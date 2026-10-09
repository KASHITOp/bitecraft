class RecipeMacros {
  final int kcal;
  final double protein;
  final double carbs;
  final double fats;
  final double fiber;

  const RecipeMacros({
    required this.kcal,
    required this.protein,
    required this.carbs,
    required this.fats,
    required this.fiber,
  });

  factory RecipeMacros.fromJson(Map<String, dynamic> json) {
    return RecipeMacros(
      kcal: (json['kcal'] as num?)?.toInt() ?? 0,
      protein: (json['protein'] as num?)?.toDouble() ?? 0.0,
      carbs: (json['carbs'] as num?)?.toDouble() ?? 0.0,
      fats: (json['fats'] as num?)?.toDouble() ?? 0.0,
      fiber: (json['fiber'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'kcal': kcal,
        'protein': protein,
        'carbs': carbs,
        'fats': fats,
        'fiber': fiber,
      };
}

class RecipeStep {
  final String text;
  final int? timerSeconds;
  final String? tip;

  const RecipeStep({
    required this.text,
    this.timerSeconds,
    this.tip,
  });

  factory RecipeStep.fromJson(Map<String, dynamic> json) {
    return RecipeStep(
      text: json['text'] as String? ?? '',
      timerSeconds: (json['timer_seconds'] as num?)?.toInt(),
      tip: json['tip'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'text': text,
        if (timerSeconds != null) 'timer_seconds': timerSeconds,
        if (tip != null) 'tip': tip,
      };
}

class RecipeIngredientItem {
  final int ingredientId;
  final String name;
  final List<String> aliases;
  final double qty;
  final String unit;

  const RecipeIngredientItem({
    required this.ingredientId,
    required this.name,
    this.aliases = const [],
    required this.qty,
    required this.unit,
  });

  factory RecipeIngredientItem.fromJson(Map<String, dynamic> json) {
    return RecipeIngredientItem(
      ingredientId: (json['ingredient_id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? 'Ingredient',
      aliases: (json['aliases'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      qty: (json['qty'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] as String? ?? 'unit',
    );
  }

  Map<String, dynamic> toJson() => {
        'ingredient_id': ingredientId,
        'name': name,
        'aliases': aliases,
        'qty': qty,
        'unit': unit,
      };
}

class Recipe {
  final int id;
  final String title;
  final String cuisine;
  final String budgetTier; // broke | balanced | hifi
  final List<String> goals;
  final int minutes;
  final List<String> equipmentTags;
  final int servings;
  final List<RecipeStep> steps;
  final RecipeMacros macros;
  final double costPerServing;
  final double costFullPack;
  final String? imageUrl;
  final String emoji;
  final int gradientSeed;
  final List<RecipeIngredientItem> ingredients;

  const Recipe({
    required this.id,
    required this.title,
    required this.cuisine,
    required this.budgetTier,
    required this.goals,
    required this.minutes,
    required this.equipmentTags,
    required this.servings,
    required this.steps,
    required this.macros,
    required this.costPerServing,
    required this.costFullPack,
    this.imageUrl,
    required this.emoji,
    required this.gradientSeed,
    this.ingredients = const [],
  });

  factory Recipe.fromJson(Map<String, dynamic> json, [List<RecipeIngredientItem>? customIngs]) {
    final stepsRaw = json['steps'] as List<dynamic>? ?? [];
    final stepsList = stepsRaw
        .map((s) => s is Map<String, dynamic> ? RecipeStep.fromJson(s) : RecipeStep(text: s.toString()))
        .toList();

    final macrosRaw = json['macros'] as Map<String, dynamic>? ?? {};

    return Recipe(
      id: (json['id'] as num?)?.toInt() ?? 0,
      title: json['title'] as String? ?? 'Untitled Recipe',
      cuisine: json['cuisine'] as String? ?? 'Indian',
      budgetTier: json['budget_tier'] as String? ?? 'balanced',
      goals: (json['goals'] as List<dynamic>?)?.map((g) => g.toString()).toList() ?? [],
      minutes: (json['minutes'] as num?)?.toInt() ?? 15,
      equipmentTags: (json['equipment_tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      servings: (json['servings'] as num?)?.toInt() ?? 1,
      steps: stepsList,
      macros: RecipeMacros.fromJson(macrosRaw),
      costPerServing: (json['cost_per_serving'] as num?)?.toDouble() ?? 0.0,
      costFullPack: (json['cost_full_pack'] as num?)?.toDouble() ?? 0.0,
      imageUrl: json['image_url'] as String?,
      emoji: json['emoji'] as String? ?? '🍲',
      gradientSeed: (json['gradient_seed'] as num?)?.toInt() ?? 1,
      ingredients: customIngs ??
          ((json['ingredients'] as List<dynamic>?)
                  ?.map((i) => RecipeIngredientItem.fromJson(i as Map<String, dynamic>))
                  .toList() ??
              []),
    );
  }

  double coverageFraction(List<int> userPantryIds) {
    if (ingredients.isEmpty) return 0.0;
    final pantrySet = userPantryIds.toSet();
    final matched = ingredients.where((i) => pantrySet.contains(i.ingredientId)).length;
    return matched / ingredients.length;
  }
}
