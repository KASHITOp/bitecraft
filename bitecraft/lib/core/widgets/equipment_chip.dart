import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

class EquipmentChip extends StatelessWidget {
  final String tag;
  final bool compact;

  const EquipmentChip({
    super.key,
    required this.tag,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final IconData iconData;
    final String label;

    final lower = tag.toLowerCase();
    if (lower.contains('kettle')) {
      iconData = Icons.coffee_maker_rounded;
      label = 'Kettle Only';
    } else if (lower.contains('1-pan') || lower.contains('one-pan') || lower.contains('pan')) {
      iconData = Icons.soup_kitchen_rounded;
      label = '1 Pan Only';
    } else if (lower.contains('hostel')) {
      iconData = Icons.hotel_rounded;
      label = 'Hostel Friendly';
    } else if (lower.contains('oven')) {
      iconData = Icons.microwave_rounded;
      label = 'Oven/Micro';
    } else if (lower.contains('mixer') || lower.contains('blender')) {
      iconData = Icons.blender_rounded;
      label = 'Mixer/Blender';
    } else if (lower.contains('induction')) {
      iconData = Icons.electric_bolt_rounded;
      label = 'Induction';
    } else {
      iconData = Icons.restaurant_rounded;
      label = tag;
    }

    if (compact) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              iconData,
              size: 12,
              color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
            ),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
                color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            iconData,
            size: 15,
            color: AppColors.primary,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTypography.labelSmall(isDark),
          ),
        ],
      ),
    );
  }
}
