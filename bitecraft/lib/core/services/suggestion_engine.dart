import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/recipe.dart';
import '../repositories/recipe_repository.dart';
import 'supabase_service.dart';

class ChefMessage {
  final bool isUser;
  final String text;
  final List<Recipe> recipes;
  final DateTime timestamp;

  const ChefMessage({
    required this.isUser,
    required this.text,
    this.recipes = const [],
    required this.timestamp,
  });
}

class ChefReply {
  final String text;
  final List<Recipe> recipes;
  final String source; // 'gemini' | 'local'

  const ChefReply({
    required this.text,
    required this.recipes,
    required this.source,
  });
}

abstract class SuggestionEngine {
  Future<ChefReply> getSuggestion({
    required String message,
    required List<int> pantryIds,
    required List<ChefMessage> history,
  });
}

// Local Fallback Engine (ZERO Keys required, 100% grounded in catalog)
class LocalSuggestionEngine implements SuggestionEngine {
  final RecipeRepository _repo;

  LocalSuggestionEngine(this._repo);

  @override
  Future<ChefReply> getSuggestion({
    required String message,
    required List<int> pantryIds,
    required List<ChefMessage> history,
  }) async {
    final lowerMsg = message.toLowerCase();
    final allIngs = await _repo.getAllIngredients();

    // Extract mentioned ingredients by name or alias
    final matchedIngIds = <int>{...pantryIds};
    for (final ing in allIngs.values) {
      if (ing.matches(lowerMsg)) {
        matchedIngIds.add(ing.id);
      }
    }

    // Filter candidate recipes
    List<Recipe> candidates;
    if (matchedIngIds.isNotEmpty) {
      candidates = await _repo.searchRecipes(
        pantryIds: matchedIngIds.toList(),
        sortByCoverage: true,
        limit: 10,
      );
    } else {
      // General keyword search
      candidates = await _repo.searchRecipes(
        query: message,
        limit: 6,
      );
    }

    if (candidates.isEmpty) {
      final heroes = await _repo.getHeroRecipes();
      return ChefReply(
        text: 'Bhai, couldn\'t find an exact match for those specific items in the hostel catalog! But here are some reliable staple survival meals you can whip up in minutes:',
        recipes: heroes.take(3).toList(),
        source: 'local',
      );
    }

    final topPicks = candidates.take(3).toList();
    final reply = (matchedIngIds.isNotEmpty)
        ? 'Raid successful! Found ${candidates.length} grounded recipes using your pantry. These top options need the fewest extra items:'
        : 'Here are the best student meals from our catalog matching "$message":';

    return ChefReply(
      text: reply,
      recipes: topPicks,
      source: 'local',
    );
  }
}

// Gemini Primary Engine (Calls Supabase Edge Function chat, falls back to local)
class GeminiSuggestionEngine implements SuggestionEngine {
  final RecipeRepository _repo;
  final LocalSuggestionEngine _localFallback;

  GeminiSuggestionEngine(this._repo) : _localFallback = LocalSuggestionEngine(_repo);

  @override
  Future<ChefReply> getSuggestion({
    required String message,
    required List<int> pantryIds,
    required List<ChefMessage> history,
  }) async {
    // Attempt remote Edge Function with 8s timeout
    try {
      final url = '${SupabaseService.supabaseUrl}/functions/v1/chat';
      final headers = {
        'Content-Type': 'application/json',
        'apikey': SupabaseService.supabaseAnonKey,
        'Authorization': 'Bearer ${SupabaseService.supabaseAnonKey}',
      };

      final body = jsonEncode({
        'message': message,
        'pantryIds': pantryIds,
        'history': history.map((m) => {
              'role': m.isUser ? 'user' : 'model',
              'text': m.text,
            }).toList(),
      });

      final res = await http.post(
        Uri.parse(url),
        headers: headers,
        body: body,
      ).timeout(const Duration(seconds: 8));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final replyText = data['reply'] as String? ?? 'Here are top recipes for you:';
        final recipeListRaw = data['recipes'] as List<dynamic>? ?? [];

        final recipes = <Recipe>[];
        for (final rJson in recipeListRaw) {
          final id = (rJson['id'] as num).toInt();
          final fullRecipe = await _repo.getRecipeById(id);
          if (fullRecipe != null) {
            recipes.add(fullRecipe);
          } else {
            recipes.add(Recipe.fromJson(rJson as Map<String, dynamic>));
          }
        }

        return ChefReply(
          text: replyText,
          recipes: recipes,
          source: data['source'] ?? 'gemini',
        );
      }
    } catch (_) {
      // Fallback silently to local offline engine
    }

    return _localFallback.getSuggestion(
      message: message,
      pantryIds: pantryIds,
      history: history,
    );
  }
}
