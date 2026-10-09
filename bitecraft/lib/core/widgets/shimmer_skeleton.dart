import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_colors.dart';

class ShimmerBox extends StatelessWidget {
  final double? width;
  final double height;
  final double borderRadius;
  final ShapeBorder? shape;

  const ShimmerBox({
    super.key,
    this.width,
    required this.height,
    this.borderRadius = 14,
    this.shape,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final baseColor = isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary;
    final highlightColor = isDark ? const Color(0xFF382E25) : const Color(0xFFE5DDD0);

    final box = Container(
      width: width,
      height: height,
      decoration: ShapeDecoration(
        color: baseColor,
        shape: shape ?? RoundedRectangleBorder(borderRadius: BorderRadius.circular(borderRadius)),
      ),
    );

    if (const bool.fromEnvironment('flutter.test')) {
      return box;
    }

    return box
        .animate(onPlay: (controller) => controller.repeat())
        .shimmer(
          duration: 1200.ms,
          color: highlightColor,
          angle: 0.3,
        );
  }
}

class RecipeCardSkeleton extends StatelessWidget {
  const RecipeCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const ShimmerBox(
            height: 115,
            borderRadius: 0,
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    ShimmerBox(width: 60, height: 16, borderRadius: 6),
                    ShimmerBox(width: 44, height: 16, borderRadius: 6),
                  ],
                ),
                const SizedBox(height: 8),
                const ShimmerBox(height: 14, borderRadius: 4),
                const SizedBox(height: 6),
                const ShimmerBox(width: 100, height: 14, borderRadius: 4),
                const SizedBox(height: 10),
                const ShimmerBox(height: 6, borderRadius: 3),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
