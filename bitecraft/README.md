# 🥑 BiteCraft Mobile App (Flutter)

Android Application ID: `com.bitecraft.app`

## Quick Commands
```bash
# Run Static Analysis (0 issues)
flutter analyze

# Run Automated Test Suite (17 tests)
flutter test

# Start the App
flutter run
```

## Features
- **Design System First**: Cream `#FAF7F2` light & charcoal `#17130F` dark themes, Sora headings, Inter body typography, animated macro bars, custom floating pill navigation dock.
- **Zero-Login Onboarding**: 4-step wizard calculating Mifflin-St Jeor BMR, TDEE, protein targets (1.8–2.2 g/kg), and macro ribbons.
- **Offline & Online Search**: Dual-name alias search ("kanda" matches Onion, "aloo" matches Potato) powered by Drift SQLite offline cache and Supabase PostgreSQL GIN full-text index.
- **Chef Chat ("Fridge Raid")**: Grounded recipe recommendations powered by Gemini 2.0 Flash Edge Function + local zero-key offline SQL fallback.
- **Quick Mart Price Comparator**: Side-by-side comparison across Zepto (10m), Blinkit (12m), and Swiggy Instamart (15m) with automatic cheapest savings badge.
- **Cook Mode**: Wakelock screen keeper (`wakelock_plus`) and step countdown timers with local notifications (`flutter_local_notifications`).
- **Quality Gate Gallery**: Accessible anytime at route `/dev/gallery` or via the top-right grid button.
