import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../core/constants/mock_data.dart';
import '../../core/utils/formatters.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

/// Manage the services offered and their default charges. Admin only.
class FormMgmtScreen extends StatefulWidget {
  const FormMgmtScreen({super.key});

  @override
  State<FormMgmtScreen> createState() => _FormMgmtScreenState();
}

class _FormMgmtScreenState extends State<FormMgmtScreen> {
  final nameCtrl = TextEditingController();
  final chargeCtrl = TextEditingController();

  void _add(AppState state) {
    if (nameCtrl.text.trim().isEmpty || double.tryParse(chargeCtrl.text) == null) {
      AppToast.show(context, 'Enter a service name and a valid charge');
      return;
    }
    state.addService(ServiceModel(name: nameCtrl.text.trim(), charge: double.parse(chargeCtrl.text), builtin: false));
    AppToast.show(context, 'Service added');
    nameCtrl.clear();
    chargeCtrl.clear();
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Container(
          constraints: const BoxConstraints(maxWidth: 640),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Add a service', style: AppFonts.display(size: 15)),
              const SizedBox(height: 14),
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(flex: 2, child: CustomInput(label: 'Service name', controller: nameCtrl)),
                  const SizedBox(width: 12),
                  Expanded(child: CustomInput(label: 'Charge (₹)', controller: chargeCtrl, keyboardType: TextInputType.number)),
                  const SizedBox(width: 12),
                  PrimaryButton(label: 'Add', onPressed: () => _add(state)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Text('SERVICES', style: AppFonts.label),
        const SizedBox(height: 10),
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: const BoxDecoration(color: AppColors.paper, border: Border(bottom: BorderSide(color: AppColors.line))),
                child: Row(
                  children: [
                    Expanded(flex: 3, child: Text('SERVICE', style: AppFonts.label)),
                    Expanded(flex: 2, child: Text('CHARGE', style: AppFonts.label)),
                    Expanded(flex: 1, child: Text('TYPE', style: AppFonts.label)),
                  ],
                ),
              ),
              for (int i = 0; i < state.services.length; i++)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                  decoration: BoxDecoration(
                    border: i == state.services.length - 1 ? null : const Border(bottom: BorderSide(color: AppColors.line)),
                  ),
                  child: Row(
                    children: [
                      Expanded(flex: 3, child: Text(state.services[i].name, style: AppFonts.body(size: 13, weight: FontWeight.w600))),
                      Expanded(flex: 2, child: Text(Formatters.currency(state.services[i].charge), style: AppFonts.mono(size: 12.5))),
                      Expanded(
                        flex: 1,
                        child: Text(
                          state.services[i].builtin ? 'Built-in' : 'Custom',
                          style: AppFonts.body(size: 11.5, color: AppColors.faint),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
