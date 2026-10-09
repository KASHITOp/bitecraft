import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Recipe } from '../types';
import { RecipeApiService } from '../services/api';
import { RecipeCard } from '../components/RecipeCard';
import { Bookmark, Sparkles } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface SavedScreenProps {
  savedRecipeIds: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onToggleSave: (id: string) => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  savedRecipeIds,
  onSelectRecipe,
  onToggleSave
}) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    RecipeApiService.getRecipes().then((all) => {
      setRecipes(all.filter((r) => savedRecipeIds.includes(r.id)));
    });
  }, [savedRecipeIds]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <View style={styles.headerIconWrap}>
          <Bookmark size={20} color={Colors.amber} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Your Saved Recipes</Text>
          <Text style={styles.sub}>
            {recipes.length} {recipes.length === 1 ? 'dish' : 'dishes'} bookmarked for your weekly staples & quick cooking
          </Text>
        </View>
      </View>

      {recipes.length > 0 ? (
        <View style={styles.list}>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onPress={() => onSelectRecipe(recipe)}
              isSaved={true}
              onToggleSave={() => onToggleSave(recipe.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Sparkles size={36} color={Colors.amber} />
          </View>
          <Text style={styles.emptyTitle}>No Saved Recipes Yet</Text>
          <Text style={styles.emptySub}>
            Explore 1,000+ budget-friendly meals and tap the star icon ⭐ to keep them handy for cooking!
          </Text>
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
    padding: 16,
    paddingBottom: 40
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  sub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16
  },
  list: {
    gap: 4
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
    ...Colors.shadow
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.amberLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300
  }
});
