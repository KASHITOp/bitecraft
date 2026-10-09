import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/recipe.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/bite_button.dart';
import '../../../core/widgets/tier_badge.dart';
import '../../../core/widgets/price_chip.dart';
import '../../../core/widgets/macro_bar.dart';
import '../../../core/widgets/equipment_chip.dart';
import '../../../core/widgets/recipe_image_view.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/widgets/error_view.dart';
import '../../../core/services/cook_mode_service.dart';
import '../../../core/services/timer_notification_service.dart';
import '../../explore/widgets/recipe_card.dart';

final recipeDetailProvider = FutureProvider.family<Recipe?, int>((ref, recipeId) async {
  final repo = ref.watch(recipeRepositoryProvider);
  return repo.getRecipeById(recipeId);
});

class RecipeDetailScreen extends ConsumerStatefulWidget {
  final int recipeId;

  const RecipeDetailScreen({super.key, required this.recipeId});

  @override
  ConsumerState<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends ConsumerState<RecipeDetailScreen> {
  final Set<int> _completedSteps = {};
  final Map<int, int> _timerRemaining = {};
  final Map<int, Timer> _activeTimers = {};
  bool _cookModeAwake = false;

  @override
  void dispose() {
    for (final timer in _activeTimers.values) {
      timer.cancel();
    }
    CookModeService.disable();
    super.dispose();
  }

  void _toggleStep(int index) {
    HapticFeedback.mediumImpact();
    setState(() {
      if (_completedSteps.contains(index)) {
        _completedSteps.remove(index);
      } else {
        _completedSteps.add(index);
      }
    });
  }

  void _toggleTimer(int stepIndex, int totalSeconds, String recipeTitle, String stepText) {
    HapticFeedback.lightImpact();
    if (_activeTimers.containsKey(stepIndex)) {
      // Pause
      _activeTimers[stepIndex]?.cancel();
      _activeTimers.remove(stepIndex);
      setState(() {});
    } else {
      // Start or Resume
      final remaining = _timerRemaining[stepIndex] ?? totalSeconds;
      if (remaining <= 0) {
        _timerRemaining[stepIndex] = totalSeconds;
      }

      final timer = Timer.periodic(const Duration(seconds: 1), (t) {
        if (!mounted) {
          t.cancel();
          return;
        }

        final curr = _timerRemaining[stepIndex] ?? totalSeconds;
        if (curr <= 1) {
          t.cancel();
          _activeTimers.remove(stepIndex);
          _timerRemaining[stepIndex] = 0;
          HapticFeedback.heavyImpact();
          TimerNotificationService.showTimerCompleteNotification(
            id: widget.recipeId * 100 + stepIndex,
            recipeTitle: recipeTitle,
            stepText: 'Step ${stepIndex + 1} timer finished: $stepText',
          );
          setState(() {});
        } else {
          setState(() {
            _timerRemaining[stepIndex] = curr - 1;
          });
        }
      });

      _activeTimers[stepIndex] = timer;
      setState(() {});
    }
  }

  void _resetTimer(int stepIndex, int totalSeconds) {
    HapticFeedback.selectionClick();
    _activeTimers[stepIndex]?.cancel();
    _activeTimers.remove(stepIndex);
    setState(() {
      _timerRemaining[stepIndex] = totalSeconds;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final recipeAsync = ref.watch(recipeDetailProvider(widget.recipeId));
    final isFavAsync = ref.watch(isFavoriteProvider(widget.recipeId));
    final isFav = isFavAsync.value ?? false;

    return Scaffold(
      body: recipeAsync.when(
        data: (recipe) {
          if (recipe == null) {
            return const Center(child: ErrorView(message: 'Recipe not found'));
          }

          return CustomScrollView(
            slivers: [
              // Parallax Hero Image App Bar
              SliverAppBar(
                expandedHeight: 280,
                pinned: true,
                stretch: true,
                backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
                leading: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: CircleAvatar(
                    backgroundColor: Colors.black.withOpacity(0.5),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back_rounded, color: Colors.white, size: 20),
                      onPressed: () => context.pop(),
                    ),
                  ),
                ),
                actions: [
                  // Cook Mode Awake Toggle
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: CircleAvatar(
                      backgroundColor: _cookModeAwake
                          ? AppColors.primary
                          : Colors.black.withOpacity(0.5),
                      child: IconButton(
                        tooltip: _cookModeAwake ? 'Cook Mode On (Screen Awake)' : 'Enable Cook Mode',
                        icon: Icon(
                          _cookModeAwake ? Icons.lightbulb_rounded : Icons.lightbulb_outline_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                        onPressed: () async {
                          final active = await CookModeService.toggle();
                          HapticFeedback.mediumImpact();
                          setState(() => _cookModeAwake = active);
                          if (!context.mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(active
                                  ? '🔥 Cook Mode Active — Screen will stay awake!'
                                  : 'Cook Mode turned off.'),
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  // Favorite Toggle
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: CircleAvatar(
                      backgroundColor: Colors.black.withOpacity(0.5),
                      child: IconButton(
                        icon: Icon(
                          isFav ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          color: isFav ? AppColors.primary : Colors.white,
                          size: 20,
                        ),
                        onPressed: () async {
                          HapticFeedback.lightImpact();
                          await ref.read(appDatabaseProvider).toggleFavorite(recipe.id);
                          ref.invalidate(isFavoriteProvider(recipe.id));
                        },
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  stretchModes: const [
                    StretchMode.zoomBackground,
                    StretchMode.blurBackground,
                  ],
                  background: RecipeImageView(
                    imageUrl: recipe.imageUrl,
                    emoji: recipe.emoji,
                    gradientSeed: recipe.gradientSeed,
                    heroTag: 'recipe_${recipe.id}',
                    borderRadius: 0,
                    height: 320,
                  ),
                ),
              ),

              // Detail Body
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tier badge + Cuisine + Cook time
                      Row(
                        children: [
                          TierBadge(
                            tier: budgetTierFromString(recipe.budgetTier),
                            showPrice: false,
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.timer_outlined, size: 14, color: AppColors.primary),
                                const SizedBox(width: 4),
                                Text(
                                  '${recipe.minutes} mins',
                                  style: AppTypography.labelSmall(isDark),
                                ),
                              ],
                            ),
                          ),
                          const Spacer(),
                          Text(
                            recipe.cuisine,
                            style: AppTypography.labelLarge(isDark).copyWith(color: AppColors.primary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Title
                      Text(recipe.title, style: AppTypography.h2(isDark)),
                      const SizedBox(height: 16),

                      // Portion vs Pack Cost Card
                      PriceChip(
                        costPerServing: recipe.costPerServing,
                        costFullPack: recipe.costFullPack,
                      ),
                      const SizedBox(height: 20),

                      // Animated Macro Nutrition Bar
                      BiteCard(
                        child: MacroBar(
                          kcal: recipe.macros.kcal,
                          protein: recipe.macros.protein,
                          carbs: recipe.macros.carbs,
                          fats: recipe.macros.fats,
                          fiber: recipe.macros.fiber,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Kitchen Equipment Chips
                      Text('Kitchen Equipment Needed', style: AppTypography.h4(isDark)),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: recipe.equipmentTags
                            .map((tag) => EquipmentChip(tag: tag))
                            .toList(),
                      ),
                      const SizedBox(height: 24),

                      // Ingredients Checklist
                      Text('Ingredients (${recipe.ingredients.length} items)', style: AppTypography.h4(isDark)),
                      const SizedBox(height: 10),
                      BiteCard(
                        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                        child: ListView.separated(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: recipe.ingredients.length,
                          separatorBuilder: (_, __) => const Divider(height: 16),
                          itemBuilder: (context, idx) {
                            final ing = recipe.ingredients[idx];
                            final aliasText = ing.aliases.isNotEmpty
                                ? ' (${ing.aliases.take(2).join(', ')})'
                                : '';
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: RichText(
                                    text: TextSpan(
                                      text: ing.name,
                                      style: AppTypography.labelLarge(isDark),
                                      children: [
                                        TextSpan(
                                          text: aliasText,
                                          style: AppTypography.bodySmall(isDark),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                Text(
                                  '${ing.qty.toStringAsFixed(0)} ${ing.unit}',
                                  style: AppTypography.labelMedium(isDark).copyWith(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Interactive Step-by-Step Cooking Guide
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Step-by-Step Guide', style: AppTypography.h4(isDark)),
                          Text(
                            '${_completedSteps.length}/${recipe.steps.length} done',
                            style: AppTypography.labelSmall(isDark).copyWith(color: AppColors.primary),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: recipe.steps.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, sIdx) {
                          final step = recipe.steps[sIdx];
                          final isDone = _completedSteps.contains(sIdx);
                          final hasTimer = step.timerSeconds != null && step.timerSeconds! > 0;
                          final isTimerRunning = _activeTimers.containsKey(sIdx);
                          final remaining = _timerRemaining[sIdx] ?? (step.timerSeconds ?? 0);

                          return BiteCard(
                            backgroundColor: isDone
                                ? (isDark ? const Color(0xFF1C281F) : const Color(0xFFF1F8F2))
                                : null,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    GestureDetector(
                                      onTap: () => _toggleStep(sIdx),
                                      child: Container(
                                        width: 28,
                                        height: 28,
                                        margin: const EdgeInsets.only(right: 12, top: 2),
                                        decoration: BoxDecoration(
                                          color: isDone ? AppColors.success : Colors.transparent,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: isDone ? AppColors.success : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                                            width: 1.5,
                                          ),
                                        ),
                                        alignment: Alignment.center,
                                        child: isDone
                                            ? const Icon(Icons.check_rounded, size: 18, color: Colors.white)
                                            : Text('${sIdx + 1}', style: AppTypography.labelSmall(isDark)),
                                      ),
                                    ),
                                    Expanded(
                                      child: Text(
                                        step.text,
                                        style: AppTypography.bodyLarge(isDark).copyWith(
                                          decoration: isDone ? TextDecoration.lineThrough : null,
                                          color: isDone
                                              ? (isDark ? AppColors.darkInkTertiary : AppColors.lightInkTertiary)
                                              : (isDark ? AppColors.darkInk : AppColors.lightInk),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                if (step.tip != null) ...[
                                  const SizedBox(height: 10),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                    decoration: BoxDecoration(
                                      color: AppColors.primary.withOpacity(0.08),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      children: [
                                        const Text('💡 ', style: TextStyle(fontSize: 12)),
                                        Expanded(
                                          child: Text(
                                            step.tip!,
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontStyle: FontStyle.italic,
                                              color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                if (hasTimer) ...[
                                  const SizedBox(height: 12),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                                      borderRadius: BorderRadius.circular(14),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Row(
                                          children: [
                                            Icon(
                                              Icons.alarm_rounded,
                                              size: 18,
                                              color: isTimerRunning ? AppColors.primary : Colors.grey,
                                            ),
                                            const SizedBox(width: 8),
                                            Text(
                                              _formatSeconds(remaining),
                                              style: TextStyle(
                                                fontFamily: 'monospace',
                                                fontSize: 16,
                                                fontWeight: FontWeight.w700,
                                                color: remaining == 0
                                                    ? AppColors.success
                                                    : (isDark ? AppColors.darkInk : AppColors.lightInk),
                                              ),
                                            ),
                                          ],
                                        ),
                                        Row(
                                          children: [
                                            IconButton(
                                              icon: Icon(
                                                isTimerRunning ? Icons.pause_rounded : Icons.play_arrow_rounded,
                                                color: AppColors.primary,
                                              ),
                                              onPressed: () => _toggleTimer(
                                                sIdx,
                                                step.timerSeconds!,
                                                recipe.title,
                                                step.text,
                                              ),
                                            ),
                                            IconButton(
                                              icon: const Icon(Icons.refresh_rounded, size: 20),
                                              onPressed: () => _resetTimer(sIdx, step.timerSeconds!),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 32),

                      // Compare Prices on Quick Mart Action Card
                      BiteButton(
                        text: 'Compare Prices on Quick Mart',
                        icon: Icons.shopping_bag_outlined,
                        onPressed: () {
                          context.push('/quick-mart?recipeId=${recipe.id}');
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: RecipeCardSkeleton()),
        error: (err, _) => Center(child: ErrorView(message: 'Error loading recipe: $err')),
      ),
    );
  }

  String _formatSeconds(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }
}
