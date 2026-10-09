import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Recipe, StoreComparison } from '../types';
import { QuickCommerceWidget } from '../components/QuickCommerceWidget';
import { RecipeApiService } from '../services/api';
import {
  X,
  Clock,
  Wrench,
  Flame,
  Zap,
  Play,
  Pause,
  Lightbulb,
  Sparkles,
  Star
} from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  visible,
  onClose,
  isSaved = false,
  onToggleSave
}) => {
  const [comparison, setComparison] = useState<StoreComparison | null>(null);
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({});

  const [activeTimerStep, setActiveTimerStep] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    if (recipe) {
      setCompletedSteps({});
      setActiveTimerStep(null);
      setIsTimerRunning(false);
      RecipeApiService.comparePrices(recipe.id).then((data) => {
        if (data) setComparison(data);
      });
    }
  }, [recipe]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  if (!recipe) return null;

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const startTimerForStep = (stepNum: number, seconds: number) => {
    setActiveTimerStep(stepNum);
    setTimerSecondsLeft(seconds);
    setIsTimerRunning(true);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Sticky Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
            <X size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle} numberOfLines={1}>
            {recipe.title}
          </Text>
          <TouchableOpacity onPress={onToggleSave} style={styles.iconCircle}>
            <Star
              size={18}
              color={isSaved ? '#F59E0B' : Colors.textMuted}
              fill={isSaved ? '#F59E0B' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.imageUrl }} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <View style={styles.tierPill}>
                <Text style={styles.tierPillText}>
                  {recipe.budgetTier === 'broke-student'
                    ? '💸 Broke Student'
                    : recipe.budgetTier === 'balanced'
                    ? '⚖️ Balanced'
                    : '✨ Hi-Fi Gourmet'}
                </Text>
                <Text style={styles.tierPrice}>₹{recipe.estimatedCostPerServing} / meal</Text>
              </View>
            </View>
          </View>

          {/* Titles & Description */}
          <View style={styles.headerBlock}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.subtitle}>{recipe.subtitle}</Text>
            <Text style={styles.description}>{recipe.description}</Text>

            <View style={styles.quickStatsRow}>
              <View style={styles.quickStat}>
                <Clock size={16} color={Colors.primary} />
                <Text style={styles.quickStatLabel}>Total Time</Text>
                <Text style={styles.quickStatValue}>{totalTime} mins</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStat}>
                <Sparkles size={16} color={Colors.purple} />
                <Text style={styles.quickStatLabel}>Cuisine</Text>
                <Text style={styles.quickStatValue}>{recipe.cuisine}</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStat}>
                <Flame size={16} color="#EA580C" />
                <Text style={styles.quickStatLabel}>Calories</Text>
                <Text style={styles.quickStatValue}>{recipe.nutrition.calories} kcal</Text>
              </View>
            </View>
          </View>

          {/* Student Kitchen Equipment Check */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Wrench size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Student Kitchen Check</Text>
            </View>
            <Text style={styles.sectionSub}>Tools you need in your hostel/apartment:</Text>
            <View style={styles.equipPillsRow}>
              {recipe.equipment.map((eq, i) => (
                <View key={i} style={styles.equipPill}>
                  <Text style={styles.equipText}>✓ {eq}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Macro Nutrition Dashboard */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Zap size={16} color={Colors.emerald} />
              <Text style={styles.sectionTitle}>Nutrition & Macros per Serving</Text>
            </View>
            <View style={styles.macrosGrid}>
              <View style={[styles.macroCard, { borderColor: Colors.emerald, backgroundColor: Colors.emeraldLight }]}>
                <Text style={[styles.macroCardValue, { color: '#065F46' }]}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.macroCardLabel}>Protein</Text>
              </View>
              <View style={[styles.macroCard, { borderColor: '#F59E0B', backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.macroCardValue, { color: '#92400E' }]}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.macroCardLabel}>Carbs</Text>
              </View>
              <View style={[styles.macroCard, { borderColor: '#EA580C', backgroundColor: '#FFEDD5' }]}>
                <Text style={[styles.macroCardValue, { color: '#9A3412' }]}>{recipe.nutrition.fats}g</Text>
                <Text style={styles.macroCardLabel}>Fats</Text>
              </View>
              <View style={[styles.macroCard, { borderColor: Colors.purple, backgroundColor: Colors.purpleLight }]}>
                <Text style={[styles.macroCardValue, { color: '#5B21B6' }]}>{recipe.nutrition.fiber}g</Text>
                <Text style={styles.macroCardLabel}>Fiber</Text>
              </View>
            </View>
          </View>

          {/* Quick-Commerce Live Comparison Widget */}
          {comparison && <QuickCommerceWidget comparison={comparison} />}

          {/* Localized Ingredients Checklist */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ingredients with Local Names</Text>
            <Text style={styles.sectionSub}>English + local Hindi/Marathi names for easy grocery shopping:</Text>

            <View style={styles.ingredientsList}>
              {recipe.ingredients.map((ing) => (
                <View key={ing.id} style={styles.ingredientRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ingName}>{ing.name}</Text>
                    <Text style={styles.ingPortion}>Needed: {ing.portionAmount}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.ingCost}>₹{ing.portionCost}</Text>
                    <Text style={styles.ingPackInfo}>({ing.fullPackUnit})</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Step-by-Step Cooking Guide */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Beginner Step-by-Step Cooking Guide</Text>
            <Text style={styles.sectionSub}>Tap any step to cross it off as you cook:</Text>

            <View style={styles.stepsList}>
              {recipe.steps.map((step) => {
                const isDone = !!completedSteps[step.stepNumber];
                const hasTimer = !!step.timerSeconds;
                const isTimerActiveForThis = activeTimerStep === step.stepNumber;

                return (
                  <View
                    key={step.stepNumber}
                    style={[
                      styles.stepCard,
                      isDone && styles.stepCardDone
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.stepHeader}
                      onPress={() => toggleStep(step.stepNumber)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.stepNumberBadge, isDone && styles.stepNumberBadgeDone]}>
                        <Text style={styles.stepNumberText}>
                          {isDone ? '✓' : step.stepNumber}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.stepInstruction,
                          isDone && styles.stepInstructionDone
                        ]}
                      >
                        {step.instruction}
                      </Text>
                    </TouchableOpacity>

                    {/* Step Timer if available */}
                    {hasTimer && step.timerSeconds && (
                      <View style={styles.timerBox}>
                        <Clock size={14} color="#D97706" />
                        <Text style={styles.timerLabel}>Cooking Timer:</Text>
                        <Text style={styles.timerCountdown}>
                          {isTimerActiveForThis ? formatTimer(timerSecondsLeft) : formatTimer(step.timerSeconds)}
                        </Text>

                        {isTimerActiveForThis ? (
                          <TouchableOpacity
                            style={styles.timerButton}
                            onPress={() => setIsTimerRunning(!isTimerRunning)}
                          >
                            {isTimerRunning ? (
                              <Pause size={14} color="#FFFFFF" />
                            ) : (
                              <Play size={14} color="#FFFFFF" />
                            )}
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.timerButton}
                            onPress={() => startTimerForStep(step.stepNumber, step.timerSeconds!)}
                          >
                            <Play size={14} color="#FFFFFF" />
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {/* Beginner Tip */}
                    {step.beginnerTip && (
                      <View style={styles.beginnerTipBox}>
                        <Lightbulb size={13} color={Colors.primary} />
                        <Text style={styles.beginnerTipText}>{step.beginnerTip}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Student Hacks & Secrets */}
          {recipe.studentHacks.length > 0 && (
            <View style={[styles.sectionContainer, styles.hacksContainer]}>
              <View style={styles.sectionHeaderRow}>
                <Lightbulb size={16} color="#D97706" />
                <Text style={[styles.sectionTitle, { color: '#92400E' }]}>
                  Dorm Room & Student Hacks
                </Text>
              </View>
              {recipe.studentHacks.map((hack, idx) => (
                <View key={idx} style={styles.hackRow}>
                  <Text style={styles.hackBullet}>💡</Text>
                  <Text style={styles.hackText}>{hack}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Colors.shadow
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 40
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative'
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16
  },
  tierPill: {
    backgroundColor: 'rgba(28, 25, 23, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  tierPillText: {
    color: '#FBBF24',
    fontWeight: '800',
    fontSize: 12
  },
  tierPrice: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13
  },
  headerBlock: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 28,
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20
  },
  description: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 8,
    lineHeight: 18
  },
  quickStatsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 16,
    marginTop: 14,
    padding: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border
  },
  quickStat: {
    alignItems: 'center',
    gap: 2
  },
  quickStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600'
  },
  quickStatValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  quickStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: Colors.surface,
    marginTop: 12,
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Colors.shadow
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    marginBottom: 12
  },
  equipPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  equipPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FED7AA'
  },
  equipText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700'
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6
  },
  macroCard: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5
  },
  macroCardValue: {
    fontSize: 17,
    fontWeight: '900'
  },
  macroCardLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginTop: 2
  },
  ingredientsList: {
    gap: 8
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border
  },
  ingName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  ingPortion: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  ingCost: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.primary
  },
  ingPackInfo: {
    fontSize: 10,
    color: Colors.textMuted
  },
  stepsList: {
    gap: 12
  },
  stepCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  stepCardDone: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.emeraldLight,
    opacity: 0.8
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  stepNumberBadgeDone: {
    backgroundColor: Colors.emerald
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  stepInstruction: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    flex: 1,
    fontWeight: '500'
  },
  stepInstructionDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6
  },
  timerLabel: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '600'
  },
  timerCountdown: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
    flex: 1
  },
  timerButton: {
    backgroundColor: '#D97706',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  beginnerTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    marginTop: 8,
    padding: 8,
    borderRadius: 10,
    gap: 6
  },
  beginnerTipText: {
    fontSize: 11,
    color: Colors.primary,
    flex: 1,
    fontWeight: '600',
    lineHeight: 15
  },
  hacksContainer: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A'
  },
  hackRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8
  },
  hackBullet: {
    fontSize: 14
  },
  hackText: {
    fontSize: 12,
    color: '#78350F',
    flex: 1,
    lineHeight: 17,
    fontWeight: '500'
  }
});
