import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/bite_button.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/providers/price_provider_di.dart';
import '../../../core/models/recipe.dart';
import '../../../core/models/ingredient.dart';
import '../../../core/services/price_provider.dart';

final quickMartComparisonProvider = FutureProvider.family<Map<String, dynamic>, int?>((ref, recipeId) async {
  final priceRepo = ref.watch(priceProvider);
  final recipeRepo = ref.watch(recipeRepositoryProvider);

  List<RecipeIngredientItem> items = [];
  String title = 'Fresh Grocery Basket';

  if (recipeId != null && recipeId > 0) {
    final recipe = await recipeRepo.getRecipeById(recipeId);
    if (recipe != null) {
      items = recipe.ingredients;
      title = recipe.title;
    }
  }

  if (items.isEmpty) {
    // Default hostel staples bundle
    items = const [
      RecipeIngredientItem(ingredientId: 1, name: 'Onion (Kanda)', qty: 1, unit: 'kg'),
      RecipeIngredientItem(ingredientId: 2, name: 'Potato (Aloo)', qty: 1, unit: 'kg'),
      RecipeIngredientItem(ingredientId: 3, name: 'Tomato (Tamatar)', qty: 500, unit: 'g'),
      RecipeIngredientItem(ingredientId: 6, name: 'Eggs (Anda)', qty: 6, unit: 'pack'),
      RecipeIngredientItem(ingredientId: 9, name: 'Bread / Pav', qty: 1, unit: 'pack'),
    ];
  }

  final ingIds = items.map((i) => i.ingredientId).toList();
  final comparison = await priceRepo.comparePrices(ingIds);
  final allIngs = await recipeRepo.getAllIngredients();

  return {
    'title': title,
    'items': items,
    'comparison': comparison,
    'allIngs': allIngs,
  };
});

class QuickMartScreen extends ConsumerStatefulWidget {
  final int? recipeId;

  const QuickMartScreen({super.key, this.recipeId});

  @override
  ConsumerState<QuickMartScreen> createState() => _QuickMartScreenState();
}

class _QuickMartScreenState extends ConsumerState<QuickMartScreen> {
  String? _selectedStore;
  bool _hapticFired = false;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final dataAsync = ref.watch(quickMartComparisonProvider(widget.recipeId));

    return Scaffold(
      appBar: AppBar(
        title: Text('Quick Mart Comparator', style: AppTypography.h3(isDark)),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Cart ingredients copied to clipboard!')),
              );
            },
          ),
        ],
      ),
      body: SafeArea(
        child: dataAsync.when(
          data: (data) {
            final title = data['title'] as String;
            final items = data['items'] as List<RecipeIngredientItem>;
            final comparison = data['comparison'] as Map<String, StoreCartTotal>;
            final allIngs = data['allIngs'] as Map<int, Ingredient>;

            final zepto = comparison['ZEPTO']!;
            final blinkit = comparison['BLINKIT']!;
            final instamart = comparison['INSTAMART']!;

            // Calculate cheapest
            final totals = [zepto, blinkit, instamart];
            totals.sort((a, b) => a.totalAmount.compareTo(b.totalAmount));
            final cheapest = totals.first;
            final mostExpensive = totals.last;
            final savings = (mostExpensive.totalAmount - cheapest.totalAmount).clamp(0.0, 9999.0);

            if (!_hapticFired) {
              _hapticFired = true;
              HapticFeedback.heavyImpact();
            }

            final effectiveSelectedStore = _selectedStore ?? cheapest.store;

            return ListView(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 110),
              children: [
                // Demo Data Disclaimer Ribbon
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.primary.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 16, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          'Estimated prices (demo data) • Local dark store pricing',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: isDark ? AppColors.darkInk : AppColors.lightInk,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Basket Context Title
                Text('Basket for:', style: AppTypography.bodySmall(isDark)),
                const SizedBox(height: 4),
                Text(title, style: AppTypography.h3(isDark)),
                const SizedBox(height: 18),

                // Savings Hero Banner
                if (savings > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2E7D32), Color(0xFF43A047)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: AppColors.glowShadow(const Color(0xFF2E7D32)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text('⚡ ', style: TextStyle(fontSize: 20)),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${cheapest.store} saves you ₹${savings.toStringAsFixed(0)}!',
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'Cheapest dark store for this recipe',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: Colors.white.withOpacity(0.85),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            'BEST DEAL',
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(height: 20),

                // 3 Store Cards
                Text('Compare 10–15 Min Delivery', style: AppTypography.h4(isDark)),
                const SizedBox(height: 12),

                _buildStoreCard(
                  isDark: isDark,
                  storeData: zepto,
                  brandColor: AppColors.zepto,
                  logoIcon: Icons.bolt_rounded,
                  isCheapest: cheapest.store == 'ZEPTO',
                  isSelected: effectiveSelectedStore == 'ZEPTO',
                  onSelect: () => setState(() => _selectedStore = 'ZEPTO'),
                ),
                const SizedBox(height: 12),

                _buildStoreCard(
                  isDark: isDark,
                  storeData: blinkit,
                  brandColor: const Color(0xFFF8CB46),
                  logoIcon: Icons.shopping_basket_rounded,
                  isCheapest: cheapest.store == 'BLINKIT',
                  isSelected: effectiveSelectedStore == 'BLINKIT',
                  onSelect: () => setState(() => _selectedStore = 'BLINKIT'),
                ),
                const SizedBox(height: 12),

                _buildStoreCard(
                  isDark: isDark,
                  storeData: instamart,
                  brandColor: AppColors.instamart,
                  logoIcon: Icons.electric_moped_rounded,
                  isCheapest: cheapest.store == 'INSTAMART',
                  isSelected: effectiveSelectedStore == 'INSTAMART',
                  onSelect: () => setState(() => _selectedStore = 'INSTAMART'),
                ),
                const SizedBox(height: 24),

                // Itemized Breakdown
                Text('Items in Cart (${items.length} ingredients)', style: AppTypography.h4(isDark)),
                const SizedBox(height: 10),

                BiteCard(
                  padding: const EdgeInsets.all(16),
                  child: ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: items.length,
                    separatorBuilder: (_, __) => const Divider(height: 16),
                    itemBuilder: (context, idx) {
                      final item = items[idx];
                      final ing = allIngs[item.ingredientId];
                      final storePrice = comparison[effectiveSelectedStore]
                              ?.itemPrices[item.ingredientId] ??
                          (ing?.avgPackPrice ?? 40.0);

                      return Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item.name, style: AppTypography.labelLarge(isDark)),
                                Text(
                                  ing != null ? 'Pack: ${ing.packSize}' : '${item.qty} ${item.unit}',
                                  style: AppTypography.bodySmall(isDark),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            '₹${storePrice.toStringAsFixed(0)}',
                            style: AppTypography.priceNumber(isDark, size: 16).copyWith(color: AppColors.primary),
                          ),
                        ],
                      );
                    },
                  ),
                ),
                const SizedBox(height: 28),

                // Checkout Simulator CTA
                BiteButton(
                  text: 'Simulate Dispatch on $effectiveSelectedStore (₹${comparison[effectiveSelectedStore]!.totalAmount.toStringAsFixed(0)})',
                  icon: Icons.check_circle_outline_rounded,
                  onPressed: () {
                    HapticFeedback.heavyImpact();
                    _showOrderDispatchedDialog(context, effectiveSelectedStore, comparison[effectiveSelectedStore]!);
                  },
                ),
              ],
            );
          },
          loading: () => const Center(child: RecipeCardSkeleton()),
          error: (err, _) => Center(child: Text('Error comparing prices: $err')),
        ),
      ),
    );
  }

  Widget _buildStoreCard({
    required bool isDark,
    required StoreCartTotal storeData,
    required Color brandColor,
    required IconData logoIcon,
    required bool isCheapest,
    required bool isSelected,
    required VoidCallback onSelect,
  }) {
    return BiteCard(
      hasGlow: isCheapest,
      glowColor: isCheapest ? const Color(0xFF2E7D32) : null,
      customBorder: isSelected
          ? Border.all(color: AppColors.primary, width: 2)
          : (isCheapest ? Border.all(color: const Color(0xFF2E7D32), width: 1.5) : null),
      onTap: onSelect,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: brandColor.withOpacity(0.18),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(logoIcon, color: brandColor, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(storeData.store, style: AppTypography.h4(isDark)),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '⚡ ${storeData.deliveryTime}',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Full grocery pack checkout',
                  style: AppTypography.bodySmall(isDark),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '₹${storeData.totalAmount.toStringAsFixed(0)}',
                style: AppTypography.priceNumber(isDark, size: 20).copyWith(
                  color: isCheapest ? (isDark ? AppColors.tierBrokeDark : AppColors.tierBrokeLight) : null,
                ),
              ),
              if (isCheapest)
                Container(
                  margin: const EdgeInsets.only(top: 2),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF2E7D32).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'CHEAPEST',
                    style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF2E7D32),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  void _showOrderDispatchedDialog(BuildContext context, String store, StoreCartTotal data) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        final isDark = Theme.of(ctx).brightness == Brightness.dark;
        return Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.withOpacity(0.3), borderRadius: BorderRadius.circular(2))),
              const SizedBox(height: 20),
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(color: AppColors.success.withOpacity(0.12), shape: BoxShape.circle),
                child: const Icon(Icons.delivery_dining_rounded, color: AppColors.success, size: 36),
              ),
              const SizedBox(height: 14),
              Text('Simulated Dark-Store Dispatch', style: AppTypography.h3(isDark)),
              const SizedBox(height: 8),
              Text(
                'Your ingredients are being picked at nearest $store dark store. Arriving in ~${data.deliveryTime}!',
                textAlign: TextAlign.center,
                style: AppTypography.bodyMedium(isDark),
              ),
              const SizedBox(height: 24),
              BiteButton(
                text: 'Done',
                onPressed: () => Navigator.pop(ctx),
              ),
            ],
          ),
        );
      },
    );
  }
}
