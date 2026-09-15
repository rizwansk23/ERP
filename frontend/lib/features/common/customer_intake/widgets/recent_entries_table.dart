import 'package:flutter/material.dart';
// import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/theme/app_colors.dart';

// DATA MODEL (Backend ke liye ready) Backend aane par JSON ko isme map karna hoga
class RecentEntryModel {
  final String name;
  final String surname;
  final String mobile;
  final String argNo;
  final String service;
  final String deadline;
  final double charges;
  final double discount;
  final double advance;
  final String paymentMode;
  final bool isOverdue; // Deadline red dikhane ke liye

  RecentEntryModel({
    required this.name,
    required this.surname,
    required this.mobile,
    required this.argNo,
    required this.service,
    required this.deadline,
    required this.charges,
    required this.discount,
    required this.advance,
    required this.paymentMode,
    this.isOverdue = false,
  });

  // Automatically calculate balance
  double get balance => (charges - discount) - advance;
  String get fullName => '$name $surname';

  // API payload ya Edit form ke liye map convertor
  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'surname': surname,
      'mobile': mobile,
      'argNo': argNo,
      'deadline': deadline,
      'charges': charges.toInt().toString(),
      'discount': discount.toInt().toString(),
      'advance': advance.toInt().toString(),
      'paymentMode': paymentMode,
    };
  }
}


// MAIN WIDGET
class RecentEntriesTable extends StatelessWidget {
  final Function(Map<String, dynamic>)? onEdit;

  const RecentEntriesTable({super.key, this.onEdit});

  // DUMMY DATA
  List<RecentEntryModel> get _dummyData => [
        RecentEntryModel(
          name: 'Rohan', surname: 'Mehta', mobile: '9820011234', argNo: 'ARG-2026-001',
          service: 'Screen Repair', deadline: '15-09-2026',
          charges: 2200, discount: 0, advance: 2200, paymentMode: 'Cash', isOverdue: true,
        ),
        RecentEntryModel(
          name: 'Ayesha', surname: 'Khan', mobile: '9987055621', argNo: 'ARG-2026-002',
          service: 'Battery Replacement', deadline: '05-10-2026',
          charges: 950, discount: 50, advance: 450, paymentMode: 'Online', isOverdue: false,
        ),
      ];

  
  // REUSABLE UI HELPERS (Taki code repeat na ho)
  DataCell _buildTextCell(String text, TextTheme textTheme, {Color? color, bool isBold = false}) {
    return DataCell(
      Text(
        text,
        style: textTheme.bodyMedium?.copyWith(
          color: color ?? AppColors.ink,
          fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
        ),
        softWrap: false,
      ),
    );
  }

  DataCell _buildArgCell(String argNo, TextTheme textTheme) {
    return DataCell(
      Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
        child: Text(argNo, style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
      ),
    );
  }

 
  // BUILD METHOD
  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    // Backend aane ke baad yahan _dummyData ki jagah API ka list variable aayega
    final entries = _dummyData; 

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('RECENT ENTRIES', style: textTheme.labelSmall?.copyWith(color: AppColors.slate, letterSpacing: 1.2, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
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
                    horizontalMargin: 14,
                    columnSpacing: 24,
                    columns: [
                      DataColumn(label: Text('SR.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('CUSTOMER', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('ARGUMENT NO.', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('SERVICE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('DEADLINE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('BALANCE', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                      DataColumn(label: Text('ACTION', style: textTheme.labelSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold), softWrap: false)),
                    ],
                    // Fetch all records from list
                    rows: entries.asMap().entries.map((mapEntry) {
                      int index = mapEntry.key;
                      RecentEntryModel entry = mapEntry.value;

                      return DataRow(
                        cells: [
                          _buildTextCell('${index + 1}', textTheme, color: AppColors.faint),
                          _buildTextCell(entry.fullName, textTheme, isBold: true),
                          _buildArgCell(entry.argNo, textTheme),
                          _buildTextCell(entry.service, textTheme),
                          _buildTextCell(entry.deadline, textTheme, color: entry.isOverdue ? AppColors.red : AppColors.ink, isBold: entry.isOverdue),
                          _buildTextCell('₹${entry.balance.toInt()}', textTheme, color: entry.balance > 0 ? AppColors.amber : AppColors.green, isBold: true),
                          DataCell(
                            OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                minimumSize: const Size(0, 0),
                                side: const BorderSide(color: AppColors.line),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                              ),
                              onPressed: onEdit != null ? () => onEdit!(entry.toMap()) : null,
                              // icon: const Icon(LucideIcons.edit2, size: 14, color: AppColors.navy2),
                              label: Text('Edit', style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
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
    );
  }
}