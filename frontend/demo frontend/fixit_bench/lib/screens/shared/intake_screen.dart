import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../core/utils/formatters.dart';
import '../../models/customer_model.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

/// Customer Intake module — accessible by both Admin and Staff.
/// New-entry form + a running list of recent intakes.
class IntakeScreen extends StatefulWidget {
  const IntakeScreen({super.key});

  @override
  State<IntakeScreen> createState() => _IntakeScreenState();
}

class _IntakeScreenState extends State<IntakeScreen> {
  final nameCtrl = TextEditingController();
  final phoneCtrl = TextEditingController();
  final deadlineCtrl = TextEditingController();
  final chargeCtrl = TextEditingController();
  final discountCtrl = TextEditingController();
  final advanceCtrl = TextEditingController();
  String? service;
  String mode = 'Cash';
  bool customService = false;

  void _submit(AppState state) {
    if (nameCtrl.text.trim().isEmpty || phoneCtrl.text.trim().isEmpty || (service == null && !customService)) {
      AppToast.show(context, 'Fill in name, phone, and service');
      return;
    }
    final charge = double.tryParse(chargeCtrl.text) ?? 0;
    final discount = double.tryParse(discountCtrl.text) ?? 0;
    final advance = double.tryParse(advanceCtrl.text) ?? 0;
    final customer = CustomerModel(
      id: 'CUST-${9000 + state.customers.length + 3}',
      name: nameCtrl.text.trim(),
      phone: phoneCtrl.text.trim(),
      date: Formatters.longDate(DateTime.now()),
      deadline: deadlineCtrl.text.trim(),
      service: service ?? 'Custom service',
      charge: charge,
      discount: discount,
      advance: advance,
      mode: mode,
      createdBy: state.mode == 'admin' ? 'Admin' : state.currentStaffName,
    );
    state.addCustomer(customer);
    AppToast.show(context, 'Customer intake saved');
    setState(() {
      nameCtrl.clear();
      phoneCtrl.clear();
      deadlineCtrl.clear();
      chargeCtrl.clear();
      discountCtrl.clear();
      advanceCtrl.clear();
      service = null;
      mode = 'Cash';
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          padding: const EdgeInsets.all(22),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('New customer', style: AppFonts.display(size: 15)),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(child: CustomInput(label: 'Customer name', controller: nameCtrl)),
                  const SizedBox(width: 16),
                  Expanded(child: CustomInput(label: 'Phone', controller: phoneCtrl, keyboardType: TextInputType.phone)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: CustomSelect<String>(
                      label: 'Service',
                      value: service,
                      items: [
                        for (final s in state.services)
                          DropdownMenuItem(value: s.name, child: Text('${s.name} · ${Formatters.currency(s.charge)}')),
                        const DropdownMenuItem(value: '__custom', child: Text('Custom service…')),
                      ],
                      onChanged: (v) {
                        setState(() {
                          if (v == '__custom') {
                            customService = true;
                            service = null;
                          } else {
                            customService = false;
                            service = v;
                            final match = state.services.firstWhere((s) => s.name == v);
                            chargeCtrl.text = match.charge.toStringAsFixed(0);
                          }
                        });
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(child: CustomInput(label: 'Deadline (YYYY-MM-DD)', controller: deadlineCtrl)),
                ],
              ),
              if (customService) ...[
                const SizedBox(height: 16),
                CustomInput(
                  label: 'Custom service name',
                  onChanged: (v) => service = v,
                ),
              ],
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: CustomInput(label: 'Charge (₹)', controller: chargeCtrl, keyboardType: TextInputType.number)),
                  const SizedBox(width: 16),
                  Expanded(child: CustomInput(label: 'Discount (₹)', controller: discountCtrl, keyboardType: TextInputType.number)),
                  const SizedBox(width: 16),
                  Expanded(child: CustomInput(label: 'Advance paid (₹)', controller: advanceCtrl, keyboardType: TextInputType.number)),
                ],
              ),
              const SizedBox(height: 16),
              CustomSelect<String>(
                label: 'Payment mode',
                value: mode,
                items: const [
                  DropdownMenuItem(value: 'Cash', child: Text('Cash')),
                  DropdownMenuItem(value: 'Online', child: Text('Online')),
                  DropdownMenuItem(value: 'Cheque', child: Text('Cheque')),
                ],
                onChanged: (v) => setState(() => mode = v ?? 'Cash'),
              ),
              const SizedBox(height: 20),
              Align(
                alignment: Alignment.centerLeft,
                child: PrimaryButton(label: 'Save customer', onPressed: () => _submit(state)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 26),
        Text('RECENT ENTRIES', style: AppFonts.label),
        const SizedBox(height: 12),
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: state.customers.isEmpty
              ? Padding(
                  padding: const EdgeInsets.all(30),
                  child: Center(child: Text('No entries yet', style: AppFonts.body(color: AppColors.faint))),
                )
              : Column(
                  children: [
                    for (int i = 0; i < state.customers.length; i++)
                      _CustomerRow(customer: state.customers[i], isLast: i == state.customers.length - 1),
                  ],
                ),
        ),
      ],
    );
  }
}

class _CustomerRow extends StatelessWidget {
  final CustomerModel customer;
  final bool isLast;
  const _CustomerRow({required this.customer, required this.isLast});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
      decoration: BoxDecoration(
        border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(customer.name, style: AppFonts.body(size: 13, weight: FontWeight.w600)),
                Text(customer.phone, style: AppFonts.body(size: 11.5, color: AppColors.slate)),
              ],
            ),
          ),
          Expanded(flex: 2, child: Text(customer.service, style: AppFonts.body(size: 13))),
          Expanded(flex: 2, child: Text('Due ${customer.deadline}', style: AppFonts.body(size: 12, color: AppColors.slate))),
          Expanded(
            flex: 2,
            child: Text(Formatters.currency(customer.balance),
                style: AppFonts.mono(size: 12.5, color: customer.balance > 0 ? AppColors.red : AppColors.green)),
          ),
          Expanded(flex: 1, child: Text(customer.createdBy, style: AppFonts.body(size: 11.5, color: AppColors.faint))),
        ],
      ),
    );
  }
}
