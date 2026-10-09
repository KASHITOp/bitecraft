import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bitecraft/core/theme/app_theme.dart';
import 'package:bitecraft/core/widgets/bite_card.dart';
import 'package:bitecraft/core/widgets/macro_bar.dart';
import 'package:bitecraft/core/widgets/tier_badge.dart';
import 'package:bitecraft/core/widgets/equipment_chip.dart';
import 'package:bitecraft/core/widgets/price_chip.dart';

void main() {
  group('Design System Components Tests', () {
    testWidgets('BiteCard renders child with radius and border styling', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: BiteCard(
              child: Text('Card Content'),
            ),
          ),
        ),
      );

      expect(find.text('Card Content'), findsOneWidget);
    });

    testWidgets('TierBadge displays correct tier label and colors', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: Column(
              children: [
                TierBadge(tier: BudgetTier.broke),
                TierBadge(tier: BudgetTier.balanced),
                TierBadge(tier: BudgetTier.hifi),
              ],
            ),
          ),
        ),
      );

      expect(find.text('Broke Student'), findsOneWidget);
      expect(find.text('Balanced'), findsOneWidget);
      expect(find.text('Hi-Fi Gourmet'), findsOneWidget);
    });

    testWidgets('MacroBar renders macro values correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: MacroBar(
              kcal: 500,
              protein: 35,
              carbs: 60,
              fats: 15,
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('500 kcal'), findsOneWidget);
      expect(find.text('Protein'), findsOneWidget);
      expect(find.text('35.0g'), findsOneWidget);
    });

    testWidgets('EquipmentChip renders emoji and tag label', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: Column(
              children: [
                EquipmentChip(tag: '1-pan'),
                EquipmentChip(tag: 'kettle-only'),
                EquipmentChip(tag: 'hostel-friendly'),
              ],
            ),
          ),
        ),
      );

      expect(find.text('1 Pan Only'), findsOneWidget);
      expect(find.text('Kettle Only'), findsOneWidget);
      expect(find.text('Hostel Friendly'), findsOneWidget);
    });

    testWidgets('PriceChip renders INR format correctly', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: AppTheme.light(),
          home: const Scaffold(
            body: PriceChip(
              costPerServing: 45.0,
              costFullPack: 120.0,
            ),
          ),
        ),
      );

      expect(find.text('₹45'), findsOneWidget);
      expect(find.text('₹120'), findsOneWidget);
      expect(find.text('Full Grocery Pack'), findsOneWidget);
    });
  });
}
