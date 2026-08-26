import 'package:flutter/material.dart';

/// App-wide color palette. Mirrors the CSS custom properties from the
/// original HTML reference (--paper, --surface, --accent, etc.)
class AppColors {
  AppColors._();

  static const Color paper = Color(0xFFFAFAF8);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color ink = Color(0xFF1C1B1A);
  static const Color slate = Color(0xFF6E6A62);
  static const Color faint = Color(0xFFA6A299);
  static const Color line = Color(0xFFE3E0D8);

  static const Color accent = Color(0xFF33544A);
  static const Color accentHover = Color(0xFF294540);
  static const Color accentInk = Color(0xFFFFFFFF);
  static const Color accentSoft = Color(0xFFE7EDE9);

  static const Color red = Color(0xFFB23B2E);
  static const Color redBg = Color(0xFFF8EAE7);

  static const Color green = Color(0xFF3E7A56);
  static const Color greenBg = Color(0xFFE8F2EB);

  static const Color amber = Color(0xFFA6741A);
  static const Color amberBg = Color(0xFFF7EFDE);

  static const double radius = 6;
}
