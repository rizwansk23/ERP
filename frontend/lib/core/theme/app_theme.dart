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

    // ==========================================
    // FONT STYLES (Test by uncommenting one)
    // ==========================================
    
    // Option A: Poppins (Clean, Round, Modern - Best for Dashboards)
    // return baseTheme.copyWith(textTheme: GoogleFonts.poppinsTextTheme(baseTheme.textTheme));
    
    // Option B: Inter (Highly Readable, Default choice for modern web apps)
    return baseTheme.copyWith(textTheme: GoogleFonts.interTextTheme(baseTheme.textTheme));
    
    // Option C: Roboto (Classic Android, Professional & Dense)
    // return baseTheme.copyWith(textTheme: GoogleFonts.robotoTextTheme(baseTheme.textTheme));

    // Option D: Lato (Elegant, slightly thinner, good for corporate ERPs)
    // return baseTheme.copyWith(textTheme: GoogleFonts.latoTextTheme(baseTheme.textTheme));
  }
}
