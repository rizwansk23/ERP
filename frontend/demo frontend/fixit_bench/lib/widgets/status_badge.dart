import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_fonts.dart';

enum StatusTone { red, amber, green, neutral }

Color _fg(StatusTone t) {
  switch (t) {
    case StatusTone.red:
      return AppColors.red;
    case StatusTone.amber:
      return AppColors.amber;
    case StatusTone.green:
      return AppColors.green;
    case StatusTone.neutral:
      return AppColors.slate;
  }
}

Color _bg(StatusTone t) {
  switch (t) {
    case StatusTone.red:
      return AppColors.redBg;
    case StatusTone.amber:
      return AppColors.amberBg;
    case StatusTone.green:
      return AppColors.greenBg;
    case StatusTone.neutral:
      return AppColors.accentSoft;
  }
}

/// Small colored dot, used before a label to flag pending/balance/completed.
class StatusDot extends StatelessWidget {
  final StatusTone tone;
  const StatusDot({super.key, required this.tone});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(color: _fg(tone), shape: BoxShape.circle),
    );
  }
}

/// Pill badge with a tinted background — mirrors the red/amber/green
/// status badges used across payments, works, and staff screens.
class StatusBadge extends StatelessWidget {
  final String label;
  final StatusTone tone;
  const StatusBadge({super.key, required this.label, required this.tone});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _bg(tone),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          StatusDot(tone: tone),
          const SizedBox(width: 6),
          Text(label, style: AppFonts.body(size: 11.5, weight: FontWeight.w600, color: _fg(tone))),
        ],
      ),
    );
  }
}
