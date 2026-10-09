import '../database/app_database.dart';

class StoreCartTotal {
  final String store; // ZEPTO | BLINKIT | INSTAMART
  final String deliveryTime; // e.g. "10 mins"
  final double totalAmount;
  final Map<int, double> itemPrices;

  const StoreCartTotal({
    required this.store,
    required this.deliveryTime,
    required this.totalAmount,
    required this.itemPrices,
  });
}

abstract class PriceProvider {
  Future<Map<String, StoreCartTotal>> comparePrices(List<int> ingredientIds);
}

class DatabasePriceProvider implements PriceProvider {
  final AppDatabase _db;

  DatabasePriceProvider(this._db);

  @override
  Future<Map<String, StoreCartTotal>> comparePrices(List<int> ingredientIds) async {
    final rows = await (_db.select(_db.localStorePrices)
          ..where((tbl) => tbl.ingredientId.isIn(ingredientIds)))
        .get();

    final zeptoItems = <int, double>{};
    final blinkitItems = <int, double>{};
    final instamartItems = <int, double>{};

    for (final r in rows) {
      if (r.store == 'ZEPTO') {
        zeptoItems[r.ingredientId] = r.price;
      } else if (r.store == 'BLINKIT') {
        blinkitItems[r.ingredientId] = r.price;
      } else if (r.store == 'INSTAMART') {
        instamartItems[r.ingredientId] = r.price;
      }
    }

    double zeptoTotal = zeptoItems.values.fold(0.0, (a, b) => a + b);
    double blinkitTotal = blinkitItems.values.fold(0.0, (a, b) => a + b);
    double instamartTotal = instamartItems.values.fold(0.0, (a, b) => a + b);

    // If database didn't have rows for some items, fill with reasonable defaults
    if (zeptoTotal == 0) zeptoTotal = ingredientIds.length * 45.0;
    if (blinkitTotal == 0) blinkitTotal = ingredientIds.length * 42.0;
    if (instamartTotal == 0) instamartTotal = ingredientIds.length * 48.0;

    return {
      'ZEPTO': StoreCartTotal(
        store: 'ZEPTO',
        deliveryTime: '10 mins',
        totalAmount: zeptoTotal,
        itemPrices: zeptoItems,
      ),
      'BLINKIT': StoreCartTotal(
        store: 'BLINKIT',
        deliveryTime: '12 mins',
        totalAmount: blinkitTotal,
        itemPrices: blinkitItems,
      ),
      'INSTAMART': StoreCartTotal(
        store: 'INSTAMART',
        deliveryTime: '15 mins',
        totalAmount: instamartTotal,
        itemPrices: instamartItems,
      ),
    };
  }
}
