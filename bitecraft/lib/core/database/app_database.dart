import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import '../../features/pantry/data/pantry_dao.dart';

part 'app_database.g.dart';

class LocalRecipes extends Table {
  IntColumn get id => integer()();
  TextColumn get title => text()();
  TextColumn get cuisine => text()();
  TextColumn get budgetTier => text()(); // broke | balanced | hifi
  TextColumn get goals => text()(); // JSON string
  IntColumn get minutes => integer()();
  TextColumn get equipmentTags => text()(); // JSON string
  IntColumn get servings => integer()();
  TextColumn get stepsJson => text()();
  TextColumn get macrosJson => text()();
  RealColumn get costPerServing => real()();
  RealColumn get costFullPack => real()();
  TextColumn get imageUrl => text().nullable()();
  TextColumn get emoji => text()();
  IntColumn get gradientSeed => integer()();
  TextColumn get ingredientIds => text()(); // Comma separated IDs
  TextColumn get ingredientSearchTerms => text()(); // Name + aliases for instant search

  @override
  Set<Column> get primaryKey => {id};
}

class LocalIngredients extends Table {
  IntColumn get id => integer()();
  TextColumn get name => text()();
  TextColumn get aliasesJson => text()(); // JSON array
  TextColumn get category => text()();
  TextColumn get packSize => text()();
  RealColumn get avgPackPrice => real()();

  @override
  Set<Column> get primaryKey => {id};
}

class LocalStorePrices extends Table {
  IntColumn get id => integer().autoIncrement()();
  IntColumn get ingredientId => integer()();
  TextColumn get store => text()(); // ZEPTO | BLINKIT | INSTAMART
  RealColumn get price => real()();
}

class LocalFavorites extends Table {
  IntColumn get recipeId => integer()();
  DateTimeColumn get savedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {recipeId};
}

class PantryItems extends Table {
  TextColumn get id => text()(); // UUID string
  TextColumn get deviceId => text()();
  IntColumn get ingredientId => integer()();
  RealColumn get quantityGrams => real()();
  DateTimeColumn get purchaseDate => dateTime()();
  DateTimeColumn get expiryDate => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}

@DriftDatabase(
  tables: [
    LocalRecipes,
    LocalIngredients,
    LocalStorePrices,
    LocalFavorites,
    PantryItems,
  ],
  daos: [
    PantryDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 2;

  @override
  MigrationStrategy get migration => MigrationStrategy(
        onCreate: (m) async {
          await m.createAll();
        },
        onUpgrade: (m, from, to) async {
          if (from < 2) {
            await m.createTable(pantryItems);
          }
        },
      );

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'bitecraft_cache');
  }

  // Search recipes by query (matches title OR ingredient dual-names/aliases)
  Future<List<LocalRecipe>> searchRecipes({
    String? query,
    String? tier,
    String? goal,
    int? maxMinutes,
    double? maxCost,
    int limit = 100,
    int offset = 0,
  }) {
    final q = select(localRecipes);

    if (query != null && query.trim().isNotEmpty) {
      final terms = query.trim().toLowerCase().split(' ').where((t) => t.isNotEmpty);
      for (final term in terms) {
        q.where((tbl) =>
            tbl.title.lower().like('%$term%') |
            tbl.ingredientSearchTerms.lower().like('%$term%') |
            tbl.cuisine.lower().like('%$term%'));
      }
    }

    if (tier != null && tier.isNotEmpty) {
      q.where((tbl) => tbl.budgetTier.equals(tier));
    }

    if (maxMinutes != null) {
      q.where((tbl) => tbl.minutes.isSmallerOrEqualValue(maxMinutes));
    }

    if (maxCost != null) {
      q.where((tbl) => tbl.costPerServing.isSmallerOrEqualValue(maxCost));
    }

    q.limit(limit, offset: offset);
    return q.get();
  }

  // Batch insert cached recipes
  Future<void> insertOrUpdateRecipes(List<LocalRecipesCompanion> entries) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(localRecipes, entries);
    });
  }

  // Batch insert ingredients
  Future<void> insertOrUpdateIngredients(List<LocalIngredientsCompanion> entries) async {
    await batch((batch) {
      batch.insertAllOnConflictUpdate(localIngredients, entries);
    });
  }

  // Batch insert store prices
  Future<void> insertOrUpdateStorePrices(List<LocalStorePricesCompanion> entries) async {
    await batch((batch) {
      batch.insertAll(localStorePrices, entries);
    });
  }

  // Favorites
  Future<bool> isFavorite(int recipeId) async {
    final row = await (select(localFavorites)..where((tbl) => tbl.recipeId.equals(recipeId))).getSingleOrNull();
    return row != null;
  }

  Future<void> toggleFavorite(int recipeId) async {
    final existing = await isFavorite(recipeId);
    if (existing) {
      await (delete(localFavorites)..where((tbl) => tbl.recipeId.equals(recipeId))).go();
    } else {
      await into(localFavorites).insert(LocalFavoritesCompanion.insert(recipeId: Value(recipeId)));
    }
  }

  Future<List<int>> getFavoriteIds() async {
    final rows = await select(localFavorites).get();
    return rows.map((r) => r.recipeId).toList();
  }
}
