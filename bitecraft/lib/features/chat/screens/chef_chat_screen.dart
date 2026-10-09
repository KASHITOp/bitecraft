import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/ingredient.dart';
import '../../../core/widgets/bite_card.dart';
import '../../../core/widgets/shimmer_skeleton.dart';
import '../../../core/widgets/recipe_image_view.dart';
import '../../../core/widgets/tier_badge.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/providers/pantry_provider.dart';
import '../../../core/providers/chat_engine_provider.dart';
import '../../../core/services/suggestion_engine.dart';

final allIngredientsListProvider = FutureProvider<List<Ingredient>>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  final map = await repo.getAllIngredients();
  return map.values.toList();
});

class ChefChatScreen extends ConsumerStatefulWidget {
  const ChefChatScreen({super.key});

  @override
  ConsumerState<ChefChatScreen> createState() => _ChefChatScreenState();
}

class _ChefChatScreenState extends ConsumerState<ChefChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChefMessage> _messages = [];
  bool _isLoading = false;
  bool _showPantryPicker = false;
  String _pantrySearchQuery = '';

  @override
  void initState() {
    super.initState();
    // Warm greeting
    _messages.add(
      ChefMessage(
        isUser: false,
        text: 'Hey! I\'m your BiteCraft Chef AI 🥑\nGot random ingredients in your hostel room or fridge? Pick them in the pantry drawer above or tell me what you have (e.g. "onion + eggs" or "bread & sauces"), and I\'ll raid our 10,000 recipe database!',
        timestamp: DateTime.now(),
      ),
    );
  }

  @override
  void dispose() {
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage(String text) async {
    final query = text.trim();
    if (query.isEmpty || _isLoading) return;

    HapticFeedback.lightImpact();
    _msgController.clear();

    setState(() {
      _messages.add(ChefMessage(isUser: true, text: query, timestamp: DateTime.now()));
      _isLoading = true;
    });
    _scrollToBottom();

    final engine = ref.read(suggestionEngineProvider);
    final pantryIds = ref.read(pantryProvider);

    try {
      final reply = await engine.getSuggestion(
        message: query,
        pantryIds: pantryIds,
        history: _messages,
      );

      if (mounted) {
        setState(() {
          _messages.add(ChefMessage(
            isUser: false,
            text: reply.text,
            recipes: reply.recipes,
            timestamp: DateTime.now(),
          ));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(ChefMessage(
            isUser: false,
            text: 'Ran into a quick dark-store glitch, but you can always browse our offline student recipes directly!',
            timestamp: DateTime.now(),
          ));
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final pantryIds = ref.watch(pantryProvider);
    final allIngsAsync = ref.watch(allIngredientsListProvider);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('🥑 ', style: TextStyle(fontSize: 20)),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Chef Chat', style: AppTypography.h3(isDark).copyWith(fontSize: 18)),
                Text('Fridge Raid Assistant', style: AppTypography.bodySmall(isDark)),
              ],
            ),
          ],
        ),
        actions: [
          // Pantry Toggle Button
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: FilterChip(
              selected: _showPantryPicker,
              avatar: const Text('🧺', style: TextStyle(fontSize: 12)),
              label: Text('Pantry (${pantryIds.length})'),
              labelStyle: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: _showPantryPicker ? Colors.white : (isDark ? AppColors.darkInk : AppColors.lightInk),
              ),
              selectedColor: AppColors.primary,
              onSelected: (val) {
                HapticFeedback.selectionClick();
                setState(() => _showPantryPicker = val);
              },
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Expandable Pantry Picker Drawer
            if (_showPantryPicker)
              _buildPantryDrawer(context, isDark, pantryIds, allIngsAsync),

            // Chat Message List
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                itemCount: _messages.length + (_isLoading ? 1 : 0),
                itemBuilder: (context, index) {
                  if (index == _messages.length && _isLoading) {
                    return _buildLoadingBubble(isDark);
                  }
                  final msg = _messages[index];
                  return _buildMessageBubble(context, isDark, msg);
                },
              ),
            ),

            // Quick Suggestion Chips
            _buildQuickChips(isDark),

            // Bottom Message Input
            _buildInputBar(isDark),
          ],
        ),
      ),
    );
  }

  Widget _buildPantryDrawer(
    BuildContext context,
    bool isDark,
    List<int> pantryIds,
    AsyncValue<List<Ingredient>> allIngsAsync,
  ) {
    return Container(
      constraints: const BoxConstraints(maxHeight: 220),
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
        border: Border(
          bottom: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Your Kitchen Pantry Items:', style: AppTypography.labelMedium(isDark)),
              if (pantryIds.isNotEmpty)
                GestureDetector(
                  onTap: () => ref.read(pantryProvider.notifier).clearPantry(),
                  child: Text('Clear All', style: TextStyle(fontSize: 11, color: AppColors.primary, fontWeight: FontWeight.w700)),
                ),
            ],
          ),
          const SizedBox(height: 8),
          // Search filter for ingredients
          SizedBox(
            height: 36,
            child: TextField(
              onChanged: (val) => setState(() => _pantrySearchQuery = val),
              decoration: InputDecoration(
                hintText: 'Filter ingredients (e.g. "kanda", "aloo", "anda")...',
                hintStyle: const TextStyle(fontSize: 12),
                contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                prefixIcon: const Icon(Icons.search_rounded, size: 16),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: allIngsAsync.when(
              data: (allIngs) {
                final filtered = allIngs.where((i) => i.matches(_pantrySearchQuery)).toList();
                return SingleChildScrollView(
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: filtered.map((ing) {
                      final isSelected = pantryIds.contains(ing.id);
                      final aliasText = ing.aliases.isNotEmpty ? ' (${ing.aliases.first})' : '';
                      return FilterChip(
                        selected: isSelected,
                        label: Text('${ing.name}$aliasText', style: const TextStyle(fontSize: 11)),
                        selectedColor: AppColors.primary,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : (isDark ? AppColors.darkInk : AppColors.lightInk),
                          fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                        ),
                        onSelected: (_) {
                          HapticFeedback.selectionClick();
                          ref.read(pantryProvider.notifier).toggleIngredient(ing.id);
                        },
                      );
                    }).toList(),
                  ),
                );
              },
              loading: () => const Center(child: CircularProgressIndicator(strokeWidth: 2)),
              error: (_, __) => const Text('Error loading ingredients'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(BuildContext context, bool isDark, ChefMessage msg) {
    if (msg.isUser) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          margin: const EdgeInsets.only(bottom: 12, left: 48),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
              bottomLeft: Radius.circular(20),
              bottomRight: Radius.circular(4),
            ),
            boxShadow: AppColors.glowShadow(AppColors.primary),
          ),
          child: Text(
            msg.text,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      );
    }

    // Chef message on left
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14, right: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(20),
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
                border: Border.all(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  width: 1,
                ),
                boxShadow: AppColors.softShadow(isDark),
              ),
              child: Text(
                msg.text,
                style: AppTypography.bodyMedium(isDark).copyWith(
                  color: isDark ? AppColors.darkInk : AppColors.lightInk,
                ),
              ),
            ),

            // Inline Recipe Cards Recommendations
            if (msg.recipes.isNotEmpty) ...[
              const SizedBox(height: 10),
              SizedBox(
                height: 200,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: msg.recipes.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 10),
                  itemBuilder: (context, idx) {
                    final recipe = msg.recipes[idx];
                    return SizedBox(
                      width: 170,
                      child: BiteCard(
                        padding: EdgeInsets.zero,
                        onTap: () => context.push('/recipe/${recipe.id}'),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            RecipeImageView(
                              height: 90,
                              width: double.infinity,
                              imageUrl: recipe.imageUrl,
                              emoji: recipe.emoji,
                              gradientSeed: recipe.gradientSeed,
                              borderRadius: 18,
                            ),
                            Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  TierBadge(
                                    tier: budgetTierFromString(recipe.budgetTier),
                                    compact: true,
                                    showPrice: false,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    recipe.title,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTypography.labelSmall(isDark).copyWith(fontWeight: FontWeight.w700),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        '₹${recipe.costPerServing.toStringAsFixed(0)}',
                                        style: TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w800,
                                          color: AppColors.primary,
                                        ),
                                      ),
                                      Text('${recipe.minutes}m', style: AppTypography.bodySmall(isDark)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingBubble(bool isDark) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 14),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const ShimmerBox(width: 12, height: 12, borderRadius: 6),
            const SizedBox(width: 8),
            const ShimmerBox(width: 12, height: 12, borderRadius: 6),
            const SizedBox(width: 8),
            const ShimmerBox(width: 12, height: 12, borderRadius: 6),
            const SizedBox(width: 12),
            Text('Chef AI searching recipes...', style: AppTypography.bodySmall(isDark)),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickChips(bool isDark) {
    final chips = [
      '🧅 Onion + eggs?',
      '🍞 Bread, butter and sauces',
      '⚡ High protein under ₹60',
      '⏱️ 15-min hostel dinner',
    ];

    return Container(
      height: 38,
      margin: const EdgeInsets.only(bottom: 8),
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        scrollDirection: Axis.horizontal,
        itemCount: chips.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, idx) {
          final text = chips[idx];
          return ActionChip(
            label: Text(text, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600)),
            backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            side: BorderSide(color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
            onPressed: () => _sendMessage(text),
          );
        },
      ),
    );
  }

  Widget _buildInputBar(bool isDark) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 6, 16, 80),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkBg : AppColors.lightBg,
        border: Border(
          top: BorderSide(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _msgController,
              onSubmitted: _sendMessage,
              decoration: InputDecoration(
                hintText: 'Ask Chef AI (e.g. "onion + eggs")...',
                hintStyle: TextStyle(
                  fontSize: 13,
                  color: isDark ? AppColors.darkInkTertiary : AppColors.lightInkTertiary,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: 10),
          CircleAvatar(
            backgroundColor: AppColors.primary,
            radius: 24,
            child: IconButton(
              icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              onPressed: () => _sendMessage(_msgController.text),
            ),
          ),
        ],
      ),
    );
  }
}
