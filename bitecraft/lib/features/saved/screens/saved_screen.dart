import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/recipe.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/providers/database_provider.dart';
import '../../explore/widgets/recipe_card.dart';

final savedRecipesProvider = FutureProvider.autoDispose<List<Recipe>>((ref) async {
  final db = ref.watch(appDatabaseProvider);
  final repo = ref.watch(recipeRepositoryProvider);

  final favIds = await db.getFavoriteIds();
  if (favIds.isEmpty) return [];

  final List<Recipe> recipes = [];
  for (final id in favIds) {
    final r = await repo.getRecipeById(id);
    if (r != null) recipes.add(r);
  }
  return recipes;
});

class SavedScreen extends ConsumerWidget {
  const SavedScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final savedAsync = ref.watch(savedRecipesProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Saved Recipes', style: AppTypography.h3(isDark)),
      ),
      body: SafeArea(
        child: savedAsync.when(
          data: (recipes) {
            if (recipes.isEmpty) {
              return EmptyStateView(
                emoji: '🤍',
                title: 'No saved recipes yet',
                subtitle: 'Tap the heart icon on any recipe in Explore to keep it in your hostel cookbook.',
                buttonText: 'Discover Recipes',
                onButtonPressed: () => context.go('/explore'),
              );
            }

            return Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 110),
              child: MasonryGridView.count(
                crossAxisCount: 2,
                mainAxisSpacing: 14,
                crossAxisSpacing: 14,
                itemCount: recipes.length,
                itemBuilder: (context, index) {
                  return RecipeCard(recipe: recipes[index]);
                },
              ),
            );
          },
          loading: () => const Center(child: RecipeCardSkeleton()),
          error: (err, _) => Center(child: Text('Error loading saved recipes: $err')),
        ),
      ),
    );
  }
}
