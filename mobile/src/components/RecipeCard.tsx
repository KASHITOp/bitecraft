import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Recipe } from '../types';
import { Clock, Flame, Zap, Wrench, Star } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  isSaved = false,
  onToggleSave
}) => {
  const getTierBadge = (tier: Recipe['budgetTier']) => {
    switch (tier) {
      case 'broke-student':
        return { label: '💸 Broke Student', bg: '#059669', text: '#FFFFFF' };
      case 'balanced':
        return { label: '⚖️ Balanced', bg: '#D97706', text: '#FFFFFF' };
      case 'hifi-gourmet':
        return { label: '✨ Hi-Fi Gourmet', bg: '#7C3AED', text: '#FFFFFF' };
    }
  };

  const tierBadge = getTierBadge(recipe.budgetTier);
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;
  const primaryEquipment = recipe.equipment[0] || '1 Pan';

  // Extract primary dual-named ingredients for student preview
  const localizedPreview = recipe.ingredients
    .slice(0, 3)
    .map((i) => i.name.split('(')[1]?.replace(')', '').trim() || i.name.split(' ')[0])
    .join(' • ');

  // Quick commerce lowest price calculation
  let lowestStorePrice = 999;
  let lowestStore = 'Blinkit';
  recipe.ingredients.forEach((ing) => {
    if (ing.quickCommerce.blinkitPrice < lowestStorePrice) {
      lowestStorePrice = ing.quickCommerce.blinkitPrice;
    }
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Recipe Photo with Floating Tags */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Floating Budget Tier Tag */}
        <View style={[styles.tierBadge, { backgroundColor: tierBadge.bg }]}>
          <Text style={styles.tierBadgeText}>{tierBadge.label}</Text>
          <Text style={styles.portionCost}>₹{recipe.estimatedCostPerServing}</Text>
        </View>

        {/* Floating Bookmark Button */}
        {onToggleSave && (
          <TouchableOpacity
            style={styles.bookmarkBtn}
            onPress={onToggleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Star
              size={18}
              color={isSaved ? '#F59E0B' : '#FFFFFF'}
              fill={isSaved ? '#F59E0B' : 'rgba(0,0,0,0.3)'}
            />
          </TouchableOpacity>
        )}

        {/* Floating Cuisine Pill */}
        <View style={styles.cuisinePill}>
          <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
        </View>

        {/* Quick Time & Prep Badge */}
        <View style={styles.timePill}>
          <Clock size={11} color="#FFFFFF" />
          <Text style={styles.timePillText}>{totalTime}m</Text>
        </View>
      </View>

      {/* Recipe Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {recipe.subtitle}
        </Text>

        {/* Localized Ingredients Highlight (Kanda, Aloo, Tamatar, etc.) */}
        <View style={styles.localizedRow}>
          <Text style={styles.localizedLabel}>Uses:</Text>
          <Text style={styles.localizedText} numberOfLines={1}>
            {recipe.ingredients.slice(0, 3).map(i => i.name).join(' • ')}
          </Text>
        </View>

        {/* Equipment & Satiety Row */}
        <View style={styles.equipmentRow}>
          <Wrench size={12} color={Colors.textSecondary} />
          <Text style={styles.equipmentText}>{primaryEquipment}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>

        {/* Nutrition Macro Pills */}
        <View style={styles.macroRow}>
          <View style={[styles.macroPill, styles.proteinPill]}>
            <Zap size={11} color="#047857" />
            <Text style={styles.proteinText}>
              <Text style={{ fontWeight: '800' }}>{recipe.nutrition.protein}g</Text> Protein
            </Text>
          </View>
          <View style={styles.macroPill}>
            <Flame size={11} color="#C2410C" />
            <Text style={styles.calorieText}>
              <Text style={{ fontWeight: '800' }}>{recipe.nutrition.calories}</Text> kcal
            </Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.carbText}>
              <Text style={{ fontWeight: '700' }}>{recipe.nutrition.carbs}g</Text> Carbs
            </Text>
          </View>
        </View>

        {/* Quick-Commerce Live Price Footer */}
        <View style={styles.quickCommerceFooter}>
          <View style={styles.qcLeft}>
            <Text style={styles.qcHeading}>⚡ Quick Grocery:</Text>
            <Text style={styles.qcStores}>
              Zepto 10m • Blinkit ₹{lowestStorePrice}
            </Text>
          </View>
          <View style={styles.qcOrderBtn}>
            <Text style={styles.qcOrderBtnText}>View Rates →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  imageContainer: {
    height: 190,
    width: '100%',
    position: 'relative'
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.surfaceSubtle
  },
  tierBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  portionCost: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cuisinePill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8
  },
  cuisineText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  timePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  timePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  content: {
    padding: 14
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 18
  },
  localizedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    gap: 4
  },
  localizedLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary
  },
  localizedText: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600',
    flex: 1
  },
  equipmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6
  },
  equipmentText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  dotSeparator: {
    color: Colors.textMuted,
    fontSize: 10
  },
  difficultyText: {
    fontSize: 11,
    color: Colors.emerald,
    fontWeight: '700'
  },
  macroRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4
  },
  proteinPill: {
    backgroundColor: Colors.emeraldLight,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder
  },
  proteinText: {
    fontSize: 11,
    color: '#065F46'
  },
  calorieText: {
    fontSize: 11,
    color: '#9A3412'
  },
  carbText: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  quickCommerceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 12
  },
  qcLeft: {
    flex: 1
  },
  qcHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C2410C'
  },
  qcStores: {
    fontSize: 11,
    color: '#7C2D12',
    fontWeight: '600'
  },
  qcOrderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  qcOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  }
});
