import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

// Shells
import '../core/layout/app_shell.dart';
import '../features/staff/shell/staff_shell.dart';

// Authentication
import '../features/login/screens/admin_login_screen.dart';

// Common Shared Screens
import '../features/common/payments/screens/payment_dashboard_screen.dart';
import '../features/common/profile/screens/profile_screen.dart';

// Admin Specific Screens
import '../features/admin/dashboard/screens/dashboard_screen.dart';
import '../features/admin/customer_intake/screens/customer_intake_screen.dart';
import '../features/admin/works/screens/works_dashboard_screen.dart';
import '../features/admin/staff_management/screens/staff_management_screen.dart';
import '../features/admin/activity/screens/activity_log_screen.dart';
import '../features/admin/form_management/screens/form_management_screen.dart';

// Staff Specific Screens
import '../features/staff/customer_intake/screens/staff_customer_intake_screen.dart';
import '../features/staff/works/screens/staff_works_dashboard_screen.dart';

final GlobalKey<NavigatorState> _rootNav = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _adminShellNav = GlobalKey<NavigatorState>();
final GlobalKey<NavigatorState> _staffShellNav = GlobalKey<NavigatorState>();

final appRouter = GoRouter(
  navigatorKey: _rootNav,
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const AdminLoginScreen(),
    ),
    
    // ================= ADMIN SHELL ROUTE =================
    ShellRoute(
      navigatorKey: _adminShellNav,
      builder: (context, state, child) => AppShell(child: child),
      routes: [
        GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
        GoRoute(path: '/intake', builder: (context, state) => const CustomerIntakeScreen()),
        GoRoute(path: '/payments', builder: (context, state) => const PaymentDashboardScreen()),
        GoRoute(path: '/works', builder: (context, state) => const WorksDashboardScreen()),
        GoRoute(path: '/staff', builder: (context, state) => const StaffManagementScreen()),
        GoRoute(path: '/activity', builder: (context, state) => const ActivityLogScreen()),
        GoRoute(path: '/forms', builder: (context, state) => const FormManagementScreen()),
        GoRoute(path: '/profile', builder: (context, state) => const ProfileScreen()),
      ],
    ),

    // ================= STAFF SHELL ROUTE =================
    ShellRoute(
      navigatorKey: _staffShellNav,
      builder: (context, state, child) => StaffShell(child: child),
      routes: [
        GoRoute(path: '/staff/intake', builder: (context, state) => const StaffCustomerIntakeScreen()),
        GoRoute(path: '/staff/payments', builder: (context, state) => const PaymentDashboardScreen()), // Points to Shared Payment Screen
        GoRoute(path: '/staff/works', builder: (context, state) => const StaffWorksDashboardScreen()),
      ],
    ),
  ],
);
