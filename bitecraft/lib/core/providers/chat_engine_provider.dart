import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../services/suggestion_engine.dart';
import 'database_provider.dart';

final chatHttpClientProvider = Provider<http.Client>((ref) {
  final client = http.Client();
  ref.onDispose(() => client.close());
  return client;
});

final suggestionEngineProvider = Provider<SuggestionEngine>((ref) {
  final repo = ref.watch(recipeRepositoryProvider);
  final client = ref.watch(chatHttpClientProvider);
  return GeminiSuggestionEngine(repo, client: client);
});
