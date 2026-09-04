import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';

class AppShell extends StatelessWidget {
  final Widget child;
  const AppShell({super.key, required this.child});

  String _getScreenTitle(String path) {
    switch (path) {
      case '/dashboard': return 'Dashboard';
      case '/intake': return 'Customer Intake';
      case '/payments': return 'Payment Dashboard';
      case '/works': return 'Works Dashboard';
      case '/staff': return 'Staff Management';
      case '/activity': return 'Activity Log';
      case '/forms': return 'Form Management';
      case '/profile': return 'Profile';
      default: return 'Workspace';
    }
  }

  // YAHAN DYNAMIC CATEGORY MAPPING HAI
  String _getCategoryName(String path) {
    if (path.contains('/dashboard')) return 'OVERVIEW';
    if (path.contains('/intake')) return 'NEW ENTRY';
    if (path.contains('/payments')) return 'ACCOUNTS';
    if (path.contains('/works')) return 'OPERATIONS';
    if (path == '/staff') return 'TEAM';
    if (path.contains('/activity')) return 'SYSTEM LOGS';
    if (path.contains('/forms')) return 'SERVICES';
    if (path.contains('/profile')) return 'SETTINGS';
    return 'MODULE';
  }

  Widget _buildSidebarDivider() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20.0),
      child: Divider(color: Colors.white.withOpacity(0.3), height: 1),
    );
  }

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    final screenTitle = _getScreenTitle(location);
    final categoryName = _getCategoryName(location);
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      backgroundColor: AppColors.paper,
      body: Row(
        children: [
          Container(
            width: 280,
            color: AppColors.navy1,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    children: [
                      Container(
                        width: 34, height: 34,
                        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(7)),
                        alignment: Alignment.center,
                        child: Text('PA', style: textTheme.titleMedium?.copyWith(color: AppColors.navy1, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('VYOM OS', style: textTheme.labelSmall?.copyWith(color: Colors.white54, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                            Text('Pritam Associates', style: textTheme.titleMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
                            // YAHAN ADMIN APPLICATION ADD KIYA
                            // Text('ADMIN APPLICATION', style: textTheme.labelSmall?.copyWith(color: Colors.white54, fontWeight: FontWeight.bold, letterSpacing: 0.5), overflow: TextOverflow.ellipsis),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                _buildSidebarDivider(),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    children: [
                      _NavItem(icon: LucideIcons.layoutDashboard, label: 'Dashboard', path: '/dashboard', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.userPlus, label: 'Customer Intake', path: '/intake', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.creditCard, label: 'Payment Dashboard', path: '/payments', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.briefcase, label: 'Works Dashboard', path: '/works', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.users, label: 'Staff Management', path: '/staff', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.formInput, label: 'Form Management', path: '/forms', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.activity, label: 'Activity Log', path: '/activity', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.settings, label: 'Profile', path: '/profile', current: location, textTheme: textTheme),
                    ],
                  ),
                ),
                _buildSidebarDivider(),
                Padding(
                  padding: const EdgeInsets.all(14.0),
                  child: TextButton.icon(
                    onPressed: () => context.go('/login'),
                    icon: const Icon(LucideIcons.logOut, color: Colors.white70, size: 16),
                    label: Text('Sign out', style: textTheme.bodyMedium?.copyWith(color: Colors.white70)),
                  ),
                )
              ],
            ),
          ),
          Expanded(
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 20),
                  decoration: const BoxDecoration(
                    color: AppColors.navy1,
                    border: Border(bottom: BorderSide(color: AppColors.line)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // YAHAN CATEGORY NAME BIND KIYA
                          Text(categoryName, style: textTheme.labelSmall?.copyWith(color: Colors.white60, letterSpacing: 1.2)),
                          Text(screenTitle, style: textTheme.titleLarge?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Row(
                        children: [
                          PopupMenuButton<AppFontSize>(
                            icon: const Icon(LucideIcons.type, color: Colors.white, size: 20),
                            tooltip: 'Test Font Sizes',
                            onSelected: (AppFontSize size) => AppTheme.fontSizeNotifier.value = size,
                            itemBuilder: (BuildContext context) => <PopupMenuEntry<AppFontSize>>[
                              const PopupMenuItem<AppFontSize>(value: AppFontSize.small, child: Text('Small Size')),
                              const PopupMenuItem<AppFontSize>(value: AppFontSize.medium, child: Text('Medium Size (Default)')),
                              const PopupMenuItem<AppFontSize>(value: AppFontSize.large, child: Text('Large Size')),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Container(
                            width: 28, height: 28,
                            decoration: const BoxDecoration(color: Colors.white24, shape: BoxShape.circle),
                            alignment: Alignment.center,
                            child: Text('A', style: textTheme.bodyMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                          const SizedBox(width: 8),
                          Text('Admin', style: textTheme.bodyMedium?.copyWith(color: Colors.white)),
                        ],
                      )
                    ],
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(32.0),
                    child: child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String path;
  final String current;
  final TextTheme textTheme;

  const _NavItem({required this.icon, required this.label, required this.path, required this.current, required this.textTheme});

  @override
  Widget build(BuildContext context) {
    final isActive = current == path;
    return InkWell(
      onTap: () => context.go(path),
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 11),
        margin: const EdgeInsets.only(bottom: 3),
        decoration: BoxDecoration(
          color: isActive ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
        ),
        child: Row(
          children: [
            Icon(icon, size: 16, color: isActive ? AppColors.navy1 : Colors.white70),
            const SizedBox(width: 11),
            Expanded(
              child: Text(label, style: textTheme.bodyMedium?.copyWith(
                color: isActive ? AppColors.navy1 : Colors.white70, 
                fontWeight: isActive ? FontWeight.bold : FontWeight.w500
              ), overflow: TextOverflow.ellipsis),
            ),
          ],
        ),
      ),
    );
  }
}
