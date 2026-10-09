import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/shell/main_shell.dart';
import '../../features/explore/screens/explore_screen.dart';
import '../../features/chat/screens/chef_chat_screen.dart';
import '../../features/planner/screens/meal_planner_screen.dart';
import '../../features/quickmart/screens/quick_mart_screen.dart';
import '../../features/saved/screens/saved_screen.dart';
import '../../features/detail/screens/recipe_detail_screen.dart';
import '../../features/onboarding/screens/onboarding_screen.dart';
import '../../features/dev/gallery_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/explore',
  routes: [
    // Shell routes with persistent FloatingPillNav
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) {
        final location = state.uri.path;
        int index = 0;
        if (location.startsWith('/chat')) {
          index = 1;
        } else if (location.startsWith('/planner')) {
          index = 2;
        } else if (location.startsWith('/quick-mart')) {
          index = 3;
        } else if (location.startsWith('/saved')) {
          index = 4;
        }

        return MainShell(
          currentIndex: index,
          onIndexChanged: (newIdx) {
            switch (newIdx) {
              case 0:
                context.go('/explore');
                break;
              case 1:
                context.go('/chat');
                break;
              case 2:
                context.go('/planner');
                break;
              case 3:
                context.go('/quick-mart');
                break;
              case 4:
                context.go('/saved');
                break;
            }
          },
          child: child,
        );
      },
      routes: [
        GoRoute(
          path: '/explore',
          name: 'explore',
          pageBuilder: (context, state) => const NoTransitionPage(child: ExploreScreen()),
        ),
        GoRoute(
          path: '/chat',
          name: 'chat',
          pageBuilder: (context, state) => const NoTransitionPage(child: ChefChatScreen()),
        ),
        GoRoute(
          path: '/planner',
          name: 'planner',
          pageBuilder: (context, state) => const NoTransitionPage(child: MealPlannerScreen()),
        ),
        GoRoute(
          path: '/quick-mart',
          name: 'quick-mart',
          pageBuilder: (context, state) {
            final idStr = state.uri.queryParameters['recipeId'];
            final rId = idStr != null ? int.tryParse(idStr) : null;
            return NoTransitionPage(child: QuickMartScreen(recipeId: rId));
          },
        ),
        GoRoute(
          path: '/saved',
          name: 'saved',
          pageBuilder: (context, state) => const NoTransitionPage(child: SavedScreen()),
        ),
      ],
    ),

    // Full screen routes
    GoRoute(
      path: '/recipe/:id',
      name: 'recipe-detail',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) {
        final id = int.tryParse(state.pathParameters['id'] ?? '1') ?? 1;
        return RecipeDetailScreen(recipeId: id);
      },
    ),
    GoRoute(
      path: '/onboarding',
      name: 'onboarding',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const OnboardingScreen(),
    ),
    GoRoute(
      path: '/dev/gallery',
      name: 'gallery',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const DevGalleryScreen(),
    ),
  ],
);
