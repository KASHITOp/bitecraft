import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/database/app_database.dart';
import '../../../core/models/ingredient.dart';
import '../../../core/models/recipe.dart';
import '../../../core/providers/database_provider.dart';

/// Stream of all pantry items from Drift
final smartPantryItemsProvider = StreamProvider<List<PantryItem>>((ref) {
  final dao = ref.watch(pantryDaoProvider);
  return dao.watchAllItems();
});

/// Map of all available ingredients indexed by ID
final allIngredientsMapProvider = FutureProvider<Map<int, Ingredient>>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  return repo.getAllIngredients();
});

/// List of all available ingredients for searching
final allIngredientsListProvider = FutureProvider<List<Ingredient>>((ref) async {
  final map = await ref.watch(allIngredientsMapProvider.future);
  return map.values.toList();
});

/// Items expiring within the next 3 days
final expiringPantryItemsProvider = FutureProvider<List<PantryItem>>((ref) async {
  final dao = ref.watch(pantryDaoProvider);
  return dao.getItemsExpiringInNextDays(days: 3, includeAlreadyExpired: true);
});

/// Top 3 recipes that use the most expiring ingredients ("Cook This First")
final cookThisFirstRecipesProvider = FutureProvider<List<Recipe>>((ref) async {
  final dao = ref.watch(pantryDaoProvider);
  final repo = ref.watch(recipeRepositoryProvider);

  // 1. Get expiring items (within 5 days to give meaningful meal options)
  final expiringItems = await dao.getItemsExpiringInNextDays(days: 5, includeAlreadyExpired: true);

  if (expiringItems.isEmpty) {
    // If no items expiring soon, check all pantry items
    final allPantry = await dao.getAllItems();
    if (allPantry.isEmpty) {
      // Fallback to top hero specials
      return repo.getHeroRecipes().then((heroes) => heroes.take(3).toList());
    }
    final pantryIds = allPantry.map((item) => item.ingredientId).toList();
    final matches = await repo.searchRecipes(
      pantryIds: pantryIds,
      sortByCoverage: true,
      limit: 3,
    );
    return matches.isNotEmpty ? matches : repo.getHeroRecipes().then((h) => h.take(3).toList());
  }

  // 2. Search recipes prioritizing coverage of expiring ingredients
  final expiringIds = expiringItems.map((item) => item.ingredientId).toSet().toList();
  final matchedRecipes = await repo.searchRecipes(
    pantryIds: expiringIds,
    sortByCoverage: true,
    limit: 3,
  );

  if (matchedRecipes.isNotEmpty) {
    return matchedRecipes;
  }

  // Fallback to hero recipes if no direct matches
  return repo.getHeroRecipes().then((heroes) => heroes.take(3).toList());
});
