import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native';
import { Header } from './src/components/Header';
import { ExploreScreen } from './src/screens/ExploreScreen';
import { VibePlannerScreen } from './src/screens/VibePlannerScreen';
import { QuickBasketScreen } from './src/screens/QuickBasketScreen';
import { SavedScreen } from './src/screens/SavedScreen';
import { RecipeDetailModal } from './src/screens/RecipeDetailModal';
import { OnboardingModal, UserProfile } from './src/components/OnboardingModal';
import { Recipe } from './src/types';
import { Colors } from './src/theme/colors';
import {
  Compass,
  CalendarDays,
  ShoppingBag,
  Bookmark
} from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'planner' | 'basket' | 'saved'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([
    'hifi-acai-dragonfruit-bowl',
    'broke-masala-oats-eggs',
    'broke-gym-maggi-upgrade'
  ]);

  // Student Profile state (Age, Body Weight, Goals, Budget)
  const [userProfile, setUserProfile] = useState<UserProfile | null>({
    age: 21,
    weightKg: 68,
    heightCm: 174,
    gender: 'male',
    goal: 'weight-gain',
    budgetTier: 'broke-student',
    kitchenSetup: 'single-pan',
    calculatedCalories: 2450,
    calculatedProtein: 136,
    completed: true
  });

  // Modal to set up or edit profile
  const [showOnboarding, setShowOnboarding] = useState(false);

  const toggleSaveRecipe = (recipeId: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Main Container - responsive layout on web/desktop with max width for mobile feel */}
      <View style={[styles.appWrapper, isWeb && styles.webWrapper]}>
        {/* Top Header with City & User Goal Stats */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCity="Bengaluru (Koramangala)"
          userProfile={userProfile}
          onOpenProfile={() => setShowOnboarding(true)}
        />

        {/* Tab View Content */}
        <View style={styles.body}>
          {activeTab === 'explore' && (
            <ExploreScreen
              searchQuery={searchQuery}
              onSelectRecipe={(r) => setSelectedRecipe(r)}
              savedRecipeIds={savedRecipeIds}
              onToggleSave={toggleSaveRecipe}
            />
          )}

          {activeTab === 'planner' && (
            <VibePlannerScreen
              onSelectRecipe={(r) => setSelectedRecipe(r)}
            />
          )}

          {activeTab === 'basket' && <QuickBasketScreen />}

          {activeTab === 'saved' && (
            <SavedScreen
              savedRecipeIds={savedRecipeIds}
              onSelectRecipe={(r) => setSelectedRecipe(r)}
              onToggleSave={toggleSaveRecipe}
            />
          )}
        </View>

        {/* Gourmet Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navTab, activeTab === 'explore' && styles.navTabActive]}
            onPress={() => setActiveTab('explore')}
            activeOpacity={0.75}
          >
            <Compass
              size={22}
              color={activeTab === 'explore' ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'explore' && styles.navLabelActive
              ]}
            >
              Explore
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'planner' && styles.navTabActivePlanner]}
            onPress={() => setActiveTab('planner')}
            activeOpacity={0.75}
          >
            <CalendarDays
              size={22}
              color={activeTab === 'planner' ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'planner' && { color: Colors.primary, fontWeight: '800' }
              ]}
            >
              Meal Plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'basket' && styles.navTabActiveBasket]}
            onPress={() => setActiveTab('basket')}
            activeOpacity={0.75}
          >
            <ShoppingBag
              size={22}
              color={activeTab === 'basket' ? Colors.emerald : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'basket' && { color: Colors.emerald, fontWeight: '800' }
              ]}
            >
              Quick Mart
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navTab, activeTab === 'saved' && styles.navTabActiveSaved]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.75}
          >
            <Bookmark
              size={22}
              color={activeTab === 'saved' ? Colors.amber : Colors.textMuted}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'saved' && { color: Colors.amber, fontWeight: '800' }
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Detail Modal */}
        <RecipeDetailModal
          recipe={selectedRecipe}
          visible={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isSaved={selectedRecipe ? savedRecipeIds.includes(selectedRecipe.id) : false}
          onToggleSave={() => {
            if (selectedRecipe) toggleSaveRecipe(selectedRecipe.id);
          }}
        />

        {/* Student Onboarding & Body Stat Setup (No Login Portal) */}
        <OnboardingModal
          visible={showOnboarding}
          initialProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setShowOnboarding(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5EFE6'
  },
  appWrapper: {
    flex: 1,
    backgroundColor: Colors.background
  },
  webWrapper: {
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: Colors.border,
    borderRightColor: Colors.border,
    backgroundColor: Colors.background,
    ...Colors.shadowLg
  },
  body: {
    flex: 1
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    ...Colors.shadow
  },
  navTab: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12
  },
  navTabActive: {
    backgroundColor: Colors.primaryLight
  },
  navTabActivePlanner: {
    backgroundColor: Colors.primaryLight
  },
  navTabActiveBasket: {
    backgroundColor: Colors.emeraldLight
  },
  navTabActiveSaved: {
    backgroundColor: Colors.amberLight
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '800'
  }
});
