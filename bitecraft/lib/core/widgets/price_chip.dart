import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class PriceChip extends StatelessWidget {
  final double costPerServing;
  final double? costFullPack;
  final bool compact;

  const PriceChip({
    super.key,
    required this.costPerServing,
    this.costFullPack,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (compact) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.primary.withOpacity(0.2), width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '₹${costPerServing.toStringAsFixed(0)}',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
            Text(
              '/serve',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Per Serving',
                style: AppTypography.labelSmall(isDark),
              ),
              const SizedBox(height: 2),
              Row(
                crossAxisAlignment: CrossAxisAlignment.baseline,
                textBaseline: TextBaseline.alphabetic,
                children: [
                  Text(
                    '₹${costPerServing.toStringAsFixed(0)}',
                    style: AppTypography.priceNumber(isDark, size: 20).copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                  const SizedBox(width: 2),
                  Text(
                    ' / plate',
                    style: AppTypography.bodySmall(isDark),
                  ),
                ],
              ),
            ],
          ),
          if (costFullPack != null) ...[
            Container(
              height: 32,
              width: 1,
              margin: const EdgeInsets.symmetric(horizontal: 14),
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Full Grocery Pack',
                  style: AppTypography.labelSmall(isDark),
                ),
                const SizedBox(height: 2),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '₹${costFullPack!.toStringAsFixed(0)}',
                      style: AppTypography.priceNumber(isDark, size: 16),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      ' at cart',
                      style: AppTypography.bodySmall(isDark),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}
