import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/supabase_service.dart';

const String _kPantryPrefKey = 'bitecraft_saved_pantry_ids';

final pantryProvider = StateNotifierProvider<PantryNotifier, List<int>>((ref) {
  return PantryNotifier();
});

class PantryNotifier extends StateNotifier<List<int>> {
  PantryNotifier() : super([]) {
    _loadPantry();
  }

  Future<void> _loadPantry() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedStr = prefs.getString(_kPantryPrefKey);
      if (savedStr != null) {
        final List<dynamic> list = jsonDecode(savedStr);
        state = list.map((e) => e as int).toList();
      }
    } catch (_) {}
  }

  Future<void> toggleIngredient(int ingredientId) async {
    if (state.contains(ingredientId)) {
      state = state.where((id) => id != ingredientId).toList();
    } else {
      state = [...state, ingredientId];
    }
    await _persist();
  }

  Future<void> setPantry(List<int> ids) async {
    state = ids;
    await _persist();
  }

  Future<void> clearPantry() async {
    state = [];
    await _persist();
  }

  Future<void> _persist() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_kPantryPrefKey, jsonEncode(state));

      // Sync to Supabase profiles if authenticated session
      final client = SupabaseService.client;
      final userId = SupabaseService.currentUserId;
      if (client != null && userId != null) {
        await client.from('profiles').upsert({
          'user_id': userId,
          'pantry': state,
          'updated_at': DateTime.now().toIso8601String(),
        });
      }
    } catch (_) {}
  }
}
