import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/suggestion_engine.dart';
import 'database_provider.dart';

final suggestionEngineProvider = Provider<SuggestionEngine>((ref) {
  final repo = ref.watch(recipeRepositoryProvider);
  return GeminiSuggestionEngine(repo);
});
