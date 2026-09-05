import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../theme/app_colors.dart';
import '../../theme/app_theme.dart';

class StaffShell extends StatelessWidget {
  final Widget child;
  const StaffShell({super.key, required this.child});

  String _getScreenTitle(String path) {
    if (path.contains('/intake')) return 'Customer Intake';
    if (path.contains('/payments')) return 'Payment Dashboard';
    if (path.contains('/works')) return 'Works Dashboard';
    return 'Staff Workspace';
  }

  // DYNAMIC CATEGORY MAPPING FOR STAFF
  String _getCategoryName(String path) {
    if (path.contains('/intake')) return 'NEW ENTRY';
    if (path.contains('/payments')) return 'ACCOUNTS';
    if (path.contains('/works')) return 'OPERATIONS';
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
                            // Text('STAFF APPLICATION', style: textTheme.labelSmall?.copyWith(color: Colors.white54, fontWeight: FontWeight.bold, letterSpacing: 0.5), overflow: TextOverflow.ellipsis),
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
                      _NavItem(icon: LucideIcons.userPlus, label: 'Customer Intake', path: '/staff/intake', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.creditCard, label: 'Payment Dashboard', path: '/staff/payments', current: location, textTheme: textTheme),
                      _NavItem(icon: LucideIcons.briefcase, label: 'Works Dashboard', path: '/staff/works', current: location, textTheme: textTheme),
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
                          // BINDED TO DYNAMIC CATEGORY
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
                            child: Text('S', style: textTheme.bodyMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                          ),
                          const SizedBox(width: 8),
                          Text('Staff User', style: textTheme.bodyMedium?.copyWith(color: Colors.white)),
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
              child: Text(label, style: textTheme.bodyMedium?.copyWith(color: isActive ? AppColors.navy1 : Colors.white70, fontWeight: isActive ? FontWeight.bold : FontWeight.w500), overflow: TextOverflow.ellipsis),
            ),
          ],
        ),
      ),
    );
  }
}
