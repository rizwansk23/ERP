import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:math';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../models/staff_model.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

/// Search existing staff and generate new staff credentials. Admin only.
class StaffMgmtScreen extends StatefulWidget {
  const StaffMgmtScreen({super.key});

  @override
  State<StaffMgmtScreen> createState() => _StaffMgmtScreenState();
}

class _StaffMgmtScreenState extends State<StaffMgmtScreen> {
  String search = '';
  final nameCtrl = TextEditingController();

  String _randomPass() {
    const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    final rnd = Random();
    return List.generate(6, (_) => chars[rnd.nextInt(chars.length)]).join();
  }

  void _generate(AppState state) {
    if (nameCtrl.text.trim().isEmpty) {
      AppToast.show(context, 'Enter a staff name');
      return;
    }
    final id = 'STF-${1040 + state.staff.length + 3}';
    state.addStaff(StaffModel(name: nameCtrl.text.trim(), id: id, pass: _randomPass()));
    AppToast.show(context, 'Staff credentials generated');
    nameCtrl.clear();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final filtered = state.staff.where((s) => search.isEmpty || s.name.toLowerCase().contains(search.toLowerCase()) || s.id.toLowerCase().contains(search.toLowerCase())).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Container(
          constraints: const BoxConstraints(maxWidth: 560),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Generate staff credentials', style: AppFonts.display(size: 15)),
              const SizedBox(height: 14),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(child: CustomInput(label: 'Staff name', controller: nameCtrl)),
                  const SizedBox(width: 12),
                  PrimaryButton(label: 'Generate', onPressed: () => _generate(state)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Text('TEAM', style: AppFonts.label),
        const SizedBox(height: 10),
        SizedBox(
          width: 400,
          child: SearchBox(hint: 'Search staff by name or ID', onChanged: (v) => setState(() => search = v)),
        ),
        const SizedBox(height: 14),
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: filtered.isEmpty
              ? Padding(
                  padding: const EdgeInsets.all(30),
                  child: Center(child: Text('No staff found', style: AppFonts.body(color: AppColors.faint))),
                )
              : Column(
                  children: [
                    for (int i = 0; i < filtered.length; i++) _StaffRow(staff: filtered[i], isLast: i == filtered.length - 1),
                  ],
                ),
        ),
      ],
    );
  }
}

class _StaffRow extends StatelessWidget {
  final StaffModel staff;
  final bool isLast;
  const _StaffRow({required this.staff, required this.isLast});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
      decoration: BoxDecoration(border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.line))),
      child: Row(
        children: [
          Expanded(flex: 2, child: Text(staff.name, style: AppFonts.body(size: 13, weight: FontWeight.w600))),
          Expanded(flex: 1, child: Text(staff.id, style: AppFonts.mono(size: 12))),
          Expanded(flex: 1, child: Text(staff.pass, style: AppFonts.mono(size: 12, color: AppColors.slate))),
        ],
      ),
    );
  }
}
