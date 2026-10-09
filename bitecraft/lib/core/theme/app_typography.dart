import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// BiteCraft Typography Scale
/// Headings: Sora (distinctive, modern geometric serif-sans feel)
/// Body & Captions: Inter (clean, high legibility, neutral)
abstract class AppTypography {
  // Sora Headings
  static TextStyle h1(bool isDark) => GoogleFonts.sora(
        fontSize: 30,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.8,
        height: 1.2,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle h2(bool isDark) => GoogleFonts.sora(
        fontSize: 24,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        height: 1.25,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle h3(bool isDark) => GoogleFonts.sora(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.3,
        height: 1.3,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle h4(bool isDark) => GoogleFonts.sora(
        fontSize: 17,
        fontWeight: FontWeight.w600,
        letterSpacing: -0.2,
        height: 1.35,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  // Inter Body & UI
  static TextStyle bodyLarge(bool isDark) => GoogleFonts.inter(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        letterSpacing: -0.1,
        height: 1.5,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle bodyMedium(bool isDark) => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        letterSpacing: 0,
        height: 1.45,
        color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
      );

  static TextStyle bodySmall(bool isDark) => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        letterSpacing: 0.1,
        height: 1.4,
        color: isDark ? AppColors.darkInkTertiary : AppColors.lightInkTertiary,
      );

  static TextStyle labelLarge(bool isDark) => GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.1,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle labelMedium(bool isDark) => GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.2,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );

  static TextStyle labelSmall(bool isDark) => GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        letterSpacing: 0.3,
        color: isDark ? AppColors.darkInkTertiary : AppColors.lightInkTertiary,
      );

  static TextStyle badge(Color color) => GoogleFonts.inter(
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: 0.4,
        color: color,
      );

  static TextStyle priceNumber(bool isDark, {double size = 18}) => GoogleFonts.sora(
        fontSize: size,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
        color: isDark ? AppColors.darkInk : AppColors.lightInk,
      );
}
