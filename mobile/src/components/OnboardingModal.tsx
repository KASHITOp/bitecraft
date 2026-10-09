import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView
} from 'react-native';
import {
  Sparkles,
  TrendingUp,
  Flame,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Scale,
  DollarSign,
  Utensils,
  Award,
  User
} from 'lucide-react-native';
import { BudgetTier, FitnessGoal } from '../types';
import { Colors } from '../theme/colors';

export interface UserProfile {
  age: number;
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female' | 'other';
  goal: FitnessGoal;
  budgetTier: BudgetTier;
  kitchenSetup: 'kettle-only' | 'single-pan' | 'full-kitchen';
  calculatedCalories: number;
  calculatedProtein: number;
  completed: boolean;
}

interface OnboardingModalProps {
  visible: boolean;
  onSaveProfile: (profile: UserProfile) => void;
  onClose?: () => void;
  initialProfile?: UserProfile | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onSaveProfile,
  onClose,
  initialProfile
}) => {
  const [step, setStep] = useState(1);

  // Form state
  const [age, setAge] = useState<string>(initialProfile ? String(initialProfile.age) : '21');
  const [weightKg, setWeightKg] = useState<string>(initialProfile ? String(initialProfile.weightKg) : '68');
  const [heightCm, setHeightCm] = useState<string>(initialProfile ? String(initialProfile.heightCm) : '174');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(initialProfile?.gender || 'male');
  const [goal, setGoal] = useState<FitnessGoal>(initialProfile?.goal || 'weight-gain');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialProfile?.budgetTier || 'broke-student');
  const [kitchenSetup, setKitchenSetup] = useState<'kettle-only' | 'single-pan' | 'full-kitchen'>(
    initialProfile?.kitchenSetup || 'single-pan'
  );

  // Calculate personalized macro targets
  const calculateTargets = () => {
    const w = parseFloat(weightKg) || 68;
    const a = parseInt(age, 10) || 21;
    const h = parseInt(heightCm, 10) || 174;

    // Basal Metabolic Rate (Mifflin-St Jeor formula)
    let bmr = 10 * w + 6.25 * h - 5 * a + (gender === 'female' ? -161 : 5);
    let tdee = bmr * 1.4; // moderate student activity

    let targetCalories = Math.round(tdee);
    let targetProtein = Math.round(w * 1.8); // 1.8g per kg body weight

    if (goal === 'weight-gain') {
      targetCalories += 350; // clean caloric surplus
      targetProtein = Math.round(w * 2.0);
    } else if (goal === 'weight-loss') {
      targetCalories -= 400; // caloric deficit
      targetProtein = Math.round(w * 1.9); // preserve muscle in deficit
    } else if (goal === 'high-protein') {
      targetProtein = Math.round(w * 2.2);
    }

    return {
      calories: Math.max(1400, Math.min(3600, targetCalories)),
      protein: Math.max(60, Math.min(220, targetProtein))
    };
  };

  const targets = calculateTargets();

  const handleFinish = () => {
    const profile: UserProfile = {
      age: parseInt(age, 10) || 21,
      weightKg: parseFloat(weightKg) || 68,
      heightCm: parseInt(heightCm, 10) || 174,
      gender,
      goal,
      budgetTier,
      kitchenSetup,
      calculatedCalories: targets.calories,
      calculatedProtein: targets.protein,
      completed: true
    };
    onSaveProfile(profile);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header & Progress Indicator */}
        <View style={styles.topBar}>
          {step > 1 ? (
            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
              <ChevronLeft size={20} color={Colors.textSecondary} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}

          {/* Progress dots */}
          <View style={styles.progressDots}>
            {[1, 2, 3, 4].map((s) => (
              <View
                key={s}
                style={[
                  styles.dot,
                  step === s && styles.dotActive,
                  step > s && styles.dotDone
                ]}
              />
            ))}
          </View>

          {onClose ? (
            <TouchableOpacity onPress={onClose} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 60 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* STEP 1: Body Weight & Basic Stats */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.iconCircle}>
                <Scale size={28} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Tell Us About Yourself</Text>
              <Text style={styles.stepSub}>
                Zero friction, no login required! We calculate your daily calories & protein directly from your body stats.
              </Text>

              {/* Weight in kg */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>CURRENT BODY WEIGHT (KG)</Text>
                <View style={styles.numberRow}>
                  <TouchableOpacity
                    style={styles.stepAdjustBtn}
                    onPress={() => setWeightKg(String(Math.max(40, (parseFloat(weightKg) || 68) - 1)))}
                  >
                    <Text style={styles.adjustText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.bigInput}
                    value={weightKg}
                    onChangeText={setWeightKg}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <TouchableOpacity
                    style={styles.stepAdjustBtn}
                    onPress={() => setWeightKg(String((parseFloat(weightKg) || 68) + 1))}
                  >
                    <Text style={styles.adjustText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Age and Height Grid */}
              <View style={styles.gridRow}>
                <View style={[styles.inputCard, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>AGE</Text>
                  <TextInput
                    style={styles.mediumInput}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
                <View style={[styles.inputCard, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>HEIGHT (CM)</Text>
                  <TextInput
                    style={styles.mediumInput}
                    value={heightCm}
                    onChangeText={setHeightCm}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
              </View>

              {/* Gender selector */}
              <Text style={[styles.inputLabel, { marginTop: 12 }]}>BIOLOGICAL GENDER</Text>
              <View style={styles.genderRow}>
                {(['male', 'female', 'other'] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                      {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : 'Other'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* STEP 2: Fitness Goal */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.emeraldLight }]}>
                <TrendingUp size={28} color={Colors.emerald} />
              </View>
              <Text style={styles.stepTitle}>What's Your Main Health Goal?</Text>
              <Text style={styles.stepSub}>
                We will match recipes to give you the ideal caloric surplus, deficit, or protein density.
              </Text>

              <View style={styles.optionsList}>
                <TouchableOpacity
                  style={[styles.optionCard, goal === 'weight-gain' && styles.optionCardActivePrimary]}
                  onPress={() => setGoal('weight-gain')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: '#F0FDF4' }]}>
                    <TrendingUp size={22} color={Colors.emerald} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Gain Weight / Muscle Bulk</Text>
                    <Text style={styles.optionDesc}>
                      Clean caloric surplus (+350 kcal) with dense proteins, healthy fats & complex carbs.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, goal === 'weight-loss' && styles.optionCardActivePrimary]}
                  onPress={() => setGoal('weight-loss')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: '#FFF1F2' }]}>
                    <Flame size={22} color="#E11D48" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Lose Weight / Shred Fat</Text>
                    <Text style={styles.optionDesc}>
                      High volume, high fiber & protein meals to stay completely full in calorie deficit.
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, goal === 'high-protein' && styles.optionCardActivePrimary]}
                  onPress={() => setGoal('high-protein')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: '#FEF3C7' }]}>
                    <Zap size={22} color={Colors.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>Gym Beast (Max Protein)</Text>
                    <Text style={styles.optionDesc}>
                      Maximum protein per rupee spent (Eggs, Soya Keema, Paneer & Greek Yogurt).
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, goal === 'exam-quick' && styles.optionCardActivePrimary]}
                  onPress={() => setGoal('exam-quick')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: Colors.purpleLight }]}>
                    <Sparkles size={22} color={Colors.purple} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionTitle}>15-Min Fast & Easy Meals</Text>
                    <Text style={styles.optionDesc}>
                      Quick student meals with zero dishes to wash during busy college exam weeks.
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: Daily Grocery Budget Tier */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.amberLight }]}>
                <DollarSign size={28} color={Colors.amber} />
              </View>
              <Text style={styles.stepTitle}>What's Your Daily Food Budget?</Text>
              <Text style={styles.stepSub}>
                We calculate real-time prices on Zepto, Blinkit & Swiggy Instamart to fit your wallet.
              </Text>

              <View style={styles.optionsList}>
                <TouchableOpacity
                  style={[styles.optionCard, budgetTier === 'broke-student' && styles.optionCardActiveGreen]}
                  onPress={() => setBudgetTier('broke-student')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: Colors.emeraldLight }]}>
                    <Text style={{ fontSize: 22 }}>💸</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={styles.optionTitle}>Broke Student</Text>
                      <View style={[styles.tierTag, { backgroundColor: Colors.emerald }]}>
                        <Text style={styles.tierTagText}>&lt; ₹150 / day</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDesc}>
                      Super cheap high protein (Masala oats, Soya chunks, Khichdi, Kanda Poha under ₹40/meal).
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, budgetTier === 'balanced' && styles.optionCardActiveAmber]}
                  onPress={() => setBudgetTier('balanced')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: Colors.amberLight }]}>
                    <Text style={{ fontSize: 22 }}>⚖️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={styles.optionTitle}>Balanced Everyday</Text>
                      <View style={[styles.tierTag, { backgroundColor: Colors.amber }]}>
                        <Text style={styles.tierTagText}>₹250 - 450 / day</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDesc}>
                      Nutritious wraps, burrito bowls, aglio e olio, paneer bhurji & Greek yogurt (₹60 - ₹130/meal).
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionCard, budgetTier === 'hifi-gourmet' && styles.optionCardActivePurple]}
                  onPress={() => setBudgetTier('hifi-gourmet')}
                  activeOpacity={0.85}
                >
                  <View style={[styles.optionIcon, { backgroundColor: Colors.purpleLight }]}>
                    <Text style={{ fontSize: 22 }}>✨</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleBadgeRow}>
                      <Text style={styles.optionTitle}>Hi-Fi Gourmet</Text>
                      <View style={[styles.tierTag, { backgroundColor: Colors.purple }]}>
                        <Text style={styles.tierTagText}>₹750+ / day</Text>
                      </View>
                    </View>
                    <Text style={styles.optionDesc}>
                      Exotic superfoods (Dragon fruit açaí bowl, Sourdough avocado & poached eggs, Truffle pasta).
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 4: Kitchen Setup & Instant Calculation Result */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.primaryLight }]}>
                <Utensils size={28} color={Colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Your Dorm Kitchen Setup</Text>
              <Text style={styles.stepSub}>
                What cooking equipment do you have access to?
              </Text>

              {/* Kitchen Setup Pills */}
              <View style={styles.kitchenRow}>
                <TouchableOpacity
                  style={[
                    styles.kitchenCard,
                    kitchenSetup === 'single-pan' && styles.kitchenCardActive
                  ]}
                  onPress={() => setKitchenSetup('single-pan')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.kitchenEmoji}>🍳</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.kitchenTitle}>Single Pan / Induction</Text>
                    <Text style={styles.kitchenDesc}>Most student PGs & shared flats</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.kitchenCard,
                    kitchenSetup === 'kettle-only' && styles.kitchenCardActive
                  ]}
                  onPress={() => setKitchenSetup('kettle-only')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.kitchenEmoji}>⚡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.kitchenTitle}>Electric Kettle Only</Text>
                    <Text style={styles.kitchenDesc}>Hostel dorm room friendly</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.kitchenCard,
                    kitchenSetup === 'full-kitchen' && styles.kitchenCardActive
                  ]}
                  onPress={() => setKitchenSetup('full-kitchen')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.kitchenEmoji}>👨‍🍳</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.kitchenTitle}>Full Kitchen</Text>
                    <Text style={styles.kitchenDesc}>Stove, blender, oven available</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Instant Calculated Target Banner */}
              <View style={styles.resultsDashboard}>
                <View style={styles.resultHeader}>
                  <Award size={18} color={Colors.emerald} />
                  <Text style={styles.resultTitle}>Your Personalized Daily Targets</Text>
                </View>

                <View style={styles.resultMetricsGrid}>
                  <View style={styles.resultMetric}>
                    <Text style={styles.resultValue}>{targets.calories} <Text style={styles.resultUnit}>kcal</Text></Text>
                    <Text style={styles.resultLabel}>Target Daily Calories</Text>
                  </View>
                  <View style={styles.resultDivider} />
                  <View style={styles.resultMetric}>
                    <Text style={[styles.resultValue, { color: Colors.emerald }]}>
                      {targets.protein} <Text style={styles.resultUnit}>g</Text>
                    </Text>
                    <Text style={styles.resultLabel}>Target Daily Protein</Text>
                  </View>
                </View>

                <Text style={styles.resultNote}>
                  🎯 Tailored for: {weightKg}kg • {goal === 'weight-gain' ? 'Muscle Gain Surplus' : goal === 'weight-loss' ? 'Fat Loss Deficit' : 'High Protein Fuel'} • {budgetTier === 'broke-student' ? 'Student Budget (<₹150/d)' : budgetTier === 'balanced' ? 'Balanced (₹300/d)' : 'Hi-Fi Gourmet'}
                </Text>
              </View>
            </View>
          )}

          {/* Bottom Action Button */}
          <View style={styles.actionRow}>
            {step < 4 ? (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={() => setStep(step + 1)}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>Continue</Text>
                <ChevronRight size={18} color="#FFFFFF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.finishBtn}
                onPress={handleFinish}
                activeOpacity={0.85}
              >
                <Text style={styles.finishBtnText}>Let's Start Cooking! 🚀</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 20 }} />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  backText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8
  },
  dot: {
    width: 24,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 32
  },
  dotDone: {
    backgroundColor: Colors.emerald
  },
  skipBtn: {
    padding: 6
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600'
  },
  scrollContent: {
    padding: 20
  },
  stepContainer: {
    alignItems: 'center'
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center'
  },
  stepSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 10
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
    ...Colors.shadow
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 8
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  stepAdjustBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  adjustText: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: '800',
    lineHeight: 24
  },
  bigInput: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textPrimary,
    textAlign: 'center',
    minWidth: 90
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  mediumInput: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 4
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    marginTop: 8
  },
  genderBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border
  },
  genderBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  genderBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  genderBtnTextActive: {
    color: Colors.primary,
    fontWeight: '800'
  },
  optionsList: {
    width: '100%',
    gap: 12
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 14,
    ...Colors.shadow
  },
  optionCardActivePrimary: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  optionCardActiveGreen: {
    borderColor: Colors.emerald,
    backgroundColor: Colors.emeraldLight
  },
  optionCardActiveAmber: {
    borderColor: Colors.amber,
    backgroundColor: Colors.amberLight
  },
  optionCardActivePurple: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 17
  },
  tierTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  kitchenRow: {
    width: '100%',
    gap: 10,
    marginBottom: 20
  },
  kitchenCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...Colors.shadow
  },
  kitchenCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight
  },
  kitchenEmoji: {
    fontSize: 24
  },
  kitchenTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  kitchenDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1
  },
  resultsDashboard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.emeraldBorder,
    ...Colors.shadow
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  resultMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center'
  },
  resultMetric: {
    alignItems: 'center'
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary
  },
  resultUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary
  },
  resultLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600'
  },
  resultDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border
  },
  resultNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 12,
    lineHeight: 16,
    textAlign: 'center'
  },
  actionRow: {
    marginTop: 20,
    width: '100%'
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 6,
    ...Colors.shadow
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  finishBtn: {
    backgroundColor: Colors.emerald,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    ...Colors.shadow
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  }
});
