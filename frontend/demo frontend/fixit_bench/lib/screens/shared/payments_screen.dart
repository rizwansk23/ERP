import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../core/utils/formatters.dart';
import '../../models/payment_model.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_input.dart';
import '../../widgets/status_badge.dart';

StatusTone _toneFor(PaymentStatus s) {
  switch (s) {
    case PaymentStatus.pending:
      return StatusTone.red;
    case PaymentStatus.balance:
      return StatusTone.amber;
    case PaymentStatus.completed:
      return StatusTone.green;
  }
}

/// Payment Dashboard — Admin sees the full list; Staff sees a search-first
/// view (both share the same rows/logic here, mirroring the HTML reference
/// where the module is shared and access differs only by visibility).
class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  String search = '';
  final Set<PaymentStatus> filters = {};

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final isAdmin = state.mode == 'admin';

    final filtered = state.payments.where((p) {
      final matchesSearch = search.isEmpty ||
          p.name.toLowerCase().contains(search.toLowerCase()) ||
          p.phone.contains(search) ||
          p.receipt.toLowerCase().contains(search.toLowerCase());
      final matchesFilter = filters.isEmpty || filters.contains(p.status);
      return matchesSearch && matchesFilter;
    }).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Row(
          children: [
            Expanded(child: SearchBox(hint: 'Search by name, phone, or receipt', onChanged: (v) => setState(() => search = v))),
            const SizedBox(width: 10),
            if (isAdmin) ...[
              FilterChip2(
                label: 'Pending',
                selected: filters.contains(PaymentStatus.pending),
                onChanged: (v) => setState(() => v ? filters.add(PaymentStatus.pending) : filters.remove(PaymentStatus.pending)),
              ),
              const SizedBox(width: 8),
              FilterChip2(
                label: 'Balance',
                selected: filters.contains(PaymentStatus.balance),
                onChanged: (v) => setState(() => v ? filters.add(PaymentStatus.balance) : filters.remove(PaymentStatus.balance)),
              ),
              const SizedBox(width: 8),
              FilterChip2(
                label: 'Completed',
                selected: filters.contains(PaymentStatus.completed),
                onChanged: (v) => setState(() => v ? filters.add(PaymentStatus.completed) : filters.remove(PaymentStatus.completed)),
              ),
            ],
          ],
        ),
        const SizedBox(height: 18),
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: ConstrainedBox(
              constraints: const BoxConstraints(minWidth: 920),
              child: Column(
                children: [
                  _PaymentRow.header(),
                  if (filtered.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(30),
                      child: Center(child: Text('No matching payments', style: AppFonts.body(color: AppColors.faint))),
                    )
                  else
                    for (int i = 0; i < filtered.length; i++)
                      _PaymentRow(
                        payment: filtered[i],
                        isLast: i == filtered.length - 1,
                        editable: isAdmin,
                        onStatusChanged: (s) {
                          state.updatePaymentStatus(filtered[i], s);
                          AppToast.show(context, 'Payment status updated');
                        },
                      ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _PaymentRow extends StatelessWidget {
  final PaymentModel? payment;
  final bool isHeader;
  final bool isLast;
  final bool editable;
  final ValueChanged<PaymentStatus>? onStatusChanged;

  const _PaymentRow({
    this.payment,
    this.isLast = false,
    this.editable = false,
    this.onStatusChanged,
  }) : isHeader = false;

  const _PaymentRow.header()
      : payment = null,
        isHeader = true,
        isLast = false,
        editable = false,
        onStatusChanged = null;

  @override
  Widget build(BuildContext context) {
    if (isHeader) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: const BoxDecoration(
          color: AppColors.paper,
          border: Border(bottom: BorderSide(color: AppColors.line)),
        ),
        child: Row(
          children: [
            _cell(2, Text('CUSTOMER', style: AppFonts.label)),
            _cell(1, Text('SERVICE', style: AppFonts.label)),
            _cell(1, Text('RECEIPT', style: AppFonts.label)),
            _cell(1, Text('CHARGE', style: AppFonts.label)),
            _cell(1, Text('BALANCE', style: AppFonts.label)),
            _cell(1, Text('METHOD', style: AppFonts.label)),
            _cell(1, Text('STATUS', style: AppFonts.label)),
          ],
        ),
      );
    }

    final p = payment!;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
      decoration: BoxDecoration(
        border: isLast ? null : const Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        children: [
          _cell(
            2,
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(p.name, style: AppFonts.body(size: 13, weight: FontWeight.w600)),
                Text(p.phone, style: AppFonts.body(size: 11.5, color: AppColors.slate)),
              ],
            ),
          ),
          _cell(1, Text(p.service, style: AppFonts.body(size: 13))),
          _cell(1, Text(p.receipt, style: AppFonts.mono(size: 12))),
          _cell(1, Text(Formatters.currency(p.charge), style: AppFonts.mono(size: 12.5))),
          _cell(
            1,
            Text(
              Formatters.currency(p.balance),
              style: AppFonts.mono(size: 12.5, color: p.balance > 0 ? AppColors.red : AppColors.green),
            ),
          ),
          _cell(1, Text(p.method, style: AppFonts.body(size: 12.5, color: AppColors.slate))),
          _cell(
            1,
            editable
                ? DropdownButton<PaymentStatus>(
                    value: p.status,
                    isDense: true,
                    underline: const SizedBox(),
                    style: AppFonts.body(size: 12),
                    items: PaymentStatus.values
                        .map((s) => DropdownMenuItem(value: s, child: StatusBadge(label: s.label, tone: _toneFor(s))))
                        .toList(),
                    onChanged: (s) {
                      if (s != null) onStatusChanged?.call(s);
                    },
                  )
                : StatusBadge(label: p.status.label, tone: _toneFor(p.status)),
          ),
        ],
      ),
    );
  }

  Widget _cell(int flex, Widget child) => Expanded(flex: flex, child: Padding(padding: const EdgeInsets.only(right: 8), child: child));
}
