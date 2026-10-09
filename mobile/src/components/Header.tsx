import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Search, MapPin, Zap, User, Target, Sparkles } from 'lucide-react-native';
import { UserProfile } from './OnboardingModal';
import { Colors } from '../theme/colors';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCity?: string;
  userProfile?: UserProfile | null;
  onOpenProfile?: () => void;
  totalRecipeCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCity = 'Bengaluru (Koramangala)',
  userProfile,
  onOpenProfile,
  totalRecipeCount = 1060
}) => {
  const quickSearchTags = [
    'Onion (Kanda)',
    'Potato (Aloo)',
    'Paneer',
    'Maggi',
    'Eggs',
    'Açaí Bowl',
    'Poha',
    'Dal Khichdi'
  ];

  return (
    <View style={styles.container}>
      {/* Top Location & Delivery Bar */}
      <View style={styles.topRow}>
        <View style={styles.locationPill}>
          <MapPin size={13} color={Colors.primary} />
          <Text style={styles.locationCity}>{selectedCity}</Text>
        </View>

        <View style={styles.quickCommerceBadge}>
          <Zap size={12} color="#F59E0B" />
          <Text style={styles.quickCommerceText}>⚡ 10m Zepto • 12m Blinkit</Text>
        </View>
      </View>

      {/* Main Brand Title & Profile Pill */}
      <View style={styles.brandRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.titleWithBadge}>
            <Text style={styles.appTitle}>🥑 BiteCraft</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{totalRecipeCount}+ Recipes</Text>
            </View>
          </View>
          <Text style={styles.tagline}>
            Smart recipes for student budgets & fitness goals
          </Text>
        </View>

        {/* User Stats Card / Button */}
        {onOpenProfile && (
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={onOpenProfile}
            activeOpacity={0.8}
          >
            <View style={styles.profileAvatar}>
              <User size={15} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.profileWeight}>
                {userProfile ? `${userProfile.weightKg} kg` : 'My Stats'}
              </Text>
              <Text style={styles.profileTarget}>
                {userProfile ? `${userProfile.calculatedProtein}g Prot` : 'Set Goals'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Daily Target Ribbon if profile is set */}
      {userProfile && (
        <TouchableOpacity
          style={styles.targetRibbon}
          onPress={onOpenProfile}
          activeOpacity={0.85}
        >
          <View style={styles.targetIconBg}>
            <Target size={13} color={Colors.emerald} />
          </View>
          <Text style={styles.targetRibbonText}>
            Target:{' '}
            <Text style={styles.targetBold}>{userProfile.calculatedCalories} kcal</Text> •{' '}
            <Text style={styles.targetBold}>{userProfile.calculatedProtein}g Protein</Text> •{' '}
            <Text style={styles.targetBold}>
              {userProfile.budgetTier === 'broke-student'
                ? '💸 Student Budget (<₹150/d)'
                : userProfile.budgetTier === 'balanced'
                ? '⚖️ Balanced'
                : '✨ Hi-Fi Gourmet'}
            </Text>
          </Text>
          <Text style={styles.editStatsHint}>Edit</Text>
        </TouchableOpacity>
      )}

      {/* Modern Search Bar */}
      <View style={styles.searchBox}>
        <Search size={18} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes or ingredients: 'kanda', 'aloo', 'paneer'..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Popular Quick Search Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tagChipsScroll}
      >
        <Text style={styles.popularLabel}>POPULAR:</Text>
        {quickSearchTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagChip,
              searchQuery.toLowerCase() === tag.toLowerCase() && styles.tagChipActive
            ]}
            onPress={() => onSearchChange(tag.includes('(') ? tag.split('(')[1].replace(')', '').trim() : tag)}
          >
            <Text
              style={[
                styles.tagChipText,
                searchQuery.toLowerCase() === tag.toLowerCase() && styles.tagChipTextActive
              ]}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Colors.shadow
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5
  },
  locationCity: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  quickCommerceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4
  },
  quickCommerceText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.6
  },
  countBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary
  },
  tagline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2
  },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileWeight: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  profileTarget: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700'
  },
  targetRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emeraldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.emeraldBorder,
    marginBottom: 8,
    gap: 6
  },
  targetIconBg: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  targetRibbonText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1
  },
  targetBold: {
    fontWeight: '800',
    color: '#047857'
  },
  editStatsHint: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '800'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border
  },
  searchIcon: {
    marginRight: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
    paddingVertical: 0
  },
  clearBtn: {
    padding: 4
  },
  clearText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700'
  },
  tagChipsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    gap: 6
  },
  popularLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginRight: 2
  },
  tagChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border
  },
  tagChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  tagChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600'
  },
  tagChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
