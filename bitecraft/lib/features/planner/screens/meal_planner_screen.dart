import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/recipe.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/bite_button.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/widgets/recipe_image_view.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/providers/profile_provider.dart';

class DailyMealPlan {
  final Recipe breakfast;
  final Recipe lunch;
  final Recipe dinner;

  DailyMealPlan({
    required this.breakfast,
    required this.lunch,
    required this.dinner,
  });

  int get totalCalories => breakfast.macros.kcal + lunch.macros.kcal + dinner.macros.kcal;
  double get totalProtein => breakfast.macros.protein + lunch.macros.protein + dinner.macros.protein;
  double get totalCost => breakfast.costPerServing + lunch.costPerServing + dinner.costPerServing;
}

final dailyPlanProvider = FutureProvider.autoDispose<DailyMealPlan>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  final profile = ref.watch(userProfileProvider);

  // Retrieve candidate pool matching user budget and equipment
  final recipes = await repo.searchRecipes(
    tier: profile.budgetTier,
    limit: 60,
  );

  if (recipes.length < 3) {
    final fallback = await repo.getHeroRecipes();
    return DailyMealPlan(
      breakfast: fallback[0],
      lunch: fallback[1],
      dinner: fallback[2],
    );
  }

  final random = Random();
  final bfastPool = recipes.where((r) => r.minutes <= 15).toList();
  final breakfast = bfastPool.isNotEmpty ? bfastPool[random.nextInt(bfastPool.length)] : recipes[0];

  final lunchPool = recipes.where((r) => r.id != breakfast.id).toList();
  final lunch = lunchPool.isNotEmpty ? lunchPool[random.nextInt(lunchPool.length)] : recipes[1];

  final dinnerPool = lunchPool.where((r) => r.id != lunch.id).toList();
  final dinner = dinnerPool.isNotEmpty ? dinnerPool[random.nextInt(dinnerPool.length)] : recipes[2];

  return DailyMealPlan(
    breakfast: breakfast,
    lunch: lunch,
    dinner: dinner,
  );
});

class MealPlannerScreen extends ConsumerWidget {
  const MealPlannerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final profile = ref.watch(userProfileProvider);
    final planAsync = ref.watch(dailyPlanProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Vibe Meal Planner', style: AppTypography.h3(isDark)),
        actions: [
          IconButton(
            tooltip: 'Regenerate Plan',
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () {
              HapticFeedback.mediumImpact();
              ref.invalidate(dailyPlanProvider);
            },
          ),
        ],
      ),
      body: SafeArea(
        child: planAsync.when(
          data: (plan) {
            final targetKcal = profile.targetCalories;
            final targetProtein = profile.targetProteinGrams;
            final calProgress = (plan.totalCalories / targetKcal).clamp(0.0, 1.0);
            final proteinProgress = (plan.totalProtein / targetProtein).clamp(0.0, 1.0);

            return ListView(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 110),
              children: [
                // Macro Target Progress Rings Card
                BiteCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Today\'s Targets', style: AppTypography.h4(isDark)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              'Day Total: ₹${plan.totalCost.toStringAsFixed(0)}',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // Two Macro Rings
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          _buildMacroRing(
                            context,
                            isDark: isDark,
                            label: 'Calories',
                            current: '${plan.totalCalories}',
                            target: '$targetKcal kcal',
                            progress: calProgress,
                            color: AppColors.calories,
                          ),
                          _buildMacroRing(
                            context,
                            isDark: isDark,
                            label: 'Protein',
                            current: '${plan.totalProtein.toStringAsFixed(0)}g',
                            target: '${targetProtein}g',
                            progress: proteinProgress,
                            color: AppColors.protein,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                Text('Schedule & Meals', style: AppTypography.h4(isDark)),
                const SizedBox(height: 12),

                // Breakfast
                _buildMealSlotCard(
                  context,
                  isDark: isDark,
                  slot: '🌅 Breakfast',
                  recipe: plan.breakfast,
                ),
                const SizedBox(height: 14),

                // Lunch
                _buildMealSlotCard(
                  context,
                  isDark: isDark,
                  slot: '🥗 Lunch',
                  recipe: plan.lunch,
                ),
                const SizedBox(height: 14),

                // Dinner
                _buildMealSlotCard(
                  context,
                  isDark: isDark,
                  slot: '🌙 Dinner',
                  recipe: plan.dinner,
                ),
                const SizedBox(height: 24),

                BiteButton(
                  text: 'Shuffle Daily Plan 🎲',
                  variant: BiteButtonVariant.secondary,
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    ref.invalidate(dailyPlanProvider);
                  },
                ),
              ],
            );
          },
          loading: () => const Center(child: RecipeCardSkeleton()),
          error: (err, _) => Center(child: Text('Error creating meal plan: $err')),
        ),
      ),
    );
  }

  Widget _buildMacroRing(
    BuildContext context, {
    required bool isDark,
    required String label,
    required String current,
    required String target,
    required double progress,
    required Color color,
  }) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 80,
              height: 80,
              child: CircularProgressIndicator(
                value: progress,
                strokeWidth: 7,
                backgroundColor: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                valueColor: AlwaysStoppedAnimation<Color>(color),
              ),
            ),
            Column(
              children: [
                Text(
                  '${(progress * 100).round()}%',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: isDark ? AppColors.darkInk : AppColors.lightInk,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(label, style: AppTypography.labelMedium(isDark)),
        Text('$current / $target', style: AppTypography.bodySmall(isDark)),
      ],
    );
  }

  Widget _buildMealSlotCard(
    BuildContext context, {
    required bool isDark,
    required String slot,
    required Recipe recipe,
  }) {
    return BiteCard(
      onTap: () => context.push('/recipe/${recipe.id}'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(slot, style: AppTypography.labelLarge(isDark).copyWith(color: AppColors.primary)),
              Text(
                '₹${recipe.costPerServing.toStringAsFixed(0)}',
                style: AppTypography.labelMedium(isDark),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              RecipeImageView(
                width: 70,
                height: 70,
                imageUrl: recipe.imageUrl,
                emoji: recipe.emoji,
                gradientSeed: recipe.gradientSeed,
                borderRadius: 14,
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      recipe.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTypography.h4(isDark).copyWith(fontSize: 15),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Text('${recipe.macros.kcal} kcal', style: TextStyle(fontSize: 11, color: AppColors.calories, fontWeight: FontWeight.w700)),
                        const Text(' • ', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        Text('${recipe.macros.protein.round()}g P', style: TextStyle(fontSize: 11, color: AppColors.protein, fontWeight: FontWeight.w700)),
                        const Text(' • ', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        Text('${recipe.minutes}m', style: AppTypography.bodySmall(isDark)),
                      ],
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right_rounded, color: Colors.grey),
            ],
          ),
        ],
      ),
    );
  }
}
