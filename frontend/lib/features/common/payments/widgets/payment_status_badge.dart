import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

class PaymentStatusBadge extends StatelessWidget {
  final String status;
  const PaymentStatusBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;

    switch (status) {
      case 'Completed':
        bgColor = const Color(0xFFE6F5EE);
        textColor = AppColors.green;
        break;
      case 'Balance Due':
        bgColor = const Color(0xFFFBF1DE);
        textColor = AppColors.amber;
        break;
      default: // Pending
        bgColor = const Color(0xFFFBEAE9);
        textColor = AppColors.red;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 8, height: 8,
            decoration: BoxDecoration(color: textColor, shape: BoxShape.circle),
          ),
          const SizedBox(width: 6),
          Text(
            status,
            style: TextStyle(
              color: textColor,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}

