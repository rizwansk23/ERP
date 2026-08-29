import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_fonts.dart';

enum ButtonSize { regular, small }

/// Solid accent button — mirrors `.btn.btn-primary` in the HTML reference.
class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonSize size;
  final bool fullWidth;
  final IconData? icon;

  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = ButtonSize.regular,
    this.fullWidth = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final button = ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.accent,
        foregroundColor: AppColors.accentInk,
        disabledBackgroundColor: AppColors.accent.withOpacity(0.5),
        elevation: 0,
        padding: EdgeInsets.symmetric(
          horizontal: size == ButtonSize.small ? 10 : 14,
          vertical: size == ButtonSize.small ? 5 : 10,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radius),
        ),
      ).copyWith(
        overlayColor: WidgetStateProperty.all(AppColors.accentHover.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 15),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: AppFonts.body(
              size: size == ButtonSize.small ? 12 : 13,
              weight: FontWeight.w600,
              color: AppColors.accentInk,
            ),
          ),
        ],
      ),
    );
    return fullWidth ? SizedBox(width: double.infinity, child: button) : button;
  }
}

/// Outlined / bordered button — mirrors `.btn` (default variant).
class OutlineButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonSize size;
  final IconData? icon;

  const OutlineButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.size = ButtonSize.regular,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        backgroundColor: AppColors.surface,
        foregroundColor: AppColors.ink,
        side: const BorderSide(color: AppColors.line),
        padding: EdgeInsets.symmetric(
          horizontal: size == ButtonSize.small ? 10 : 14,
          vertical: size == ButtonSize.small ? 5 : 10,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.radius),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 15),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: AppFonts.body(
              size: size == ButtonSize.small ? 12 : 13,
              weight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

/// Borderless, low-emphasis button — mirrors `.btn.btn-ghost`.
class GhostButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;

  const GhostButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onPressed,
      style: TextButton.styleFrom(
        foregroundColor: AppColors.slate,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      ),
      child: Text(label, style: AppFonts.body(size: 12.5, color: AppColors.slate)),
    );
  }
}
