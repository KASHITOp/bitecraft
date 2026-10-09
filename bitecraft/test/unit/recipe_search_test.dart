import 'package:flutter_test/flutter_test.dart';
import 'package:drift/drift.dart' as drift;
import 'package:drift/native.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/core/repositories/recipe_repository.dart';

void main() {
  group('RecipeRepository Dual-Name & Offline Search Tests', () {
    late AppDatabase db;
    late RecipeRepository repository;

    setUp(() async {
      db = AppDatabase(NativeDatabase.memory());
      repository = RecipeRepository(db);

      // Seed representative sample recipes
      await db.insertOrUpdateRecipes([
        LocalRecipesCompanion.insert(
          id: const drift.Value(1),
          title: 'Kanda Poha',
          cuisine: 'Indian',
          budgetTier: 'broke',
          goals: '["quick", "vegetarian"]',
          minutes: 15,
          equipmentTags: '["1-pan", "hostel-friendly"]',
          servings: 2,
          stepsJson: '[{"text":"Wash poha"},{"text":"Fry onions"}]',
          macrosJson: '{"kcal":280,"protein":8,"carbs":52,"fats":5,"fiber":4}',
          costPerServing: 35.0,
          costFullPack: 120.0,
          emoji: '🥣',
          gradientSeed: 1,
          ingredientIds: '1,2',
          ingredientSearchTerms: 'Onion Kanda Pyaz Poha Aval Flattened Rice',
        ),
        LocalRecipesCompanion.insert(
          id: const drift.Value(2),
          title: 'Aloo Jeera',
          cuisine: 'Indian',
          budgetTier: 'broke',
          goals: '["vegetarian"]',
          minutes: 12,
          equipmentTags: '["1-pan"]',
          servings: 2,
          stepsJson: '[{"text":"Boil aloo"},{"text":"Toss with jeera"}]',
          macrosJson: '{"kcal":220,"protein":4,"carbs":38,"fats":6,"fiber":3}',
          costPerServing: 28.0,
          costFullPack: 90.0,
          emoji: '🥔',
          gradientSeed: 2,
          ingredientIds: '3,4',
          ingredientSearchTerms: 'Potato Aloo Batata Cumin Jeera',
        ),
        LocalRecipesCompanion.insert(
          id: const drift.Value(3),
          title: 'Paneer Tikka Quinoa Bowl',
          cuisine: 'Fusion',
          budgetTier: 'hifi',
          goals: '["high-protein"]',
          minutes: 30,
          equipmentTags: '["1-pan", "oven"]',
          servings: 1,
          stepsJson: '[{"text":"Marinate paneer"},{"text":"Assemble bowl"}]',
          macrosJson: '{"kcal":520,"protein":32,"carbs":45,"fats":18,"fiber":8}',
          costPerServing: 165.0,
          costFullPack: 420.0,
          emoji: '🥗',
          gradientSeed: 3,
          ingredientIds: '5,6',
          ingredientSearchTerms: 'Paneer Cottage Cheese Quinoa Bell Pepper Shimla Mirch',
        ),
      ]);
    });

    tearDown(() async {
      await db.close();
    });

    test('Searches by colloquial alias "kanda" and finds Kanda Poha', () async {
      final results = await repository.searchRecipes(query: 'kanda');
      expect(results.length, equals(1));
      expect(results.first.title, equals('Kanda Poha'));
    });

    test('Searches by colloquial alias "aloo" and finds Aloo Jeera', () async {
      final results = await repository.searchRecipes(query: 'aloo');
      expect(results.length, equals(1));
      expect(results.first.title, equals('Aloo Jeera'));
    });

    test('Searches by alternative alias "batata" and finds Aloo Jeera', () async {
      final results = await repository.searchRecipes(query: 'batata');
      expect(results.length, equals(1));
      expect(results.first.title, equals('Aloo Jeera'));
    });

    test('Filters by budget tier "broke" correctly', () async {
      final results = await repository.searchRecipes(tier: 'broke');
      expect(results.length, equals(2));
      for (final r in results) {
        expect(r.budgetTier, equals('broke'));
        expect(r.costPerServing, lessThanOrEqualTo(60.0));
      }
    });

    test('Filters by maxMinutes <= 15', () async {
      final results = await repository.searchRecipes(maxMinutes: 15);
      expect(results.length, equals(2));
      for (final r in results) {
        expect(r.minutes, lessThanOrEqualTo(15));
      }
    });

    test('Calculates pantry coverage and ranks correctly', () async {
      // Pantry has item 1 (Onion) and item 2 (Poha) -> 100% coverage for Kanda Poha
      final results = await repository.searchRecipes(
        pantryIds: [1, 2],
        sortByCoverage: true,
      );
      expect(results.first.title, equals('Kanda Poha'));
      expect(results.first.coverageFraction([1, 2]), equals(1.0));
    });
  });
}
