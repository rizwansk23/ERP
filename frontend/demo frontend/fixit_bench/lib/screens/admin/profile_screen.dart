import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

/// Business info, data backups, and the application-lock password.
/// Admin only.
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final businessNameCtrl = TextEditingController(text: 'Fixit Bench');
  final businessPhoneCtrl = TextEditingController(text: '98200 00000');
  final newLockCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        _card(
          title: 'Business info',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(child: CustomInput(label: 'Business name', controller: businessNameCtrl)),
                  const SizedBox(width: 16),
                  Expanded(child: CustomInput(label: 'Contact phone', controller: businessPhoneCtrl)),
                ],
              ),
              const SizedBox(height: 18),
              PrimaryButton(label: 'Save changes', onPressed: () => AppToast.show(context, 'Business info saved')),
            ],
          ),
        ),
        const SizedBox(height: 20),
        _card(
          title: 'Backups',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Export a local backup of customers, payments, and works data.',
                  style: AppFonts.body(size: 12.5, color: AppColors.slate)),
              const SizedBox(height: 14),
              Row(
                children: [
                  OutlineButton(label: 'Export CSV', onPressed: () => AppToast.show(context, 'Backup exported')),
                  const SizedBox(width: 10),
                  OutlineButton(label: 'Export PDF', onPressed: () => AppToast.show(context, 'PDF export coming soon')),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        _card(
          title: 'Application lock',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Set the password used to unlock the app when it is locked.',
                  style: AppFonts.body(size: 12.5, color: AppColors.slate)),
              const SizedBox(height: 14),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(child: CustomInput(label: 'New application password', controller: newLockCtrl, obscure: true)),
                  const SizedBox(width: 12),
                  PrimaryButton(
                    label: 'Update',
                    onPressed: () {
                      if (newLockCtrl.text.trim().isEmpty) {
                        AppToast.show(context, 'Enter a new password');
                        return;
                      }
                      state.appLockPassword = newLockCtrl.text.trim();
                      AppToast.show(context, 'Application lock password updated');
                      newLockCtrl.clear();
                    },
                  ),
                ],
              ),
              const SizedBox(height: 14),
              OutlineButton(label: 'Lock app now', onPressed: state.lockApp),
            ],
          ),
        ),
      ],
    );
  }

  Widget _card({required String title, required Widget child}) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 720),
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.line),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppFonts.display(size: 15)),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }
}
