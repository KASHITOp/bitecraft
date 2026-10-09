import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class MacroBar extends StatelessWidget {
  final int kcal;
  final double protein;
  final double carbs;
  final double fats;
  final double? fiber;
  final bool compact;

  const MacroBar({
    super.key,
    required this.kcal,
    required this.protein,
    required this.carbs,
    required this.fats,
    this.fiber,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final totalGrams = (protein + carbs + fats).clamp(1.0, 9999.0);
    final proteinFraction = (protein / totalGrams).clamp(0.05, 0.9);
    final carbsFraction = (carbs / totalGrams).clamp(0.05, 0.9);
    final fatsFraction = (fats / totalGrams).clamp(0.05, 0.9);

    if (compact) {
      return Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildCompactPill(context, '$kcal kcal', AppColors.calories),
          const SizedBox(width: 6),
          _buildCompactPill(context, '${protein.round()}g P', AppColors.protein),
          const SizedBox(width: 6),
          _buildCompactPill(context, '${carbs.round()}g C', AppColors.carbs),
          const SizedBox(width: 6),
          _buildCompactPill(context, '${fats.round()}g F', AppColors.fats),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                const Icon(Icons.local_fire_department_rounded, size: 20, color: AppColors.calories),
                const SizedBox(width: 4),
                Text(
                  '$kcal kcal',
                  style: AppTypography.priceNumber(isDark, size: 18).copyWith(color: AppColors.calories),
                ),
              ],
            ),
            Text(
              'Macros Breakdown',
              style: AppTypography.bodySmall(isDark),
            ),
          ],
        ),
        const SizedBox(height: 10),
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: SizedBox(
            height: 10,
            child: Row(
              children: [
                Expanded(
                  flex: (proteinFraction * 100).round(),
                  child: Container(color: AppColors.protein),
                ),
                const SizedBox(width: 2),
                Expanded(
                  flex: (carbsFraction * 100).round(),
                  child: Container(color: AppColors.carbs),
                ),
                const SizedBox(width: 2),
                Expanded(
                  flex: (fatsFraction * 100).round(),
                  child: Container(color: AppColors.fats),
                ),
              ],
            ),
          ),
        ).animate().fadeIn(duration: 250.ms).scaleX(begin: 0.8, alignment: Alignment.centerLeft),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildMacroMetric(context, 'Protein', '${protein.toStringAsFixed(1)}g', AppColors.protein),
            _buildMacroMetric(context, 'Carbs', '${carbs.toStringAsFixed(1)}g', AppColors.carbs),
            _buildMacroMetric(context, 'Fats', '${fats.toStringAsFixed(1)}g', AppColors.fats),
            if (fiber != null)
              _buildMacroMetric(context, 'Fiber', '${fiber!.toStringAsFixed(1)}g', AppColors.fiber),
          ],
        ),
      ],
    );
  }

  Widget _buildCompactPill(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: color,
        ),
      ),
    );
  }

  Widget _buildMacroMetric(BuildContext context, String label, String value, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTypography.labelSmall(isDark)),
            Text(value, style: AppTypography.labelMedium(isDark).copyWith(fontWeight: FontWeight.w700)),
          ],
        ),
      ],
    );
  }
}
