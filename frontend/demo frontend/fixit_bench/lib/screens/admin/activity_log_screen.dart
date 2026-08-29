import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../core/utils/formatters.dart';

/// Audit trail for every staff-made change. Admin only.
class ActivityLogScreen extends StatelessWidget {
  const ActivityLogScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final log = state.activityLog;

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Container(
          constraints: const BoxConstraints(maxWidth: 1080),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(8),
          ),
          child: log.isEmpty
              ? Padding(
                  padding: const EdgeInsets.all(30),
                  child: Center(
                    child: Text('No activity recorded yet', style: AppFonts.body(color: AppColors.faint)),
                  ),
                )
              : Column(
                  children: [
                    for (int i = 0; i < log.length; i++)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          border: i == log.length - 1 ? null : const Border(bottom: BorderSide(color: AppColors.line)),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('${log[i].actor} · ${log[i].action}', style: AppFonts.body(size: 13, weight: FontWeight.w600)),
                                  const SizedBox(height: 2),
                                  Text(log[i].detail, style: AppFonts.body(size: 12.5, color: AppColors.slate)),
                                ],
                              ),
                            ),
                            Text(Formatters.logTimestamp(log[i].ts), style: AppFonts.mono(size: 11, color: AppColors.faint)),
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
