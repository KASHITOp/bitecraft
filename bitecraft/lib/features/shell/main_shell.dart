import 'package:flutter/material.dart';
import '../../core/widgets/floating_pill_nav.dart';

class MainShell extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final ValueChanged<int> onIndexChanged;

  const MainShell({
    super.key,
    required this.child,
    required this.currentIndex,
    required this.onIndexChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: child,
      bottomNavigationBar: FloatingPillNav(
        currentIndex: currentIndex,
        onIndexChanged: onIndexChanged,
      ),
    );
  }
}
