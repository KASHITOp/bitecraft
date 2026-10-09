import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:drift/drift.dart';
import '../database/app_database.dart';
import '../models/recipe.dart';
import '../models/ingredient.dart';
import '../services/supabase_service.dart';

class RecipeRepository {
  final AppDatabase _db;
  bool _seeded = false;
  Map<int, Ingredient>? _cachedIngredients;

  RecipeRepository(this._db);

  AppDatabase get db => _db;

  Future<void> ensureInitialized() async {
    if (_seeded) return;

    // Check if database already has recipes
    final countExp = _db.localRecipes.id.count();
    final query = _db.selectOnly(_db.localRecipes)..addColumns([countExp]);
    final row = await query.getSingle();
    final count = row.read(countExp) ?? 0;

    if (count == 0) {
      await _seedLocalCache();
    }
    _seeded = true;

    // Pre-cache ingredients map for fast lookups
    await getAllIngredients();
  }

  Future<void> _seedLocalCache() async {
    try {
      // 1. Load and insert ingredients
      final ingStr = await rootBundle.loadString('assets/seeds/ingredients_seed.json');
      final List<dynamic> ingJson = jsonDecode(ingStr);
      final ingCompanions = ingJson.map((item) {
        return LocalIngredientsCompanion.insert(
          id: Value(item['id'] as int),
          name: item['name'] as String,
          aliasesJson: jsonEncode(item['aliases'] ?? []),
          category: item['category'] as String? ?? 'General',
          packSize: item['packSize'] as String? ?? '1 unit',
          avgPackPrice: (item['avgPackPrice'] as num?)?.toDouble() ?? 0.0,
        );
      }).toList();
      await _db.insertOrUpdateIngredients(ingCompanions);

      // Create quick lookup for ingredient names and aliases
      final Map<int, String> ingSearchMap = {};
      for (final item in ingJson) {
        final id = item['id'] as int;
        final name = item['name'] as String;
        final aliases = (item['aliases'] as List<dynamic>?)?.map((e) => e.toString()).join(' ') ?? '';
        ingSearchMap[id] = '$name $aliases';
      }

      // 2. Load and insert recipes
      final recStr = await rootBundle.loadString('assets/seeds/recipes_seed.json');
      final List<dynamic> recJson = jsonDecode(recStr);

      final recCompanions = recJson.map((item) {
        final ingItems = (item['ingredients'] as List<dynamic>?) ?? [];
        final ingIds = ingItems.map((i) => i['ingredient_id'].toString()).join(',');
        
        final searchTermsList = <String>[];
        for (final i in ingItems) {
          final id = i['ingredient_id'] as int;
          if (ingSearchMap.containsKey(id)) {
            searchTermsList.add(ingSearchMap[id]!);
          }
        }

        return LocalRecipesCompanion.insert(
          id: Value(item['id'] as int),
          title: item['title'] as String,
          cuisine: item['cuisine'] as String,
          budgetTier: item['budget_tier'] as String,
          goals: jsonEncode(item['goals'] ?? []),
          minutes: (item['minutes'] as num).toInt(),
          equipmentTags: jsonEncode(item['equipment_tags'] ?? []),
          servings: (item['servings'] as num).toInt(),
          stepsJson: jsonEncode(item['steps'] ?? []),
          macrosJson: jsonEncode(item['macros'] ?? {}),
          costPerServing: (item['cost_per_serving'] as num).toDouble(),
          costFullPack: (item['cost_full_pack'] as num).toDouble(),
          imageUrl: Value(item['image_url'] as String?),
          emoji: item['emoji'] as String? ?? '🍲',
          gradientSeed: (item['gradient_seed'] as num).toInt(),
          ingredientIds: ingIds,
          ingredientSearchTerms: searchTermsList.join(' '),
        );
      }).toList();

      // Chunk inserts for SQLite batch size
      const chunkSize = 200;
      for (var i = 0; i < recCompanions.length; i += chunkSize) {
        final chunk = recCompanions.sublist(i, (i + chunkSize).clamp(0, recCompanions.length));
        await _db.insertOrUpdateRecipes(chunk);
      }
    } catch (e) {
      // In case of parsing exception, log and continue
    }
  }

  Future<Map<int, Ingredient>> getAllIngredients() async {
    if (_cachedIngredients != null) return _cachedIngredients!;
    final rows = await _db.select(_db.localIngredients).get();
    final map = <int, Ingredient>{};
    for (final r in rows) {
      final List<dynamic> aliases = jsonDecode(r.aliasesJson);
      map[r.id] = Ingredient(
        id: r.id,
        name: r.name,
        aliases: aliases.map((e) => e.toString()).toList(),
        category: r.category,
        packSize: r.packSize,
        avgPackPrice: r.avgPackPrice,
      );
    }
    _cachedIngredients = map;
    return map;
  }

  Future<List<Recipe>> getHeroRecipes() async {
    await ensureInitialized();
    // Return the curated top heroes
    final heroIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    final rows = await (_db.select(_db.localRecipes)..where((tbl) => tbl.id.isIn(heroIds))).get();
    final ingMap = await getAllIngredients();
    return rows.map((r) => _mapRowToRecipe(r, ingMap)).toList();
  }

  Future<List<Recipe>> searchRecipes({
    String? query,
    String? tier,
    String? goal,
    int? maxMinutes,
    double? maxCost,
    List<int>? pantryIds,
    bool sortByCoverage = false,
    int limit = 50,
    int offset = 0,
  }) async {
    await ensureInitialized();

    // 1. First attempt Supabase remote if online and no complex local pantry coverage needed
    if (SupabaseService.client != null && !sortByCoverage) {
      try {
        var sbQuery = SupabaseService.client!.from('recipes').select();
        if (tier != null && tier.isNotEmpty) {
          sbQuery = sbQuery.eq('budget_tier', tier);
        }
        if (maxMinutes != null) {
          sbQuery = sbQuery.lte('minutes', maxMinutes);
        }
        if (maxCost != null) {
          sbQuery = sbQuery.lte('cost_per_serving', maxCost);
        }
        if (query != null && query.trim().isNotEmpty) {
          sbQuery = sbQuery.textSearch('search_vector', query.trim());
        }
        final res = await sbQuery.range(offset, offset + limit - 1);
        if (res.isNotEmpty) {
          return (res as List<dynamic>).map((item) {
            return Recipe.fromJson(item as Map<String, dynamic>);
          }).toList();
        }
      } catch (_) {
        // Fall back to local SQLite cache
      }
    }

    // 2. Local Drift SQLite search with instant dual-name matching
    final rows = await _db.searchRecipes(
      query: query,
      tier: tier,
      goal: goal,
      maxMinutes: maxMinutes,
      maxCost: maxCost,
      limit: sortByCoverage ? 300 : limit,
      offset: sortByCoverage ? 0 : offset,
    );

    final ingMap = await getAllIngredients();
    var recipes = rows.map((r) => _mapRowToRecipe(r, ingMap)).toList();

    // If pantry IDs provided and sorting by coverage
    if (pantryIds != null && pantryIds.isNotEmpty && sortByCoverage) {
      recipes.sort((a, b) {
        final aMatch = a.ingredients.where((i) => pantryIds.contains(i.ingredientId)).length;
        final bMatch = b.ingredients.where((i) => pantryIds.contains(i.ingredientId)).length;
        final aRatio = a.ingredients.isEmpty ? 0.0 : aMatch / a.ingredients.length;
        final bRatio = b.ingredients.isEmpty ? 0.0 : bMatch / b.ingredients.length;

        if (bRatio != aRatio) {
          return bRatio.compareTo(aRatio);
        }
        return a.costPerServing.compareTo(b.costPerServing);
      });
      recipes = recipes.sublist(0, limit.clamp(0, recipes.length));
    }

    return recipes;
  }

  Future<Recipe?> getRecipeById(int id) async {
    await ensureInitialized();
    final row = await (_db.select(_db.localRecipes)..where((tbl) => tbl.id.equals(id))).getSingleOrNull();
    if (row == null) return null;
    final ingMap = await getAllIngredients();
    return _mapRowToRecipe(row, ingMap);
  }

  Recipe _mapRowToRecipe(LocalRecipe row, Map<int, Ingredient> ingMap) {
    final List<dynamic> stepsRaw = jsonDecode(row.stepsJson);
    final List<dynamic> goalsRaw = jsonDecode(row.goals);
    final List<dynamic> equipRaw = jsonDecode(row.equipmentTags);
    final Map<String, dynamic> macrosRaw = jsonDecode(row.macrosJson);

    final ingIdStrings = row.ingredientIds.split(',').where((s) => s.isNotEmpty);
    final ingredients = ingIdStrings.map((s) {
      final id = int.tryParse(s) ?? 0;
      final ing = ingMap[id];
      return RecipeIngredientItem(
        ingredientId: id,
        name: ing?.name ?? 'Ingredient',
        aliases: ing?.aliases ?? [],
        qty: 1.0,
        unit: ing?.packSize.contains('piece') ?? false ? 'pc' : 'g',
      );
    }).toList();

    return Recipe(
      id: row.id,
      title: row.title,
      cuisine: row.cuisine,
      budgetTier: row.budgetTier,
      goals: goalsRaw.map((e) => e.toString()).toList(),
      minutes: row.minutes,
      equipmentTags: equipRaw.map((e) => e.toString()).toList(),
      servings: row.servings,
      steps: stepsRaw.map((s) => RecipeStep.fromJson(s as Map<String, dynamic>)).toList(),
      macros: RecipeMacros.fromJson(macrosRaw),
      costPerServing: row.costPerServing,
      costFullPack: row.costFullPack,
      imageUrl: row.imageUrl,
      emoji: row.emoji,
      gradientSeed: row.gradientSeed,
      ingredients: ingredients,
    );
  }
}
