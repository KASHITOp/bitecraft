import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:drift/native.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/core/repositories/recipe_repository.dart';
import 'package:bitecraft/core/services/suggestion_engine.dart';

void main() {
  group('Chef Chat Pantry Payload Integration', () {
    late AppDatabase db;
    late RecipeRepository repo;

    setUp(() async {
      db = AppDatabase(NativeDatabase.memory());
      repo = RecipeRepository(db);
    });

    tearDown(() async {
      await db.close();
    });

    test('GeminiSuggestionEngine sends payload containing pantry_items array to Supabase', () async {
      Map<String, dynamic>? interceptedPayload;
      String? interceptedUrl;
      Map<String, String>? interceptedHeaders;

      final mockClient = MockClient((request) async {
        interceptedUrl = request.url.toString();
        interceptedHeaders = request.headers;
        interceptedPayload = jsonDecode(request.body) as Map<String, dynamic>;

        return http.Response(
          jsonEncode({
            'source': 'gemini',
            'reply': 'Bhai, here is an awesome dish to use your expiring paneer before it spoils: [RECIPE_ID: 1]',
            'recipes': [
              {
                'id': 1,
                'title': 'Quick Paneer Bhurji',
                'cuisine': 'Indian',
                'budget_tier': 'cheap',
                'goals': ['high-protein'],
                'minutes': 10,
                'equipment_tags': ['pan'],
                'servings': 1,
                'macros': {'protein': 18, 'carbs': 6, 'fat': 14, 'calories': 220},
                'cost_per_serving': 45.0,
                'cost_full_pack': 80.0,
                'image_url': 'https://example.com/paneer.jpg',
                'emoji': '🧀',
                'gradient_seed': 1,
              }
            ],
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      });

      final engine = GeminiSuggestionEngine(repo, client: mockClient);

      final pantryItems = [
        {
          'ingredient_id': 10,
          'name': 'Paneer',
          'quantity_grams': 250.0,
          'expiry_date': DateTime.now().add(const Duration(days: 1)).toIso8601String(),
          'days_until_expiry': 1,
        },
        {
          'ingredient_id': 1,
          'name': 'Onion',
          'quantity_grams': 500.0,
          'expiry_date': DateTime.now().add(const Duration(days: 5)).toIso8601String(),
          'days_until_expiry': 5,
        },
      ];

      final reply = await engine.getSuggestion(
        message: 'What should I cook?',
        pantryIds: [10, 1],
        pantryItems: pantryItems,
        history: [],
      );

      // Verify HTTP request destination
      expect(interceptedUrl, contains('/functions/v1/chat'));
      expect(interceptedHeaders?['content-type'], equals('application/json'));

      // Verify payload structure matches specification
      expect(interceptedPayload, isNotNull);
      expect(interceptedPayload!['message'], equals('What should I cook?'));
      expect(interceptedPayload!['pantryIds'], equals([10, 1]));

      // Critical check: payload includes the pantry_items array
      expect(interceptedPayload!.containsKey('pantry_items'), isTrue);
      expect(interceptedPayload!['pantry_items'], isA<List>());
      final payloadItems = interceptedPayload!['pantry_items'] as List<dynamic>;
      expect(payloadItems.length, equals(2));

      // Verify item attributes
      final firstItem = payloadItems[0] as Map<String, dynamic>;
      expect(firstItem['ingredient_id'], equals(10));
      expect(firstItem['name'], equals('Paneer'));
      expect(firstItem['quantity_grams'], equals(250.0));
      expect(firstItem['days_until_expiry'], equals(1));

      final secondItem = payloadItems[1] as Map<String, dynamic>;
      expect(secondItem['ingredient_id'], equals(1));
      expect(secondItem['name'], equals('Onion'));
      expect(secondItem['quantity_grams'], equals(500.0));
      expect(secondItem['days_until_expiry'], equals(5));

      // Verify response returned correctly
      expect(reply.source, equals('gemini'));
      expect(reply.text, contains('expiring paneer'));
      expect(reply.recipes.length, equals(1));
      expect(reply.recipes.first.title, equals('Quick Paneer Bhurji'));
    });

    test('GeminiSuggestionEngine gracefully supplies empty pantry_items array when no items provided', () async {
      Map<String, dynamic>? interceptedPayload;

      final mockClient = MockClient((request) async {
        interceptedPayload = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({
            'source': 'gemini',
            'reply': 'Here are some quick hostel meals!',
            'recipes': [],
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      });

      final engine = GeminiSuggestionEngine(repo, client: mockClient);

      await engine.getSuggestion(
        message: 'Quick dinner',
        pantryIds: [],
        pantryItems: null,
        history: [],
      );

      expect(interceptedPayload, isNotNull);
      expect(interceptedPayload!.containsKey('pantry_items'), isTrue);
      expect(interceptedPayload!['pantry_items'], isA<List>());
      expect((interceptedPayload!['pantry_items'] as List).isEmpty, isTrue);
    });

    test('Drift PantryDao items correctly format into pantry_items payload for Chef Chat', () async {
      final pantryDao = db.pantryDao;
      final now = DateTime.now();

      // Seed items in local Drift database
      await pantryDao.createAndAddItem(
        deviceId: 'device-test-student',
        ingredientId: 4, // e.g. Curd/Dahi
        quantityGrams: 400.0,
        purchaseDate: now.subtract(const Duration(days: 2)),
        expiryDate: now.add(const Duration(days: 1)),
      );

      await pantryDao.createAndAddItem(
        deviceId: 'device-test-student',
        ingredientId: 8, // e.g. Bread
        quantityGrams: 300.0,
        purchaseDate: now.subtract(const Duration(days: 1)),
        expiryDate: now.add(const Duration(days: 2)),
      );

      // Simulate the exact fetching and transformation performed in chef_chat_screen.dart
      final localPantryItems = await pantryDao.getAllItems();
      final allIngs = await repo.getAllIngredients();

      final pantryItemsPayload = localPantryItems.map((item) {
        final ing = allIngs[item.ingredientId];
        final daysUntilExpiry = item.expiryDate?.difference(now).inDays;
        return {
          'ingredient_id': item.ingredientId,
          'name': ing?.name ?? 'Ingredient #${item.ingredientId}',
          'quantity_grams': item.quantityGrams,
          'expiry_date': item.expiryDate?.toIso8601String(),
          'days_until_expiry': daysUntilExpiry,
        };
      }).toList();

      expect(pantryItemsPayload.length, equals(2));
      expect(pantryItemsPayload[0]['ingredient_id'], equals(4));
      expect(pantryItemsPayload[0]['quantity_grams'], equals(400.0));
      expect(pantryItemsPayload[0]['days_until_expiry'], isNotNull);
      expect(pantryItemsPayload[1]['ingredient_id'], equals(8));
      expect(pantryItemsPayload[1]['quantity_grams'], equals(300.0));

      // Verify passing into GeminiSuggestionEngine
      Map<String, dynamic>? interceptedPayload;
      final mockClient = MockClient((request) async {
        interceptedPayload = jsonDecode(request.body) as Map<String, dynamic>;
        return http.Response(
          jsonEncode({'source': 'gemini', 'reply': 'OK', 'recipes': []}),
          200,
          headers: {'content-type': 'application/json'},
        );
      });

      final engine = GeminiSuggestionEngine(repo, client: mockClient);
      await engine.getSuggestion(
        message: 'What should I cook?',
        pantryIds: localPantryItems.map((e) => e.ingredientId).toList(),
        pantryItems: pantryItemsPayload,
        history: [],
      );

      expect(interceptedPayload!['pantry_items'], isA<List>());
      final sentItems = interceptedPayload!['pantry_items'] as List<dynamic>;
      expect(sentItems.length, equals(2));
      expect(sentItems[0]['ingredient_id'], equals(4));
      expect(sentItems[1]['ingredient_id'], equals(8));
    });
  });
}
