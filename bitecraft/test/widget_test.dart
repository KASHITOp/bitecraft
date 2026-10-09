import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:drift/native.dart';
import 'package:bitecraft/main.dart';
import 'package:bitecraft/core/database/app_database.dart';
import 'package:bitecraft/core/providers/database_provider.dart';

void main() {
  testWidgets('BiteCraft smoke test with in-memory database', (WidgetTester tester) async {
    final db = AppDatabase(NativeDatabase.memory());
    addTearDown(() async => await db.close());

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          appDatabaseProvider.overrideWithValue(db),
        ],
        child: const BiteCraftApp(),
      ),
    );
    await tester.pump(const Duration(seconds: 1));
    expect(find.text('BiteCraft'), findsWidgets);
  });
}
