// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $LocalRecipesTable extends LocalRecipes
    with TableInfo<$LocalRecipesTable, LocalRecipe> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalRecipesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
    'title',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _cuisineMeta = const VerificationMeta(
    'cuisine',
  );
  @override
  late final GeneratedColumn<String> cuisine = GeneratedColumn<String>(
    'cuisine',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _budgetTierMeta = const VerificationMeta(
    'budgetTier',
  );
  @override
  late final GeneratedColumn<String> budgetTier = GeneratedColumn<String>(
    'budget_tier',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _goalsMeta = const VerificationMeta('goals');
  @override
  late final GeneratedColumn<String> goals = GeneratedColumn<String>(
    'goals',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _minutesMeta = const VerificationMeta(
    'minutes',
  );
  @override
  late final GeneratedColumn<int> minutes = GeneratedColumn<int>(
    'minutes',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _equipmentTagsMeta = const VerificationMeta(
    'equipmentTags',
  );
  @override
  late final GeneratedColumn<String> equipmentTags = GeneratedColumn<String>(
    'equipment_tags',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _servingsMeta = const VerificationMeta(
    'servings',
  );
  @override
  late final GeneratedColumn<int> servings = GeneratedColumn<int>(
    'servings',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _stepsJsonMeta = const VerificationMeta(
    'stepsJson',
  );
  @override
  late final GeneratedColumn<String> stepsJson = GeneratedColumn<String>(
    'steps_json',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _macrosJsonMeta = const VerificationMeta(
    'macrosJson',
  );
  @override
  late final GeneratedColumn<String> macrosJson = GeneratedColumn<String>(
    'macros_json',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _costPerServingMeta = const VerificationMeta(
    'costPerServing',
  );
  @override
  late final GeneratedColumn<double> costPerServing = GeneratedColumn<double>(
    'cost_per_serving',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _costFullPackMeta = const VerificationMeta(
    'costFullPack',
  );
  @override
  late final GeneratedColumn<double> costFullPack = GeneratedColumn<double>(
    'cost_full_pack',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _imageUrlMeta = const VerificationMeta(
    'imageUrl',
  );
  @override
  late final GeneratedColumn<String> imageUrl = GeneratedColumn<String>(
    'image_url',
    aliasedName,
    true,
    type: DriftSqlType.string,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _emojiMeta = const VerificationMeta('emoji');
  @override
  late final GeneratedColumn<String> emoji = GeneratedColumn<String>(
    'emoji',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _gradientSeedMeta = const VerificationMeta(
    'gradientSeed',
  );
  @override
  late final GeneratedColumn<int> gradientSeed = GeneratedColumn<int>(
    'gradient_seed',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _ingredientIdsMeta = const VerificationMeta(
    'ingredientIds',
  );
  @override
  late final GeneratedColumn<String> ingredientIds = GeneratedColumn<String>(
    'ingredient_ids',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _ingredientSearchTermsMeta =
      const VerificationMeta('ingredientSearchTerms');
  @override
  late final GeneratedColumn<String> ingredientSearchTerms =
      GeneratedColumn<String>(
        'ingredient_search_terms',
        aliasedName,
        false,
        type: DriftSqlType.string,
        requiredDuringInsert: true,
      );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    title,
    cuisine,
    budgetTier,
    goals,
    minutes,
    equipmentTags,
    servings,
    stepsJson,
    macrosJson,
    costPerServing,
    costFullPack,
    imageUrl,
    emoji,
    gradientSeed,
    ingredientIds,
    ingredientSearchTerms,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_recipes';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalRecipe> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
        _titleMeta,
        title.isAcceptableOrUnknown(data['title']!, _titleMeta),
      );
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('cuisine')) {
      context.handle(
        _cuisineMeta,
        cuisine.isAcceptableOrUnknown(data['cuisine']!, _cuisineMeta),
      );
    } else if (isInserting) {
      context.missing(_cuisineMeta);
    }
    if (data.containsKey('budget_tier')) {
      context.handle(
        _budgetTierMeta,
        budgetTier.isAcceptableOrUnknown(data['budget_tier']!, _budgetTierMeta),
      );
    } else if (isInserting) {
      context.missing(_budgetTierMeta);
    }
    if (data.containsKey('goals')) {
      context.handle(
        _goalsMeta,
        goals.isAcceptableOrUnknown(data['goals']!, _goalsMeta),
      );
    } else if (isInserting) {
      context.missing(_goalsMeta);
    }
    if (data.containsKey('minutes')) {
      context.handle(
        _minutesMeta,
        minutes.isAcceptableOrUnknown(data['minutes']!, _minutesMeta),
      );
    } else if (isInserting) {
      context.missing(_minutesMeta);
    }
    if (data.containsKey('equipment_tags')) {
      context.handle(
        _equipmentTagsMeta,
        equipmentTags.isAcceptableOrUnknown(
          data['equipment_tags']!,
          _equipmentTagsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_equipmentTagsMeta);
    }
    if (data.containsKey('servings')) {
      context.handle(
        _servingsMeta,
        servings.isAcceptableOrUnknown(data['servings']!, _servingsMeta),
      );
    } else if (isInserting) {
      context.missing(_servingsMeta);
    }
    if (data.containsKey('steps_json')) {
      context.handle(
        _stepsJsonMeta,
        stepsJson.isAcceptableOrUnknown(data['steps_json']!, _stepsJsonMeta),
      );
    } else if (isInserting) {
      context.missing(_stepsJsonMeta);
    }
    if (data.containsKey('macros_json')) {
      context.handle(
        _macrosJsonMeta,
        macrosJson.isAcceptableOrUnknown(data['macros_json']!, _macrosJsonMeta),
      );
    } else if (isInserting) {
      context.missing(_macrosJsonMeta);
    }
    if (data.containsKey('cost_per_serving')) {
      context.handle(
        _costPerServingMeta,
        costPerServing.isAcceptableOrUnknown(
          data['cost_per_serving']!,
          _costPerServingMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_costPerServingMeta);
    }
    if (data.containsKey('cost_full_pack')) {
      context.handle(
        _costFullPackMeta,
        costFullPack.isAcceptableOrUnknown(
          data['cost_full_pack']!,
          _costFullPackMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_costFullPackMeta);
    }
    if (data.containsKey('image_url')) {
      context.handle(
        _imageUrlMeta,
        imageUrl.isAcceptableOrUnknown(data['image_url']!, _imageUrlMeta),
      );
    }
    if (data.containsKey('emoji')) {
      context.handle(
        _emojiMeta,
        emoji.isAcceptableOrUnknown(data['emoji']!, _emojiMeta),
      );
    } else if (isInserting) {
      context.missing(_emojiMeta);
    }
    if (data.containsKey('gradient_seed')) {
      context.handle(
        _gradientSeedMeta,
        gradientSeed.isAcceptableOrUnknown(
          data['gradient_seed']!,
          _gradientSeedMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_gradientSeedMeta);
    }
    if (data.containsKey('ingredient_ids')) {
      context.handle(
        _ingredientIdsMeta,
        ingredientIds.isAcceptableOrUnknown(
          data['ingredient_ids']!,
          _ingredientIdsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_ingredientIdsMeta);
    }
    if (data.containsKey('ingredient_search_terms')) {
      context.handle(
        _ingredientSearchTermsMeta,
        ingredientSearchTerms.isAcceptableOrUnknown(
          data['ingredient_search_terms']!,
          _ingredientSearchTermsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_ingredientSearchTermsMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalRecipe map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalRecipe(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      title: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}title'],
      )!,
      cuisine: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}cuisine'],
      )!,
      budgetTier: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}budget_tier'],
      )!,
      goals: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}goals'],
      )!,
      minutes: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}minutes'],
      )!,
      equipmentTags: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}equipment_tags'],
      )!,
      servings: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}servings'],
      )!,
      stepsJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}steps_json'],
      )!,
      macrosJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}macros_json'],
      )!,
      costPerServing: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}cost_per_serving'],
      )!,
      costFullPack: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}cost_full_pack'],
      )!,
      imageUrl: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}image_url'],
      ),
      emoji: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}emoji'],
      )!,
      gradientSeed: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}gradient_seed'],
      )!,
      ingredientIds: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}ingredient_ids'],
      )!,
      ingredientSearchTerms: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}ingredient_search_terms'],
      )!,
    );
  }

  @override
  $LocalRecipesTable createAlias(String alias) {
    return $LocalRecipesTable(attachedDatabase, alias);
  }
}

class LocalRecipe extends DataClass implements Insertable<LocalRecipe> {
  final int id;
  final String title;
  final String cuisine;
  final String budgetTier;
  final String goals;
  final int minutes;
  final String equipmentTags;
  final int servings;
  final String stepsJson;
  final String macrosJson;
  final double costPerServing;
  final double costFullPack;
  final String? imageUrl;
  final String emoji;
  final int gradientSeed;
  final String ingredientIds;
  final String ingredientSearchTerms;
  const LocalRecipe({
    required this.id,
    required this.title,
    required this.cuisine,
    required this.budgetTier,
    required this.goals,
    required this.minutes,
    required this.equipmentTags,
    required this.servings,
    required this.stepsJson,
    required this.macrosJson,
    required this.costPerServing,
    required this.costFullPack,
    this.imageUrl,
    required this.emoji,
    required this.gradientSeed,
    required this.ingredientIds,
    required this.ingredientSearchTerms,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    map['cuisine'] = Variable<String>(cuisine);
    map['budget_tier'] = Variable<String>(budgetTier);
    map['goals'] = Variable<String>(goals);
    map['minutes'] = Variable<int>(minutes);
    map['equipment_tags'] = Variable<String>(equipmentTags);
    map['servings'] = Variable<int>(servings);
    map['steps_json'] = Variable<String>(stepsJson);
    map['macros_json'] = Variable<String>(macrosJson);
    map['cost_per_serving'] = Variable<double>(costPerServing);
    map['cost_full_pack'] = Variable<double>(costFullPack);
    if (!nullToAbsent || imageUrl != null) {
      map['image_url'] = Variable<String>(imageUrl);
    }
    map['emoji'] = Variable<String>(emoji);
    map['gradient_seed'] = Variable<int>(gradientSeed);
    map['ingredient_ids'] = Variable<String>(ingredientIds);
    map['ingredient_search_terms'] = Variable<String>(ingredientSearchTerms);
    return map;
  }

  LocalRecipesCompanion toCompanion(bool nullToAbsent) {
    return LocalRecipesCompanion(
      id: Value(id),
      title: Value(title),
      cuisine: Value(cuisine),
      budgetTier: Value(budgetTier),
      goals: Value(goals),
      minutes: Value(minutes),
      equipmentTags: Value(equipmentTags),
      servings: Value(servings),
      stepsJson: Value(stepsJson),
      macrosJson: Value(macrosJson),
      costPerServing: Value(costPerServing),
      costFullPack: Value(costFullPack),
      imageUrl: imageUrl == null && nullToAbsent
          ? const Value.absent()
          : Value(imageUrl),
      emoji: Value(emoji),
      gradientSeed: Value(gradientSeed),
      ingredientIds: Value(ingredientIds),
      ingredientSearchTerms: Value(ingredientSearchTerms),
    );
  }

  factory LocalRecipe.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalRecipe(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      cuisine: serializer.fromJson<String>(json['cuisine']),
      budgetTier: serializer.fromJson<String>(json['budgetTier']),
      goals: serializer.fromJson<String>(json['goals']),
      minutes: serializer.fromJson<int>(json['minutes']),
      equipmentTags: serializer.fromJson<String>(json['equipmentTags']),
      servings: serializer.fromJson<int>(json['servings']),
      stepsJson: serializer.fromJson<String>(json['stepsJson']),
      macrosJson: serializer.fromJson<String>(json['macrosJson']),
      costPerServing: serializer.fromJson<double>(json['costPerServing']),
      costFullPack: serializer.fromJson<double>(json['costFullPack']),
      imageUrl: serializer.fromJson<String?>(json['imageUrl']),
      emoji: serializer.fromJson<String>(json['emoji']),
      gradientSeed: serializer.fromJson<int>(json['gradientSeed']),
      ingredientIds: serializer.fromJson<String>(json['ingredientIds']),
      ingredientSearchTerms: serializer.fromJson<String>(
        json['ingredientSearchTerms'],
      ),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'cuisine': serializer.toJson<String>(cuisine),
      'budgetTier': serializer.toJson<String>(budgetTier),
      'goals': serializer.toJson<String>(goals),
      'minutes': serializer.toJson<int>(minutes),
      'equipmentTags': serializer.toJson<String>(equipmentTags),
      'servings': serializer.toJson<int>(servings),
      'stepsJson': serializer.toJson<String>(stepsJson),
      'macrosJson': serializer.toJson<String>(macrosJson),
      'costPerServing': serializer.toJson<double>(costPerServing),
      'costFullPack': serializer.toJson<double>(costFullPack),
      'imageUrl': serializer.toJson<String?>(imageUrl),
      'emoji': serializer.toJson<String>(emoji),
      'gradientSeed': serializer.toJson<int>(gradientSeed),
      'ingredientIds': serializer.toJson<String>(ingredientIds),
      'ingredientSearchTerms': serializer.toJson<String>(ingredientSearchTerms),
    };
  }

  LocalRecipe copyWith({
    int? id,
    String? title,
    String? cuisine,
    String? budgetTier,
    String? goals,
    int? minutes,
    String? equipmentTags,
    int? servings,
    String? stepsJson,
    String? macrosJson,
    double? costPerServing,
    double? costFullPack,
    Value<String?> imageUrl = const Value.absent(),
    String? emoji,
    int? gradientSeed,
    String? ingredientIds,
    String? ingredientSearchTerms,
  }) => LocalRecipe(
    id: id ?? this.id,
    title: title ?? this.title,
    cuisine: cuisine ?? this.cuisine,
    budgetTier: budgetTier ?? this.budgetTier,
    goals: goals ?? this.goals,
    minutes: minutes ?? this.minutes,
    equipmentTags: equipmentTags ?? this.equipmentTags,
    servings: servings ?? this.servings,
    stepsJson: stepsJson ?? this.stepsJson,
    macrosJson: macrosJson ?? this.macrosJson,
    costPerServing: costPerServing ?? this.costPerServing,
    costFullPack: costFullPack ?? this.costFullPack,
    imageUrl: imageUrl.present ? imageUrl.value : this.imageUrl,
    emoji: emoji ?? this.emoji,
    gradientSeed: gradientSeed ?? this.gradientSeed,
    ingredientIds: ingredientIds ?? this.ingredientIds,
    ingredientSearchTerms: ingredientSearchTerms ?? this.ingredientSearchTerms,
  );
  LocalRecipe copyWithCompanion(LocalRecipesCompanion data) {
    return LocalRecipe(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      cuisine: data.cuisine.present ? data.cuisine.value : this.cuisine,
      budgetTier: data.budgetTier.present
          ? data.budgetTier.value
          : this.budgetTier,
      goals: data.goals.present ? data.goals.value : this.goals,
      minutes: data.minutes.present ? data.minutes.value : this.minutes,
      equipmentTags: data.equipmentTags.present
          ? data.equipmentTags.value
          : this.equipmentTags,
      servings: data.servings.present ? data.servings.value : this.servings,
      stepsJson: data.stepsJson.present ? data.stepsJson.value : this.stepsJson,
      macrosJson: data.macrosJson.present
          ? data.macrosJson.value
          : this.macrosJson,
      costPerServing: data.costPerServing.present
          ? data.costPerServing.value
          : this.costPerServing,
      costFullPack: data.costFullPack.present
          ? data.costFullPack.value
          : this.costFullPack,
      imageUrl: data.imageUrl.present ? data.imageUrl.value : this.imageUrl,
      emoji: data.emoji.present ? data.emoji.value : this.emoji,
      gradientSeed: data.gradientSeed.present
          ? data.gradientSeed.value
          : this.gradientSeed,
      ingredientIds: data.ingredientIds.present
          ? data.ingredientIds.value
          : this.ingredientIds,
      ingredientSearchTerms: data.ingredientSearchTerms.present
          ? data.ingredientSearchTerms.value
          : this.ingredientSearchTerms,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalRecipe(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('cuisine: $cuisine, ')
          ..write('budgetTier: $budgetTier, ')
          ..write('goals: $goals, ')
          ..write('minutes: $minutes, ')
          ..write('equipmentTags: $equipmentTags, ')
          ..write('servings: $servings, ')
          ..write('stepsJson: $stepsJson, ')
          ..write('macrosJson: $macrosJson, ')
          ..write('costPerServing: $costPerServing, ')
          ..write('costFullPack: $costFullPack, ')
          ..write('imageUrl: $imageUrl, ')
          ..write('emoji: $emoji, ')
          ..write('gradientSeed: $gradientSeed, ')
          ..write('ingredientIds: $ingredientIds, ')
          ..write('ingredientSearchTerms: $ingredientSearchTerms')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    title,
    cuisine,
    budgetTier,
    goals,
    minutes,
    equipmentTags,
    servings,
    stepsJson,
    macrosJson,
    costPerServing,
    costFullPack,
    imageUrl,
    emoji,
    gradientSeed,
    ingredientIds,
    ingredientSearchTerms,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalRecipe &&
          other.id == this.id &&
          other.title == this.title &&
          other.cuisine == this.cuisine &&
          other.budgetTier == this.budgetTier &&
          other.goals == this.goals &&
          other.minutes == this.minutes &&
          other.equipmentTags == this.equipmentTags &&
          other.servings == this.servings &&
          other.stepsJson == this.stepsJson &&
          other.macrosJson == this.macrosJson &&
          other.costPerServing == this.costPerServing &&
          other.costFullPack == this.costFullPack &&
          other.imageUrl == this.imageUrl &&
          other.emoji == this.emoji &&
          other.gradientSeed == this.gradientSeed &&
          other.ingredientIds == this.ingredientIds &&
          other.ingredientSearchTerms == this.ingredientSearchTerms);
}

class LocalRecipesCompanion extends UpdateCompanion<LocalRecipe> {
  final Value<int> id;
  final Value<String> title;
  final Value<String> cuisine;
  final Value<String> budgetTier;
  final Value<String> goals;
  final Value<int> minutes;
  final Value<String> equipmentTags;
  final Value<int> servings;
  final Value<String> stepsJson;
  final Value<String> macrosJson;
  final Value<double> costPerServing;
  final Value<double> costFullPack;
  final Value<String?> imageUrl;
  final Value<String> emoji;
  final Value<int> gradientSeed;
  final Value<String> ingredientIds;
  final Value<String> ingredientSearchTerms;
  const LocalRecipesCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.cuisine = const Value.absent(),
    this.budgetTier = const Value.absent(),
    this.goals = const Value.absent(),
    this.minutes = const Value.absent(),
    this.equipmentTags = const Value.absent(),
    this.servings = const Value.absent(),
    this.stepsJson = const Value.absent(),
    this.macrosJson = const Value.absent(),
    this.costPerServing = const Value.absent(),
    this.costFullPack = const Value.absent(),
    this.imageUrl = const Value.absent(),
    this.emoji = const Value.absent(),
    this.gradientSeed = const Value.absent(),
    this.ingredientIds = const Value.absent(),
    this.ingredientSearchTerms = const Value.absent(),
  });
  LocalRecipesCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required String cuisine,
    required String budgetTier,
    required String goals,
    required int minutes,
    required String equipmentTags,
    required int servings,
    required String stepsJson,
    required String macrosJson,
    required double costPerServing,
    required double costFullPack,
    this.imageUrl = const Value.absent(),
    required String emoji,
    required int gradientSeed,
    required String ingredientIds,
    required String ingredientSearchTerms,
  }) : title = Value(title),
       cuisine = Value(cuisine),
       budgetTier = Value(budgetTier),
       goals = Value(goals),
       minutes = Value(minutes),
       equipmentTags = Value(equipmentTags),
       servings = Value(servings),
       stepsJson = Value(stepsJson),
       macrosJson = Value(macrosJson),
       costPerServing = Value(costPerServing),
       costFullPack = Value(costFullPack),
       emoji = Value(emoji),
       gradientSeed = Value(gradientSeed),
       ingredientIds = Value(ingredientIds),
       ingredientSearchTerms = Value(ingredientSearchTerms);
  static Insertable<LocalRecipe> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<String>? cuisine,
    Expression<String>? budgetTier,
    Expression<String>? goals,
    Expression<int>? minutes,
    Expression<String>? equipmentTags,
    Expression<int>? servings,
    Expression<String>? stepsJson,
    Expression<String>? macrosJson,
    Expression<double>? costPerServing,
    Expression<double>? costFullPack,
    Expression<String>? imageUrl,
    Expression<String>? emoji,
    Expression<int>? gradientSeed,
    Expression<String>? ingredientIds,
    Expression<String>? ingredientSearchTerms,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (cuisine != null) 'cuisine': cuisine,
      if (budgetTier != null) 'budget_tier': budgetTier,
      if (goals != null) 'goals': goals,
      if (minutes != null) 'minutes': minutes,
      if (equipmentTags != null) 'equipment_tags': equipmentTags,
      if (servings != null) 'servings': servings,
      if (stepsJson != null) 'steps_json': stepsJson,
      if (macrosJson != null) 'macros_json': macrosJson,
      if (costPerServing != null) 'cost_per_serving': costPerServing,
      if (costFullPack != null) 'cost_full_pack': costFullPack,
      if (imageUrl != null) 'image_url': imageUrl,
      if (emoji != null) 'emoji': emoji,
      if (gradientSeed != null) 'gradient_seed': gradientSeed,
      if (ingredientIds != null) 'ingredient_ids': ingredientIds,
      if (ingredientSearchTerms != null)
        'ingredient_search_terms': ingredientSearchTerms,
    });
  }

  LocalRecipesCompanion copyWith({
    Value<int>? id,
    Value<String>? title,
    Value<String>? cuisine,
    Value<String>? budgetTier,
    Value<String>? goals,
    Value<int>? minutes,
    Value<String>? equipmentTags,
    Value<int>? servings,
    Value<String>? stepsJson,
    Value<String>? macrosJson,
    Value<double>? costPerServing,
    Value<double>? costFullPack,
    Value<String?>? imageUrl,
    Value<String>? emoji,
    Value<int>? gradientSeed,
    Value<String>? ingredientIds,
    Value<String>? ingredientSearchTerms,
  }) {
    return LocalRecipesCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      cuisine: cuisine ?? this.cuisine,
      budgetTier: budgetTier ?? this.budgetTier,
      goals: goals ?? this.goals,
      minutes: minutes ?? this.minutes,
      equipmentTags: equipmentTags ?? this.equipmentTags,
      servings: servings ?? this.servings,
      stepsJson: stepsJson ?? this.stepsJson,
      macrosJson: macrosJson ?? this.macrosJson,
      costPerServing: costPerServing ?? this.costPerServing,
      costFullPack: costFullPack ?? this.costFullPack,
      imageUrl: imageUrl ?? this.imageUrl,
      emoji: emoji ?? this.emoji,
      gradientSeed: gradientSeed ?? this.gradientSeed,
      ingredientIds: ingredientIds ?? this.ingredientIds,
      ingredientSearchTerms:
          ingredientSearchTerms ?? this.ingredientSearchTerms,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (cuisine.present) {
      map['cuisine'] = Variable<String>(cuisine.value);
    }
    if (budgetTier.present) {
      map['budget_tier'] = Variable<String>(budgetTier.value);
    }
    if (goals.present) {
      map['goals'] = Variable<String>(goals.value);
    }
    if (minutes.present) {
      map['minutes'] = Variable<int>(minutes.value);
    }
    if (equipmentTags.present) {
      map['equipment_tags'] = Variable<String>(equipmentTags.value);
    }
    if (servings.present) {
      map['servings'] = Variable<int>(servings.value);
    }
    if (stepsJson.present) {
      map['steps_json'] = Variable<String>(stepsJson.value);
    }
    if (macrosJson.present) {
      map['macros_json'] = Variable<String>(macrosJson.value);
    }
    if (costPerServing.present) {
      map['cost_per_serving'] = Variable<double>(costPerServing.value);
    }
    if (costFullPack.present) {
      map['cost_full_pack'] = Variable<double>(costFullPack.value);
    }
    if (imageUrl.present) {
      map['image_url'] = Variable<String>(imageUrl.value);
    }
    if (emoji.present) {
      map['emoji'] = Variable<String>(emoji.value);
    }
    if (gradientSeed.present) {
      map['gradient_seed'] = Variable<int>(gradientSeed.value);
    }
    if (ingredientIds.present) {
      map['ingredient_ids'] = Variable<String>(ingredientIds.value);
    }
    if (ingredientSearchTerms.present) {
      map['ingredient_search_terms'] = Variable<String>(
        ingredientSearchTerms.value,
      );
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalRecipesCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('cuisine: $cuisine, ')
          ..write('budgetTier: $budgetTier, ')
          ..write('goals: $goals, ')
          ..write('minutes: $minutes, ')
          ..write('equipmentTags: $equipmentTags, ')
          ..write('servings: $servings, ')
          ..write('stepsJson: $stepsJson, ')
          ..write('macrosJson: $macrosJson, ')
          ..write('costPerServing: $costPerServing, ')
          ..write('costFullPack: $costFullPack, ')
          ..write('imageUrl: $imageUrl, ')
          ..write('emoji: $emoji, ')
          ..write('gradientSeed: $gradientSeed, ')
          ..write('ingredientIds: $ingredientIds, ')
          ..write('ingredientSearchTerms: $ingredientSearchTerms')
          ..write(')'))
        .toString();
  }
}

class $LocalIngredientsTable extends LocalIngredients
    with TableInfo<$LocalIngredientsTable, LocalIngredient> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalIngredientsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _nameMeta = const VerificationMeta('name');
  @override
  late final GeneratedColumn<String> name = GeneratedColumn<String>(
    'name',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _aliasesJsonMeta = const VerificationMeta(
    'aliasesJson',
  );
  @override
  late final GeneratedColumn<String> aliasesJson = GeneratedColumn<String>(
    'aliases_json',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _categoryMeta = const VerificationMeta(
    'category',
  );
  @override
  late final GeneratedColumn<String> category = GeneratedColumn<String>(
    'category',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _packSizeMeta = const VerificationMeta(
    'packSize',
  );
  @override
  late final GeneratedColumn<String> packSize = GeneratedColumn<String>(
    'pack_size',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _avgPackPriceMeta = const VerificationMeta(
    'avgPackPrice',
  );
  @override
  late final GeneratedColumn<double> avgPackPrice = GeneratedColumn<double>(
    'avg_pack_price',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    name,
    aliasesJson,
    category,
    packSize,
    avgPackPrice,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_ingredients';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalIngredient> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('name')) {
      context.handle(
        _nameMeta,
        name.isAcceptableOrUnknown(data['name']!, _nameMeta),
      );
    } else if (isInserting) {
      context.missing(_nameMeta);
    }
    if (data.containsKey('aliases_json')) {
      context.handle(
        _aliasesJsonMeta,
        aliasesJson.isAcceptableOrUnknown(
          data['aliases_json']!,
          _aliasesJsonMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_aliasesJsonMeta);
    }
    if (data.containsKey('category')) {
      context.handle(
        _categoryMeta,
        category.isAcceptableOrUnknown(data['category']!, _categoryMeta),
      );
    } else if (isInserting) {
      context.missing(_categoryMeta);
    }
    if (data.containsKey('pack_size')) {
      context.handle(
        _packSizeMeta,
        packSize.isAcceptableOrUnknown(data['pack_size']!, _packSizeMeta),
      );
    } else if (isInserting) {
      context.missing(_packSizeMeta);
    }
    if (data.containsKey('avg_pack_price')) {
      context.handle(
        _avgPackPriceMeta,
        avgPackPrice.isAcceptableOrUnknown(
          data['avg_pack_price']!,
          _avgPackPriceMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_avgPackPriceMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalIngredient map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalIngredient(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      name: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}name'],
      )!,
      aliasesJson: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}aliases_json'],
      )!,
      category: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}category'],
      )!,
      packSize: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}pack_size'],
      )!,
      avgPackPrice: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}avg_pack_price'],
      )!,
    );
  }

  @override
  $LocalIngredientsTable createAlias(String alias) {
    return $LocalIngredientsTable(attachedDatabase, alias);
  }
}

class LocalIngredient extends DataClass implements Insertable<LocalIngredient> {
  final int id;
  final String name;
  final String aliasesJson;
  final String category;
  final String packSize;
  final double avgPackPrice;
  const LocalIngredient({
    required this.id,
    required this.name,
    required this.aliasesJson,
    required this.category,
    required this.packSize,
    required this.avgPackPrice,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['name'] = Variable<String>(name);
    map['aliases_json'] = Variable<String>(aliasesJson);
    map['category'] = Variable<String>(category);
    map['pack_size'] = Variable<String>(packSize);
    map['avg_pack_price'] = Variable<double>(avgPackPrice);
    return map;
  }

  LocalIngredientsCompanion toCompanion(bool nullToAbsent) {
    return LocalIngredientsCompanion(
      id: Value(id),
      name: Value(name),
      aliasesJson: Value(aliasesJson),
      category: Value(category),
      packSize: Value(packSize),
      avgPackPrice: Value(avgPackPrice),
    );
  }

  factory LocalIngredient.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalIngredient(
      id: serializer.fromJson<int>(json['id']),
      name: serializer.fromJson<String>(json['name']),
      aliasesJson: serializer.fromJson<String>(json['aliasesJson']),
      category: serializer.fromJson<String>(json['category']),
      packSize: serializer.fromJson<String>(json['packSize']),
      avgPackPrice: serializer.fromJson<double>(json['avgPackPrice']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'name': serializer.toJson<String>(name),
      'aliasesJson': serializer.toJson<String>(aliasesJson),
      'category': serializer.toJson<String>(category),
      'packSize': serializer.toJson<String>(packSize),
      'avgPackPrice': serializer.toJson<double>(avgPackPrice),
    };
  }

  LocalIngredient copyWith({
    int? id,
    String? name,
    String? aliasesJson,
    String? category,
    String? packSize,
    double? avgPackPrice,
  }) => LocalIngredient(
    id: id ?? this.id,
    name: name ?? this.name,
    aliasesJson: aliasesJson ?? this.aliasesJson,
    category: category ?? this.category,
    packSize: packSize ?? this.packSize,
    avgPackPrice: avgPackPrice ?? this.avgPackPrice,
  );
  LocalIngredient copyWithCompanion(LocalIngredientsCompanion data) {
    return LocalIngredient(
      id: data.id.present ? data.id.value : this.id,
      name: data.name.present ? data.name.value : this.name,
      aliasesJson: data.aliasesJson.present
          ? data.aliasesJson.value
          : this.aliasesJson,
      category: data.category.present ? data.category.value : this.category,
      packSize: data.packSize.present ? data.packSize.value : this.packSize,
      avgPackPrice: data.avgPackPrice.present
          ? data.avgPackPrice.value
          : this.avgPackPrice,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalIngredient(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('aliasesJson: $aliasesJson, ')
          ..write('category: $category, ')
          ..write('packSize: $packSize, ')
          ..write('avgPackPrice: $avgPackPrice')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, name, aliasesJson, category, packSize, avgPackPrice);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalIngredient &&
          other.id == this.id &&
          other.name == this.name &&
          other.aliasesJson == this.aliasesJson &&
          other.category == this.category &&
          other.packSize == this.packSize &&
          other.avgPackPrice == this.avgPackPrice);
}

class LocalIngredientsCompanion extends UpdateCompanion<LocalIngredient> {
  final Value<int> id;
  final Value<String> name;
  final Value<String> aliasesJson;
  final Value<String> category;
  final Value<String> packSize;
  final Value<double> avgPackPrice;
  const LocalIngredientsCompanion({
    this.id = const Value.absent(),
    this.name = const Value.absent(),
    this.aliasesJson = const Value.absent(),
    this.category = const Value.absent(),
    this.packSize = const Value.absent(),
    this.avgPackPrice = const Value.absent(),
  });
  LocalIngredientsCompanion.insert({
    this.id = const Value.absent(),
    required String name,
    required String aliasesJson,
    required String category,
    required String packSize,
    required double avgPackPrice,
  }) : name = Value(name),
       aliasesJson = Value(aliasesJson),
       category = Value(category),
       packSize = Value(packSize),
       avgPackPrice = Value(avgPackPrice);
  static Insertable<LocalIngredient> custom({
    Expression<int>? id,
    Expression<String>? name,
    Expression<String>? aliasesJson,
    Expression<String>? category,
    Expression<String>? packSize,
    Expression<double>? avgPackPrice,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (name != null) 'name': name,
      if (aliasesJson != null) 'aliases_json': aliasesJson,
      if (category != null) 'category': category,
      if (packSize != null) 'pack_size': packSize,
      if (avgPackPrice != null) 'avg_pack_price': avgPackPrice,
    });
  }

  LocalIngredientsCompanion copyWith({
    Value<int>? id,
    Value<String>? name,
    Value<String>? aliasesJson,
    Value<String>? category,
    Value<String>? packSize,
    Value<double>? avgPackPrice,
  }) {
    return LocalIngredientsCompanion(
      id: id ?? this.id,
      name: name ?? this.name,
      aliasesJson: aliasesJson ?? this.aliasesJson,
      category: category ?? this.category,
      packSize: packSize ?? this.packSize,
      avgPackPrice: avgPackPrice ?? this.avgPackPrice,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (name.present) {
      map['name'] = Variable<String>(name.value);
    }
    if (aliasesJson.present) {
      map['aliases_json'] = Variable<String>(aliasesJson.value);
    }
    if (category.present) {
      map['category'] = Variable<String>(category.value);
    }
    if (packSize.present) {
      map['pack_size'] = Variable<String>(packSize.value);
    }
    if (avgPackPrice.present) {
      map['avg_pack_price'] = Variable<double>(avgPackPrice.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalIngredientsCompanion(')
          ..write('id: $id, ')
          ..write('name: $name, ')
          ..write('aliasesJson: $aliasesJson, ')
          ..write('category: $category, ')
          ..write('packSize: $packSize, ')
          ..write('avgPackPrice: $avgPackPrice')
          ..write(')'))
        .toString();
  }
}

class $LocalStorePricesTable extends LocalStorePrices
    with TableInfo<$LocalStorePricesTable, LocalStorePrice> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalStorePricesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
    'id',
    aliasedName,
    false,
    hasAutoIncrement: true,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
    defaultConstraints: GeneratedColumn.constraintIsAlways(
      'PRIMARY KEY AUTOINCREMENT',
    ),
  );
  static const VerificationMeta _ingredientIdMeta = const VerificationMeta(
    'ingredientId',
  );
  @override
  late final GeneratedColumn<int> ingredientId = GeneratedColumn<int>(
    'ingredient_id',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _storeMeta = const VerificationMeta('store');
  @override
  late final GeneratedColumn<String> store = GeneratedColumn<String>(
    'store',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _priceMeta = const VerificationMeta('price');
  @override
  late final GeneratedColumn<double> price = GeneratedColumn<double>(
    'price',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  @override
  List<GeneratedColumn> get $columns => [id, ingredientId, store, price];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_store_prices';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalStorePrice> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('ingredient_id')) {
      context.handle(
        _ingredientIdMeta,
        ingredientId.isAcceptableOrUnknown(
          data['ingredient_id']!,
          _ingredientIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_ingredientIdMeta);
    }
    if (data.containsKey('store')) {
      context.handle(
        _storeMeta,
        store.isAcceptableOrUnknown(data['store']!, _storeMeta),
      );
    } else if (isInserting) {
      context.missing(_storeMeta);
    }
    if (data.containsKey('price')) {
      context.handle(
        _priceMeta,
        price.isAcceptableOrUnknown(data['price']!, _priceMeta),
      );
    } else if (isInserting) {
      context.missing(_priceMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  LocalStorePrice map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalStorePrice(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}id'],
      )!,
      ingredientId: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}ingredient_id'],
      )!,
      store: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}store'],
      )!,
      price: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}price'],
      )!,
    );
  }

  @override
  $LocalStorePricesTable createAlias(String alias) {
    return $LocalStorePricesTable(attachedDatabase, alias);
  }
}

class LocalStorePrice extends DataClass implements Insertable<LocalStorePrice> {
  final int id;
  final int ingredientId;
  final String store;
  final double price;
  const LocalStorePrice({
    required this.id,
    required this.ingredientId,
    required this.store,
    required this.price,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['ingredient_id'] = Variable<int>(ingredientId);
    map['store'] = Variable<String>(store);
    map['price'] = Variable<double>(price);
    return map;
  }

  LocalStorePricesCompanion toCompanion(bool nullToAbsent) {
    return LocalStorePricesCompanion(
      id: Value(id),
      ingredientId: Value(ingredientId),
      store: Value(store),
      price: Value(price),
    );
  }

  factory LocalStorePrice.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalStorePrice(
      id: serializer.fromJson<int>(json['id']),
      ingredientId: serializer.fromJson<int>(json['ingredientId']),
      store: serializer.fromJson<String>(json['store']),
      price: serializer.fromJson<double>(json['price']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'ingredientId': serializer.toJson<int>(ingredientId),
      'store': serializer.toJson<String>(store),
      'price': serializer.toJson<double>(price),
    };
  }

  LocalStorePrice copyWith({
    int? id,
    int? ingredientId,
    String? store,
    double? price,
  }) => LocalStorePrice(
    id: id ?? this.id,
    ingredientId: ingredientId ?? this.ingredientId,
    store: store ?? this.store,
    price: price ?? this.price,
  );
  LocalStorePrice copyWithCompanion(LocalStorePricesCompanion data) {
    return LocalStorePrice(
      id: data.id.present ? data.id.value : this.id,
      ingredientId: data.ingredientId.present
          ? data.ingredientId.value
          : this.ingredientId,
      store: data.store.present ? data.store.value : this.store,
      price: data.price.present ? data.price.value : this.price,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalStorePrice(')
          ..write('id: $id, ')
          ..write('ingredientId: $ingredientId, ')
          ..write('store: $store, ')
          ..write('price: $price')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, ingredientId, store, price);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalStorePrice &&
          other.id == this.id &&
          other.ingredientId == this.ingredientId &&
          other.store == this.store &&
          other.price == this.price);
}

class LocalStorePricesCompanion extends UpdateCompanion<LocalStorePrice> {
  final Value<int> id;
  final Value<int> ingredientId;
  final Value<String> store;
  final Value<double> price;
  const LocalStorePricesCompanion({
    this.id = const Value.absent(),
    this.ingredientId = const Value.absent(),
    this.store = const Value.absent(),
    this.price = const Value.absent(),
  });
  LocalStorePricesCompanion.insert({
    this.id = const Value.absent(),
    required int ingredientId,
    required String store,
    required double price,
  }) : ingredientId = Value(ingredientId),
       store = Value(store),
       price = Value(price);
  static Insertable<LocalStorePrice> custom({
    Expression<int>? id,
    Expression<int>? ingredientId,
    Expression<String>? store,
    Expression<double>? price,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (ingredientId != null) 'ingredient_id': ingredientId,
      if (store != null) 'store': store,
      if (price != null) 'price': price,
    });
  }

  LocalStorePricesCompanion copyWith({
    Value<int>? id,
    Value<int>? ingredientId,
    Value<String>? store,
    Value<double>? price,
  }) {
    return LocalStorePricesCompanion(
      id: id ?? this.id,
      ingredientId: ingredientId ?? this.ingredientId,
      store: store ?? this.store,
      price: price ?? this.price,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (ingredientId.present) {
      map['ingredient_id'] = Variable<int>(ingredientId.value);
    }
    if (store.present) {
      map['store'] = Variable<String>(store.value);
    }
    if (price.present) {
      map['price'] = Variable<double>(price.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalStorePricesCompanion(')
          ..write('id: $id, ')
          ..write('ingredientId: $ingredientId, ')
          ..write('store: $store, ')
          ..write('price: $price')
          ..write(')'))
        .toString();
  }
}

class $LocalFavoritesTable extends LocalFavorites
    with TableInfo<$LocalFavoritesTable, LocalFavorite> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $LocalFavoritesTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _recipeIdMeta = const VerificationMeta(
    'recipeId',
  );
  @override
  late final GeneratedColumn<int> recipeId = GeneratedColumn<int>(
    'recipe_id',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: false,
  );
  static const VerificationMeta _savedAtMeta = const VerificationMeta(
    'savedAt',
  );
  @override
  late final GeneratedColumn<DateTime> savedAt = GeneratedColumn<DateTime>(
    'saved_at',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
    defaultValue: currentDateAndTime,
  );
  @override
  List<GeneratedColumn> get $columns => [recipeId, savedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'local_favorites';
  @override
  VerificationContext validateIntegrity(
    Insertable<LocalFavorite> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('recipe_id')) {
      context.handle(
        _recipeIdMeta,
        recipeId.isAcceptableOrUnknown(data['recipe_id']!, _recipeIdMeta),
      );
    }
    if (data.containsKey('saved_at')) {
      context.handle(
        _savedAtMeta,
        savedAt.isAcceptableOrUnknown(data['saved_at']!, _savedAtMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {recipeId};
  @override
  LocalFavorite map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return LocalFavorite(
      recipeId: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}recipe_id'],
      )!,
      savedAt: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}saved_at'],
      )!,
    );
  }

  @override
  $LocalFavoritesTable createAlias(String alias) {
    return $LocalFavoritesTable(attachedDatabase, alias);
  }
}

class LocalFavorite extends DataClass implements Insertable<LocalFavorite> {
  final int recipeId;
  final DateTime savedAt;
  const LocalFavorite({required this.recipeId, required this.savedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['recipe_id'] = Variable<int>(recipeId);
    map['saved_at'] = Variable<DateTime>(savedAt);
    return map;
  }

  LocalFavoritesCompanion toCompanion(bool nullToAbsent) {
    return LocalFavoritesCompanion(
      recipeId: Value(recipeId),
      savedAt: Value(savedAt),
    );
  }

  factory LocalFavorite.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return LocalFavorite(
      recipeId: serializer.fromJson<int>(json['recipeId']),
      savedAt: serializer.fromJson<DateTime>(json['savedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'recipeId': serializer.toJson<int>(recipeId),
      'savedAt': serializer.toJson<DateTime>(savedAt),
    };
  }

  LocalFavorite copyWith({int? recipeId, DateTime? savedAt}) => LocalFavorite(
    recipeId: recipeId ?? this.recipeId,
    savedAt: savedAt ?? this.savedAt,
  );
  LocalFavorite copyWithCompanion(LocalFavoritesCompanion data) {
    return LocalFavorite(
      recipeId: data.recipeId.present ? data.recipeId.value : this.recipeId,
      savedAt: data.savedAt.present ? data.savedAt.value : this.savedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('LocalFavorite(')
          ..write('recipeId: $recipeId, ')
          ..write('savedAt: $savedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(recipeId, savedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is LocalFavorite &&
          other.recipeId == this.recipeId &&
          other.savedAt == this.savedAt);
}

class LocalFavoritesCompanion extends UpdateCompanion<LocalFavorite> {
  final Value<int> recipeId;
  final Value<DateTime> savedAt;
  const LocalFavoritesCompanion({
    this.recipeId = const Value.absent(),
    this.savedAt = const Value.absent(),
  });
  LocalFavoritesCompanion.insert({
    this.recipeId = const Value.absent(),
    this.savedAt = const Value.absent(),
  });
  static Insertable<LocalFavorite> custom({
    Expression<int>? recipeId,
    Expression<DateTime>? savedAt,
  }) {
    return RawValuesInsertable({
      if (recipeId != null) 'recipe_id': recipeId,
      if (savedAt != null) 'saved_at': savedAt,
    });
  }

  LocalFavoritesCompanion copyWith({
    Value<int>? recipeId,
    Value<DateTime>? savedAt,
  }) {
    return LocalFavoritesCompanion(
      recipeId: recipeId ?? this.recipeId,
      savedAt: savedAt ?? this.savedAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (recipeId.present) {
      map['recipe_id'] = Variable<int>(recipeId.value);
    }
    if (savedAt.present) {
      map['saved_at'] = Variable<DateTime>(savedAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('LocalFavoritesCompanion(')
          ..write('recipeId: $recipeId, ')
          ..write('savedAt: $savedAt')
          ..write(')'))
        .toString();
  }
}

class $PantryItemsTable extends PantryItems
    with TableInfo<$PantryItemsTable, PantryItem> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $PantryItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
    'id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _deviceIdMeta = const VerificationMeta(
    'deviceId',
  );
  @override
  late final GeneratedColumn<String> deviceId = GeneratedColumn<String>(
    'device_id',
    aliasedName,
    false,
    type: DriftSqlType.string,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _ingredientIdMeta = const VerificationMeta(
    'ingredientId',
  );
  @override
  late final GeneratedColumn<int> ingredientId = GeneratedColumn<int>(
    'ingredient_id',
    aliasedName,
    false,
    type: DriftSqlType.int,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _quantityGramsMeta = const VerificationMeta(
    'quantityGrams',
  );
  @override
  late final GeneratedColumn<double> quantityGrams = GeneratedColumn<double>(
    'quantity_grams',
    aliasedName,
    false,
    type: DriftSqlType.double,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _purchaseDateMeta = const VerificationMeta(
    'purchaseDate',
  );
  @override
  late final GeneratedColumn<DateTime> purchaseDate = GeneratedColumn<DateTime>(
    'purchase_date',
    aliasedName,
    false,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: true,
  );
  static const VerificationMeta _expiryDateMeta = const VerificationMeta(
    'expiryDate',
  );
  @override
  late final GeneratedColumn<DateTime> expiryDate = GeneratedColumn<DateTime>(
    'expiry_date',
    aliasedName,
    true,
    type: DriftSqlType.dateTime,
    requiredDuringInsert: false,
  );
  @override
  List<GeneratedColumn> get $columns => [
    id,
    deviceId,
    ingredientId,
    quantityGrams,
    purchaseDate,
    expiryDate,
  ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'pantry_items';
  @override
  VerificationContext validateIntegrity(
    Insertable<PantryItem> instance, {
    bool isInserting = false,
  }) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('device_id')) {
      context.handle(
        _deviceIdMeta,
        deviceId.isAcceptableOrUnknown(data['device_id']!, _deviceIdMeta),
      );
    } else if (isInserting) {
      context.missing(_deviceIdMeta);
    }
    if (data.containsKey('ingredient_id')) {
      context.handle(
        _ingredientIdMeta,
        ingredientId.isAcceptableOrUnknown(
          data['ingredient_id']!,
          _ingredientIdMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_ingredientIdMeta);
    }
    if (data.containsKey('quantity_grams')) {
      context.handle(
        _quantityGramsMeta,
        quantityGrams.isAcceptableOrUnknown(
          data['quantity_grams']!,
          _quantityGramsMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_quantityGramsMeta);
    }
    if (data.containsKey('purchase_date')) {
      context.handle(
        _purchaseDateMeta,
        purchaseDate.isAcceptableOrUnknown(
          data['purchase_date']!,
          _purchaseDateMeta,
        ),
      );
    } else if (isInserting) {
      context.missing(_purchaseDateMeta);
    }
    if (data.containsKey('expiry_date')) {
      context.handle(
        _expiryDateMeta,
        expiryDate.isAcceptableOrUnknown(data['expiry_date']!, _expiryDateMeta),
      );
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  PantryItem map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return PantryItem(
      id: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}id'],
      )!,
      deviceId: attachedDatabase.typeMapping.read(
        DriftSqlType.string,
        data['${effectivePrefix}device_id'],
      )!,
      ingredientId: attachedDatabase.typeMapping.read(
        DriftSqlType.int,
        data['${effectivePrefix}ingredient_id'],
      )!,
      quantityGrams: attachedDatabase.typeMapping.read(
        DriftSqlType.double,
        data['${effectivePrefix}quantity_grams'],
      )!,
      purchaseDate: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}purchase_date'],
      )!,
      expiryDate: attachedDatabase.typeMapping.read(
        DriftSqlType.dateTime,
        data['${effectivePrefix}expiry_date'],
      ),
    );
  }

  @override
  $PantryItemsTable createAlias(String alias) {
    return $PantryItemsTable(attachedDatabase, alias);
  }
}

class PantryItem extends DataClass implements Insertable<PantryItem> {
  final String id;
  final String deviceId;
  final int ingredientId;
  final double quantityGrams;
  final DateTime purchaseDate;
  final DateTime? expiryDate;
  const PantryItem({
    required this.id,
    required this.deviceId,
    required this.ingredientId,
    required this.quantityGrams,
    required this.purchaseDate,
    this.expiryDate,
  });
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['device_id'] = Variable<String>(deviceId);
    map['ingredient_id'] = Variable<int>(ingredientId);
    map['quantity_grams'] = Variable<double>(quantityGrams);
    map['purchase_date'] = Variable<DateTime>(purchaseDate);
    if (!nullToAbsent || expiryDate != null) {
      map['expiry_date'] = Variable<DateTime>(expiryDate);
    }
    return map;
  }

  PantryItemsCompanion toCompanion(bool nullToAbsent) {
    return PantryItemsCompanion(
      id: Value(id),
      deviceId: Value(deviceId),
      ingredientId: Value(ingredientId),
      quantityGrams: Value(quantityGrams),
      purchaseDate: Value(purchaseDate),
      expiryDate: expiryDate == null && nullToAbsent
          ? const Value.absent()
          : Value(expiryDate),
    );
  }

  factory PantryItem.fromJson(
    Map<String, dynamic> json, {
    ValueSerializer? serializer,
  }) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return PantryItem(
      id: serializer.fromJson<String>(json['id']),
      deviceId: serializer.fromJson<String>(json['deviceId']),
      ingredientId: serializer.fromJson<int>(json['ingredientId']),
      quantityGrams: serializer.fromJson<double>(json['quantityGrams']),
      purchaseDate: serializer.fromJson<DateTime>(json['purchaseDate']),
      expiryDate: serializer.fromJson<DateTime?>(json['expiryDate']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'deviceId': serializer.toJson<String>(deviceId),
      'ingredientId': serializer.toJson<int>(ingredientId),
      'quantityGrams': serializer.toJson<double>(quantityGrams),
      'purchaseDate': serializer.toJson<DateTime>(purchaseDate),
      'expiryDate': serializer.toJson<DateTime?>(expiryDate),
    };
  }

  PantryItem copyWith({
    String? id,
    String? deviceId,
    int? ingredientId,
    double? quantityGrams,
    DateTime? purchaseDate,
    Value<DateTime?> expiryDate = const Value.absent(),
  }) => PantryItem(
    id: id ?? this.id,
    deviceId: deviceId ?? this.deviceId,
    ingredientId: ingredientId ?? this.ingredientId,
    quantityGrams: quantityGrams ?? this.quantityGrams,
    purchaseDate: purchaseDate ?? this.purchaseDate,
    expiryDate: expiryDate.present ? expiryDate.value : this.expiryDate,
  );
  PantryItem copyWithCompanion(PantryItemsCompanion data) {
    return PantryItem(
      id: data.id.present ? data.id.value : this.id,
      deviceId: data.deviceId.present ? data.deviceId.value : this.deviceId,
      ingredientId: data.ingredientId.present
          ? data.ingredientId.value
          : this.ingredientId,
      quantityGrams: data.quantityGrams.present
          ? data.quantityGrams.value
          : this.quantityGrams,
      purchaseDate: data.purchaseDate.present
          ? data.purchaseDate.value
          : this.purchaseDate,
      expiryDate: data.expiryDate.present
          ? data.expiryDate.value
          : this.expiryDate,
    );
  }

  @override
  String toString() {
    return (StringBuffer('PantryItem(')
          ..write('id: $id, ')
          ..write('deviceId: $deviceId, ')
          ..write('ingredientId: $ingredientId, ')
          ..write('quantityGrams: $quantityGrams, ')
          ..write('purchaseDate: $purchaseDate, ')
          ..write('expiryDate: $expiryDate')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(
    id,
    deviceId,
    ingredientId,
    quantityGrams,
    purchaseDate,
    expiryDate,
  );
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is PantryItem &&
          other.id == this.id &&
          other.deviceId == this.deviceId &&
          other.ingredientId == this.ingredientId &&
          other.quantityGrams == this.quantityGrams &&
          other.purchaseDate == this.purchaseDate &&
          other.expiryDate == this.expiryDate);
}

class PantryItemsCompanion extends UpdateCompanion<PantryItem> {
  final Value<String> id;
  final Value<String> deviceId;
  final Value<int> ingredientId;
  final Value<double> quantityGrams;
  final Value<DateTime> purchaseDate;
  final Value<DateTime?> expiryDate;
  final Value<int> rowid;
  const PantryItemsCompanion({
    this.id = const Value.absent(),
    this.deviceId = const Value.absent(),
    this.ingredientId = const Value.absent(),
    this.quantityGrams = const Value.absent(),
    this.purchaseDate = const Value.absent(),
    this.expiryDate = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  PantryItemsCompanion.insert({
    required String id,
    required String deviceId,
    required int ingredientId,
    required double quantityGrams,
    required DateTime purchaseDate,
    this.expiryDate = const Value.absent(),
    this.rowid = const Value.absent(),
  }) : id = Value(id),
       deviceId = Value(deviceId),
       ingredientId = Value(ingredientId),
       quantityGrams = Value(quantityGrams),
       purchaseDate = Value(purchaseDate);
  static Insertable<PantryItem> custom({
    Expression<String>? id,
    Expression<String>? deviceId,
    Expression<int>? ingredientId,
    Expression<double>? quantityGrams,
    Expression<DateTime>? purchaseDate,
    Expression<DateTime>? expiryDate,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (deviceId != null) 'device_id': deviceId,
      if (ingredientId != null) 'ingredient_id': ingredientId,
      if (quantityGrams != null) 'quantity_grams': quantityGrams,
      if (purchaseDate != null) 'purchase_date': purchaseDate,
      if (expiryDate != null) 'expiry_date': expiryDate,
      if (rowid != null) 'rowid': rowid,
    });
  }

  PantryItemsCompanion copyWith({
    Value<String>? id,
    Value<String>? deviceId,
    Value<int>? ingredientId,
    Value<double>? quantityGrams,
    Value<DateTime>? purchaseDate,
    Value<DateTime?>? expiryDate,
    Value<int>? rowid,
  }) {
    return PantryItemsCompanion(
      id: id ?? this.id,
      deviceId: deviceId ?? this.deviceId,
      ingredientId: ingredientId ?? this.ingredientId,
      quantityGrams: quantityGrams ?? this.quantityGrams,
      purchaseDate: purchaseDate ?? this.purchaseDate,
      expiryDate: expiryDate ?? this.expiryDate,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (deviceId.present) {
      map['device_id'] = Variable<String>(deviceId.value);
    }
    if (ingredientId.present) {
      map['ingredient_id'] = Variable<int>(ingredientId.value);
    }
    if (quantityGrams.present) {
      map['quantity_grams'] = Variable<double>(quantityGrams.value);
    }
    if (purchaseDate.present) {
      map['purchase_date'] = Variable<DateTime>(purchaseDate.value);
    }
    if (expiryDate.present) {
      map['expiry_date'] = Variable<DateTime>(expiryDate.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('PantryItemsCompanion(')
          ..write('id: $id, ')
          ..write('deviceId: $deviceId, ')
          ..write('ingredientId: $ingredientId, ')
          ..write('quantityGrams: $quantityGrams, ')
          ..write('purchaseDate: $purchaseDate, ')
          ..write('expiryDate: $expiryDate, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $LocalRecipesTable localRecipes = $LocalRecipesTable(this);
  late final $LocalIngredientsTable localIngredients = $LocalIngredientsTable(
    this,
  );
  late final $LocalStorePricesTable localStorePrices = $LocalStorePricesTable(
    this,
  );
  late final $LocalFavoritesTable localFavorites = $LocalFavoritesTable(this);
  late final $PantryItemsTable pantryItems = $PantryItemsTable(this);
  late final PantryDao pantryDao = PantryDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
    localRecipes,
    localIngredients,
    localStorePrices,
    localFavorites,
    pantryItems,
  ];
}

typedef $$LocalRecipesTableCreateCompanionBuilder =
    LocalRecipesCompanion Function({
      Value<int> id,
      required String title,
      required String cuisine,
      required String budgetTier,
      required String goals,
      required int minutes,
      required String equipmentTags,
      required int servings,
      required String stepsJson,
      required String macrosJson,
      required double costPerServing,
      required double costFullPack,
      Value<String?> imageUrl,
      required String emoji,
      required int gradientSeed,
      required String ingredientIds,
      required String ingredientSearchTerms,
    });
typedef $$LocalRecipesTableUpdateCompanionBuilder =
    LocalRecipesCompanion Function({
      Value<int> id,
      Value<String> title,
      Value<String> cuisine,
      Value<String> budgetTier,
      Value<String> goals,
      Value<int> minutes,
      Value<String> equipmentTags,
      Value<int> servings,
      Value<String> stepsJson,
      Value<String> macrosJson,
      Value<double> costPerServing,
      Value<double> costFullPack,
      Value<String?> imageUrl,
      Value<String> emoji,
      Value<int> gradientSeed,
      Value<String> ingredientIds,
      Value<String> ingredientSearchTerms,
    });

class $$LocalRecipesTableFilterComposer
    extends Composer<_$AppDatabase, $LocalRecipesTable> {
  $$LocalRecipesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get cuisine => $composableBuilder(
    column: $table.cuisine,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get budgetTier => $composableBuilder(
    column: $table.budgetTier,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get goals => $composableBuilder(
    column: $table.goals,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get minutes => $composableBuilder(
    column: $table.minutes,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get equipmentTags => $composableBuilder(
    column: $table.equipmentTags,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get servings => $composableBuilder(
    column: $table.servings,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get stepsJson => $composableBuilder(
    column: $table.stepsJson,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get macrosJson => $composableBuilder(
    column: $table.macrosJson,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get costPerServing => $composableBuilder(
    column: $table.costPerServing,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get costFullPack => $composableBuilder(
    column: $table.costFullPack,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get imageUrl => $composableBuilder(
    column: $table.imageUrl,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get emoji => $composableBuilder(
    column: $table.emoji,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get gradientSeed => $composableBuilder(
    column: $table.gradientSeed,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get ingredientIds => $composableBuilder(
    column: $table.ingredientIds,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get ingredientSearchTerms => $composableBuilder(
    column: $table.ingredientSearchTerms,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalRecipesTableOrderingComposer
    extends Composer<_$AppDatabase, $LocalRecipesTable> {
  $$LocalRecipesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get title => $composableBuilder(
    column: $table.title,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get cuisine => $composableBuilder(
    column: $table.cuisine,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get budgetTier => $composableBuilder(
    column: $table.budgetTier,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get goals => $composableBuilder(
    column: $table.goals,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get minutes => $composableBuilder(
    column: $table.minutes,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get equipmentTags => $composableBuilder(
    column: $table.equipmentTags,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get servings => $composableBuilder(
    column: $table.servings,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get stepsJson => $composableBuilder(
    column: $table.stepsJson,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get macrosJson => $composableBuilder(
    column: $table.macrosJson,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get costPerServing => $composableBuilder(
    column: $table.costPerServing,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get costFullPack => $composableBuilder(
    column: $table.costFullPack,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get imageUrl => $composableBuilder(
    column: $table.imageUrl,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get emoji => $composableBuilder(
    column: $table.emoji,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get gradientSeed => $composableBuilder(
    column: $table.gradientSeed,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get ingredientIds => $composableBuilder(
    column: $table.ingredientIds,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get ingredientSearchTerms => $composableBuilder(
    column: $table.ingredientSearchTerms,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalRecipesTableAnnotationComposer
    extends Composer<_$AppDatabase, $LocalRecipesTable> {
  $$LocalRecipesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get cuisine =>
      $composableBuilder(column: $table.cuisine, builder: (column) => column);

  GeneratedColumn<String> get budgetTier => $composableBuilder(
    column: $table.budgetTier,
    builder: (column) => column,
  );

  GeneratedColumn<String> get goals =>
      $composableBuilder(column: $table.goals, builder: (column) => column);

  GeneratedColumn<int> get minutes =>
      $composableBuilder(column: $table.minutes, builder: (column) => column);

  GeneratedColumn<String> get equipmentTags => $composableBuilder(
    column: $table.equipmentTags,
    builder: (column) => column,
  );

  GeneratedColumn<int> get servings =>
      $composableBuilder(column: $table.servings, builder: (column) => column);

  GeneratedColumn<String> get stepsJson =>
      $composableBuilder(column: $table.stepsJson, builder: (column) => column);

  GeneratedColumn<String> get macrosJson => $composableBuilder(
    column: $table.macrosJson,
    builder: (column) => column,
  );

  GeneratedColumn<double> get costPerServing => $composableBuilder(
    column: $table.costPerServing,
    builder: (column) => column,
  );

  GeneratedColumn<double> get costFullPack => $composableBuilder(
    column: $table.costFullPack,
    builder: (column) => column,
  );

  GeneratedColumn<String> get imageUrl =>
      $composableBuilder(column: $table.imageUrl, builder: (column) => column);

  GeneratedColumn<String> get emoji =>
      $composableBuilder(column: $table.emoji, builder: (column) => column);

  GeneratedColumn<int> get gradientSeed => $composableBuilder(
    column: $table.gradientSeed,
    builder: (column) => column,
  );

  GeneratedColumn<String> get ingredientIds => $composableBuilder(
    column: $table.ingredientIds,
    builder: (column) => column,
  );

  GeneratedColumn<String> get ingredientSearchTerms => $composableBuilder(
    column: $table.ingredientSearchTerms,
    builder: (column) => column,
  );
}

class $$LocalRecipesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $LocalRecipesTable,
          LocalRecipe,
          $$LocalRecipesTableFilterComposer,
          $$LocalRecipesTableOrderingComposer,
          $$LocalRecipesTableAnnotationComposer,
          $$LocalRecipesTableCreateCompanionBuilder,
          $$LocalRecipesTableUpdateCompanionBuilder,
          (
            LocalRecipe,
            BaseReferences<_$AppDatabase, $LocalRecipesTable, LocalRecipe>,
          ),
          LocalRecipe,
          PrefetchHooks Function()
        > {
  $$LocalRecipesTableTableManager(_$AppDatabase db, $LocalRecipesTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalRecipesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalRecipesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalRecipesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<String> title = const Value.absent(),
                Value<String> cuisine = const Value.absent(),
                Value<String> budgetTier = const Value.absent(),
                Value<String> goals = const Value.absent(),
                Value<int> minutes = const Value.absent(),
                Value<String> equipmentTags = const Value.absent(),
                Value<int> servings = const Value.absent(),
                Value<String> stepsJson = const Value.absent(),
                Value<String> macrosJson = const Value.absent(),
                Value<double> costPerServing = const Value.absent(),
                Value<double> costFullPack = const Value.absent(),
                Value<String?> imageUrl = const Value.absent(),
                Value<String> emoji = const Value.absent(),
                Value<int> gradientSeed = const Value.absent(),
                Value<String> ingredientIds = const Value.absent(),
                Value<String> ingredientSearchTerms = const Value.absent(),
              }) => LocalRecipesCompanion(
                id: id,
                title: title,
                cuisine: cuisine,
                budgetTier: budgetTier,
                goals: goals,
                minutes: minutes,
                equipmentTags: equipmentTags,
                servings: servings,
                stepsJson: stepsJson,
                macrosJson: macrosJson,
                costPerServing: costPerServing,
                costFullPack: costFullPack,
                imageUrl: imageUrl,
                emoji: emoji,
                gradientSeed: gradientSeed,
                ingredientIds: ingredientIds,
                ingredientSearchTerms: ingredientSearchTerms,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required String title,
                required String cuisine,
                required String budgetTier,
                required String goals,
                required int minutes,
                required String equipmentTags,
                required int servings,
                required String stepsJson,
                required String macrosJson,
                required double costPerServing,
                required double costFullPack,
                Value<String?> imageUrl = const Value.absent(),
                required String emoji,
                required int gradientSeed,
                required String ingredientIds,
                required String ingredientSearchTerms,
              }) => LocalRecipesCompanion.insert(
                id: id,
                title: title,
                cuisine: cuisine,
                budgetTier: budgetTier,
                goals: goals,
                minutes: minutes,
                equipmentTags: equipmentTags,
                servings: servings,
                stepsJson: stepsJson,
                macrosJson: macrosJson,
                costPerServing: costPerServing,
                costFullPack: costFullPack,
                imageUrl: imageUrl,
                emoji: emoji,
                gradientSeed: gradientSeed,
                ingredientIds: ingredientIds,
                ingredientSearchTerms: ingredientSearchTerms,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalRecipesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $LocalRecipesTable,
      LocalRecipe,
      $$LocalRecipesTableFilterComposer,
      $$LocalRecipesTableOrderingComposer,
      $$LocalRecipesTableAnnotationComposer,
      $$LocalRecipesTableCreateCompanionBuilder,
      $$LocalRecipesTableUpdateCompanionBuilder,
      (
        LocalRecipe,
        BaseReferences<_$AppDatabase, $LocalRecipesTable, LocalRecipe>,
      ),
      LocalRecipe,
      PrefetchHooks Function()
    >;
typedef $$LocalIngredientsTableCreateCompanionBuilder =
    LocalIngredientsCompanion Function({
      Value<int> id,
      required String name,
      required String aliasesJson,
      required String category,
      required String packSize,
      required double avgPackPrice,
    });
typedef $$LocalIngredientsTableUpdateCompanionBuilder =
    LocalIngredientsCompanion Function({
      Value<int> id,
      Value<String> name,
      Value<String> aliasesJson,
      Value<String> category,
      Value<String> packSize,
      Value<double> avgPackPrice,
    });

class $$LocalIngredientsTableFilterComposer
    extends Composer<_$AppDatabase, $LocalIngredientsTable> {
  $$LocalIngredientsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get aliasesJson => $composableBuilder(
    column: $table.aliasesJson,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get category => $composableBuilder(
    column: $table.category,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get packSize => $composableBuilder(
    column: $table.packSize,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get avgPackPrice => $composableBuilder(
    column: $table.avgPackPrice,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalIngredientsTableOrderingComposer
    extends Composer<_$AppDatabase, $LocalIngredientsTable> {
  $$LocalIngredientsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get name => $composableBuilder(
    column: $table.name,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get aliasesJson => $composableBuilder(
    column: $table.aliasesJson,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get category => $composableBuilder(
    column: $table.category,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get packSize => $composableBuilder(
    column: $table.packSize,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get avgPackPrice => $composableBuilder(
    column: $table.avgPackPrice,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalIngredientsTableAnnotationComposer
    extends Composer<_$AppDatabase, $LocalIngredientsTable> {
  $$LocalIngredientsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get name =>
      $composableBuilder(column: $table.name, builder: (column) => column);

  GeneratedColumn<String> get aliasesJson => $composableBuilder(
    column: $table.aliasesJson,
    builder: (column) => column,
  );

  GeneratedColumn<String> get category =>
      $composableBuilder(column: $table.category, builder: (column) => column);

  GeneratedColumn<String> get packSize =>
      $composableBuilder(column: $table.packSize, builder: (column) => column);

  GeneratedColumn<double> get avgPackPrice => $composableBuilder(
    column: $table.avgPackPrice,
    builder: (column) => column,
  );
}

class $$LocalIngredientsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $LocalIngredientsTable,
          LocalIngredient,
          $$LocalIngredientsTableFilterComposer,
          $$LocalIngredientsTableOrderingComposer,
          $$LocalIngredientsTableAnnotationComposer,
          $$LocalIngredientsTableCreateCompanionBuilder,
          $$LocalIngredientsTableUpdateCompanionBuilder,
          (
            LocalIngredient,
            BaseReferences<
              _$AppDatabase,
              $LocalIngredientsTable,
              LocalIngredient
            >,
          ),
          LocalIngredient,
          PrefetchHooks Function()
        > {
  $$LocalIngredientsTableTableManager(
    _$AppDatabase db,
    $LocalIngredientsTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalIngredientsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalIngredientsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalIngredientsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<String> name = const Value.absent(),
                Value<String> aliasesJson = const Value.absent(),
                Value<String> category = const Value.absent(),
                Value<String> packSize = const Value.absent(),
                Value<double> avgPackPrice = const Value.absent(),
              }) => LocalIngredientsCompanion(
                id: id,
                name: name,
                aliasesJson: aliasesJson,
                category: category,
                packSize: packSize,
                avgPackPrice: avgPackPrice,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required String name,
                required String aliasesJson,
                required String category,
                required String packSize,
                required double avgPackPrice,
              }) => LocalIngredientsCompanion.insert(
                id: id,
                name: name,
                aliasesJson: aliasesJson,
                category: category,
                packSize: packSize,
                avgPackPrice: avgPackPrice,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalIngredientsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $LocalIngredientsTable,
      LocalIngredient,
      $$LocalIngredientsTableFilterComposer,
      $$LocalIngredientsTableOrderingComposer,
      $$LocalIngredientsTableAnnotationComposer,
      $$LocalIngredientsTableCreateCompanionBuilder,
      $$LocalIngredientsTableUpdateCompanionBuilder,
      (
        LocalIngredient,
        BaseReferences<_$AppDatabase, $LocalIngredientsTable, LocalIngredient>,
      ),
      LocalIngredient,
      PrefetchHooks Function()
    >;
typedef $$LocalStorePricesTableCreateCompanionBuilder =
    LocalStorePricesCompanion Function({
      Value<int> id,
      required int ingredientId,
      required String store,
      required double price,
    });
typedef $$LocalStorePricesTableUpdateCompanionBuilder =
    LocalStorePricesCompanion Function({
      Value<int> id,
      Value<int> ingredientId,
      Value<String> store,
      Value<double> price,
    });

class $$LocalStorePricesTableFilterComposer
    extends Composer<_$AppDatabase, $LocalStorePricesTable> {
  $$LocalStorePricesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get store => $composableBuilder(
    column: $table.store,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get price => $composableBuilder(
    column: $table.price,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalStorePricesTableOrderingComposer
    extends Composer<_$AppDatabase, $LocalStorePricesTable> {
  $$LocalStorePricesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get store => $composableBuilder(
    column: $table.store,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get price => $composableBuilder(
    column: $table.price,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalStorePricesTableAnnotationComposer
    extends Composer<_$AppDatabase, $LocalStorePricesTable> {
  $$LocalStorePricesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => column,
  );

  GeneratedColumn<String> get store =>
      $composableBuilder(column: $table.store, builder: (column) => column);

  GeneratedColumn<double> get price =>
      $composableBuilder(column: $table.price, builder: (column) => column);
}

class $$LocalStorePricesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $LocalStorePricesTable,
          LocalStorePrice,
          $$LocalStorePricesTableFilterComposer,
          $$LocalStorePricesTableOrderingComposer,
          $$LocalStorePricesTableAnnotationComposer,
          $$LocalStorePricesTableCreateCompanionBuilder,
          $$LocalStorePricesTableUpdateCompanionBuilder,
          (
            LocalStorePrice,
            BaseReferences<
              _$AppDatabase,
              $LocalStorePricesTable,
              LocalStorePrice
            >,
          ),
          LocalStorePrice,
          PrefetchHooks Function()
        > {
  $$LocalStorePricesTableTableManager(
    _$AppDatabase db,
    $LocalStorePricesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalStorePricesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalStorePricesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalStorePricesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                Value<int> ingredientId = const Value.absent(),
                Value<String> store = const Value.absent(),
                Value<double> price = const Value.absent(),
              }) => LocalStorePricesCompanion(
                id: id,
                ingredientId: ingredientId,
                store: store,
                price: price,
              ),
          createCompanionCallback:
              ({
                Value<int> id = const Value.absent(),
                required int ingredientId,
                required String store,
                required double price,
              }) => LocalStorePricesCompanion.insert(
                id: id,
                ingredientId: ingredientId,
                store: store,
                price: price,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalStorePricesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $LocalStorePricesTable,
      LocalStorePrice,
      $$LocalStorePricesTableFilterComposer,
      $$LocalStorePricesTableOrderingComposer,
      $$LocalStorePricesTableAnnotationComposer,
      $$LocalStorePricesTableCreateCompanionBuilder,
      $$LocalStorePricesTableUpdateCompanionBuilder,
      (
        LocalStorePrice,
        BaseReferences<_$AppDatabase, $LocalStorePricesTable, LocalStorePrice>,
      ),
      LocalStorePrice,
      PrefetchHooks Function()
    >;
typedef $$LocalFavoritesTableCreateCompanionBuilder =
    LocalFavoritesCompanion Function({
      Value<int> recipeId,
      Value<DateTime> savedAt,
    });
typedef $$LocalFavoritesTableUpdateCompanionBuilder =
    LocalFavoritesCompanion Function({
      Value<int> recipeId,
      Value<DateTime> savedAt,
    });

class $$LocalFavoritesTableFilterComposer
    extends Composer<_$AppDatabase, $LocalFavoritesTable> {
  $$LocalFavoritesTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get recipeId => $composableBuilder(
    column: $table.recipeId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get savedAt => $composableBuilder(
    column: $table.savedAt,
    builder: (column) => ColumnFilters(column),
  );
}

class $$LocalFavoritesTableOrderingComposer
    extends Composer<_$AppDatabase, $LocalFavoritesTable> {
  $$LocalFavoritesTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get recipeId => $composableBuilder(
    column: $table.recipeId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get savedAt => $composableBuilder(
    column: $table.savedAt,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$LocalFavoritesTableAnnotationComposer
    extends Composer<_$AppDatabase, $LocalFavoritesTable> {
  $$LocalFavoritesTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get recipeId =>
      $composableBuilder(column: $table.recipeId, builder: (column) => column);

  GeneratedColumn<DateTime> get savedAt =>
      $composableBuilder(column: $table.savedAt, builder: (column) => column);
}

class $$LocalFavoritesTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $LocalFavoritesTable,
          LocalFavorite,
          $$LocalFavoritesTableFilterComposer,
          $$LocalFavoritesTableOrderingComposer,
          $$LocalFavoritesTableAnnotationComposer,
          $$LocalFavoritesTableCreateCompanionBuilder,
          $$LocalFavoritesTableUpdateCompanionBuilder,
          (
            LocalFavorite,
            BaseReferences<_$AppDatabase, $LocalFavoritesTable, LocalFavorite>,
          ),
          LocalFavorite,
          PrefetchHooks Function()
        > {
  $$LocalFavoritesTableTableManager(
    _$AppDatabase db,
    $LocalFavoritesTable table,
  ) : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$LocalFavoritesTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$LocalFavoritesTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$LocalFavoritesTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<int> recipeId = const Value.absent(),
                Value<DateTime> savedAt = const Value.absent(),
              }) =>
                  LocalFavoritesCompanion(recipeId: recipeId, savedAt: savedAt),
          createCompanionCallback:
              ({
                Value<int> recipeId = const Value.absent(),
                Value<DateTime> savedAt = const Value.absent(),
              }) => LocalFavoritesCompanion.insert(
                recipeId: recipeId,
                savedAt: savedAt,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$LocalFavoritesTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $LocalFavoritesTable,
      LocalFavorite,
      $$LocalFavoritesTableFilterComposer,
      $$LocalFavoritesTableOrderingComposer,
      $$LocalFavoritesTableAnnotationComposer,
      $$LocalFavoritesTableCreateCompanionBuilder,
      $$LocalFavoritesTableUpdateCompanionBuilder,
      (
        LocalFavorite,
        BaseReferences<_$AppDatabase, $LocalFavoritesTable, LocalFavorite>,
      ),
      LocalFavorite,
      PrefetchHooks Function()
    >;
typedef $$PantryItemsTableCreateCompanionBuilder =
    PantryItemsCompanion Function({
      required String id,
      required String deviceId,
      required int ingredientId,
      required double quantityGrams,
      required DateTime purchaseDate,
      Value<DateTime?> expiryDate,
      Value<int> rowid,
    });
typedef $$PantryItemsTableUpdateCompanionBuilder =
    PantryItemsCompanion Function({
      Value<String> id,
      Value<String> deviceId,
      Value<int> ingredientId,
      Value<double> quantityGrams,
      Value<DateTime> purchaseDate,
      Value<DateTime?> expiryDate,
      Value<int> rowid,
    });

class $$PantryItemsTableFilterComposer
    extends Composer<_$AppDatabase, $PantryItemsTable> {
  $$PantryItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<String> get deviceId => $composableBuilder(
    column: $table.deviceId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<double> get quantityGrams => $composableBuilder(
    column: $table.quantityGrams,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get purchaseDate => $composableBuilder(
    column: $table.purchaseDate,
    builder: (column) => ColumnFilters(column),
  );

  ColumnFilters<DateTime> get expiryDate => $composableBuilder(
    column: $table.expiryDate,
    builder: (column) => ColumnFilters(column),
  );
}

class $$PantryItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $PantryItemsTable> {
  $$PantryItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
    column: $table.id,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<String> get deviceId => $composableBuilder(
    column: $table.deviceId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<double> get quantityGrams => $composableBuilder(
    column: $table.quantityGrams,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get purchaseDate => $composableBuilder(
    column: $table.purchaseDate,
    builder: (column) => ColumnOrderings(column),
  );

  ColumnOrderings<DateTime> get expiryDate => $composableBuilder(
    column: $table.expiryDate,
    builder: (column) => ColumnOrderings(column),
  );
}

class $$PantryItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $PantryItemsTable> {
  $$PantryItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get deviceId =>
      $composableBuilder(column: $table.deviceId, builder: (column) => column);

  GeneratedColumn<int> get ingredientId => $composableBuilder(
    column: $table.ingredientId,
    builder: (column) => column,
  );

  GeneratedColumn<double> get quantityGrams => $composableBuilder(
    column: $table.quantityGrams,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get purchaseDate => $composableBuilder(
    column: $table.purchaseDate,
    builder: (column) => column,
  );

  GeneratedColumn<DateTime> get expiryDate => $composableBuilder(
    column: $table.expiryDate,
    builder: (column) => column,
  );
}

class $$PantryItemsTableTableManager
    extends
        RootTableManager<
          _$AppDatabase,
          $PantryItemsTable,
          PantryItem,
          $$PantryItemsTableFilterComposer,
          $$PantryItemsTableOrderingComposer,
          $$PantryItemsTableAnnotationComposer,
          $$PantryItemsTableCreateCompanionBuilder,
          $$PantryItemsTableUpdateCompanionBuilder,
          (
            PantryItem,
            BaseReferences<_$AppDatabase, $PantryItemsTable, PantryItem>,
          ),
          PantryItem,
          PrefetchHooks Function()
        > {
  $$PantryItemsTableTableManager(_$AppDatabase db, $PantryItemsTable table)
    : super(
        TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$PantryItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$PantryItemsTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$PantryItemsTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback:
              ({
                Value<String> id = const Value.absent(),
                Value<String> deviceId = const Value.absent(),
                Value<int> ingredientId = const Value.absent(),
                Value<double> quantityGrams = const Value.absent(),
                Value<DateTime> purchaseDate = const Value.absent(),
                Value<DateTime?> expiryDate = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PantryItemsCompanion(
                id: id,
                deviceId: deviceId,
                ingredientId: ingredientId,
                quantityGrams: quantityGrams,
                purchaseDate: purchaseDate,
                expiryDate: expiryDate,
                rowid: rowid,
              ),
          createCompanionCallback:
              ({
                required String id,
                required String deviceId,
                required int ingredientId,
                required double quantityGrams,
                required DateTime purchaseDate,
                Value<DateTime?> expiryDate = const Value.absent(),
                Value<int> rowid = const Value.absent(),
              }) => PantryItemsCompanion.insert(
                id: id,
                deviceId: deviceId,
                ingredientId: ingredientId,
                quantityGrams: quantityGrams,
                purchaseDate: purchaseDate,
                expiryDate: expiryDate,
                rowid: rowid,
              ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ),
      );
}

typedef $$PantryItemsTableProcessedTableManager =
    ProcessedTableManager<
      _$AppDatabase,
      $PantryItemsTable,
      PantryItem,
      $$PantryItemsTableFilterComposer,
      $$PantryItemsTableOrderingComposer,
      $$PantryItemsTableAnnotationComposer,
      $$PantryItemsTableCreateCompanionBuilder,
      $$PantryItemsTableUpdateCompanionBuilder,
      (
        PantryItem,
        BaseReferences<_$AppDatabase, $PantryItemsTable, PantryItem>,
      ),
      PantryItem,
      PrefetchHooks Function()
    >;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$LocalRecipesTableTableManager get localRecipes =>
      $$LocalRecipesTableTableManager(_db, _db.localRecipes);
  $$LocalIngredientsTableTableManager get localIngredients =>
      $$LocalIngredientsTableTableManager(_db, _db.localIngredients);
  $$LocalStorePricesTableTableManager get localStorePrices =>
      $$LocalStorePricesTableTableManager(_db, _db.localStorePrices);
  $$LocalFavoritesTableTableManager get localFavorites =>
      $$LocalFavoritesTableTableManager(_db, _db.localFavorites);
  $$PantryItemsTableTableManager get pantryItems =>
      $$PantryItemsTableTableManager(_db, _db.pantryItems);
}
