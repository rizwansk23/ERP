import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Centralized text styles. --display: Space Grotesk, --body: Inter,
/// --mono: IBM Plex Mono (used for numeric/currency/receipt values).
class AppFonts {
  AppFonts._();

  static TextStyle display({
    double size = 20,
    FontWeight weight = FontWeight.w600,
    Color color = AppColors.ink,
    double? letterSpacing,
  }) =>
      GoogleFonts.spaceGrotesk(
        fontSize: size,
        fontWeight: weight,
        color: color,
        letterSpacing: letterSpacing ?? -0.2,
      );

  static TextStyle body({
    double size = 13,
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.ink,
  }) =>
      GoogleFonts.inter(
        fontSize: size,
        fontWeight: weight,
        color: color,
      );

  static TextStyle mono({
    double size = 13,
    FontWeight weight = FontWeight.w500,
    Color color = AppColors.ink,
  }) =>
      GoogleFonts.ibmPlexMono(
        fontSize: size,
        fontWeight: weight,
        color: color,
      );

  static TextStyle label = GoogleFonts.inter(
    fontSize: 11,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.5,
    color: AppColors.slate,
  );

  static TextTheme textTheme = TextTheme(
    displayLarge: display(size: 26),
    headlineMedium: display(size: 20),
    titleMedium: display(size: 15),
    bodyMedium: body(size: 13),
    bodySmall: body(size: 11.5, color: AppColors.slate),
    labelLarge: label,
  );
}
