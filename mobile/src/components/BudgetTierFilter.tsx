import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BudgetTier } from '../types';
import { Colors } from '../theme/colors';

interface BudgetTierFilterProps {
  selectedTier: BudgetTier;
  onSelectTier: (tier: BudgetTier) => void;
}

export const BudgetTierFilter: React.FC<BudgetTierFilterProps> = ({
  selectedTier,
  onSelectTier
}) => {
  const tiers: {
    id: BudgetTier;
    emoji: string;
    label: string;
    badge: string;
    activeBg: string;
    activeText: string;
    activeBorder: string;
  }[] = [
    {
      id: 'all',
      emoji: '🌟',
      label: 'All Budgets',
      badge: '1060+',
      activeBg: Colors.textPrimary,
      activeText: '#FFFFFF',
      activeBorder: Colors.textPrimary
    },
    {
      id: 'broke-student',
      emoji: '💸',
      label: 'Broke Student',
      badge: '< ₹60/meal',
      activeBg: '#059669',
      activeText: '#FFFFFF',
      activeBorder: '#059669'
    },
    {
      id: 'balanced',
      emoji: '⚖️',
      label: 'Balanced',
      badge: '₹60 - 150',
      activeBg: '#D97706',
      activeText: '#FFFFFF',
      activeBorder: '#D97706'
    },
    {
      id: 'hifi-gourmet',
      emoji: '✨',
      label: 'Hi-Fi Gourmet',
      badge: '₹150+',
      activeBg: '#7C3AED',
      activeText: '#FFFFFF',
      activeBorder: '#7C3AED'
    }
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.sectionLabel}>BUDGET PER MEAL</Text>
        <Text style={styles.sectionSub}>Student friendly to gourmet luxury</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tiers.map((t) => {
          const isActive = selectedTier === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[
                styles.tierCard,
                isActive && {
                  backgroundColor: t.activeBg,
                  borderColor: t.activeBorder,
                  ...Colors.shadow
                }
              ]}
              onPress={() => onSelectTier(t.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.tierEmoji}>{t.emoji}</Text>
              <View>
                <Text
                  style={[
                    styles.tierTitle,
                    isActive && { color: '#FFFFFF', fontWeight: '800' }
                  ]}
                >
                  {t.label}
                </Text>
                <Text
                  style={[
                    styles.tierBadge,
                    isActive ? { color: '#F3F4F6' } : { color: Colors.textSecondary }
                  ]}
                >
                  {t.badge}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    backgroundColor: Colors.background
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 0.8
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textSecondary
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row'
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
    ...Colors.shadow
  },
  tierEmoji: {
    fontSize: 18
  },
  tierTitle: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '700'
  },
  tierBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1
  }
});
