import 'package:flutter/material.dart';

class StaffWorksDashboardScreen extends StatelessWidget {
  const StaffWorksDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE2E6EC)),
      ),
      child: const Text(
        'Staff Works Dashboard code goes here...',
        style: TextStyle(color: Color(0xFF5B6472), fontSize: 14),
      ),
    );
  }
}
