import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/recipe.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/recipe_image_view.dart';
import '../../../core/widgets/tier_badge.dart';
import '../../../core/widgets/macro_bar.dart';
import '../../../core/providers/database_provider.dart';

final isFavoriteProvider = FutureProvider.family<bool, int>((ref, recipeId) async {
  final db = ref.watch(appDatabaseProvider);
  return db.isFavorite(recipeId);
});

class RecipeCard extends ConsumerWidget {
  final Recipe recipe;
  final List<int>? userPantryIds;
  final bool showCoverage;
  final VoidCallback? onTap;

  const RecipeCard({
    super.key,
    required this.recipe,
    this.userPantryIds,
    this.showCoverage = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isFavAsync = ref.watch(isFavoriteProvider(recipe.id));
    final isFav = isFavAsync.value ?? false;

    // Coverage calculation
    final totalIngs = recipe.ingredients.length;
    final haveCount = userPantryIds != null
        ? recipe.ingredients.where((i) => userPantryIds!.contains(i.ingredientId)).length
        : 0;
    final missingCount = (totalIngs - haveCount).clamp(0, totalIngs);

    return BiteCard(
      padding: EdgeInsets.zero,
      onTap: onTap ?? () => context.push('/recipe/${recipe.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image + Overlays (Fav & Time)
          Stack(
            children: [
              RecipeImageView(
                height: 140,
                width: double.infinity,
                imageUrl: recipe.imageUrl,
                emoji: recipe.emoji,
                gradientSeed: recipe.gradientSeed,
                heroTag: 'recipe_${recipe.id}',
                borderRadius: 22,
              ),
              // Gradient scrim at bottom of image
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Colors.black.withOpacity(0.55),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
              ),
              // Minutes badge
              Positioned(
                bottom: 8,
                left: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.65),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.timer_outlined, size: 12, color: Colors.white),
                      const SizedBox(width: 4),
                      Text(
                        '${recipe.minutes}m',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Servings / Portion Cost badge
              Positioned(
                bottom: 8,
                right: 10,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '₹${recipe.costPerServing.toStringAsFixed(0)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
              // Favorite button
              Positioned(
                top: 8,
                right: 8,
                child: GestureDetector(
                  onTap: () async {
                    HapticFeedback.lightImpact();
                    await ref.read(appDatabaseProvider).toggleFavorite(recipe.id);
                    ref.invalidate(isFavoriteProvider(recipe.id));
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.45),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                      size: 18,
                      color: isFav ? AppColors.primary : Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Content body
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Tier badge & cuisine
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TierBadge(
                      tier: budgetTierFromString(recipe.budgetTier),
                      compact: true,
                      showPrice: false,
                    ),
                    Text(
                      recipe.cuisine,
                      style: AppTypography.labelSmall(isDark),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Title
                Text(
                  recipe.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: AppTypography.h4(isDark).copyWith(fontSize: 15),
                ),
                const SizedBox(height: 8),

                // Compact macro pill
                MacroBar(
                  kcal: recipe.macros.kcal,
                  protein: recipe.macros.protein,
                  carbs: recipe.macros.carbs,
                  fats: recipe.macros.fats,
                  compact: true,
                ),

                // Pantry Coverage row if enabled
                if (showCoverage && totalIngs > 0) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                    decoration: BoxDecoration(
                      color: (haveCount == totalIngs
                              ? AppColors.success
                              : AppColors.primary)
                          .withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Have $haveCount/$totalIngs items',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: haveCount == totalIngs
                                ? (isDark ? AppColors.tierBrokeDark : AppColors.tierBrokeLight)
                                : AppColors.primary,
                          ),
                        ),
                        if (missingCount > 0)
                          GestureDetector(
                            onTap: () {
                              context.push('/quick-mart?recipeId=${recipe.id}');
                            },
                            child: Row(
                              children: [
                                Text(
                                  'Buy $missingCount on Mart',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: isDark ? AppColors.darkInk : AppColors.lightInk,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                const Icon(Icons.arrow_forward_ios_rounded, size: 9),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
