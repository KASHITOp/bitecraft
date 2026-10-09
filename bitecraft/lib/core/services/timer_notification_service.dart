import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class TimerNotificationService {
  static final FlutterLocalNotificationsPlugin _notificationsPlugin =
      FlutterLocalNotificationsPlugin();
  static bool _initialized = false;

  static Future<void> initialize() async {
    if (_initialized) return;

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const initSettings = InitializationSettings(android: androidSettings);

    try {
      await _notificationsPlugin.initialize(initSettings);
      _initialized = true;
    } catch (_) {
      // Graceful fallback on unsupported platforms
    }
  }

  static Future<void> showTimerCompleteNotification({
    required int id,
    required String recipeTitle,
    required String stepText,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'bitecraft_cooking_timer',
      'Cooking Step Timers',
      channelDescription: 'Alerts when recipe cooking steps and countdowns complete',
      importance: Importance.max,
      priority: Priority.high,
      playSound: true,
      enableVibration: true,
    );

    const notificationDetails = NotificationDetails(android: androidDetails);

    try {
      await _notificationsPlugin.show(
        id,
        '⏰ Timer Done: $recipeTitle',
        stepText,
        notificationDetails,
      );
    } catch (_) {}
  }
}
