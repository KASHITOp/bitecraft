import 'package:wakelock_plus/wakelock_plus.dart';

class CookModeService {
  static bool _isActive = false;

  static bool get isActive => _isActive;

  static Future<void> enable() async {
    try {
      await WakelockPlus.enable();
      _isActive = true;
    } catch (_) {}
  }

  static Future<void> disable() async {
    try {
      await WakelockPlus.disable();
      _isActive = false;
    } catch (_) {}
  }

  static Future<bool> toggle() async {
    if (_isActive) {
      await disable();
      return false;
    } else {
      await enable();
      return true;
    }
  }
}
