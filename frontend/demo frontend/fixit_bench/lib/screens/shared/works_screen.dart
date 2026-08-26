import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../models/work_item_model.dart';
import '../../widgets/custom_input.dart';
import '../../widgets/status_badge.dart';

StatusTone _toneFor(WorkStatus s) {
  switch (s) {
    case WorkStatus.pending:
      return StatusTone.amber;
    case WorkStatus.accepted:
      return StatusTone.green;
    case WorkStatus.rejected:
      return StatusTone.red;
  }
}

/// Works Dashboard — job tracking and status updates. Shared by Admin
/// and Staff; Staff typically works the queue, Admin audits it.
class WorksScreen extends StatefulWidget {
  const WorksScreen({super.key});

  @override
  State<WorksScreen> createState() => _WorksScreenState();
}

class _WorksScreenState extends State<WorksScreen> {
  String search = '';
  String filter = 'all'; // all | pending | accepted | rejected

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();

    final filtered = state.works.where((w) {
      final matchesSearch = search.isEmpty || w.name.toLowerCase().contains(search.toLowerCase()) || w.service.toLowerCase().contains(search.toLowerCase());
      final matchesFilter = filter == 'all' || w.status.name == filter;
      return matchesSearch && matchesFilter;
    }).toList();

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Row(
          children: [
            Expanded(child: SearchBox(hint: 'Search by name or service', onChanged: (v) => setState(() => search = v))),
            const SizedBox(width: 10),
            _Segmented(
              value: filter,
              options: const ['all', 'pending', 'accepted', 'rejected'],
              labels: const {'all': 'All', 'pending': 'Pending', 'accepted': 'Accepted', 'rejected': 'Rejected'},
              onChanged: (v) => setState(() => filter = v),
            ),
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
              constraints: const BoxConstraints(minWidth: 980),
              child: Column(
                children: [
                  _headerRow(),
                  if (filtered.isEmpty)
                    Padding(
                      padding: const EdgeInsets.all(30),
                      child: Center(child: Text('No matching jobs', style: AppFonts.body(color: AppColors.faint))),
                    )
                  else
                    for (int i = 0; i < filtered.length; i++)
                      _WorkRow(item: filtered[i], isLast: i == filtered.length - 1),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _headerRow() {
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
          _cell(1, Text('DEADLINE', style: AppFonts.label)),
          _cell(2, Text('REMARK', style: AppFonts.label)),
          _cell(1, Text('STATUS', style: AppFonts.label)),
          _cell(1, Text('COMPLETE', style: AppFonts.label)),
          _cell(1, Text('DELIVERED', style: AppFonts.label)),
        ],
      ),
    );
  }
}

Widget _cell(int flex, Widget child) => Expanded(flex: flex, child: Padding(padding: const EdgeInsets.only(right: 8), child: child));

class _WorkRow extends StatefulWidget {
  final WorkItemModel item;
  final bool isLast;
  const _WorkRow({required this.item, required this.isLast});

  @override
  State<_WorkRow> createState() => _WorkRowState();
}

class _WorkRowState extends State<_WorkRow> {
  late final remarkCtrl = TextEditingController(text: widget.item.remark);

  @override
  Widget build(BuildContext context) {
    final state = context.read<AppState>();
    final w = widget.item;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
      decoration: BoxDecoration(
        border: widget.isLast ? null : const Border(bottom: BorderSide(color: AppColors.line)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _cell(2, Text(w.name, style: AppFonts.body(size: 13, weight: FontWeight.w600))),
          _cell(1, Text(w.service, style: AppFonts.body(size: 13))),
          _cell(1, Text(w.deadline, style: AppFonts.body(size: 12, color: AppColors.slate))),
          _cell(
            2,
            MiniInput(
              controller: remarkCtrl,
              hint: 'Add remark…',
              onChanged: (v) => state.updateRemark(w, v),
            ),
          ),
          _cell(
            1,
            w.status == WorkStatus.pending
                ? Row(
                    children: [
                      _tinyAction(Icons.check, AppColors.green, () => state.updateWorkStatus(w, WorkStatus.accepted)),
                      const SizedBox(width: 6),
                      _tinyAction(Icons.close, AppColors.red, () => state.updateWorkStatus(w, WorkStatus.rejected)),
                    ],
                  )
                : StatusBadge(label: w.status.label, tone: _toneFor(w.status)),
          ),
          _cell(1, _deliveryPill(label: w.completed ? 'Done' : 'Mark', on: w.completed, onTap: () => state.toggleWorkCompleted(w))),
          _cell(1, _deliveryPill(label: w.delivered ? 'Delivered' : 'Deliver', on: w.delivered, onTap: () => state.toggleWorkDelivered(w))),
        ],
      ),
    );
  }

  Widget _tinyAction(IconData icon, Color color, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(5),
        decoration: BoxDecoration(border: Border.all(color: AppColors.line), shape: BoxShape.circle),
        child: Icon(icon, size: 13, color: color),
      ),
    );
  }

  Widget _deliveryPill({required String label, required bool on, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: on ? AppColors.greenBg : AppColors.surface,
          border: Border.all(color: on ? AppColors.green : AppColors.line),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(label, style: AppFonts.body(size: 11, weight: FontWeight.w600, color: on ? AppColors.green : AppColors.slate)),
      ),
    );
  }
}

class _Segmented extends StatelessWidget {
  final String value;
  final List<String> options;
  final Map<String, String> labels;
  final ValueChanged<String> onChanged;

  const _Segmented({required this.value, required this.options, required this.labels, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.line),
        borderRadius: BorderRadius.circular(20),
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final o in options)
            InkWell(
              onTap: () => onChanged(o),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                color: value == o ? AppColors.accent : AppColors.surface,
                child: Text(labels[o] ?? o, style: AppFonts.body(size: 12, color: value == o ? Colors.white : AppColors.slate)),
              ),
            ),
        ],
      ),
    );
  }
}
