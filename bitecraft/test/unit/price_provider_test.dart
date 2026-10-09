import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/core/services/price_provider.dart';

void main() {
  group('DatabasePriceProvider & Quick Mart Tests', () {
    late AppDatabase db;
    late DatabasePriceProvider priceProvider;

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
      priceProvider = DatabasePriceProvider(db);
    });

    tearDown(() async {
      await db.close();
    });

    test('calculates correct cart totals across stores with seeded data', () async {
      // Insert test store prices for ingredient 1 (Onion) and ingredient 2 (Potato)
      await db.insertOrUpdateStorePrices([
        LocalStorePricesCompanion.insert(ingredientId: 1, store: 'ZEPTO', price: 35.0),
        LocalStorePricesCompanion.insert(ingredientId: 2, store: 'ZEPTO', price: 30.0),
        LocalStorePricesCompanion.insert(ingredientId: 1, store: 'BLINKIT', price: 32.0),
        LocalStorePricesCompanion.insert(ingredientId: 2, store: 'BLINKIT', price: 28.0),
        LocalStorePricesCompanion.insert(ingredientId: 1, store: 'INSTAMART', price: 38.0),
        LocalStorePricesCompanion.insert(ingredientId: 2, store: 'INSTAMART', price: 34.0),
      ]);

      final comparison = await priceProvider.comparePrices([1, 2]);

      expect(comparison.containsKey('ZEPTO'), isTrue);
      expect(comparison.containsKey('BLINKIT'), isTrue);
      expect(comparison.containsKey('INSTAMART'), isTrue);

      expect(comparison['BLINKIT']!.totalAmount, equals(60.0)); // 32 + 28
      expect(comparison['ZEPTO']!.totalAmount, equals(65.0)); // 35 + 30
      expect(comparison['INSTAMART']!.totalAmount, equals(72.0)); // 38 + 34

      // Blinkit is the cheapest
      final cheapest = comparison.values.reduce((curr, min) => curr.totalAmount < min.totalAmount ? curr : min);
      expect(cheapest.store, equals('BLINKIT'));
    });

    test('falls back gracefully when items are missing in DB', () async {
      final comparison = await priceProvider.comparePrices([999, 1000]);

      expect(comparison['ZEPTO']!.totalAmount, equals(90.0)); // 2 * 45
      expect(comparison['BLINKIT']!.totalAmount, equals(84.0)); // 2 * 42
      expect(comparison['INSTAMART']!.totalAmount, equals(96.0)); // 2 * 48
    });
  });
}
