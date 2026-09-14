import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart'; 
import 'app_colors.dart';

enum AppFontSize { small, medium, large }

class AppTheme {
  static ValueNotifier<AppFontSize> fontSizeNotifier = ValueNotifier(AppFontSize.medium);

  static ThemeData getTheme(AppFontSize sizeType) {
    double headingSize = sizeType == AppFontSize.small ? 16 : (sizeType == AppFontSize.large ? 24 : 20);
    double subHeadingSize = sizeType == AppFontSize.small ? 15 : (sizeType == AppFontSize.large ? 20 : 18);
    double normalSize = sizeType == AppFontSize.small ? 11 : (sizeType == AppFontSize.large ? 15 : 13);
    double smallTextSize = sizeType == AppFontSize.small ? 9 : (sizeType == AppFontSize.large ? 13 : 11);

    ThemeData baseTheme = ThemeData(
      scaffoldBackgroundColor: AppColors.paper,
      useMaterial3: true,
      textTheme: TextTheme(
        titleLarge: TextStyle(fontSize: headingSize, fontWeight: FontWeight.bold, color: AppColors.ink),
        titleMedium: TextStyle(fontSize: subHeadingSize, fontWeight: FontWeight.w600, color: AppColors.ink),
        bodyMedium: TextStyle(fontSize: normalSize, color: AppColors.ink),
        labelSmall: TextStyle(fontSize: smallTextSize, color: AppColors.slate, letterSpacing: 0.5),
      ),
    );

      // Font Style
      
      // Cambria 
      // return baseTheme.copyWith(textTheme: GoogleFonts.cambriaTextTheme(baseTheme.textTheme));

      //Times New Roman
      // return baseTheme.copyWith(textTheme: GoogleFonts.timesNewRomanTextTheme(baseTheme.textTheme));

      // Comic Sans
      // return baseTheme.copyWith(textTheme: GoogleFonts.comicNeueTextTheme(baseTheme.textTheme)); // Comic Neue is the modern, web-safe version of Comic Sans available in Google Fonts

      // System Default
      return baseTheme;
  }
}
