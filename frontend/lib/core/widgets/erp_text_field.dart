import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class ErpTextField extends StatelessWidget {
  final String label;
  final String? hintText;
  final String? helperText;
  final String? errorText; // NAYA: Error text ke liye
  final bool isRequired;
  final bool readOnly;
  final Widget? suffixIcon;
  final TextEditingController? controller;
  final TextInputType keyboardType;
  final void Function(String)? onChanged;

  const ErpTextField({
    super.key,
    required this.label,
    this.hintText,
    this.helperText,
    this.errorText, // NAYA
    this.isRequired = false,
    this.readOnly = false,
    this.suffixIcon,
    this.controller,
    this.keyboardType = TextInputType.text,
    this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(label.toUpperCase(), style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
            if (isRequired) Text(' *', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.red)),
          ],
        ),
        const SizedBox(height: 6),
        // NAYA: SizedBox(height: 42) hata diya taaki errorText aane par box expand ho sake
        TextField(
          controller: controller,
          readOnly: readOnly,
          keyboardType: keyboardType,
          onChanged: onChanged,
          style: textTheme.bodyMedium?.copyWith(color: readOnly ? AppColors.slate : AppColors.ink),
          decoration: InputDecoration(
            hintText: hintText,
            errorText: errorText, // NAYA
            hintStyle: textTheme.bodyMedium?.copyWith(color: AppColors.faint),
            filled: true,
            fillColor: readOnly ? const Color(0xFFF8F9FB) : AppColors.surface,
            suffixIcon: suffixIcon,
            isDense: true, 
            // contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10), // Vertical padding 12 se 10 kardi
            // NAYA: Vertical padding add ki taaki default height perfect rahe
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
            enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
            focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: readOnly ? AppColors.line : AppColors.navy2, width: readOnly ? 1 : 2), borderRadius: BorderRadius.circular(6)),
            errorBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.red), borderRadius: BorderRadius.circular(6)),
            focusedErrorBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.red, width: 2), borderRadius: BorderRadius.circular(6)),
          ),
        ),
        if (helperText != null && errorText == null) ...[ // Error ke time helper chup jayega
          const SizedBox(height: 4),
          Text(helperText!, style: textTheme.labelSmall?.copyWith(color: AppColors.faint)),
        ]
      ],
    );
  }
}