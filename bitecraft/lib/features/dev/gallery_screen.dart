import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/theme_provider.dart';
import '../../core/widgets/bite_card.dart';
import '../../core/widgets/bite_button.dart';
import '../../core/widgets/tier_badge.dart';
import '../../core/widgets/equipment_chip.dart';
import '../../core/widgets/price_chip.dart';
import '../../core/widgets/macro_bar.dart';
import '../../core/widgets/shimmer_skeleton.dart';
import '../../core/widgets/empty_state_view.dart';
import '../../core/widgets/error_view.dart';
import '../../core/widgets/recipe_image_view.dart';
import '../../core/widgets/floating_pill_nav.dart';

class DevGalleryScreen extends ConsumerStatefulWidget {
  const DevGalleryScreen({super.key});

  @override
  ConsumerState<DevGalleryScreen> createState() => _DevGalleryScreenState();
}

class _DevGalleryScreenState extends ConsumerState<DevGalleryScreen> {
  int _pillNavIndex = 0;
  bool _btnLoading = false;

  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text('Design System Gallery', style: AppTypography.h3(isDark)),
        actions: [
          IconButton(
            tooltip: 'Toggle Theme',
            icon: Icon(isDark ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
            onPressed: () => ref.read(themeModeProvider.notifier).toggleTheme(context),
          ),
          PopupMenuButton<ThemeMode>(
            icon: const Icon(Icons.palette_outlined),
            initialValue: themeMode,
            onSelected: (mode) => ref.read(themeModeProvider.notifier).setTheme(mode),
            itemBuilder: (context) => [
              const PopupMenuItem(value: ThemeMode.system, child: Text('System')),
              const PopupMenuItem(value: ThemeMode.light, child: Text('Light (#FAF7F2)')),
              const PopupMenuItem(value: ThemeMode.dark, child: Text('Dark (#17130F)')),
            ],
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        children: [
          _buildSectionHeader('1. Theme Tokens & Mode', isDark),
          BiteCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Current Mode: ${themeMode.name.toUpperCase()} (Brightness: ${isDark ? "DARK" : "LIGHT"})',
                  style: AppTypography.labelLarge(isDark),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _buildColorSwatch('Primary', AppColors.primary),
                    _buildColorSwatch('Background', isDark ? AppColors.darkBg : AppColors.lightBg),
                    _buildColorSwatch('Surface', isDark ? AppColors.darkSurface : AppColors.lightSurface),
                    _buildColorSwatch('Ink', isDark ? AppColors.darkInk : AppColors.lightInk),
                    _buildColorSwatch('🟢 Broke', isDark ? AppColors.tierBrokeDark : AppColors.tierBrokeLight),
                    _buildColorSwatch('🟡 Balanced', isDark ? AppColors.tierBalancedDark : AppColors.tierBalancedLight),
                    _buildColorSwatch('🟣 Hi-Fi', isDark ? AppColors.tierHiFiDark : AppColors.tierHiFiLight),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('2. Typography Scale (Sora + Inter)', isDark),
          BiteCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('H1 Sora Bold 30px', style: AppTypography.h1(isDark)),
                const SizedBox(height: 6),
                Text('H2 Sora Bold 24px', style: AppTypography.h2(isDark)),
                const SizedBox(height: 6),
                Text('H3 Sora SemiBold 20px', style: AppTypography.h3(isDark)),
                const SizedBox(height: 6),
                Text('H4 Sora SemiBold 17px', style: AppTypography.h4(isDark)),
                const Divider(height: 24),
                Text('Body Large Inter Regular 16px — Perfect for cooking directions & descriptions.', style: AppTypography.bodyLarge(isDark)),
                const SizedBox(height: 6),
                Text('Body Medium Inter Regular 14px — Ingredient notes & student tips.', style: AppTypography.bodyMedium(isDark)),
                const SizedBox(height: 6),
                Text('Body Small Inter Regular 12px — Footnotes & store timestamps.', style: AppTypography.bodySmall(isDark)),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('3. Budget Tiers (Strict Spec)', isDark),
          BiteCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Full Badges', style: AppTypography.labelMedium(isDark)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: const [
                    TierBadge(tier: BudgetTier.broke),
                    TierBadge(tier: BudgetTier.balanced),
                    TierBadge(tier: BudgetTier.hifi),
                  ],
                ),
                const SizedBox(height: 14),
                Text('Compact Badges for Feed Grids', style: AppTypography.labelMedium(isDark)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: const [
                    TierBadge(tier: BudgetTier.broke, compact: true),
                    TierBadge(tier: BudgetTier.balanced, compact: true),
                    TierBadge(tier: BudgetTier.hifi, compact: true),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('4. Equipment & Kitchen Setup Chips', isDark),
          BiteCard(
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: const [
                EquipmentChip(tag: 'kettle-only'),
                EquipmentChip(tag: '1-pan'),
                EquipmentChip(tag: 'hostel-friendly'),
                EquipmentChip(tag: 'induction'),
                EquipmentChip(tag: 'oven'),
                EquipmentChip(tag: 'mixer'),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('5. Portion Cost vs Full-Pack Cost', isDark),
          BiteCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                PriceChip(costPerServing: 32, costFullPack: 140),
                SizedBox(height: 12),
                PriceChip(costPerServing: 85, costFullPack: 290),
                SizedBox(height: 12),
                PriceChip(costPerServing: 24, compact: true),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('6. Animated Macro Nutrition Breakdown', isDark),
          BiteCard(
            child: Column(
              children: const [
                MacroBar(
                  kcal: 485,
                  protein: 34.0,
                  carbs: 52.0,
                  fats: 14.5,
                  fiber: 6.2,
                ),
                SizedBox(height: 16),
                MacroBar(
                  kcal: 260,
                  protein: 18.0,
                  carbs: 32.0,
                  fats: 6.0,
                  compact: true,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('7. Button Hierarchy & Haptic Feedback', isDark),
          BiteCard(
            child: Column(
              children: [
                BiteButton(
                  text: 'Primary Action (Coral Glow)',
                  icon: Icons.bolt_rounded,
                  onPressed: () {},
                ),
                const SizedBox(height: 10),
                BiteButton(
                  text: 'Secondary Surface Action',
                  icon: Icons.layers_rounded,
                  variant: BiteButtonVariant.secondary,
                  onPressed: () {},
                ),
                const SizedBox(height: 10),
                BiteButton(
                  text: 'Outline Button',
                  variant: BiteButtonVariant.outline,
                  onPressed: () {},
                ),
                const SizedBox(height: 10),
                BiteButton(
                  text: _btnLoading ? 'Loading' : 'Simulate Async Action',
                  isLoading: _btnLoading,
                  onPressed: () async {
                    setState(() => _btnLoading = true);
                    await Future.delayed(const Duration(seconds: 2));
                    if (mounted) setState(() => _btnLoading = false);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('8. Shimmer Skeletons (Zero Raw Spinners)', isDark),
          const RecipeCardSkeleton(),
          const SizedBox(height: 24),

          _buildSectionHeader('9. Deterministic Image Fallback (No Broken Images)', isDark),
          BiteCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Deterministic gradient + emoji generated from recipe seed when network/image is unavailable:',
                  style: AppTypography.bodySmall(isDark),
                ),
                const SizedBox(height: 12),
                Row(
                  children: const [
                    Expanded(
                      child: RecipeImageView(
                        height: 100,
                        emoji: '🥑',
                        gradientSeed: 1,
                        heroTag: 'gal_1',
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: RecipeImageView(
                        height: 100,
                        emoji: '🍲',
                        gradientSeed: 2,
                        heroTag: 'gal_2',
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: RecipeImageView(
                        height: 100,
                        emoji: '🍳',
                        gradientSeed: 3,
                        heroTag: 'gal_3',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('10. Designed Empty & Error States', isDark),
          BiteCard(
            padding: EdgeInsets.zero,
            child: const EmptyStateView(
              emoji: '🥦',
              title: 'Empty Fridge Raid',
              subtitle: 'Select a few ingredients above to find delicious hostel recipes.',
              buttonText: 'Add Ingredients',
            ),
          ),
          const SizedBox(height: 14),
          BiteCard(
            padding: EdgeInsets.zero,
            child: const ErrorView(
              title: 'Dark-Store Network Hiccup',
              message: 'Could not fetch live Zepto/Blinkit quotes. Showing cached rates.',
            ),
          ),
          const SizedBox(height: 24),

          _buildSectionHeader('11. Custom Floating Pill Navigation', isDark),
          FloatingPillNav(
            currentIndex: _pillNavIndex,
            onIndexChanged: (i) => setState(() => _pillNavIndex = i),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(
        title,
        style: AppTypography.h4(isDark).copyWith(color: AppColors.primary),
      ),
    );
  }

  Widget _buildColorSwatch(String name, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.black.withOpacity(0.1)),
      ),
      child: Text(
        name,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: color.computeLuminance() > 0.5 ? Colors.black : Colors.white,
        ),
      ),
    );
  }
}
