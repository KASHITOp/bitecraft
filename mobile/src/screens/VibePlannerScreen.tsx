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
import { BudgetTier, DayPlanResponse, FitnessGoal, Recipe } from '../types';
import { RecipeApiService } from '../services/api';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  ShoppingBag,
  RefreshCw,
  ChevronRight,
  Sun,
  Coffee,
  Utensils,
  Moon
} from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface VibePlannerScreenProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

export const VibePlannerScreen: React.FC<VibePlannerScreenProps> = ({ onSelectRecipe }) => {
  const [selectedTier, setSelectedTier] = useState<BudgetTier>('broke-student');
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>('weight-gain');
  const [plan, setPlan] = useState<DayPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async (tier: BudgetTier, goal: FitnessGoal) => {
    setLoading(true);
    try {
      const data = await RecipeApiService.generateDayPlan(tier, goal);
      setPlan(data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(selectedTier, selectedGoal);
  }, []);

  const handleTierChange = (tier: BudgetTier) => {
    setSelectedTier(tier);
    fetchPlan(tier, selectedGoal);
  };

  const handleGoalChange = (goal: FitnessGoal) => {
    setSelectedGoal(goal);
    fetchPlan(selectedTier, goal);
  };

  const getSlotIcon = (slot: string) => {
    switch (slot) {
      case 'Breakfast':
        return <Sun size={15} color="#D97706" />;
      case 'Brunch':
        return <Coffee size={15} color={Colors.primary} />;
      case 'Lunch':
        return <Utensils size={15} color="#059669" />;
      case 'Snack':
        return <Coffee size={15} color="#2563EB" />;
      case 'Dinner':
        return <Moon size={15} color="#7C3AED" />;
      default:
        return <Utensils size={15} color={Colors.primary} />;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Sparkles size={14} color={Colors.primary} />
          <Text style={styles.badgeText}>SMART DAILY VIBE PLANNER</Text>
        </View>
        <Text style={styles.title}>Your Personalized 5-Meal Day</Text>
        <Text style={styles.sub}>
          Crafted to hit your exact calorie & protein goals within your student budget.
        </Text>
      </View>

      {/* 1. Daily Budget Tier Switcher */}
      <View style={styles.configBox}>
        <Text style={styles.configLabel}>1. SELECT TODAY'S BUDGET TIER:</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedTier === 'broke-student' && styles.choiceBtnActiveGreen
            ]}
            onPress={() => handleTierChange('broke-student')}
          >
            <Text style={{ fontSize: 16 }}>💸</Text>
            <Text
              style={[
                styles.choiceBtnText,
                selectedTier === 'broke-student' && styles.choiceBtnTextActive
              ]}
            >
              Broke Student
            </Text>
            <Text style={styles.choiceSub}>&lt; ₹150 / day</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedTier === 'balanced' && styles.choiceBtnActiveAmber
            ]}
            onPress={() => handleTierChange('balanced')}
          >
            <Text style={{ fontSize: 16 }}>⚖️</Text>
            <Text
              style={[
                styles.choiceBtnText,
                selectedTier === 'balanced' && styles.choiceBtnTextActive
              ]}
            >
              Balanced
            </Text>
            <Text style={styles.choiceSub}>₹250 - 450 / d</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedTier === 'hifi-gourmet' && styles.choiceBtnActivePurple
            ]}
            onPress={() => handleTierChange('hifi-gourmet')}
          >
            <Text style={{ fontSize: 16 }}>✨</Text>
            <Text
              style={[
                styles.choiceBtnText,
                selectedTier === 'hifi-gourmet' && styles.choiceBtnTextActive
              ]}
            >
              Hi-Fi Gourmet
            </Text>
            <Text style={styles.choiceSub}>₹750+ / d</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Fitness Goal Switcher */}
        <Text style={[styles.configLabel, { marginTop: 14 }]}>
          2. SELECT TODAY'S FITNESS GOAL:
        </Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedGoal === 'weight-gain' && styles.choiceBtnActiveGreen
            ]}
            onPress={() => handleGoalChange('weight-gain')}
          >
            <TrendingUp size={14} color="#059669" />
            <Text
              style={[
                styles.choiceBtnText,
                selectedGoal === 'weight-gain' && styles.choiceBtnTextActive
              ]}
            >
              Muscle Gain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedGoal === 'weight-loss' && styles.choiceBtnActiveRose
            ]}
            onPress={() => handleGoalChange('weight-loss')}
          >
            <Flame size={14} color="#E11D48" />
            <Text
              style={[
                styles.choiceBtnText,
                selectedGoal === 'weight-loss' && styles.choiceBtnTextActive
              ]}
            >
              Fat Loss
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.choiceBtn,
              selectedGoal === 'high-protein' && styles.choiceBtnActiveAmber
            ]}
            onPress={() => handleGoalChange('high-protein')}
          >
            <Zap size={14} color="#D97706" />
            <Text
              style={[
                styles.choiceBtnText,
                selectedGoal === 'high-protein' && styles.choiceBtnTextActive
              ]}
            >
              Max Protein
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Calculating 5-meal schedule and grocery prices...</Text>
        </View>
      )}

      {/* Plan Results */}
      {!loading && plan && (
        <>
          {/* Day Macro & Cost Summary Dashboard */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <View>
                <Text style={styles.summaryTitle}>Total Day Food Cost (5 Meals)</Text>
                <Text style={styles.summaryCost}>₹{plan.totalDailyCost}</Text>
                <Text style={styles.summarySubCost}>for all meals combined</Text>
              </View>
              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => fetchPlan(selectedTier, selectedGoal)}
              >
                <RefreshCw size={14} color={Colors.primary} />
                <Text style={styles.refreshBtnText}>Shuffle Menu</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.macroStrip}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{plan.totalNutrition.calories}</Text>
                <Text style={styles.macroUnit}>Calories (kcal)</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, { color: '#047857' }]}>
                  {plan.totalNutrition.protein}g
                </Text>
                <Text style={styles.macroUnit}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{plan.totalNutrition.carbs}g</Text>
                <Text style={styles.macroUnit}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{plan.totalNutrition.fats}g</Text>
                <Text style={styles.macroUnit}>Fats</Text>
              </View>
            </View>

            {/* Quick Commerce Summary Banner */}
            <View style={styles.quickCommerceSummary}>
              <ShoppingBag size={14} color="#C2410C" />
              <Text style={styles.qcSummaryText}>
                Full pantry basket on <Text style={styles.qcStoreBold}>{plan.quickCommerceTotals.bestStore}</Text>: ₹{plan.quickCommerceTotals.blinkit} (Save ₹{plan.quickCommerceTotals.maxSavings} vs other apps)
              </Text>
            </View>
          </View>

          {/* 5 Meal Timeline */}
          <View style={styles.timelineContainer}>
            <Text style={styles.timelineHeading}>TODAY'S 5-MEAL TIMELINE</Text>

            {plan.meals.map(({ mealSlot, recipe }, index) => (
              <TouchableOpacity
                key={`${mealSlot}-${index}`}
                style={styles.mealSlotCard}
                onPress={() => onSelectRecipe(recipe)}
                activeOpacity={0.88}
              >
                <View style={styles.slotTagRow}>
                  <View style={styles.slotTag}>
                    {getSlotIcon(mealSlot)}
                    <Text style={styles.slotTagName}>{mealSlot.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.slotPrice}>₹{recipe.estimatedCostPerServing}</Text>
                </View>

                <View style={styles.mealSlotContent}>
                  <Image source={{ uri: recipe.imageUrl }} style={styles.mealSlotImage} />
                  <View style={styles.mealSlotDetails}>
                    <Text style={styles.mealSlotTitle} numberOfLines={1}>
                      {recipe.title}
                    </Text>
                    <Text style={styles.mealSlotSub} numberOfLines={2}>
                      {recipe.subtitle}
                    </Text>

                    <View style={styles.mealSlotMacros}>
                      <Text style={styles.mealSlotMacroTag}>
                        🍗 {recipe.nutrition.protein}g protein
                      </Text>
                      <Text style={styles.mealSlotMacroTag}>
                        🔥 {recipe.nutrition.calories} kcal
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
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
  header: {
    marginBottom: 16
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.4
  },
  sub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  configBox: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  configLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 8
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8
  },
  choiceBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 2
  },
  choiceBtnActiveGreen: {
    borderColor: '#059669',
    backgroundColor: '#E8F8F2'
  },
  choiceBtnActiveAmber: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7'
  },
  choiceBtnActivePurple: {
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF'
  },
  choiceBtnActiveRose: {
    borderColor: '#E11D48',
    backgroundColor: '#FFE4E6'
  },
  choiceBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center'
  },
  choiceBtnTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800'
  },
  choiceSub: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600'
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 20,
    ...Colors.shadow
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  summaryTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '700'
  },
  summaryCost: {
    fontSize: 30,
    fontWeight: '900',
    color: Colors.primary,
    marginTop: 2
  },
  summarySubCost: {
    fontSize: 11,
    color: Colors.textMuted
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6
  },
  refreshBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800'
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12
  },
  macroStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  macroItem: {
    alignItems: 'center'
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary
  },
  macroUnit: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600'
  },
  quickCommerceSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    padding: 10,
    borderRadius: 12,
    marginTop: 14,
    gap: 6
  },
  qcSummaryText: {
    fontSize: 11,
    color: '#7C2D12',
    flex: 1
  },
  qcStoreBold: {
    color: Colors.primary,
    fontWeight: '800'
  },
  timelineContainer: {
    gap: 12
  },
  timelineHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: 4
  },
  mealSlotCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  slotTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  slotTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  slotTagName: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.5
  },
  slotPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.emerald
  },
  mealSlotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  mealSlotImage: {
    width: 66,
    height: 66,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSubtle
  },
  mealSlotDetails: {
    flex: 1
  },
  mealSlotTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  mealSlotSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15
  },
  mealSlotMacros: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6
  },
  mealSlotMacroTag: {
    fontSize: 11,
    color: Colors.textPrimary,
    fontWeight: '600'
  }
});
