import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/price_provider.dart';
import 'database_provider.dart';

final priceProvider = Provider<PriceProvider>((ref) {
  final db = ref.watch(appDatabaseProvider);
  return DatabasePriceProvider(db);
});
