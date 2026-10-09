class Ingredient {
  final int id;
  final String name;
  final List<String> aliases;
  final String category;
  final String packSize;
  final double avgPackPrice;

  const Ingredient({
    required this.id,
    required this.name,
    required this.aliases,
    required this.category,
    required this.packSize,
    required this.avgPackPrice,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) {
    return Ingredient(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      aliases: (json['aliases'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      category: json['category'] as String? ?? 'General',
      packSize: json['packSize'] as String? ?? json['pack_size'] as String? ?? '1 unit',
      avgPackPrice: (json['avgPackPrice'] as num?)?.toDouble() ??
          (json['avg_pack_price'] as num?)?.toDouble() ??
          0.0,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'aliases': aliases,
        'category': category,
        'packSize': packSize,
        'avgPackPrice': avgPackPrice,
      };

  // Matches query against name OR any alias (e.g. "kanda", "pyaz", "onion")
  bool matches(String query) {
    final lower = query.trim().toLowerCase();
    if (name.toLowerCase().contains(lower)) return true;
    for (final alias in aliases) {
      if (alias.toLowerCase().contains(lower)) return true;
    }
    return false;
  }
}
