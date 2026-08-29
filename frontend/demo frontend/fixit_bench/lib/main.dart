import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/app_state.dart';
import 'core/constants/app_colors.dart';
import 'core/constants/app_fonts.dart';
import 'core/constants/mock_data.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/lock_overlay.dart';
import 'screens/shared/intake_screen.dart';
import 'screens/shared/payments_screen.dart';
import 'screens/shared/works_screen.dart';
import 'screens/admin/dashboard_screen.dart';
import 'screens/admin/staff_mgmt_screen.dart';
import 'screens/admin/form_mgmt_screen.dart';
import 'screens/admin/activity_log_screen.dart';
import 'screens/admin/profile_screen.dart';
import 'widgets/app_sidebar.dart';

void main() {
  runApp(const FixitBenchApp());
}

class FixitBenchApp extends StatelessWidget {
  const FixitBenchApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState(),
      child: MaterialApp(
        title: 'Fixit Bench',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          scaffoldBackgroundColor: AppColors.paper,
          colorScheme: ColorScheme.fromSeed(
            seedColor: AppColors.accent,
            primary: AppColors.accent,
            surface: AppColors.surface,
          ),
          textTheme: AppFonts.textTheme,
          dividerColor: AppColors.line,
        ),
        home: const AppRoot(),
      ),
    );
  }
}

/// Top-level routing shell: login → (locked overlay |) → sidebar + view.
class AppRoot extends StatelessWidget {
  const AppRoot({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    if (!state.signedIn) {
      return const LoginScreen();
    }

    return Scaffold(
      body: Stack(
        children: [
          Row(
            children: [
              const AppSidebar(),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _TopBar(view: state.currentView),
                    const Divider(height: 1, color: AppColors.line),
                    Expanded(child: _CurrentView(view: state.currentView)),
                  ],
                ),
              ),
            ],
          ),
          if (state.appLocked) const LockOverlay(),
        ],
      ),
    );
  }
}

class _TopBar extends StatelessWidget {
  final String view;
  const _TopBar({required this.view});

  @override
  Widget build(BuildContext context) {
    final titles = MockData.titles[view] ?? ['', ''];
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
      color: AppColors.surface,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(titles[0].toUpperCase(), style: AppFonts.label),
                const SizedBox(height: 2),
                Text(titles[1], style: AppFonts.display(size: 20)),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Lock application',
            onPressed: () => context.read<AppState>().lockApp(),
            icon: const Icon(Icons.lock_outline, size: 19, color: AppColors.slate),
          ),
        ],
      ),
    );
  }
}

class _CurrentView extends StatelessWidget {
  final String view;
  const _CurrentView({required this.view});

  @override
  Widget build(BuildContext context) {
    switch (view) {
      case 'dashboard':
        return const DashboardScreen();
      case 'intake':
        return const IntakeScreen();
      case 'payments':
        return const PaymentsScreen();
      case 'works':
        return const WorksScreen();
      case 'staff':
        return const StaffMgmtScreen();
      case 'formmgmt':
        return const FormMgmtScreen();
      case 'activity':
        return const ActivityLogScreen();
      case 'profile':
        return const ProfileScreen();
      default:
        return const DashboardScreen();
    }
  }
}
