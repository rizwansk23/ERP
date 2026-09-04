import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../models/payment_model.dart';
import '../widgets/payment_status_badge.dart';
import '../widgets/add_payment_dialog.dart';

class PaymentDashboardScreen extends StatefulWidget {
  const PaymentDashboardScreen({super.key});

  @override
  State<PaymentDashboardScreen> createState() => _PaymentDashboardScreenState();
}

class _PaymentDashboardScreenState extends State<PaymentDashboardScreen> {
  String _searchQuery = '';
  bool _filterPending = false;
  bool _filterBalance = false;
  bool _filterCompleted = false;

  final List<PaymentModel> _allPayments = [
    PaymentModel(id: 'CUST-9001', firstName: 'Rohan', lastName: 'Mehta', phone: '9820011234', argumentNumber: 'ARG-2026-001', service: 'Screen Repair', charge: 2200, discount: 0, advance: 2200, paymentMethod: 'Cash'),
    PaymentModel(id: 'CUST-9002', firstName: 'Ayesha', lastName: 'Khan', phone: '9987055621', argumentNumber: 'ARG-2026-002', service: 'Battery Replacement', charge: 950, discount: 50, advance: 500, paymentMethod: 'Online'),
  ];

  List<PaymentModel> get _filteredPayments {
    return _allPayments.where((p) {
      final searchLower = _searchQuery.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty || p.fullName.toLowerCase().contains(searchLower) || p.argumentNumber.toLowerCase().contains(searchLower);
      final activeFilters = [if (_filterPending) 'Pending', if (_filterBalance) 'Balance Due', if (_filterCompleted) 'Completed'];
      final matchesFilter = activeFilters.isEmpty || activeFilters.contains(p.status);
      return matchesSearch && matchesFilter;
    }).toList();
  }

  void _showAddPaymentDialog(PaymentModel payment) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AddPaymentDialog(payment: payment),
    );
  }

  @override
  Widget build(BuildContext context) {
    final payments = _filteredPayments;
    final textTheme = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Wrap(
          spacing: 16,
          runSpacing: 16,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            SizedBox(
              width: 300,
              height: 38,
              child: TextField(
                style: textTheme.bodyMedium?.copyWith(color: AppColors.ink),
                decoration: InputDecoration(
                  hintText: 'Search by customer, argument no...',
                  hintStyle: textTheme.bodyMedium?.copyWith(color: AppColors.faint),
                  prefixIcon: const Icon(LucideIcons.search, size: 16, color: AppColors.faint),
                  filled: true,
                  fillColor: AppColors.surface,
                  contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                  focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
                ),
                onChanged: (val) => setState(() => _searchQuery = val),
              ),
            ),
            _buildFilterChip('Pending', _filterPending, (val) => setState(() => _filterPending = val), textTheme),
            _buildFilterChip('Balance due', _filterBalance, (val) => setState(() => _filterBalance = val), textTheme),
            _buildFilterChip('Completed', _filterCompleted, (val) => setState(() => _filterCompleted = val), textTheme),
          ],
        ),
        const SizedBox(height: 24),
        Expanded(
          child: Container(
            width: double.infinity,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.line),
              boxShadow: const [BoxShadow(color: Color.fromRGBO(15,49,93,0.04), blurRadius: 2, offset: Offset(0, 1))],
            ),
            child: LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: SingleChildScrollView(
                    child: ConstrainedBox(
                      constraints: BoxConstraints(minWidth: constraints.maxWidth),
                      child: DataTable(
                        headingRowColor: MaterialStateProperty.all(AppColors.navy1),
                        headingTextStyle: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                        dataTextStyle: textTheme.bodyMedium?.copyWith(color: AppColors.ink),
                        dividerThickness: 1,
                        horizontalMargin: 14,
                        columnSpacing: 24,
                        // YAHAN SABHI HEADERS MEIN softWrap: false ADD KIYA HAI
                        columns: [
                          DataColumn(label: Text('S.NO.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('CUSTOMER NAME', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('ARGUMENT NO.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('MOBILE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('SERVICE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('TOTAL', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('PAID', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('PENDING', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('STATUS', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('METHOD', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                          DataColumn(label: Text('ACTION', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        ],
                        rows: payments.asMap().entries.map((entry) {
                          final index = entry.key;
                          final p = entry.value;
                          final hasPending = p.pendingBalance > 0;

                          // YAHAN SABHI CELLS MEIN softWrap: false ADD KIYA HAI
                          return DataRow(
                            cells: [
                              DataCell(Text('${index + 1}', style: textTheme.bodyMedium?.copyWith(color: AppColors.faint), softWrap: false)),
                              DataCell(Text(p.fullName, style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold), softWrap: false)),
                              DataCell(
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
                                  child: Text(p.argumentNumber, style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                                ),
                              ),
                              DataCell(Text(p.phone, style: textTheme.bodyMedium?.copyWith(color: AppColors.slate), softWrap: false)),
                              DataCell(Text(p.service, style: textTheme.bodyMedium, softWrap: false)),
                              DataCell(Text('₹${p.netCharge.toInt()}', style: textTheme.bodyMedium, softWrap: false)),
                              DataCell(Text('₹${p.advance.toInt()}', style: textTheme.bodyMedium, softWrap: false)),
                              DataCell(Text('₹${p.pendingBalance.toInt()}', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: hasPending ? AppColors.red : AppColors.green), softWrap: false)),
                              DataCell(PaymentStatusBadge(status: p.status)),
                              DataCell(Text(p.paymentMethod, style: textTheme.bodyMedium, softWrap: false)),
                              DataCell(
                                OutlinedButton.icon(
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                    minimumSize: const Size(0, 0),
                                    side: BorderSide(color: hasPending ? AppColors.navy2 : AppColors.line),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                                  ),
                                  onPressed: hasPending ? () => _showAddPaymentDialog(p) : null,
                                  icon: Icon(LucideIcons.plus, size: 14, color: hasPending ? AppColors.navy2 : AppColors.faint),
                                  label: Text('Add Payment', style: textTheme.bodyMedium?.copyWith(color: hasPending ? AppColors.navy2 : AppColors.faint, fontWeight: FontWeight.bold), softWrap: false),
                                ),
                              ),
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                );
              }
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, Function(bool) onChanged, TextTheme textTheme) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: onChanged,
      backgroundColor: AppColors.surface,
      selectedColor: const Color(0xFFE8EEF7),
      checkmarkColor: AppColors.navy2,
      labelStyle: textTheme.bodyMedium?.copyWith(color: isSelected ? AppColors.navy2 : AppColors.slate, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: isSelected ? AppColors.navy2 : AppColors.line)),
    );
  }
}
