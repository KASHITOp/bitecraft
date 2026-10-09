import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/ingredient.dart';
import '../../../core/database/app_database.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/tier_badge.dart';
import '../../../core/widgets/recipe_image_view.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../providers/pantry_screen_providers.dart';
import '../widgets/add_pantry_item_sheet.dart';

class PantryScreen extends ConsumerWidget {
  const PantryScreen({super.key});

  void _openAddSheet(BuildContext context) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const AddPantryItemSheet(),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final pantryAsync = ref.watch(smartPantryItemsProvider);
    final ingMapAsync = ref.watch(allIngredientsMapProvider);
    final cookFirstAsync = ref.watch(cookThisFirstRecipesProvider);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 74), // Keep clear of floating pill nav
        child: FloatingActionButton.extended(
          key: const Key('add_pantry_fab'),
          onPressed: () => _openAddSheet(context),
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 4,
          icon: const Icon(Icons.add_rounded, size: 22),
          label: const Text(
            'Add Ingredient',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
          ),
        ),
      ),
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          physics: const BouncingScrollPhysics(),
          slivers: [
            // Top App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Text('🧺', style: TextStyle(fontSize: 22)),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('My Pantry', style: AppTypography.h2(isDark).copyWith(fontSize: 22)),
                            Text('Smart storage & zero-waste cooking', style: AppTypography.bodySmall(isDark)),
                          ],
                        ),
                      ],
                    ),
                    IconButton.filledTonal(
                      icon: const Icon(Icons.add_rounded, color: AppColors.primary),
                      onPressed: () => _openAddSheet(context),
                    ),
                  ],
                ),
              ),
            ),

            // "Cook This First" Header Section
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text('🚨 ', style: TextStyle(fontSize: 16)),
                        Text('Cook This First', style: AppTypography.h4(isDark)),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Expiry Priority',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.error,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Recipes that save your ingredients expiring soonest',
                      style: AppTypography.bodySmall(isDark),
                    ),
                    const SizedBox(height: 12),
                    cookFirstAsync.when(
                      data: (recipes) {
                        if (recipes.isEmpty) {
                          return BiteCard(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                const Text('✨', style: TextStyle(fontSize: 24)),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('All fresh & stocked!', style: AppTypography.h4(isDark).copyWith(fontSize: 15)),
                                      Text('Add ingredients below to unlock customized zero-waste recipes.', style: AppTypography.bodySmall(isDark)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        }

                        return SizedBox(
                          height: 225,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: recipes.length.clamp(0, 3),
                            separatorBuilder: (_, __) => const SizedBox(width: 14),
                            itemBuilder: (context, index) {
                              final recipe = recipes[index];
                              return SizedBox(
                                width: 220,
                                child: BiteCard(
                                  padding: EdgeInsets.zero,
                                  onTap: () => context.push('/recipe/${recipe.id}'),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Stack(
                                        children: [
                                          ClipRRect(
                                            borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                                            child: RecipeImageView(
                                              imageUrl: recipe.imageUrl,
                                              emoji: recipe.emoji,
                                              gradientSeed: recipe.gradientSeed,
                                              height: 110,
                                              width: double.infinity,
                                            ),
                                          ),
                                          Positioned(
                                            top: 8,
                                            right: 8,
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
                                                  const SizedBox(width: 3),
                                                  Text(
                                                    '${recipe.minutes}m',
                                                    style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w700),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(12),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                TierBadge(
                                                  tier: budgetTierFromString(recipe.budgetTier),
                                                  compact: true,
                                                ),
                                                const Spacer(),
                                                Text(
                                                  '₹${recipe.costPerServing.toStringAsFixed(0)}',
                                                  style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary, fontSize: 13),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 6),
                                            Text(
                                              recipe.title,
                                              style: AppTypography.h4(isDark).copyWith(fontSize: 14),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Row(
                                              children: [
                                                Icon(Icons.bolt_rounded, size: 13, color: AppColors.error),
                                                const SizedBox(width: 2),
                                                Expanded(
                                                  child: Text(
                                                    'Uses expiring stock',
                                                    style: TextStyle(
                                                      fontSize: 11,
                                                      fontWeight: FontWeight.w700,
                                                      color: AppColors.error,
                                                    ),
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                      loading: () => const SizedBox(
                        height: 180,
                        child: Center(child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary)),
                      ),
                      error: (_, __) => const SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
            ),

            // Inventory Section Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 10),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Current Inventory', style: AppTypography.h4(isDark)),
                    pantryAsync.when(
                      data: (items) => Text(
                        '${items.length} items',
                        style: AppTypography.bodySmall(isDark),
                      ),
                      loading: () => const SizedBox.shrink(),
                      error: (_, __) => const SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
            ),

            // Pantry Items List View
            pantryAsync.when(
              data: (items) {
                if (items.isEmpty) {
                  return SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
                      child: EmptyStateView(
                        emoji: '🧺',
                        title: 'No items in your pantry yet',
                        subtitle: 'Tap the button below to add Paneer, Onions, Potatoes, or Spices and prevent food waste.',
                        buttonText: 'Add First Item',
                        onButtonPressed: () => _openAddSheet(context),
                      ),
                    ),
                  );
                }

                final ingMap = ingMapAsync.value ?? {};

                return SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 120),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final item = items[index];
                        final ingredient = ingMap[item.ingredientId];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: _PantryItemCard(
                            item: item,
                            ingredient: ingredient,
                          ),
                        );
                      },
                      childCount: items.length,
                    ),
                  ),
                );
              },
              loading: () => const SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(40),
                  child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
                ),
              ),
              error: (err, _) => SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Text('Error loading pantry: $err'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PantryItemCard extends ConsumerWidget {
  final PantryItem item;
  final Ingredient? ingredient;

  const _PantryItemCard({
    required this.item,
    required this.ingredient,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final now = DateTime.now();

    // Check expiry proximity
    final double? daysLeft = item.expiryDate != null
        ? item.expiryDate!.difference(now).inHours / 24.0
        : null;

    final bool isExpiringSoon = daysLeft != null && daysLeft <= 2.0;
    final bool isExpired = daysLeft != null && daysLeft < 0.0;

    // Quantity progress ratio (relative to 1000g standard baseline)
    final progress = (item.quantityGrams / 1000.0).clamp(0.05, 1.0);

    final String name = ingredient?.name ?? 'Ingredient #${item.ingredientId}';
    final String emoji = _getIngredientEmoji(name);

    return BiteCard(
      padding: const EdgeInsets.all(14),
      hasGlow: isExpiringSoon,
      glowColor: AppColors.error.withOpacity(0.25),
      customBorder: isExpiringSoon
          ? Border.all(color: AppColors.error.withOpacity(0.7), width: 1.5)
          : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Emoji Container
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: isExpiringSoon
                      ? AppColors.error.withOpacity(0.12)
                      : (isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary),
                  borderRadius: BorderRadius.circular(14),
                ),
                alignment: Alignment.center,
                child: Text(emoji, style: const TextStyle(fontSize: 22)),
              ),
              const SizedBox(width: 12),

              // Title and Category
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            style: AppTypography.h4(isDark).copyWith(fontSize: 16),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${item.quantityGrams.toInt()}g',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: isExpiringSoon ? AppColors.error : AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      ingredient?.category ?? 'Kitchen Stock',
                      style: AppTypography.bodySmall(isDark),
                    ),
                  ],
                ),
              ),

              // Expiry Pill Badge
              if (item.expiryDate != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isExpiringSoon
                        ? AppColors.error.withOpacity(0.14)
                        : (isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: isExpiringSoon
                          ? AppColors.error.withOpacity(0.4)
                          : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isExpiringSoon ? Icons.warning_amber_rounded : Icons.calendar_today_rounded,
                        size: 11,
                        color: isExpiringSoon ? AppColors.error : AppColors.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        isExpired
                            ? 'Expired'
                            : daysLeft! <= 1.0
                                ? 'Today!'
                                : '${daysLeft.ceil()}d left',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: isExpiringSoon ? AppColors.error : (isDark ? AppColors.darkInk : AppColors.lightInk),
                        ),
                      ),
                    ],
                  ),
                ),

              // Delete action
              IconButton(
                icon: const Icon(Icons.delete_outline_rounded, size: 20),
                color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
                onPressed: () {
                  HapticFeedback.lightImpact();
                  ref.read(pantryDaoProvider).removeItem(item.id);
                },
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Quantity Progress Bar
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    backgroundColor: isDark ? AppColors.darkSurfaceSecondary : const Color(0xFFEFE8DD),
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isExpiringSoon ? AppColors.error : AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              // Quick quantity adjustment stepper
              GestureDetector(
                onTap: () {
                  HapticFeedback.selectionClick();
                  final newQty = (item.quantityGrams - 50.0).clamp(50.0, 9999.0);
                  ref.read(pantryDaoProvider).updateQuantity(item.id, newQty);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text('-', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                ),
              ),
              const SizedBox(width: 4),
              GestureDetector(
                onTap: () {
                  HapticFeedback.selectionClick();
                  final newQty = (item.quantityGrams + 50.0).clamp(50.0, 9999.0);
                  ref.read(pantryDaoProvider).updateQuantity(item.id, newQty);
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text('+', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _getIngredientEmoji(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('paneer') || lower.contains('cheese')) return '🧀';
    if (lower.contains('onion') || lower.contains('kanda') || lower.contains('pyaz')) return '🧅';
    if (lower.contains('potato') || lower.contains('aloo') || lower.contains('batata')) return '🥔';
    if (lower.contains('tomato') || lower.contains('tamatar')) return '🍅';
    if (lower.contains('egg')) return '🥚';
    if (lower.contains('bread')) return '🍞';
    if (lower.contains('tofu')) return '🧊';
    if (lower.contains('milk') || lower.contains('curd') || lower.contains('yogurt')) return '🥛';
    if (lower.contains('rice') || lower.contains('poha')) return '🍚';
    if (lower.contains('dal') || lower.contains('beans')) return '🫘';
    if (lower.contains('spinach') || lower.contains('capsicum') || lower.contains('coriander')) return '🥬';
    if (lower.contains('garlic') || lower.contains('ginger')) return '🧄';
    return '🥗';
  }
}
