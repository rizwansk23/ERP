import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_colors.dart';
import '../models/payment_model.dart';
import '../widgets/payment_status_badge.dart';
import '../widgets/add_payment_dialog.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

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
    PaymentModel(id: 'CUST-9004', firstName: 'Neha', lastName: 'Joshi', phone: '9821133440', argumentNumber: 'ARG-2026-004', service: 'Diagnostic Check', charge: 300, discount: 0, advance: 300, paymentMethod: 'Cash'),
    PaymentModel(id: 'CUST-9006', firstName: 'Priya', lastName: 'Nair', phone: '9702266190', argumentNumber: 'ARG-2026-006', service: 'Screen Repair', charge: 2200, discount: 0, advance: 0, paymentMethod: 'Cash'),
    PaymentModel(id: 'CUST-9007', firstName: 'Karan', lastName: 'Thakur', phone: '9123456780', argumentNumber: 'ARG-2026-007', service: 'Motherboard Repair', charge: 4500, discount: 0, advance: 4500, paymentMethod: 'Online'),
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

    // NAYA: Screen ki width check karke spacing dynamically set karo
    final screenWidth = MediaQuery.of(context).size.width;
    final double dynamicColumnSpacing = screenWidth < 1200 ? 12.0 : 24.0; 
    final double dynamicMargin = screenWidth < 1200 ? 8.0 : 14.0;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Wrap(
            spacing: 16,
            runSpacing: 16,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              SizedBox(
                width: 450,
                height: 38,
                child: TextField(
                  style: textTheme.bodyMedium?.copyWith(color: AppColors.ink),
                  decoration: InputDecoration(
                    hintText: 'Search',
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
              
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  backgroundColor: AppColors.surface,
                  foregroundColor: const Color(0xFF1FAA55), 
                  side: const BorderSide(color: Color(0xFF1FAA55), width: 1), 
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                  minimumSize: const Size(0, 34),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('WhatsApp Reminders sent to all pending customers!'), 
                      backgroundColor: Color(0xFF1FAA55)
                    )
                  );
                },
                icon: const FaIcon(FontAwesomeIcons.whatsapp, size: 16, color: Color(0xFF1FAA55)),
                label: Text('Remind All', style: textTheme.bodyMedium?.copyWith(color: const Color(0xFF1FAA55), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          Container(
            width: double.infinity,
            clipBehavior: Clip.hardEdge, 
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
                  child: ConstrainedBox(
                    constraints: BoxConstraints(minWidth: constraints.maxWidth),
                    child: DataTable(
                      headingRowColor: MaterialStateProperty.all(AppColors.navy1),
                      headingTextStyle: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      dataTextStyle: textTheme.bodyMedium?.copyWith(color: AppColors.ink),
                      dividerThickness: 1,
                      horizontalMargin: dynamicMargin, 
                      columnSpacing: dynamicColumnSpacing,
                      showCheckboxColumn: false, 
                      
                      columns: [
                        DataColumn(label: Text('S.NO.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        DataColumn(label: Text('CUSTOMER NAME', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        DataColumn(label: Text('ARGUMENT NO.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        DataColumn(label: Text('SERVICE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        DataColumn(label: Text('PAYMENT STATUS', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                        DataColumn(label: Text('WHATSAPP REMINDER', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      ],
                      rows: payments.asMap().entries.map((entry) {
                        final index = entry.key;
                        final p = entry.value;
                        final isCompleted = p.status == 'Completed';

                        return DataRow(
                          onSelectChanged: (_) => _showAddPaymentDialog(p),
                          cells: [
                            DataCell(Text('${index + 1}', style: textTheme.bodyMedium?.copyWith(color: AppColors.black), softWrap: false)),
                            DataCell(Text(p.fullName, style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold), softWrap: false)),
                            DataCell(
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
                                child: Text(p.argumentNumber, style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                              ),
                            ),
                            DataCell(Text(p.service, style: textTheme.bodyMedium, softWrap: false)),
                            DataCell(PaymentStatusBadge(status: p.status)),
                            DataCell(
                              isCompleted
                                ? const Text('—', style: TextStyle(color: AppColors.faint, fontSize: 14))
                                : ElevatedButton.icon(
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF1FAA55),
                                      foregroundColor: Colors.white,
                                      elevation: 0,
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                      minimumSize: const Size(0, 0),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                                    ),
                                    onPressed: () {
                                      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Reminder sent to ${p.fullName}'), backgroundColor: const Color(0xFF1FAA55)));
                                    },
                                    icon: const FaIcon(FontAwesomeIcons.whatsapp, size: 16, color: AppColors.surface),
                                    label: Text('Remind', style: textTheme.bodyMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false),
                                  ),
                            ),
                          ],
                        );
                      }).toList(),
                    ),
                  ),
                );
              }
            ),
          ),
        ],
      ),
    );
  }

  // YAHAN FUNCTION KI JAGAH ValueChanged<bool> LAGAYA HAI TO FIX THE SYNTAX ERROR
  Widget _buildFilterChip(String label, bool isSelected, ValueChanged<bool> onChanged, TextTheme textTheme) {
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