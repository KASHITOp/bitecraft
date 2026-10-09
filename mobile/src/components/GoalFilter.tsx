import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FitnessGoal } from '../types';
import { TrendingUp, Flame, Zap, Clock, Compass } from 'lucide-react-native';
import { Colors } from '../theme/colors';

interface GoalFilterProps {
  selectedGoal: FitnessGoal;
  onSelectGoal: (goal: FitnessGoal) => void;
}

export const GoalFilter: React.FC<GoalFilterProps> = ({
  selectedGoal,
  onSelectGoal
}) => {
  const goals: {
    id: FitnessGoal;
    label: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    accentColor: string;
    lightBg: string;
  }[] = [
    { id: 'all', label: 'All Goals', icon: Compass, accentColor: Colors.textPrimary, lightBg: Colors.surfaceSubtle },
    { id: 'weight-gain', label: 'Weight / Muscle Gain', icon: TrendingUp, accentColor: '#059669', lightBg: '#E8F8F2' },
    { id: 'weight-loss', label: 'Fat Shred Deficit', icon: Flame, accentColor: '#E11D48', lightBg: '#FFE4E6' },
    { id: 'high-protein', label: 'Gym Beast (High Protein)', icon: Zap, accentColor: '#D97706', lightBg: '#FEF3C7' },
    { id: 'exam-quick', label: '15-Min Fast & Easy', icon: Clock, accentColor: Colors.primary, lightBg: Colors.primaryLight }
  ];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>FITNESS & HEALTH GOAL</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {goals.map((g) => {
          const isActive = selectedGoal === g.id;
          const IconComp = g.icon;
          return (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.goalCard,
                isActive
                  ? {
                      backgroundColor: g.accentColor,
                      borderColor: g.accentColor,
                      ...Colors.shadow
                    }
                  : {
                      backgroundColor: Colors.surface,
                      borderColor: Colors.border
                    }
              ]}
              onPress={() => onSelectGoal(g.id)}
              activeOpacity={0.8}
            >
              <IconComp
                size={14}
                color={isActive ? '#FFFFFF' : g.accentColor}
              />
              <Text
                style={[
                  styles.goalLabel,
                  isActive
                    ? { color: '#FFFFFF', fontWeight: '800' }
                    : { color: Colors.textPrimary }
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 6,
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
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row'
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 6
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '600'
  }
});
