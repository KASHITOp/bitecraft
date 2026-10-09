import 'package:flutter/material.dart';

/// BiteCraft Design Tokens
/// Strict color specifications:
/// - Light theme: cream #FAF7F2, primary #FF5A36, ink #1F1B16
/// - Dark theme: charcoal #17130F, surface #221D17, primary #FF5A36
/// - Tier colors: Broke 🟢, Balanced 🟡, Hi-Fi 🟣
abstract class AppColors {
  // Brand Primary & Accent
  static const Color primary = Color(0xFFFF5A36); // Vibrant coral-orange
  static const Color primaryDark = Color(0xFFE04220);
  static const Color primaryLight = Color(0xFFFF856A);
  static const Color primaryGlow = Color(0x33FF5A36);

  // Light Theme Palette
  static const Color lightBg = Color(0xFFFAF7F2); // Warm gourmet cream
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceSecondary = Color(0xFFF3ECE2);
  static const Color lightInk = Color(0xFF1F1B16); // High contrast warm ink
  static const Color lightInkSecondary = Color(0xFF6B645C);
  static const Color lightInkTertiary = Color(0xFFA59E95);
  static const Color lightBorder = Color(0xFFEBE3D7);
  static const Color lightHairline = Color(0x141F1B16);

  // Dark Theme Palette
  static const Color darkBg = Color(0xFF17130F); // Deep warm charcoal
  static const Color darkSurface = Color(0xFF221D17); // Elevated surface
  static const Color darkSurfaceSecondary = Color(0xFF2C251F);
  static const Color darkInk = Color(0xFFF5EFE6); // Warm off-white
  static const Color darkInkSecondary = Color(0xFFAEA79C);
  static const Color darkInkTertiary = Color(0xFF756E63);
  static const Color darkBorder = Color(0xFF332A22);
  static const Color darkHairline = Color(0x1FFFFFFF);

  // Tier Colors (Light Mode)
  static const Color tierBrokeLight = Color(0xFF2E7D32); // 🟢 Broke Student (< ₹60)
  static const Color tierBalancedLight = Color(0xFFF9A825); // 🟡 Balanced (₹60–₹150)
  static const Color tierHiFiLight = Color(0xFF6A1B9A); // 🟣 Hi-Fi Gourmet (₹150+)

  // Tier Colors (Dark Mode contrast adjusted)
  static const Color tierBrokeDark = Color(0xFF4CAF50);
  static const Color tierBalancedDark = Color(0xFFFDD835);
  static const Color tierHiFiDark = Color(0xFFBA68C8);

  // Store Brand Accent Colors
  static const Color zepto = Color(0xFFEC2578);
  static const Color blinkit = Color(0xFFF8CB46);
  static const Color blinkitDark = Color(0xFF0C831F);
  static const Color instamart = Color(0xFFFF5200);

  // Functional & Macro Colors
  static const Color calories = Color(0xFFFF7043);
  static const Color protein = Color(0xFF42A5F5);
  static const Color carbs = Color(0xFFFFA726);
  static const Color fats = Color(0xFFAB47BC);
  static const Color fiber = Color(0xFF26A69A);

  static const Color success = Color(0xFF2E7D32);
  static const Color warning = Color(0xFFED6C02);
  static const Color error = Color(0xFFD32F2F);

  // Soft diffused shadows
  static List<BoxShadow> softShadow(bool isDark) => [
        BoxShadow(
          color: isDark ? const Color(0x66000000) : const Color(0x0C1F1B16),
          blurRadius: 18,
          spreadRadius: 0,
          offset: const Offset(0, 6),
        ),
        BoxShadow(
          color: isDark ? const Color(0x33000000) : const Color(0x081F1B16),
          blurRadius: 6,
          spreadRadius: 0,
          offset: const Offset(0, 2),
        ),
      ];

  static List<BoxShadow> glowShadow(Color color) => [
        BoxShadow(
          color: color.withOpacity(0.35),
          blurRadius: 16,
          spreadRadius: 0,
          offset: const Offset(0, 4),
        ),
      ];
}
