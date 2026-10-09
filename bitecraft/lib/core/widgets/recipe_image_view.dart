import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'shimmer_skeleton.dart';

class RecipeImageView extends StatelessWidget {
  final String? imageUrl;
  final String? emoji;
  final int? gradientSeed;
  final String heroTag;
  final double? width;
  final double? height;
  final double borderRadius;
  final BoxFit fit;

  const RecipeImageView({
    super.key,
    this.imageUrl,
    this.emoji,
    this.gradientSeed,
    this.heroTag = '',
    this.width,
    this.height,
    this.borderRadius = 18,
    this.fit = BoxFit.cover,
  });

  // Food emojis pool for deterministic fallback
  static const List<String> fallbackEmojis = [
    '🥑', '🍲', '🍳', '🥗', '🥘', '🍛', '🍜', '🍝',
    '🌯', '🥪', '🥟', '🥙', '🍣', '🍱', '🥣', '🍚',
    '🥞', '🧇', '🍗', '🍤', '🌮', '🥩', '🍕', '🍞'
  ];

  static const List<List<Color>> gradientPool = [
    [Color(0xFFFF5A36), Color(0xFFFF9E7D)], // Sunset coral
    [Color(0xFF2E7D32), Color(0xFF81C784)], // Herb green
    [Color(0xFF6A1B9A), Color(0xFFBA68C8)], // Hi-Fi violet
    [Color(0xFFF57C00), Color(0xFFFFB74D)], // Warm saffron
    [Color(0xFF00897B), Color(0xFF4DB6AC)], // Ocean teal
    [Color(0xFFC2185B), Color(0xFFF06292)], // Berry blush
    [Color(0xFF5D4037), Color(0xFFA1887F)], // Roasted cocoa
    [Color(0xFF1E88E5), Color(0xFF64B5F6)], // Cool sky
  ];

  @override
  Widget build(BuildContext context) {
    final seed = gradientSeed ?? (heroTag.hashCode.abs());
    final effectiveEmoji = (emoji != null && emoji!.isNotEmpty)
        ? emoji!
        : fallbackEmojis[seed % fallbackEmojis.length];
    final gradientColors = gradientPool[seed % gradientPool.length];

    Widget content;

    final hasValidUrl = imageUrl != null &&
        imageUrl!.trim().isNotEmpty &&
        (imageUrl!.startsWith('http://') || imageUrl!.startsWith('https://'));

    if (hasValidUrl) {
      content = CachedNetworkImage(
        imageUrl: imageUrl!,
        width: width,
        height: height,
        fit: fit,
        placeholder: (context, url) => ShimmerBox(
          width: width,
          height: height ?? 160,
          borderRadius: borderRadius,
        ),
        errorWidget: (context, url, error) => _buildFallback(gradientColors, effectiveEmoji),
      );
    } else {
      content = _buildFallback(gradientColors, effectiveEmoji);
    }

    final clipped = ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: content,
    );

    if (heroTag.isNotEmpty) {
      return Hero(tag: heroTag, child: clipped);
    }

    return clipped;
  }

  Widget _buildFallback(List<Color> colors, String displayEmoji) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colors,
        ),
      ),
      alignment: Alignment.center,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.18),
          shape: BoxShape.circle,
        ),
        child: Text(
          displayEmoji,
          style: TextStyle(
            fontSize: (height != null && height! < 120) ? 26 : 42,
          ),
        ),
      ).animate().scale(duration: 300.ms, curve: Curves.easeOutBack),
    );
  }
}
