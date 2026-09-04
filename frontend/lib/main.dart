import 'package:flutter/material.dart';
import 'app/router.dart';
import 'core/theme/app_theme.dart';

void main() {
  runApp(const VyomErpApp());
}

class VyomErpApp extends StatelessWidget {
  const VyomErpApp({super.key});

  @override
  Widget build(BuildContext context) {
    // ValueListenableBuilder pure app ko rebuild karega jab font size change hoga
    return ValueListenableBuilder<AppFontSize>(
      valueListenable: AppTheme.fontSizeNotifier,
      builder: (context, currentSize, child) {
        return MaterialApp.router(
          title: 'Vyom ERP',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.getTheme(currentSize), // Naya dynamic theme apply kiya
          routerConfig: appRouter,
        );
      },
    );
  }
}