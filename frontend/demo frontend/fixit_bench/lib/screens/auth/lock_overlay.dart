import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';

/// Full-screen dimmed overlay shown when the app is locked. Mirrors
/// `#lock-overlay` in the HTML reference.
class LockOverlay extends StatefulWidget {
  const LockOverlay({super.key});

  @override
  State<LockOverlay> createState() => _LockOverlayState();
}

class _LockOverlayState extends State<LockOverlay> {
  final passController = TextEditingController();
  bool showForgot = false;

  void _unlock() {
    final state = context.read<AppState>();
    if (state.unlockApp(passController.text.trim())) {
      passController.clear();
    } else {
      AppToast.show(context, 'Incorrect application password');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: Container(
        color: AppColors.ink.withOpacity(0.55),
        alignment: Alignment.center,
        child: Container(
          width: 320,
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.lock_outline, size: 38, color: AppColors.accent),
              const SizedBox(height: 14),
              Text('Application locked', textAlign: TextAlign.center, style: AppFonts.display(size: 15)),
              const SizedBox(height: 4),
              Text('Enter the application password to continue.',
                  textAlign: TextAlign.center, style: AppFonts.body(size: 12, color: AppColors.slate)),
              const SizedBox(height: 16),
              TextField(
                controller: passController,
                obscureText: true,
                textAlign: TextAlign.center,
                style: AppFonts.body(size: 13),
                decoration: InputDecoration(
                  hintText: 'Application password',
                  hintStyle: AppFonts.body(size: 13, color: AppColors.faint),
                  filled: true,
                  fillColor: AppColors.surface,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppColors.radius),
                    borderSide: const BorderSide(color: AppColors.line),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppColors.radius),
                    borderSide: const BorderSide(color: AppColors.line),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppColors.radius),
                    borderSide: const BorderSide(color: AppColors.accent, width: 2),
                  ),
                ),
                onSubmitted: (_) => _unlock(),
              ),
              const SizedBox(height: 10),
              PrimaryButton(label: 'Unlock', onPressed: _unlock, fullWidth: true),
              const SizedBox(height: 4),
              TextButton(
                onPressed: () => setState(() => showForgot = !showForgot),
                child: Text('Forgot password?',
                    style: AppFonts.body(size: 12, color: AppColors.accent).copyWith(decoration: TextDecoration.underline)),
              ),
              if (showForgot)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.paper,
                    border: Border.all(color: AppColors.line),
                    borderRadius: BorderRadius.circular(AppColors.radius),
                  ),
                  child: Text(
                    'Enter your default admin login password to reset the application lock, '
                    'then set a new one from Profile.',
                    style: AppFonts.body(size: 12, color: AppColors.slate),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
