import 'package:drift/drift.dart';
import 'package:uuid/uuid.dart';
import '../../../core/database/app_database.dart';

part 'pantry_dao.g.dart';

@DriftAccessor(tables: [PantryItems])
class PantryDao extends DatabaseAccessor<AppDatabase> with _$PantryDaoMixin {
  PantryDao(super.db);

  /// Add a new pantry item or update if conflict
  Future<int> addItem(Insertable<PantryItem> item) async {
    return into(pantryItems).insertOnConflictUpdate(item);
  }

  /// Convenience method to create and insert an item with automatic UUID
  Future<PantryItem> createAndAddItem({
    String? id,
    required String deviceId,
    required int ingredientId,
    required double quantityGrams,
    DateTime? purchaseDate,
    DateTime? expiryDate,
  }) async {
    final generatedId = id ?? const Uuid().v4();
    final companion = PantryItemsCompanion.insert(
      id: generatedId,
      deviceId: deviceId,
      ingredientId: ingredientId,
      quantityGrams: quantityGrams,
      purchaseDate: purchaseDate ?? DateTime.now(),
      expiryDate: Value(expiryDate),
    );
    await addItem(companion);
    return (select(pantryItems)..where((tbl) => tbl.id.equals(generatedId))).getSingle();
  }

  /// Remove item by its UUID
  Future<int> removeItem(String id) async {
    return (delete(pantryItems)..where((tbl) => tbl.id.equals(id))).go();
  }

  /// Update the quantity (in grams) for a specific item
  Future<int> updateQuantity(String id, double quantityGrams) async {
    return (update(pantryItems)..where((tbl) => tbl.id.equals(id))).write(
      PantryItemsCompanion(quantityGrams: Value(quantityGrams)),
    );
  }

  /// Get items expiring in the next specified days (default 3 days)
  Future<List<PantryItem>> getItemsExpiringInNextDays({
    int days = 3,
    DateTime? referenceDate,
    bool includeAlreadyExpired = false,
  }) async {
    final now = referenceDate ?? DateTime.now();
    final threshold = now.add(Duration(days: days));

    final query = select(pantryItems)
      ..where((tbl) {
        final hasExpiry = tbl.expiryDate.isNotNull();
        final beforeThreshold = tbl.expiryDate.isSmallerOrEqualValue(threshold);
        if (includeAlreadyExpired) {
          return hasExpiry & beforeThreshold;
        }
        return hasExpiry & beforeThreshold & tbl.expiryDate.isBiggerOrEqualValue(now);
      })
      ..orderBy([(tbl) => OrderingTerm.asc(tbl.expiryDate)]);

    return query.get();
  }

  /// Alias specifically matching the spec: get items expiring in the next 3 days
  Future<List<PantryItem>> getItemsExpiringInNext3Days({
    DateTime? referenceDate,
    bool includeAlreadyExpired = false,
  }) async {
    return getItemsExpiringInNextDays(
      days: 3,
      referenceDate: referenceDate,
      includeAlreadyExpired: includeAlreadyExpired,
    );
  }

  /// Get all pantry items for a specific device
  Future<List<PantryItem>> getItemsByDevice(String deviceId) async {
    return (select(pantryItems)
          ..where((tbl) => tbl.deviceId.equals(deviceId))
          ..orderBy([(tbl) => OrderingTerm.desc(tbl.purchaseDate)]))
        .get();
  }

  /// Watch all pantry items for a specific device
  Stream<List<PantryItem>> watchItemsByDevice(String deviceId) {
    return (select(pantryItems)
          ..where((tbl) => tbl.deviceId.equals(deviceId))
          ..orderBy([(tbl) => OrderingTerm.desc(tbl.purchaseDate)]))
        .watch();
  }

  /// Get all pantry items
  Future<List<PantryItem>> getAllItems() async {
    return select(pantryItems).get();
  }

  /// Get a single pantry item by id
  Future<PantryItem?> getItemById(String id) async {
    return (select(pantryItems)..where((tbl) => tbl.id.equals(id))).getSingleOrNull();
  }
}
