import 'package:flutter_test/flutter_test.dart';
import 'package:bitecraft/features/onboarding/models/user_profile.dart';

void main() {
  group('UserProfile Mifflin-St Jeor BMR & Macro Calculations', () {
    test('Calculates male BMR and muscle-gain macros correctly', () {
      // 21 yo, 70kg, 175cm male
      // BMR = (10 * 70) + (6.25 * 175) - (5 * 21) + 5
      //     = 700 + 1093.75 - 105 + 5 = 1693.75
      // TDEE (x1.2) = 2032.5
      // Muscle gain (+300) = 2332.5 -> 2333
      // Protein (70 * 2.0) = 140g
      final profile = UserProfile.calculate(
        age: 21,
        weightKg: 70.0,
        heightCm: 175.0,
        gender: 'male',
        goal: 'muscle-gain',
        budgetTier: 'broke',
        equipment: ['1-pan'],
      );

      expect(profile.targetCalories, equals(2333));
      expect(profile.targetProteinGrams, equals(140));
      expect(profile.budgetTier, equals('broke'));
    });

    test('Calculates female BMR and fat-loss macros correctly', () {
      // 20 yo, 60kg, 160cm female
      // BMR = (10 * 60) + (6.25 * 160) - (5 * 20) - 161
      //     = 600 + 1000 - 100 - 161 = 1339
      // TDEE (x1.2) = 1606.8
      // Fat loss (-400) = 1206.8 -> 1207
      // Protein (60 * 2.2) = 132g
      final profile = UserProfile.calculate(
        age: 20,
        weightKg: 60.0,
        heightCm: 160.0,
        gender: 'female',
        goal: 'fat-loss',
        budgetTier: 'balanced',
        equipment: ['kettle-only'],
      );

      expect(profile.targetCalories, equals(1207));
      expect(profile.targetProteinGrams, equals(132));
      expect(profile.budgetTier, equals('balanced'));
    });

    test('Clamps extreme inputs within healthy limits', () {
      final lowProfile = UserProfile.calculate(
        age: 80,
        weightKg: 30.0,
        heightCm: 120.0,
        gender: 'female',
        goal: 'fat-loss',
        budgetTier: 'broke',
        equipment: [],
      );

      expect(lowProfile.targetCalories, greaterThanOrEqualTo(1200));
      expect(lowProfile.targetProteinGrams, greaterThanOrEqualTo(50));
    });
  });
}
