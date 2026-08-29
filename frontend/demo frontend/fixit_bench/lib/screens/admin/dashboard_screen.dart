import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../core/constants/mock_data.dart';
import '../../core/utils/formatters.dart';

/// Admin-only KPIs, FY filtering, and a jobs-by-service bar chart.
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.watch<AppState>();
    final range = state.activeDashRange;
    final data = MockData.fyData[range]!;
    final chart = MockData.chartData();
    final mult = data['mult'] as double;

    return ListView(
      padding: const EdgeInsets.fromLTRB(32, 28, 32, 60),
      children: [
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: [
            for (final r in MockData.fyRanges)
              _RangeChip(
                label: MockData.fyLabels[r]!,
                selected: r == range,
                onTap: () => state.setDashRange(r),
              ),
          ],
        ),
        const SizedBox(height: 20),
        LayoutBuilder(builder: (context, constraints) {
          final threeCol = constraints.maxWidth > 640;
          final kpis = [
            _Kpi(label: 'Total works', value: '${data['works']}', trend: data['trend'] as String),
            _Kpi(label: 'Revenue', value: Formatters.currency(data['revenue'] as int), trend: 'incl. GST-exempt jobs'),
            _Kpi(label: 'Pending dues', value: Formatters.currency(data['pending'] as int), trend: 'across all customers'),
          ];
          if (threeCol) {
            return Row(
              children: [
                for (int i = 0; i < kpis.length; i++) ...[
                  if (i > 0) const SizedBox(width: 16),
                  Expanded(child: kpis[i]),
                ],
              ],
            );
          }
          return Column(children: [for (final k in kpis) Padding(padding: const EdgeInsets.only(bottom: 12), child: k)]);
        }),
        const SizedBox(height: 24),
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
              Text('JOBS BY SERVICE', style: AppFonts.label),
              const SizedBox(height: 18),
              SizedBox(
                height: 150,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    for (final entry in chart) ...[
                      Expanded(child: _Bar(label: entry.key, value: (entry.value * mult).round())),
                      const SizedBox(width: 18),
                    ],
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

class _RangeChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _RangeChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? AppColors.accent : AppColors.surface,
          border: Border.all(color: selected ? AppColors.accent : AppColors.line),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(label, style: AppFonts.body(size: 12, color: selected ? Colors.white : AppColors.slate)),
      ),
    );
  }
}

class _Kpi extends StatelessWidget {
  final String label;
  final String value;
  final String trend;
  const _Kpi({required this.label, required this.value, required this.trend});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.line),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: AppFonts.label),
          const SizedBox(height: 10),
          Text(value, style: AppFonts.mono(size: 26, weight: FontWeight.w600)),
          const SizedBox(height: 6),
          Text(trend, style: AppFonts.body(size: 11.5, color: AppColors.green)),
        ],
      ),
    );
  }
}

class _Bar extends StatelessWidget {
  final String label;
  final int value;
  const _Bar({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    // Normalize against a soft max so the tallest bar doesn't clip.
    final maxVal = (value / 0.85).clamp(1, double.infinity);
    final heightFraction = (value / maxVal).clamp(0.05, 1.0);
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        Text('$value', style: AppFonts.mono(size: 11)),
        const SizedBox(height: 8),
        Expanded(
          child: FractionallySizedBox(
            heightFactor: heightFraction,
            alignment: Alignment.bottomCenter,
            child: Container(
              constraints: const BoxConstraints(maxWidth: 38),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.9),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label, textAlign: TextAlign.center, style: AppFonts.body(size: 11, color: AppColors.slate)),
      ],
    );
  }
}
