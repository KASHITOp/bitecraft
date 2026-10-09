import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../services/supabase_service.dart';
import '../../features/onboarding/models/user_profile.dart';

const String _kProfilePrefKey = 'bitecraft_user_profile';

final userProfileProvider = StateNotifierProvider<UserProfileNotifier, UserProfile>((ref) {
  return UserProfileNotifier();
});

class UserProfileNotifier extends StateNotifier<UserProfile> {
  UserProfileNotifier() : super(const UserProfile()) {
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final str = prefs.getString(_kProfilePrefKey);
      if (str != null) {
        final Map<String, dynamic> data = jsonDecode(str);
        state = UserProfile(
          age: data['age'] as int? ?? 21,
          weightKg: (data['weightKg'] as num?)?.toDouble() ?? 68.0,
          heightCm: (data['heightCm'] as num?)?.toDouble() ?? 172.0,
          gender: data['gender'] as String? ?? 'male',
          goal: data['goal'] as String? ?? 'high-protein',
          budgetTier: data['budgetTier'] as String? ?? 'balanced',
          equipment: (data['equipment'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? ['1-pan'],
          targetCalories: data['targetCalories'] as int? ?? 2200,
          targetProteinGrams: data['targetProteinGrams'] as int? ?? 120,
        );
      }
    } catch (_) {}
  }

  Future<void> saveProfile(UserProfile profile) async {
    state = profile;
    try {
      final prefs = await SharedPreferences.getInstance();
      final map = {
        'age': profile.age,
        'weightKg': profile.weightKg,
        'heightCm': profile.heightCm,
        'gender': profile.gender,
        'goal': profile.goal,
        'budgetTier': profile.budgetTier,
        'equipment': profile.equipment,
        'targetCalories': profile.targetCalories,
        'targetProteinGrams': profile.targetProteinGrams,
      };
      await prefs.setString(_kProfilePrefKey, jsonEncode(map));

      // Sync to Supabase profiles
      final client = SupabaseService.client;
      final userId = SupabaseService.currentUserId;
      if (client != null && userId != null) {
        await client.from('profiles').upsert({
          'user_id': userId,
          'targets': {
            'calories': profile.targetCalories,
            'protein': profile.targetProteinGrams,
            'budget': profile.budgetTier,
            'goal': profile.goal,
          },
          'updated_at': DateTime.now().toIso8601String(),
        });
      }
    } catch (_) {}
  }
}
