import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/app_state.dart';
import '../core/constants/app_colors.dart';
import '../core/constants/app_fonts.dart';
import '../core/constants/mock_data.dart';

const Map<String, IconData> _navIcons = {
  'dashboard': Icons.grid_view_rounded,
  'intake': Icons.person_add_alt_1_outlined,
  'payments': Icons.account_balance_wallet_outlined,
  'works': Icons.build_outlined,
  'staff': Icons.groups_outlined,
  'activity': Icons.receipt_long_outlined,
  'formmgmt': Icons.list_alt_outlined,
  'profile': Icons.account_circle_outlined,
};

/// Left sidebar: brand mark, nav list, mode-preview switch, sign out.
/// Mirrors `<aside class="sidebar">` in the HTML reference.
class AppSidebar extends StatelessWidget {
  const AppSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final items = MockData.nav[state.mode]!;

    return Container(
      width: 232,
      color: AppColors.paper,
      padding: const EdgeInsets.fromLTRB(18, 22, 18, 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 34,
                height: 34,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.accent,
                  borderRadius: BorderRadius.circular(AppColors.radius),
                ),
                child: Text('FB', style: AppFonts.display(size: 13, weight: FontWeight.w700, color: Colors.white)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Fixit Bench', style: AppFonts.display(size: 14.5)),
                    Text(
                      state.mode == 'admin' ? 'Admin application' : 'Staff application',
                      style: AppFonts.body(size: 10.5, color: AppColors.slate),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 28),
          Expanded(
            child: ListView(
              children: [
                for (final item in items)
                  _NavItem(
                    id: item.key,
                    label: item.value,
                    selected: state.currentView == item.key,
                    onTap: () => state.goTo(item.key),
                  ),
              ],
            ),
          ),
          const Divider(color: AppColors.line, height: 1),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('PREVIEW: ${state.mode == 'admin' ? 'STAFF' : 'ADMIN'} APP',
                  style: AppFonts.body(size: 10.5, color: AppColors.slate)),
              _ModeSwitch(on: state.mode == 'staff', onTap: state.toggleMode),
            ],
          ),
          TextButton(
            onPressed: state.signOut,
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 8),
              alignment: Alignment.centerLeft,
              foregroundColor: AppColors.slate,
            ),
            child: Text('Sign out', style: AppFonts.body(size: 12.5, color: AppColors.slate)),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final String id;
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _NavItem({required this.id, required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: Material(
        color: selected ? AppColors.accentSoft : Colors.transparent,
        borderRadius: BorderRadius.circular(AppColors.radius),
        child: InkWell(
          borderRadius: BorderRadius.circular(AppColors.radius),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            child: Row(
              children: [
                Icon(_navIcons[id] ?? Icons.circle_outlined, size: 17,
                    color: selected ? AppColors.accent : AppColors.slate),
                const SizedBox(width: 10),
                Text(
                  label,
                  style: AppFonts.body(
                    size: 13,
                    weight: selected ? FontWeight.w600 : FontWeight.w400,
                    color: selected ? AppColors.accent : AppColors.ink,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ModeSwitch extends StatelessWidget {
  final bool on;
  final VoidCallback onTap;
  const _ModeSwitch({required this.on, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 34,
        height: 18,
        padding: const EdgeInsets.all(2),
        decoration: BoxDecoration(
          color: on ? AppColors.accent : AppColors.line,
          borderRadius: BorderRadius.circular(20),
        ),
        child: AnimatedAlign(
          duration: const Duration(milliseconds: 150),
          alignment: on ? Alignment.centerRight : Alignment.centerLeft,
          child: Container(
            width: 14,
            height: 14,
            decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
          ),
        ),
      ),
    );
  }
}
