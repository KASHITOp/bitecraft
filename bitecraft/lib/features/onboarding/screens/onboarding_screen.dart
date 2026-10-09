import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/bite_button.dart';
import '../../../core/widgets/tier_badge.dart';
import '../../../core/providers/profile_provider.dart';
import '../models/user_profile.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  int _currentStep = 0;

  // Step 1: Metrics
  int _age = 21;
  double _weightKg = 68.0;
  double _heightCm = 172.0;
  String _gender = 'male';

  // Step 2: Goal
  String _goal = 'high-protein';

  // Step 3: Budget Tier
  String _budgetTier = 'balanced';

  // Step 4: Equipment
  final Set<String> _selectedEquipment = {'1-pan', 'hostel-friendly'};

  @override
  void initState() {
    super.initState();
    final profile = ref.read(userProfileProvider);
    _age = profile.age;
    _weightKg = profile.weightKg;
    _heightCm = profile.heightCm;
    _gender = profile.gender;
    _goal = profile.goal;
    _budgetTier = profile.budgetTier;
    _selectedEquipment.addAll(profile.equipment);
  }

  void _nextStep() {
    HapticFeedback.lightImpact();
    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      _saveAndFinish();
    }
  }

  void _prevStep() {
    HapticFeedback.lightImpact();
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    } else {
      context.pop();
    }
  }

  Future<void> _saveAndFinish() async {
    final calculated = UserProfile.calculate(
      age: _age,
      weightKg: _weightKg,
      heightCm: _heightCm,
      gender: _gender,
      goal: _goal,
      budgetTier: _budgetTier,
      equipment: _selectedEquipment.toList(),
    );

    await ref.read(userProfileProvider.notifier).saveProfile(calculated);
    HapticFeedback.heavyImpact();

    if (mounted) {
      context.go('/explore');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: _prevStep,
        ),
        title: Text('Student Profile Setup', style: AppTypography.h4(isDark)),
        actions: [
          TextButton(
            onPressed: _saveAndFinish,
            child: Text('Skip', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700)),
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: (_currentStep + 1) / 4.0,
                  backgroundColor: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                  valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primary),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Step ${_currentStep + 1} of 4',
                style: AppTypography.labelSmall(isDark).copyWith(color: AppColors.primary),
              ),
              const SizedBox(height: 16),

              // Step Content Area
              Expanded(
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 250),
                  child: _buildCurrentStep(isDark),
                ),
              ),

              // Bottom Navigation
              Row(
                children: [
                  if (_currentStep > 0) ...[
                    Expanded(
                      flex: 1,
                      child: BiteButton(
                        text: 'Back',
                        variant: BiteButtonVariant.secondary,
                        onPressed: _prevStep,
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    flex: 2,
                    child: BiteButton(
                      text: _currentStep == 3 ? 'Calculate & Finish 🚀' : 'Continue',
                      onPressed: _nextStep,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentStep(bool isDark) {
    switch (_currentStep) {
      case 0:
        return _buildMetricsStep(isDark);
      case 1:
        return _buildGoalStep(isDark);
      case 2:
        return _buildBudgetStep(isDark);
      case 3:
        return _buildEquipmentStep(isDark);
      default:
        return const SizedBox.shrink();
    }
  }

  // Step 1: Body Metrics
  Widget _buildMetricsStep(bool isDark) {
    return ListView(
      key: const ValueKey(0),
      children: [
        Text('About You 👤', style: AppTypography.h2(isDark)),
        const SizedBox(height: 6),
        Text(
          'Used to calculate your BMR and precise daily macro goals.',
          style: AppTypography.bodyMedium(isDark),
        ),
        const SizedBox(height: 24),

        // Gender Selector
        Row(
          children: [
            Expanded(
              child: _buildSelectablePill(
                isDark: isDark,
                selected: _gender == 'male',
                emoji: '🙋‍♂️',
                label: 'Male',
                onTap: () => setState(() => _gender = 'male'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSelectablePill(
                isDark: isDark,
                selected: _gender == 'female',
                emoji: '🙋‍♀️',
                label: 'Female',
                onTap: () => setState(() => _gender = 'female'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Age Slider
        BiteCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Age', style: AppTypography.labelLarge(isDark)),
                  Text('$_age yrs', style: AppTypography.priceNumber(isDark, size: 18).copyWith(color: AppColors.primary)),
                ],
              ),
              Slider(
                value: _age.toDouble(),
                min: 16,
                max: 45,
                divisions: 29,
                activeColor: AppColors.primary,
                onChanged: (v) => setState(() => _age = v.round()),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Weight Slider
        BiteCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Weight', style: AppTypography.labelLarge(isDark)),
                  Text('${_weightKg.toStringAsFixed(1)} kg', style: AppTypography.priceNumber(isDark, size: 18).copyWith(color: AppColors.primary)),
                ],
              ),
              Slider(
                value: _weightKg,
                min: 40,
                max: 130,
                divisions: 90,
                activeColor: AppColors.primary,
                onChanged: (v) => setState(() => _weightKg = v),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Height Slider
        BiteCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Height', style: AppTypography.labelLarge(isDark)),
                  Text('${_heightCm.toStringAsFixed(0)} cm', style: AppTypography.priceNumber(isDark, size: 18).copyWith(color: AppColors.primary)),
                ],
              ),
              Slider(
                value: _heightCm,
                min: 140,
                max: 210,
                divisions: 70,
                activeColor: AppColors.primary,
                onChanged: (v) => setState(() => _heightCm = v),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // Step 2: Goal
  Widget _buildGoalStep(bool isDark) {
    final goals = [
      {'id': 'high-protein', 'emoji': '⚡', 'title': 'Gym Bro High Protein', 'desc': 'Maximize protein-to-calorie ratio (2.0g/kg)'},
      {'id': 'muscle-gain', 'emoji': '💪', 'title': 'Muscle Bulk / Gain', 'desc': 'Surplus calories (+300 kcal) with dense clean carbs'},
      {'id': 'fat-loss', 'emoji': '🔥', 'title': 'Fat Loss / Cutting', 'desc': 'Calorie deficit (-400 kcal) with high satiety volume meals'},
      {'id': 'maintenance', 'emoji': '⚖️', 'title': 'Balanced Health', 'desc': 'Steady energy and maintenance nutrition'},
    ];

    return ListView(
      key: const ValueKey(1),
      children: [
        Text('What is your goal? 🎯', style: AppTypography.h2(isDark)),
        const SizedBox(height: 6),
        Text('We will tune your calories and protein multiplier.', style: AppTypography.bodyMedium(isDark)),
        const SizedBox(height: 20),
        ...goals.map((g) {
          final isSelected = _goal == g['id'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: BiteCard(
              backgroundColor: isSelected
                  ? AppColors.primary.withOpacity(isDark ? 0.2 : 0.1)
                  : null,
              customBorder: isSelected
                  ? Border.all(color: AppColors.primary, width: 1.8)
                  : null,
              onTap: () => setState(() => _goal = g['id'] as String),
              child: Row(
                children: [
                  Text(g['emoji'] as String, style: const TextStyle(fontSize: 32)),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(g['title'] as String, style: AppTypography.labelLarge(isDark)),
                        const SizedBox(height: 4),
                        Text(g['desc'] as String, style: AppTypography.bodySmall(isDark)),
                      ],
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 24),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  // Step 3: Budget Tier
  Widget _buildBudgetStep(bool isDark) {
    return ListView(
      key: const ValueKey(2),
      children: [
        Text('Daily Meal Budget 💰', style: AppTypography.h2(isDark)),
        const SizedBox(height: 6),
        Text('Pick your default tier. You can switch any time in Explore.', style: AppTypography.bodyMedium(isDark)),
        const SizedBox(height: 20),
        _buildTierOption(
          isDark,
          tierId: 'broke',
          badge: const TierBadge(tier: BudgetTier.broke),
          title: 'Broke Student (< ₹60 / meal)',
          desc: 'Masala oats with eggs, khichdi, poha, soya keema bhurji. Frugal survival.',
        ),
        const SizedBox(height: 12),
        _buildTierOption(
          isDark,
          tierId: 'balanced',
          badge: const TierBadge(tier: BudgetTier.balanced),
          title: 'Balanced Everyday (₹60–150 / meal)',
          desc: 'Paneer tikka quinoa, aglio e olio, greek yogurt parfait, chicken curry rice.',
        ),
        const SizedBox(height: 12),
        _buildTierOption(
          isDark,
          tierId: 'hifi',
          badge: const TierBadge(tier: BudgetTier.hifi),
          title: 'Hi-Fi Gourmet (₹150+ / meal)',
          desc: 'Truffle fettuccine, dragon fruit acai bowls, artisanal avocado toasts.',
        ),
      ],
    );
  }

  Widget _buildTierOption(
    bool isDark, {
    required String tierId,
    required Widget badge,
    required String title,
    required String desc,
  }) {
    final isSelected = _budgetTier == tierId;
    return BiteCard(
      backgroundColor: isSelected
          ? AppColors.primary.withOpacity(isDark ? 0.2 : 0.1)
          : null,
      customBorder: isSelected
          ? Border.all(color: AppColors.primary, width: 1.8)
          : null,
      onTap: () => setState(() => _budgetTier = tierId),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              badge,
              if (isSelected)
                const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 22),
            ],
          ),
          const SizedBox(height: 10),
          Text(title, style: AppTypography.labelLarge(isDark)),
          const SizedBox(height: 4),
          Text(desc, style: AppTypography.bodySmall(isDark)),
        ],
      ),
    );
  }

  // Step 4: Kitchen Setup
  Widget _buildEquipmentStep(bool isDark) {
    final equipmentOptions = [
      {'tag': '1-pan', 'emoji': '🍳', 'name': 'Only 1 Pan / Tawa'},
      {'tag': 'kettle-only', 'emoji': '☕', 'name': 'Electric Kettle Only'},
      {'tag': 'hostel-friendly', 'emoji': '🏨', 'name': 'Hostel Room Friendly'},
      {'tag': 'induction', 'emoji': '⚡', 'name': 'Induction Plate'},
      {'tag': 'oven', 'emoji': '♨️', 'name': 'Microwave / Oven'},
      {'tag': 'mixer', 'emoji': '🌪️', 'name': 'Mixer / Blender'},
    ];

    // Calculated summary preview
    final preview = UserProfile.calculate(
      age: _age,
      weightKg: _weightKg,
      heightCm: _heightCm,
      gender: _gender,
      goal: _goal,
      budgetTier: _budgetTier,
      equipment: _selectedEquipment.toList(),
    );

    return ListView(
      key: const ValueKey(3),
      children: [
        Text('Kitchen Setup 🍳', style: AppTypography.h2(isDark)),
        const SizedBox(height: 6),
        Text('What tools do you have in your room?', style: AppTypography.bodyMedium(isDark)),
        const SizedBox(height: 18),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: equipmentOptions.map((eq) {
            final tag = eq['tag'] as String;
            final isSelected = _selectedEquipment.contains(tag);
            return FilterChip(
              selected: isSelected,
              avatar: Text(eq['emoji'] as String, style: const TextStyle(fontSize: 14)),
              label: Text(eq['name'] as String),
              selectedColor: AppColors.primary,
              labelStyle: TextStyle(
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : (isDark ? AppColors.darkInk : AppColors.lightInk),
              ),
              onSelected: (val) {
                HapticFeedback.lightImpact();
                setState(() {
                  if (val) {
                    _selectedEquipment.add(tag);
                  } else {
                    _selectedEquipment.remove(tag);
                  }
                });
              },
            );
          }).toList(),
        ),
        const SizedBox(height: 24),

        // Calculated Targets Preview Card
        BiteCard(
          hasGlow: true,
          glowColor: AppColors.primary,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('✨ Your Calculated Daily Targets', style: AppTypography.h4(isDark)),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text('${preview.targetCalories} kcal',
                          style: AppTypography.priceNumber(isDark, size: 22).copyWith(color: AppColors.calories)),
                      Text('Daily Calories', style: AppTypography.bodySmall(isDark)),
                    ],
                  ),
                  Container(height: 36, width: 1, color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
                  Column(
                    children: [
                      Text('${preview.targetProteinGrams}g',
                          style: AppTypography.priceNumber(isDark, size: 22).copyWith(color: AppColors.protein)),
                      Text('Target Protein', style: AppTypography.bodySmall(isDark)),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSelectablePill({
    required bool isDark,
    required bool selected,
    required String emoji,
    required String label,
    required VoidCallback onTap,
  }) {
    return BiteCard(
      backgroundColor: selected ? AppColors.primary.withOpacity(isDark ? 0.2 : 0.1) : null,
      customBorder: selected ? Border.all(color: AppColors.primary, width: 1.8) : null,
      onTap: onTap,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 8),
          Text(label, style: AppTypography.labelLarge(isDark)),
        ],
      ),
    );
  }
}
