# 🥑 BiteCraft — Student Smart Recipe App (Flutter + Supabase)

**Android Package**: `com.bitecraft.app`  
**Target Audience**: Students & beginners cooking with tiny budgets (<₹60 / meal), minimal equipment (electric kettle, 1 induction plate, 1 pan), and fitness goals (BMR macros).

---

## 📱 App Highlights & Architecture

BiteCraft is an Android-first Flutter app designed with high startup-grade aesthetics, custom theme tokens (cream `#FAF7F2` light, charcoal `#17130F` dark), and a zero-login onboarding flow.

```
c:\Moment app\
├── bitecraft/                      # Production Flutter Application (Dart 3 / Riverpod / Drift / GoRouter)
│   ├── lib/
│   │   ├── core/
│   │   │   ├── theme/             # AppColors, AppTypography (Sora + Inter), AppTheme, ThemeProvider
│   │   │   ├── database/          # Drift SQLite offline cache (LocalRecipes, FTS alias matching)
│   │   │   ├── models/            # Recipe, Ingredient, UserProfile
│   │   │   ├── providers/         # Riverpod providers (database, pantry, theme, profile)
│   │   │   ├── services/          # SupabaseService, TimerNotificationService, CookModeService, PriceProvider
│   │   │   └── widgets/           # BiteCard, MacroBar, TierBadge, EquipmentChip, PriceChip, FloatingPillNav, Shimmer
│   │   └── features/
│   │       ├── onboarding/        # 4-step wizard: BMR Mifflin-St Jeor formula calculation
│   │       ├── explore/           # Masonry grid, dual-name alias search ("kanda","aloo"), pantry toggle
│   │       ├── detail/            # Parallax hero, port-vs-pack price chip, step timers, Cook Mode wakelock
│   │       ├── quickmart/         # Zepto (10m) vs Blinkit (12m) vs Instamart (15m) comparator
│   │       ├── planner/           # Calorie & protein target rings, daily schedule, meal shuffler
│   │       ├── chat/              # Chef Chat "Fridge Raid" (Gemini 2.0 Flash + grounded local SQL)
│   │       ├── saved/             # Drift bookmark grid with illustrated empty state
│   │       └── dev/               # /dev/gallery component quality gate route
│   └── assets/seeds/              # 10,000 deterministic recipes seed, ingredients, store prices
├── supabase/
│   ├── migrations/                # Postgres schema (search_vector GIN, match_pantry RPC, RLS)
│   ├── seed.sql                   # 8.6MB batch seed for 10,000 recipes + dual-named ingredients
│   └── functions/
│       ├── chat/                  # Supabase Edge Function: Gemini 2.0 Flash grounded chat
│       └── planner/               # Supabase Edge Function: greedy macro/budget schedule selector
└── scripts/
    ├── generateAndSeed.ts         # Deterministic seeded RNG generator (10k recipes in 1.2s)
    └── verifySeedQueries.ts       # SQL & alias verification test suite
```

---

## ⚡ Supabase Setup & Edge Functions

### 1. Database Schema & Migrations
The database schema is defined in `supabase/migrations/20261009000000_bitecraft_schema.sql` and includes:
- Tables: `recipes`, `ingredients`, `recipe_ingredients`, `store_prices`, `favorites`, `profiles`.
- RLS Policies: Public read on recipes/ingredients/store_prices; anonymous user authentication (`auth.uid()`) scopes favorites & profile rows.
- Full-Text Search: `search_vector tsvector` indexing title + dual-name aliases with GIN index.
- Storage: Public bucket `recipe-images`.
- RPC: `match_pantry(pantry_ids int[], min_coverage float, optional tier/goal/max_minutes)` sorting recipes by coverage% → fewest missing → cheapest.

### 2. Edge Function Deployment & Gemini Secret
To configure the Chef Chat Gemini Edge Function:
```bash
# 1. Deploy the functions
supabase functions deploy chat
supabase functions deploy planner

# 2. Set the Gemini API key secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🤖 Chef Chat — "Fridge Raid" Architecture

Chef Chat implements the `SuggestionEngine` interface with **two grounded layers**:

1. **Gemini Engine (Primary)**:
   - Client sends pantry ingredients and chat query to the Supabase Edge Function `chat`.
   - The edge function executes `match_pantry` and Postgres keyword searches to extract the top-15 candidate recipes from the catalog.
   - It submits ONLY those retrieved candidate recipes to `gemini-2.0-flash`.
   - The prompt instructs Gemini with a senior-student hostel vibe (concise Hinglish touches) and restricts output to `[RECIPE_ID: <id>]`.
   - The app extracts the IDs and renders interactive inline recipe cards deep-linking to `/recipe/:id`.

2. **Local Engine (Zero-Key Resilient Fallback)**:
   - On network failure, timeout (>7.5s), or missing API key, the app seamlessly switches to `LocalSuggestionEngine`.
   - Extracts ingredients from the user's pantry and message.
   - Executes offline Drift SQLite queries matching names and aliases (`kanda`, `aloo`, `tamatar`, `poha`, etc.).
   - Ranks by pantry coverage % and formats grounded replies without hallucination.

---

## 🛒 Quick Mart & Swapping the `PriceProvider`

Quick-commerce apps (Zepto, Blinkit, Swiggy Instamart) do not expose public APIs. BiteCraft uses a clean `PriceProvider` abstraction:

```dart
abstract class PriceProvider {
  Future<Map<String, StoreCartTotal>> comparePrices(List<int> ingredientIds);
}
```

- **Default Implementation**: `DatabasePriceProvider` queries the offline Drift SQLite / Supabase `store_prices` table.
- **UI Label**: Clear disclaimer `Estimated prices (demo data)`.
- **Swapping with a Live Partner Adapter**:
  To plug in a live partner API, implement `PriceProvider` and update the dependency injection provider in `lib/core/providers/price_provider_di.dart`:

```dart
final priceProvider = Provider<PriceProvider>((ref) {
  // Swap with your live partner API client:
  // return LivePartnerPriceProvider(apiKey: '...');
  final db = ref.watch(appDatabaseProvider);
  return DatabasePriceProvider(db);
});
```

---

## 🎯 Verification Proofs & Receipts

### 1. 10,000 Recipe Seed & Deterministic RNG
- Execution time: **1.2 seconds** (`node --experimental-strip-types scripts/generateAndSeed.ts`).
- Tiers generated:
  - 🟢 Broke Student (< ₹60): **3,334 recipes**
  - 🟡 Balanced (₹60–₹150): **3,342 recipes**
  - 🟣 Hi-Fi Gourmet (₹150+): **3,324 recipes**
- Dual-Name Alias Query Verification (`scripts/verifySeedQueries.ts`):
  - `"kanda"` matched **2,932 recipes**
  - `"aloo"` matched **2,024 recipes**
  - `"tamatar"` matched **3,088 recipes**

### 2. Static Analysis (`flutter analyze`)
```
Analyzing bitecraft...
No issues found! (ran in 97.0s)
```
- **0 errors, 0 warnings, 0 linter issues.**

### 3. Automated Test Suite (`flutter test`)
```
00:05 +17: All tests passed!
```
- `user_profile_test.dart`: Mifflin-St Jeor formula, BMR, TDEE sedentary multiplier, protein targets (1.8–2.2 g/kg), calorie surpluses and deficits.
- `price_provider_test.dart`: Zepto 10m vs Blinkit 12m vs Instamart 15m price comparator, cheapest badge, savings calculation.
- `recipe_search_test.dart`: Offline dual-name alias matching ("kanda", "aloo", "batata"), budget tiers, pantry coverage ranking.
- `design_system_test.dart`: BiteCard radius and hairline borders, MacroBar animation, TierBadge tokens, EquipmentChip, PriceChip INR formatting.
- `widget_test.dart`: In-memory isolated database application smoke test.

---

## 🚀 Running BiteCraft Locally

```bash
cd "c:\Moment app\bitecraft"

# Run all automated tests
flutter test

# Run static analysis
flutter analyze

# Open the Developer Design Gallery directly
# Navigate to /dev/gallery via app bar grid icon or deep-link
```
