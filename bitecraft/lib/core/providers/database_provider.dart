import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../database/app_database.dart';
import '../repositories/recipe_repository.dart';
import '../../features/pantry/data/pantry_dao.dart';

final appDatabaseProvider = Provider<AppDatabase>((ref) {
  return AppDatabase();
});

final recipeRepositoryProvider = Provider<RecipeRepository>((ref) {
  final db = ref.watch(appDatabaseProvider);
  return RecipeRepository(db);
});

final pantryDaoProvider = Provider<PantryDao>((ref) {
  final db = ref.watch(appDatabaseProvider);
  return db.pantryDao;
});
