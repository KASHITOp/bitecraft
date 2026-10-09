import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/native.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/core/models/ingredient.dart';
import 'package:bitecraft/core/providers/database_provider.dart';
import 'package:bitecraft/core/theme/app_theme.dart';
import 'package:bitecraft/features/pantry/widgets/add_pantry_item_sheet.dart';

void main() {
  group('Pantry Add Item Flow Widget Test', () {
    late AppDatabase db;

    final testIngredients = [
      const Ingredient(
        id: 1,
        name: 'Onion',
        aliases: ['Kanda', 'Pyaz'],
        category: 'Produce',
        packSize: '1 kg',
        avgPackPrice: 35.0,
      ),
      const Ingredient(
        id: 2,
        name: 'Potato',
        aliases: ['Aloo', 'Batata'],
        category: 'Produce',
        packSize: '1 kg',
        avgPackPrice: 30.0,
      ),
      const Ingredient(
        id: 3,
        name: 'Paneer',
        aliases: ['Cottage Cheese'],
        category: 'Dairy',
        packSize: '200 g',
        avgPackPrice: 85.0,
      ),
    ];

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
    });

    tearDown(() async {
      await db.close();
    });

    testWidgets('Searching "kanda" finds "Onion" and auto-suggests 7 days expiry', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            appDatabaseProvider.overrideWithValue(db),
          ],
          child: MaterialApp(
            theme: AppTheme.light(),
            home: Scaffold(
              body: AddPantryItemSheet(
                initialIngredients: testIngredients,
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Verify search field exists
      final searchFieldFinder = find.byKey(const Key('pantry_search_field'));
      expect(searchFieldFinder, findsOneWidget);

      // Search colloquial alias "kanda"
      await tester.enterText(searchFieldFinder, 'kanda');
      await tester.pumpAndSettle();

      // Assert that "Onion" is found via alias match, and "Potato" is not found
      expect(find.text('Onion'), findsOneWidget);
      expect(find.text('Potato'), findsNothing);
      expect(find.textContaining('Kanda'), findsWidgets);

      // Select "Onion"
      final selectButton = find.text('Select').first;
      await tester.tap(selectButton);
      await tester.pumpAndSettle();

      // Assert Onion is now selected
      expect(find.text('Onion'), findsOneWidget);

      // Assert smart expiry auto-suggestion highlights 7 days for Onion
      expect(find.textContaining('7 Days'), findsOneWidget);

      // Assert "Add to Smart Pantry" button is enabled
      final submitButton = find.byKey(const Key('pantry_add_submit_button'));
      expect(submitButton, findsOneWidget);

      // Tap submit
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify item was inserted into local Drift database
      final items = await db.pantryDao.getAllItems();
      expect(items.length, equals(1));
      expect(items.first.ingredientId, equals(1)); // Onion
      expect(items.first.quantityGrams, equals(500.0));
    });

    testWidgets('Selecting "Paneer" auto-suggests 3 days expiry', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            appDatabaseProvider.overrideWithValue(db),
          ],
          child: MaterialApp(
            theme: AppTheme.light(),
            home: Scaffold(
              body: AddPantryItemSheet(
                initialIngredients: testIngredients,
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Search "paneer"
      final searchFieldFinder = find.byKey(const Key('pantry_search_field'));
      await tester.enterText(searchFieldFinder, 'paneer');
      await tester.pumpAndSettle();

      expect(find.text('Paneer'), findsOneWidget);

      // Select Paneer
      await tester.tap(find.text('Select').first);
      await tester.pumpAndSettle();

      // Assert smart expiry auto-suggestion highlights 3 days for Paneer
      expect(find.textContaining('3 Days'), findsOneWidget);
      expect(find.textContaining('Suggested'), findsOneWidget);
    });
  });
}
