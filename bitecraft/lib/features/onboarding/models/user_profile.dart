class UserProfile {
  final int age;
  final double weightKg;
  final double heightCm;
  final String gender; // 'male' | 'female'
  final String goal; // 'muscle-gain' | 'fat-loss' | 'high-protein' | 'maintenance'
  final String budgetTier; // 'broke' | 'balanced' | 'hifi'
  final List<String> equipment; // ['1-pan', 'kettle-only', ...]
  final int targetCalories;
  final int targetProteinGrams;

  const UserProfile({
    this.age = 21,
    this.weightKg = 68.0,
    this.heightCm = 172.0,
    this.gender = 'male',
    this.goal = 'high-protein',
    this.budgetTier = 'balanced',
    this.equipment = const ['1-pan', 'hostel-friendly'],
    this.targetCalories = 2200,
    this.targetProteinGrams = 120,
  });

  // Calculate Mifflin-St Jeor formula targets
  static UserProfile calculate({
    required int age,
    required double weightKg,
    required double heightCm,
    required String gender,
    required String goal,
    required String budgetTier,
    required List<String> equipment,
  }) {
    // 1. BMR
    double bmr;
    if (gender.toLowerCase() == 'female') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    }

    // 2. TDEE (Sedentary x1.2)
    final tdee = bmr * 1.2;

    // 3. Goal adjustment
    int targetKcal;
    double proteinMultiplier;
    if (goal == 'muscle-gain') {
      targetKcal = (tdee + 300).round();
      proteinMultiplier = 2.0;
    } else if (goal == 'fat-loss') {
      targetKcal = (tdee - 400).round();
      proteinMultiplier = 2.2;
    } else {
      targetKcal = tdee.round();
      proteinMultiplier = 1.9;
    }

    final targetProtein = (weightKg * proteinMultiplier).round();

    return UserProfile(
      age: age,
      weightKg: weightKg,
      heightCm: heightCm,
      gender: gender,
      goal: goal,
      budgetTier: budgetTier,
      equipment: equipment,
      targetCalories: targetKcal.clamp(1200, 4500),
      targetProteinGrams: targetProtein.clamp(50, 260),
    );
  }
}
