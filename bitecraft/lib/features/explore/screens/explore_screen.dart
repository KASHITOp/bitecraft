import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/recipe.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/providers/pantry_provider.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/widgets/empty_state_view.dart';
import '../widgets/recipe_card.dart';

// Explore State Providers
final searchQueryProvider = StateProvider<String>((ref) => '');
final selectedTierProvider = StateProvider<String?>((ref) => null);
final selectedGoalProvider = StateProvider<String?>((ref) => null);
final quickieOnlyProvider = StateProvider<bool>((ref) => false);
final haveIngredientsToggleProvider = StateProvider<bool>((ref) => false);

final heroRecipesProvider = FutureProvider<List<Recipe>>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  return repo.getHeroRecipes();
});

final exploreRecipesProvider = FutureProvider<List<Recipe>>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  final query = ref.watch(searchQueryProvider);
  final tier = ref.watch(selectedTierProvider);
  final goal = ref.watch(selectedGoalProvider);
  final quickie = ref.watch(quickieOnlyProvider);
  final haveOnly = ref.watch(haveIngredientsToggleProvider);
  final pantryIds = ref.watch(pantryProvider);

  return repo.searchRecipes(
    query: query,
    tier: tier,
    goal: goal,
    maxMinutes: quickie ? 15 : null,
    pantryIds: haveOnly ? pantryIds : null,
    sortByCoverage: haveOnly,
    limit: 60,
  );
});

class ExploreScreen extends ConsumerStatefulWidget {
  const ExploreScreen({super.key});

  @override
  ConsumerState<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends ConsumerState<ExploreScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final heroesAsync = ref.watch(heroRecipesProvider);
    final recipesAsync = ref.watch(exploreRecipesProvider);
    final haveIngredientsOn = ref.watch(haveIngredientsToggleProvider);
    final userPantryIds = ref.watch(pantryProvider);
    final selectedTier = ref.watch(selectedTierProvider);
    final selectedGoal = ref.watch(selectedGoalProvider);
    final quickieOnly = ref.watch(quickieOnlyProvider);

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: CustomScrollView(
          slivers: [
            // Pinned Targets Ribbon + App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header row with logo & quick stats
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Text('🥑', style: TextStyle(fontSize: 22)),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('BiteCraft', style: AppTypography.h3(isDark).copyWith(fontSize: 20)),
                                Text(
                                  'Smart Student Kitchen',
                                  style: AppTypography.bodySmall(isDark),
                                ),
                              ],
                            ),
                          ],
                        ),
                        // Quick Mart / Dev Gallery Action
                        IconButton(
                          tooltip: 'Component Gallery',
                          icon: Icon(
                            Icons.grid_view_rounded,
                            color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
                          ),
                          onPressed: () => context.push('/dev/gallery'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Daily Target Nutrition Ribbon
                    _buildNutritionRibbon(context, isDark),
                    const SizedBox(height: 14),

                    // Floating Search Bar
                    _buildSearchBar(context, isDark),
                    const SizedBox(height: 12),

                    // Filter Chips Row
                    _buildFilterChips(isDark, selectedTier, selectedGoal, quickieOnly, haveIngredientsOn),
                  ],
                ),
              ),
            ),

            // Hero Spotlight Carousel (if no active search query)
            if (_searchController.text.isEmpty && selectedTier == null && !haveIngredientsOn)
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 10),
                      child: Row(
                        children: [
                          const Text('🔥 ', style: TextStyle(fontSize: 16)),
                          Text('Pinned Hero Specials', style: AppTypography.h4(isDark)),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: 245,
                      child: heroesAsync.when(
                        data: (heroes) => ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          scrollDirection: Axis.horizontal,
                          itemCount: heroes.length,
                          separatorBuilder: (_, __) => const SizedBox(width: 14),
                          itemBuilder: (context, index) {
                            final hero = heroes[index];
                            return SizedBox(
                              width: 200,
                              child: RecipeCard(
                                recipe: hero,
                                userPantryIds: userPantryIds,
                                showCoverage: false,
                              ),
                            );
                          },
                        ),
                        loading: () => ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          scrollDirection: Axis.horizontal,
                          itemCount: 4,
                          separatorBuilder: (_, __) => const SizedBox(width: 14),
                          itemBuilder: (_, __) => const SizedBox(width: 200, child: RecipeCardSkeleton()),
                        ),
                        error: (_, __) => const SizedBox.shrink(),
                      ),
                    ),
                  ],
                ),
              ),

            // Main Feed Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      haveIngredientsOn
                          ? 'Pantry Matches (Sorted by Coverage)'
                          : 'Explore Recipes',
                      style: AppTypography.h4(isDark),
                    ),
                    recipesAsync.when(
                      data: (list) => Text(
                        '${list.length} meals',
                        style: AppTypography.bodySmall(isDark),
                      ),
                      loading: () => const SizedBox.shrink(),
                      error: (_, __) => const SizedBox.shrink(),
                    ),
                  ],
                ),
              ),
            ),

            // Staggered Masonry Grid
            recipesAsync.when(
              data: (recipes) {
                if (recipes.isEmpty) {
                  return SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      child: EmptyStateView(
                        emoji: '🔍',
                        title: 'No matching recipes found',
                        subtitle: 'Try searching "kanda", "aloo", "oats", or relax your budget tier filter.',
                        buttonText: 'Reset Filters',
                        onButtonPressed: () {
                          _searchController.clear();
                          ref.read(searchQueryProvider.notifier).state = '';
                          ref.read(selectedTierProvider.notifier).state = null;
                          ref.read(selectedGoalProvider.notifier).state = null;
                          ref.read(quickieOnlyProvider.notifier).state = false;
                        },
                      ),
                    ),
                  );
                }

                return SliverPadding(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 110),
                  sliver: SliverMasonryGrid.count(
                    crossAxisCount: 2,
                    mainAxisSpacing: 14,
                    crossAxisSpacing: 14,
                    itemBuilder: (context, index) {
                      final recipe = recipes[index];
                      return RecipeCard(
                        recipe: recipe,
                        userPantryIds: userPantryIds,
                        showCoverage: haveIngredientsOn,
                      );
                    },
                    childCount: recipes.length,
                  ),
                );
              },
              loading: () => SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 110),
                sliver: SliverMasonryGrid.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 14,
                  crossAxisSpacing: 14,
                  itemBuilder: (_, __) => const RecipeCardSkeleton(),
                  childCount: 6,
                ),
              ),
              error: (err, _) => SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(40),
                  child: Text('Error loading feed: $err'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNutritionRibbon(BuildContext context, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(Icons.fitness_center_rounded, size: 16, color: AppColors.primary),
              const SizedBox(width: 8),
              Text('Daily Target: ', style: AppTypography.labelSmall(isDark)),
              Text('2,200 kcal', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: isDark ? AppColors.darkInk : AppColors.lightInk)),
              const Text(' • ', style: TextStyle(fontSize: 12, color: Colors.grey)),
              Text('120g Protein', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.protein)),
            ],
          ),
          GestureDetector(
            onTap: () => context.push('/onboarding'),
            child: Row(
              children: [
                Text(
                  'Edit',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, size: 14, color: AppColors.primary),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(BuildContext context, bool isDark) {
    return TextField(
      controller: _searchController,
      onChanged: (val) {
        ref.read(searchQueryProvider.notifier).state = val;
      },
      decoration: InputDecoration(
        hintText: 'Search dishes or "kanda", "aloo", "tamatar"...',
        prefixIcon: const Icon(Icons.search_rounded, size: 20, color: AppColors.primary),
        suffixIcon: _searchController.text.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear_rounded, size: 18),
                onPressed: () {
                  _searchController.clear();
                  ref.read(searchQueryProvider.notifier).state = '';
                },
              )
            : null,
      ),
    );
  }

  Widget _buildFilterChips(
    bool isDark,
    String? selectedTier,
    String? selectedGoal,
    bool quickieOnly,
    bool haveIngredientsOn,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          // "Have Ingredients?" Pantry toggle
          FilterChip(
            selected: haveIngredientsOn,
            avatar: const Text('🧺', style: TextStyle(fontSize: 13)),
            label: Text(haveIngredientsOn ? 'Cook What I Have (ON)' : 'Have Ingredients?'),
            labelStyle: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w700,
              color: haveIngredientsOn ? Colors.white : (isDark ? AppColors.darkInk : AppColors.lightInk),
            ),
            selectedColor: AppColors.primary,
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(haveIngredientsToggleProvider.notifier).state = val;
            },
          ),
          const SizedBox(width: 8),

          // Broke Student (< ₹60)
          FilterChip(
            selected: selectedTier == 'broke',
            avatar: const Text('🟢', style: TextStyle(fontSize: 10)),
            label: const Text('Broke (<₹60)'),
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(selectedTierProvider.notifier).state = val ? 'broke' : null;
            },
          ),
          const SizedBox(width: 8),

          // Balanced (₹60–₹150)
          FilterChip(
            selected: selectedTier == 'balanced',
            avatar: const Text('🟡', style: TextStyle(fontSize: 10)),
            label: const Text('Balanced (₹60–150)'),
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(selectedTierProvider.notifier).state = val ? 'balanced' : null;
            },
          ),
          const SizedBox(width: 8),

          // Hi-Fi Gourmet (₹150+)
          FilterChip(
            selected: selectedTier == 'hifi',
            avatar: const Text('🟣', style: TextStyle(fontSize: 10)),
            label: const Text('Hi-Fi (₹150+)'),
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(selectedTierProvider.notifier).state = val ? 'hifi' : null;
            },
          ),
          const SizedBox(width: 8),

          // ≤15 min Quickie
          FilterChip(
            selected: quickieOnly,
            avatar: const Icon(Icons.flash_on_rounded, size: 14),
            label: const Text('≤15 min Quickie'),
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(quickieOnlyProvider.notifier).state = val;
            },
          ),
          const SizedBox(width: 8),

          // High Protein
          FilterChip(
            selected: selectedGoal == 'high-protein',
            avatar: const Icon(Icons.fitness_center_rounded, size: 14),
            label: const Text('High Protein'),
            onSelected: (val) {
              HapticFeedback.lightImpact();
              ref.read(selectedGoalProvider.notifier).state = val ? 'high-protein' : null;
            },
          ),
        ],
      ),
    );
  }
}
