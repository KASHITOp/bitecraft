import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/models/ingredient.dart';
import '../../../core/providers/database_provider.dart';
import '../../../core/providers/pantry_provider.dart';
import '../providers/pantry_screen_providers.dart';

class AddPantryItemSheet extends ConsumerStatefulWidget {
  final List<Ingredient>? initialIngredients;

  const AddPantryItemSheet({
    super.key,
    this.initialIngredients,
  });

  @override
  ConsumerState<AddPantryItemSheet> createState() => _AddPantryItemSheetState();
}

class _AddPantryItemSheetState extends ConsumerState<AddPantryItemSheet> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _quantityController = TextEditingController(text: '500');

  Ingredient? _selectedIngredient;
  int _selectedExpiryDays = 7;
  DateTime _expiryDate = DateTime.now().add(const Duration(days: 7));
  bool _isCustomDate = false;

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _quantityController.dispose();
    super.dispose();
  }

  int _calculateSuggestedExpiryDays(Ingredient ingredient) {
    final lowerName = ingredient.name.toLowerCase();
    final lowerCat = ingredient.category.toLowerCase();

    // Auto-suggest 3 days for paneer, dairy, tofu
    if (lowerName.contains('paneer') ||
        lowerName.contains('tofu') ||
        lowerName.contains('milk') ||
        lowerName.contains('curd') ||
        lowerName.contains('yogurt') ||
        lowerCat.contains('dairy')) {
      return 3;
    }

    // Auto-suggest 7 days for onion, potato, garlic, root vegetables
    if (lowerName.contains('onion') ||
        lowerName.contains('kanda') ||
        lowerName.contains('pyaz') ||
        lowerName.contains('potato') ||
        lowerName.contains('aloo') ||
        lowerName.contains('batata') ||
        lowerName.contains('garlic') ||
        lowerName.contains('ginger')) {
      return 7;
    }

    // Bread, eggs, tomatoes: 4-5 days
    if (lowerName.contains('bread') ||
        lowerName.contains('egg') ||
        lowerName.contains('tomato') ||
        lowerName.contains('tamatar')) {
      return 4;
    }

    // Pulses & grains: 30 days
    if (lowerCat.contains('pulses') || lowerCat.contains('grains')) {
      return 30;
    }

    return 7;
  }

  void _onIngredientSelected(Ingredient ingredient) {
    final suggestedDays = _calculateSuggestedExpiryDays(ingredient);
    setState(() {
      _selectedIngredient = ingredient;
      _selectedExpiryDays = suggestedDays;
      _isCustomDate = false;
      _expiryDate = DateTime.now().add(Duration(days: suggestedDays));
    });
    HapticFeedback.selectionClick();
  }

  Future<void> _pickCustomDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _expiryDate,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      builder: (context, child) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Theme(
          data: isDark
              ? ThemeData.dark().copyWith(
                  colorScheme: const ColorScheme.dark(
                    primary: AppColors.primary,
                    surface: AppColors.darkSurface,
                  ),
                )
              : ThemeData.light().copyWith(
                  colorScheme: const ColorScheme.light(
                    primary: AppColors.primary,
                  ),
                ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _expiryDate = picked;
        _isCustomDate = true;
        _selectedExpiryDays = picked.difference(DateTime.now()).inDays.clamp(1, 365);
      });
    }
  }

  Future<void> _submit() async {
    if (_selectedIngredient == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an ingredient first')),
      );
      return;
    }

    final qty = double.tryParse(_quantityController.text.trim()) ?? 500.0;
    final dao = ref.read(pantryDaoProvider);

    await dao.createAndAddItem(
      deviceId: 'default-device',
      ingredientId: _selectedIngredient!.id,
      quantityGrams: qty,
      purchaseDate: DateTime.now(),
      expiryDate: _expiryDate,
    );

    // Also update riverpod explored pantry store
    final pantryNotifier = ref.read(pantryProvider.notifier);
    final currentIds = ref.read(pantryProvider);
    if (!currentIds.contains(_selectedIngredient!.id)) {
      await pantryNotifier.toggleIngredient(_selectedIngredient!.id);
    }

    if (mounted) {
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Added ${_selectedIngredient!.name} to Smart Pantry!'),
          backgroundColor: AppColors.primary,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final allIngsAsync = ref.watch(allIngredientsListProvider);
    final ingredientsList = widget.initialIngredients ?? allIngsAsync.value ?? [];

    final query = _searchController.text.trim();
    final filteredIngredients = query.isEmpty
        ? ingredientsList.take(15).toList()
        : ingredientsList.where((ing) => ing.matches(query)).toList();

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 14,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag Handle
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Header Title
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Add to Smart Pantry', style: AppTypography.h3(isDark).copyWith(fontSize: 20)),
                    Text('Track stock & get smart expiry alerts', style: AppTypography.bodySmall(isDark)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close_rounded, size: 22),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Dual-Name Alias Search Bar
            TextField(
              key: const Key('pantry_search_field'),
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search "kanda", "aloo", "paneer"...',
                prefixIcon: const Icon(Icons.search_rounded, color: AppColors.primary, size: 20),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, size: 18),
                        onPressed: () => _searchController.clear(),
                      )
                    : null,
              ),
            ),
            const SizedBox(height: 12),

            // Search Results / Suggested Ingredients List
            if (_selectedIngredient == null) ...[
              Text(
                query.isNotEmpty
                    ? 'Search Results (${filteredIngredients.length})'
                    : 'Suggested Kitchen Essentials',
                style: AppTypography.labelSmall(isDark),
              ),
              const SizedBox(height: 8),
              if (filteredIngredients.isEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  child: Center(
                    child: Text(
                      'No ingredients matching "$query"',
                      style: AppTypography.bodySmall(isDark),
                    ),
                  ),
                )
              else
                SizedBox(
                  height: 150,
                  child: ListView.separated(
                    itemCount: filteredIngredients.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 6),
                    itemBuilder: (context, index) {
                      final ing = filteredIngredients[index];
                      return Material(
                        color: Colors.transparent,
                        child: InkWell(
                          borderRadius: BorderRadius.circular(12),
                          onTap: () => _onIngredientSelected(ing),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurfaceSecondary : AppColors.lightSurfaceSecondary,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                                width: 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Text(
                                  _getIngredientEmoji(ing.name),
                                  style: const TextStyle(fontSize: 20),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        ing.name,
                                        style: TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 14,
                                          color: isDark ? AppColors.darkInk : AppColors.lightInk,
                                        ),
                                      ),
                                      if (ing.aliases.isNotEmpty)
                                        Text(
                                          'Also known as: ${ing.aliases.join(", ")}',
                                          style: TextStyle(
                                            fontSize: 11,
                                            color: isDark ? AppColors.darkInkSecondary : AppColors.lightInkSecondary,
                                          ),
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    'Select',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.primary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
            ] else ...[
              // Selected Ingredient Pill Card
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary.withOpacity(0.3), width: 1.2),
                ),
                child: Row(
                  children: [
                    Text(_getIngredientEmoji(_selectedIngredient!.name), style: const TextStyle(fontSize: 26)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _selectedIngredient!.name,
                            style: AppTypography.h4(isDark).copyWith(fontSize: 16),
                          ),
                          if (_selectedIngredient!.aliases.isNotEmpty)
                            Text(
                              _selectedIngredient!.aliases.join(" • "),
                              style: AppTypography.bodySmall(isDark).copyWith(fontSize: 11),
                            ),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _selectedIngredient = null;
                        });
                      },
                      child: const Text('Change', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w700)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Quantity Input & Quick Chips
              Text('Quantity (Grams)', style: AppTypography.labelSmall(isDark)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      key: const Key('pantry_quantity_field'),
                      controller: _quantityController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        suffixText: 'g',
                        prefixIcon: Icon(Icons.scale_rounded, size: 20, color: AppColors.primary),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  // Quick adjustment steppers
                  IconButton.filledTonal(
                    icon: const Icon(Icons.remove_rounded, size: 18),
                    onPressed: () {
                      final current = double.tryParse(_quantityController.text) ?? 500.0;
                      if (current > 50) {
                        _quantityController.text = (current - 50).toStringAsFixed(0);
                      }
                    },
                  ),
                  IconButton.filledTonal(
                    icon: const Icon(Icons.add_rounded, size: 18),
                    onPressed: () {
                      final current = double.tryParse(_quantityController.text) ?? 500.0;
                      _quantityController.text = (current + 50).toStringAsFixed(0);
                    },
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Quantity Presets
              Row(
                children: [100, 250, 500, 1000].map((preset) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text('${preset}g'),
                      selected: _quantityController.text == preset.toString(),
                      onSelected: (selected) {
                        if (selected) {
                          setState(() {
                            _quantityController.text = preset.toString();
                          });
                        }
                      },
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              // Smart Expiry Date Auto-Suggestion
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Expiry Date', style: AppTypography.labelSmall(isDark)),
                  GestureDetector(
                    onTap: _pickCustomDate,
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today_rounded, size: 14, color: AppColors.primary),
                        const SizedBox(width: 4),
                        Text(
                          _isCustomDate
                              ? '${_expiryDate.day}/${_expiryDate.month}/${_expiryDate.year}'
                              : 'Custom Date',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Expiry Duration Chips (auto-suggest highlights)
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  _buildExpiryChip(3, '3 Days (${_selectedIngredient!.name.toLowerCase().contains("paneer") ? "Suggested" : "Fresh"})'),
                  _buildExpiryChip(7, '7 Days (${_selectedIngredient!.name.toLowerCase().contains("onion") ? "Suggested" : "Standard"})'),
                  _buildExpiryChip(14, '2 Weeks'),
                  _buildExpiryChip(30, '1 Month'),
                ],
              ),
            ],
            const SizedBox(height: 22),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                key: const Key('pantry_add_submit_button'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 2,
                ),
                icon: const Icon(Icons.check_circle_outline_rounded, size: 20),
                label: const Text(
                  'Add to Smart Pantry',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                ),
                onPressed: _selectedIngredient != null ? _submit : null,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpiryChip(int days, String label) {
    final isSelected = !_isCustomDate && _selectedExpiryDays == days;

    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: AppColors.primary,
      labelStyle: TextStyle(
        fontSize: 12,
        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
        color: isSelected ? Colors.white : null,
      ),
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _isCustomDate = false;
            _selectedExpiryDays = days;
            _expiryDate = DateTime.now().add(Duration(days: days));
          });
        }
      },
    );
  }

  String _getIngredientEmoji(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('paneer') || lower.contains('cheese')) return '🧀';
    if (lower.contains('onion') || lower.contains('kanda') || lower.contains('pyaz')) return '🧅';
    if (lower.contains('potato') || lower.contains('aloo') || lower.contains('batata')) return '🥔';
    if (lower.contains('tomato') || lower.contains('tamatar')) return '🍅';
    if (lower.contains('egg')) return '🥚';
    if (lower.contains('bread')) return '🍞';
    if (lower.contains('tofu')) return '🧊';
    if (lower.contains('milk') || lower.contains('curd') || lower.contains('yogurt')) return '🥛';
    if (lower.contains('rice') || lower.contains('poha')) return '🍚';
    if (lower.contains('dal') || lower.contains('beans')) return '🫘';
    if (lower.contains('spinach') || lower.contains('capsicum') || lower.contains('coriander')) return '🥬';
    if (lower.contains('garlic') || lower.contains('ginger')) return '🧄';
    return '🥗';
  }
}
