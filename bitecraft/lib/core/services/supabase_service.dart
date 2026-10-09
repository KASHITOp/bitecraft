import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://xdgdbgvnhgpztgvyvvzi.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZ2RiZ3ZuaGdwenRndnl2dnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODExOTYsImV4cCI6MjEwNzA1NzE5Nn0.WzPP9kodhEC9NDtbUAx3bFhy0ZWWYyOuSutFLy4F78A';

  static bool _initialized = false;

  static Future<void> initialize() async {
    if (_initialized) return;
    try {
      await Supabase.initialize(
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      );
      _initialized = true;

      // Ensure anonymous session for zero-login user
      final currentSession = Supabase.instance.client.auth.currentSession;
      if (currentSession == null) {
        await Supabase.instance.client.auth.signInAnonymously();
      }
    } catch (_) {
      // Offline or network unavailable — gracefully proceed with local cache
    }
  }

  static SupabaseClient? get client {
    if (!_initialized) return null;
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  static String? get currentUserId {
    return client?.auth.currentUser?.id;
  }
}
