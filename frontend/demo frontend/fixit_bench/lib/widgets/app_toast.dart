import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_fonts.dart';

/// Bottom-right toast notification, mirrors the `.toast` element in the
/// HTML reference (dark pill, fades + slides in, auto-dismisses).
class AppToast {
  AppToast._();

  static OverlayEntry? _entry;

  static void show(BuildContext context, String message) {
    _entry?.remove();
    final overlay = Overlay.of(context);

    final entry = OverlayEntry(
      builder: (context) => _ToastWidget(message: message),
    );
    _entry = entry;
    overlay.insert(entry);

    Future.delayed(const Duration(milliseconds: 2400), () {
      entry.remove();
      if (_entry == entry) _entry = null;
    });
  }
}

class _ToastWidget extends StatefulWidget {
  final String message;
  const _ToastWidget({required this.message});

  @override
  State<_ToastWidget> createState() => _ToastWidgetState();
}

class _ToastWidgetState extends State<_ToastWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 200),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: 24,
      right: 24,
      child: FadeTransition(
        opacity: _controller,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.15),
            end: Offset.zero,
          ).animate(_controller),
          child: Material(
            color: Colors.transparent,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
              decoration: BoxDecoration(
                color: AppColors.ink,
                borderRadius: BorderRadius.circular(AppColors.radius),
                boxShadow: const [
                  BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, 4)),
                ],
              ),
              child: Text(
                widget.message,
                style: AppFonts.body(size: 13, color: Colors.white),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
