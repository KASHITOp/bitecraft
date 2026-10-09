import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

enum BudgetTier {
  broke, // 🟢 < ₹60
  balanced, // 🟡 ₹60–₹150
  hifi, // 🟣 ₹150+
}

BudgetTier budgetTierFromString(String? value) {
  if (value == null) return BudgetTier.balanced;
  final lower = value.toLowerCase();
  if (lower.contains('broke') || lower == 'tier_1' || lower == 'tier1') return BudgetTier.broke;
  if (lower.contains('hifi') || lower.contains('hi-fi') || lower == 'tier_3' || lower == 'tier3') return BudgetTier.hifi;
  return BudgetTier.balanced;
}

String budgetTierLabel(BudgetTier tier) {
  switch (tier) {
    case BudgetTier.broke:
      return 'Broke Student';
    case BudgetTier.balanced:
      return 'Balanced';
    case BudgetTier.hifi:
      return 'Hi-Fi Gourmet';
  }
}

String budgetTierPriceRange(BudgetTier tier) {
  switch (tier) {
    case BudgetTier.broke:
      return '< ₹60';
    case BudgetTier.balanced:
      return '₹60–150';
    case BudgetTier.hifi:
      return '₹150+';
  }
}

class TierBadge extends StatelessWidget {
  final BudgetTier tier;
  final bool showPrice;
  final bool compact;

  const TierBadge({
    super.key,
    required this.tier,
    this.showPrice = true,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final Color tierColor;
    final String emoji;

    switch (tier) {
      case BudgetTier.broke:
        tierColor = isDark ? AppColors.tierBrokeDark : AppColors.tierBrokeLight;
        emoji = '🟢';
        break;
      case BudgetTier.balanced:
        tierColor = isDark ? AppColors.tierBalancedDark : AppColors.tierBalancedLight;
        emoji = '🟡';
        break;
      case BudgetTier.hifi:
        tierColor = isDark ? AppColors.tierHiFiDark : AppColors.tierHiFiLight;
        emoji = '🟣';
        break;
    }

    if (compact) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: tierColor.withOpacity(isDark ? 0.2 : 0.12),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: tierColor.withOpacity(0.3), width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(emoji, style: const TextStyle(fontSize: 9)),
            const SizedBox(width: 4),
            Text(
              showPrice ? budgetTierPriceRange(tier) : budgetTierLabel(tier),
              style: AppTypography.badge(tierColor),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: tierColor.withOpacity(isDark ? 0.2 : 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: tierColor.withOpacity(0.35), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 11)),
          const SizedBox(width: 5),
          Text(
            budgetTierLabel(tier),
            style: AppTypography.badge(tierColor),
          ),
          if (showPrice) ...[
            const SizedBox(width: 4),
            Text(
              '(${budgetTierPriceRange(tier)})',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: tierColor.withOpacity(0.85),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
