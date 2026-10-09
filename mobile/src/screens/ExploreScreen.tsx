import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { BudgetTier, FitnessGoal, Recipe } from '../types';
import { RecipeApiService } from '../services/api';
import { BudgetTierFilter } from '../components/BudgetTierFilter';
import { GoalFilter } from '../components/GoalFilter';
import { RecipeCard } from '../components/RecipeCard';
import { Sparkles, Utensils, Flame, Clock } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface ExploreScreenProps {
  searchQuery: string;
  onSelectRecipe: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  searchQuery,
  onSelectRecipe,
  savedRecipeIds,
  onToggleSave
}) => {
  const [selectedTier, setSelectedTier] = useState<BudgetTier>('all');
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [displayLimit, setDisplayLimit] = useState<number>(30);
  const [loading, setLoading] = useState(true);

  const cuisines = [
    { label: 'All Cuisines', emoji: '🍽️' },
    { label: 'Indian', emoji: '🍛' },
    { label: 'Italian', emoji: '🍝' },
    { label: 'Pan-Asian', emoji: '🥢' },
    { label: 'Mexican', emoji: '🌮' },
    { label: 'Continental', emoji: '🥑' },
    { label: 'Middle Eastern', emoji: '🧆' }
  ];

  useEffect(() => {
    loadRecipes();
  }, [selectedTier, selectedGoal, selectedCuisine, searchQuery]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await RecipeApiService.getRecipes({
        budgetTier: selectedTier,
        fitnessGoal: selectedGoal,
        cuisine: selectedCuisine === 'All Cuisines' ? 'All' : selectedCuisine,
        search: searchQuery
      });
      setRecipes(data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const displayedRecipes = recipes.slice(0, displayLimit);
  const heroRecipe = recipes.find((r) => r.budgetTier === 'hifi-gourmet') || recipes[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Featured Spotlight Card */}
      {heroRecipe && !searchQuery && (
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => onSelectRecipe(heroRecipe)}
          activeOpacity={0.92}
        >
          <Image source={{ uri: heroRecipe.imageUrl }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <View style={styles.featuredBadge}>
              <Sparkles size={12} color="#FFFFFF" />
              <Text style={styles.featuredBadgeText}>STUDENT CHEF SPOTLIGHT</Text>
            </View>
            <Text style={styles.heroTitle}>{heroRecipe.title}</Text>
            <Text style={styles.heroSub}>{heroRecipe.subtitle}</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroCost}>₹{heroRecipe.estimatedCostPerServing} / serving</Text>
              <Text style={styles.heroMacros}>
                🍗 {heroRecipe.nutrition.protein}g Protein • 🔥 {heroRecipe.nutrition.calories} kcal
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Story-Style Cuisine Category Bubbles */}
      <View style={styles.cuisineSection}>
        <Text style={styles.sectionLabel}>EXPLORE CUISINES</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisineScroll}
        >
          {cuisines.map((c) => {
            const isActive =
              (c.label === 'All Cuisines' && selectedCuisine === 'All') ||
              selectedCuisine === c.label;
            return (
              <TouchableOpacity
                key={c.label}
                style={[styles.cuisineBubble, isActive && styles.cuisineBubbleActive]}
                onPress={() => setSelectedCuisine(c.label === 'All Cuisines' ? 'All' : c.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.cuisineEmoji}>{c.emoji}</Text>
                <Text style={[styles.cuisineLabel, isActive && styles.cuisineLabelActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Modern Budget Tier Selector */}
      <BudgetTierFilter
        selectedTier={selectedTier}
        onSelectTier={(tier) => setSelectedTier(tier)}
      />

      {/* Fitness Goal Selector */}
      <GoalFilter
        selectedGoal={selectedGoal}
        onSelectGoal={(goal) => setSelectedGoal(goal)}
      />

      {/* Results Header Counter */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Showing {displayedRecipes.length} of <Text style={{ color: Colors.primary }}>{recipes.length} recipes</Text>
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </Text>
        <Text style={styles.resultsSubtitle}>
          Real-time prices from Zepto, Blinkit & Swiggy Instamart
        </Text>
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching grocery prices & macros...</Text>
        </View>
      )}

      {/* Recipes List */}
      {!loading && (
        <View style={styles.recipesList}>
          {displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => onSelectRecipe(recipe)}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={() => onToggleSave(recipe.id)}
            />
          ))}

          {/* Load More Button if over 30 recipes */}
          {recipes.length > displayLimit && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => setDisplayLimit((prev) => prev + 30)}
              activeOpacity={0.85}
            >
              <Text style={styles.loadMoreBtnText}>
                Load More Recipes ({recipes.length - displayLimit} remaining) ↓
              </Text>
            </TouchableOpacity>
          )}

          {recipes.length === 0 && (
            <View style={styles.emptyContainer}>
              <Utensils size={44} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No Recipes Found</Text>
              <Text style={styles.emptySub}>
                Try searching for ingredients like "kanda", "aloo", "paneer", or "eggs".
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    paddingBottom: 40
  },
  heroCard: {
    height: 220,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    ...Colors.shadowLg
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceSubtle
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(28, 25, 23, 0.88)'
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4
  },
  heroSub: {
    fontSize: 12,
    color: '#E7E5E4',
    marginTop: 2
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  heroCost: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34D399'
  },
  heroMacros: {
    fontSize: 11,
    color: '#D6D3D1',
    fontWeight: '600'
  },
  cuisineSection: {
    paddingVertical: 10,
    backgroundColor: Colors.background
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    marginBottom: 8
  },
  cuisineScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row'
  },
  cuisineBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
    ...Colors.shadow
  },
  cuisineBubbleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  cuisineEmoji: {
    fontSize: 16
  },
  cuisineLabel: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '700'
  },
  cuisineLabelActive: {
    color: '#FFFFFF'
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  resultsSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  recipesList: {
    paddingHorizontal: 16,
    paddingTop: 8
  },
  loadMoreBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 12,
    ...Colors.shadow
  },
  loadMoreBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '800'
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40
  }
});
