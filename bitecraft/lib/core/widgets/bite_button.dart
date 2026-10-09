import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

enum BiteButtonVariant {
  primary,
  secondary,
  outline,
  ghost,
}

class BiteButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final BiteButtonVariant variant;
  final IconData? icon;
  final bool isLoading;
  final double? width;
  final double height;
  final double borderRadius;

  const BiteButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = BiteButtonVariant.primary,
    this.icon,
    this.isLoading = false,
    this.width,
    this.height = 52,
    this.borderRadius = 16,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color bg;
    Color fg;
    Border? border;

    switch (variant) {
      case BiteButtonVariant.primary:
        bg = AppColors.primary;
        fg = Colors.white;
        border = null;
        break;
      case BiteButtonVariant.secondary:
        bg = isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary;
        fg = isDark ? AppColors.darkInk : AppColors.lightInk;
        border = Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        );
        break;
      case BiteButtonVariant.outline:
        bg = Colors.transparent;
        fg = AppColors.primary;
        border = Border.all(color: AppColors.primary, width: 1.5);
        break;
      case BiteButtonVariant.ghost:
        bg = Colors.transparent;
        fg = isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary;
        border = null;
        break;
    }

    final effectiveOnPressed = (isLoading || onPressed == null)
        ? null
        : () {
            HapticFeedback.mediumImpact();
            onPressed!();
          };

    return SizedBox(
      width: width,
      height: height,
      child: Material(
        color: bg,
        borderRadius: BorderRadius.circular(borderRadius),
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: effectiveOnPressed,
          splashColor: fg.withOpacity(0.12),
          highlightColor: fg.withOpacity(0.06),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(borderRadius),
              border: border,
              boxShadow: (variant == BiteButtonVariant.primary && onPressed != null)
                  ? AppColors.glowShadow(AppColors.primary)
                  : null,
            ),
            alignment: Alignment.center,
            child: isLoading
                ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.2,
                      valueColor: AlwaysStoppedAnimation<Color>(fg),
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (icon != null) ...[
                        Icon(icon, size: 18, color: fg),
                        const SizedBox(width: 8),
                      ],
                      Text(
                        text,
                        style: AppTypography.labelLarge(isDark).copyWith(
                          color: fg,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
