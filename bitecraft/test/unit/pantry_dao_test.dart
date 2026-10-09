import 'package:flutter_test/flutter_test.dart';
import 'package:drift/native.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/features/pantry/data/pantry_dao.dart';

void main() {
  group('PantryDao (Smart Pantry Local Cache)', () {
    late AppDatabase db;
    late PantryDao pantryDao;

    setUp(() {
      db = AppDatabase(NativeDatabase.memory());
      pantryDao = db.pantryDao;
    });

    tearDown(() async {
      await db.close();
    });

    test('add item and retrieve by device id', () async {
      final now = DateTime.now();
      final item = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 1, // e.g. Onion
        quantityGrams: 500.0,
        purchaseDate: now,
        expiryDate: now.add(const Duration(days: 7)),
      );

      expect(item.id, isNotEmpty);
      expect(item.deviceId, equals('device-test-123'));
      expect(item.ingredientId, equals(1));
      expect(item.quantityGrams, equals(500.0));

      final items = await pantryDao.getItemsByDevice('device-test-123');
      expect(items.length, equals(1));
      expect(items.first.id, equals(item.id));
    });

    test('update quantity of existing item', () async {
      final item = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 2, // e.g. Potato
        quantityGrams: 1000.0,
      );

      // Update quantity to 750g
      final rowsUpdated = await pantryDao.updateQuantity(item.id, 750.0);
      expect(rowsUpdated, equals(1));

      final updated = await pantryDao.getItemById(item.id);
      expect(updated, isNotNull);
      expect(updated!.quantityGrams, equals(750.0));
    });

    test('remove item by id', () async {
      final item = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 3, // e.g. Tomato
        quantityGrams: 300.0,
      );

      final rowsDeleted = await pantryDao.removeItem(item.id);
      expect(rowsDeleted, equals(1));

      final fetched = await pantryDao.getItemById(item.id);
      expect(fetched, isNull);
    });

    test('get items expiring in the next 3 days', () async {
      final baseDate = DateTime(2026, 10, 10, 12, 0);

      // Item 1: Expires in 1 day (should be included)
      final item1 = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 4,
        quantityGrams: 200.0,
        purchaseDate: baseDate,
        expiryDate: baseDate.add(const Duration(days: 1)),
      );

      // Item 2: Expires in 2.5 days (should be included)
      final item2 = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 5,
        quantityGrams: 150.0,
        purchaseDate: baseDate,
        expiryDate: baseDate.add(const Duration(hours: 60)), // 2.5 days
      );

      // Item 3: Expires in exactly 3 days (should be included)
      final item3 = await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 6,
        quantityGrams: 100.0,
        purchaseDate: baseDate,
        expiryDate: baseDate.add(const Duration(days: 3)),
      );

      // Item 4: Expires in 5 days (should NOT be included)
      await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 7,
        quantityGrams: 400.0,
        purchaseDate: baseDate,
        expiryDate: baseDate.add(const Duration(days: 5)),
      );

      // Item 5: Already expired 2 days ago (should NOT be included by default)
      await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 8,
        quantityGrams: 50.0,
        purchaseDate: baseDate.subtract(const Duration(days: 5)),
        expiryDate: baseDate.subtract(const Duration(days: 2)),
      );

      // Item 6: No expiry date specified (should NOT be included)
      await pantryDao.createAndAddItem(
        deviceId: 'device-test-123',
        ingredientId: 9,
        quantityGrams: 600.0,
        purchaseDate: baseDate,
        expiryDate: null,
      );

      final expiringItems = await pantryDao.getItemsExpiringInNext3Days(
        referenceDate: baseDate,
      );

      expect(expiringItems.length, equals(3));
      final returnedIds = expiringItems.map((e) => e.id).toSet();
      expect(returnedIds, containsAll([item1.id, item2.id, item3.id]));

      // Verify ascending order by expiry date
      expect(expiringItems[0].id, equals(item1.id));
      expect(expiringItems[1].id, equals(item2.id));
      expect(expiringItems[2].id, equals(item3.id));
    });
  });
}
