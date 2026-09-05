import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/theme/app_colors.dart';

class RecentEntriesTable extends StatelessWidget {
  final Function(Map<String, dynamic>)? onEdit; // <-- EDIT CALLBACK
  
  const RecentEntriesTable({super.key, this.onEdit});

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('RECENT ENTRIES', style: textTheme.labelSmall?.copyWith(color: AppColors.slate, letterSpacing: 1.2, fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        Container(
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
                    rows: [
                      DataRow(cells: [
                        DataCell(Text('1', style: textTheme.bodyMedium?.copyWith(color: AppColors.faint), softWrap: false)),
                        DataCell(Text('Rohan Mehta', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold), softWrap: false)),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
                            child: Text('ARG-2026-001', style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                          ),
                        ),
                        DataCell(Text('Screen Repair', softWrap: false)),
                        DataCell(Text('15-09-2026', style: textTheme.bodyMedium?.copyWith(color: AppColors.red, fontWeight: FontWeight.bold), softWrap: false)), 
                        DataCell(Text('₹0', style: textTheme.bodyMedium?.copyWith(color: AppColors.green, fontWeight: FontWeight.bold), softWrap: false)),
                        DataCell(
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                              minimumSize: const Size(0, 0),
                              side: const BorderSide(color: AppColors.line),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                            ),
                            // EDIT BUTTON 1 
                            onPressed: onEdit != null ? () {
                              onEdit!({
                                'name': 'Rohan',
                                'surname': 'Mehta',
                                'mobile': '9820011234',
                                'argNo': 'ARG-2026-001',
                                'deadline': '15-09-2026',
                                'charges': '2200',
                                'discount': '0',
                                'advance': '2200',
                                'paymentMode': 'Cash'
                              });
                            } : null,
                            icon: const Icon(LucideIcons.edit2, size: 14, color: AppColors.navy2),
                            label: Text('Edit', style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                          ),
                        ),
                      ]),
                      DataRow(cells: [
                        DataCell(Text('2', style: textTheme.bodyMedium?.copyWith(color: AppColors.faint), softWrap: false)),
                        DataCell(Text('Ayesha Khan', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold), softWrap: false)),
                        DataCell(
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
                            child: Text('ARG-2026-002', style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                          ),
                        ),
                        DataCell(Text('Battery Replacement', softWrap: false)),
                        DataCell(Text('05-10-2026', softWrap: false)),
                        DataCell(Text('₹450', style: textTheme.bodyMedium?.copyWith(color: AppColors.amber, fontWeight: FontWeight.bold), softWrap: false)),
                        DataCell(
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                              minimumSize: const Size(0, 0),
                              side: const BorderSide(color: AppColors.line),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                            ),
                            // EDIT BUTTON 2
                            onPressed: onEdit != null ? () {
                              onEdit!({
                                'name': 'Ayesha',
                                'surname': 'Khan',
                                'mobile': '9987055621',
                                'argNo': 'ARG-2026-002',
                                'deadline': '05-10-2026',
                                'charges': '950',
                                'discount': '50',
                                'advance': '450',
                                'paymentMode': 'Online'
                              });
                            } : null,
                            icon: const Icon(LucideIcons.edit2, size: 14, color: AppColors.navy2),
                            label: Text('Edit', style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold), softWrap: false),
                          ),
                        ),
                      ]),
                    ],
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