import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/widgets/erp_text_field.dart';
import '../../../../core/theme/app_colors.dart';
import '../models/payment_model.dart';

class AddPaymentDialog extends StatefulWidget {
  final PaymentModel payment;
  const AddPaymentDialog({super.key, required this.payment});

  @override
  State<AddPaymentDialog> createState() => _AddPaymentDialogState();
}

class _AddPaymentDialogState extends State<AddPaymentDialog> {
  String _selectedMethod = 'Cash';
  String _selectedStatus = 'Completed'; // Naya payment by default completed manenge
  final TextEditingController _amountController = TextEditingController();
  late String _currentDate;
  
  bool _isSaveEnabled = false;
  String? _amountErrorText;

  @override
  void initState() {
    super.initState();
    // 1. Current Date generate karna (Format: DD-MM-YYYY)
    final now = DateTime.now();
    _currentDate = '${now.day.toString().padLeft(2, '0')}-${now.month.toString().padLeft(2, '0')}-${now.year}';
    
    // 2. Amount field ko continuously monitor karna validation ke liye
    _amountController.addListener(_validateForm);
  }

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  // VALIDATION LOGIC
  void _validateForm() {
    final text = _amountController.text.trim();
    
    if (text.isEmpty) {
      setState(() {
        _isSaveEnabled = false;
        _amountErrorText = null;
      });
      return;
    }

    final amount = double.tryParse(text);
    
    if (amount == null || amount <= 0) {
      setState(() {
        _isSaveEnabled = false;
        _amountErrorText = 'Invalid amount';
      });
    } else if (amount > widget.payment.pendingBalance) {
      setState(() {
        _isSaveEnabled = false;
        _amountErrorText = 'Amount cannot exceed ₹${widget.payment.pendingBalance.toInt()}';
      });
    } else {
      setState(() {
        _isSaveEnabled = true;
        _amountErrorText = null;
      });
    }
  }

  Widget _buildDetailRow(String title, Widget value, TextTheme textTheme, {bool isLast = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: isLast ? null : const BoxDecoration(border: Border(bottom: BorderSide(color: AppColors.line))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: textTheme.bodyMedium?.copyWith(color: AppColors.slate)),
          value,
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;
    final p = widget.payment;
    final isPendingZero = p.pendingBalance == 0;

    return Dialog(
      backgroundColor: AppColors.surface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      clipBehavior: Clip.antiAlias,
      child: SizedBox(
        width: 550,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // TOP HEADER
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              color: AppColors.navy1,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Customer Details', style: textTheme.titleMedium?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                  MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: const Icon(LucideIcons.x, color: Colors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ),
            
            // BODY CONTENT
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildDetailRow('Customer Name', Text(p.fullName, style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow(
                      'Argument Number', 
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(color: const Color(0xFFE8EEF7), borderRadius: BorderRadius.circular(5)),
                        child: Text(p.argumentNumber, style: textTheme.bodyMedium?.copyWith(color: AppColors.navy2, fontWeight: FontWeight.bold)),
                      ), 
                      textTheme
                    ),
                    _buildDetailRow('Reference', Text('REF-001', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow('Mobile Number', Text(p.phone, style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow('Service', Text(p.service, style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow('Total Charges', Text('₹${p.netCharge.toInt()}', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow('Already Paid', Text('₹${p.advance.toInt()}', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold)), textTheme),
                    _buildDetailRow('Pending Balance', Text('₹${p.pendingBalance.toInt()}', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: isPendingZero ? AppColors.green : AppColors.red)), textTheme, isLast: true),
                    
                    const SizedBox(height: 16),
                    const Divider(color: AppColors.line, height: 1), // Ye ek patli line banayega
                    const SizedBox(height: 16),
                    
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start, // Align to top for error messages
                      children: [
                        Expanded(
                          // WIDGET USE KIYA HAI YAHAN
                          child: ErpTextField(
                            label: 'NEW PAYMENT AMOUNT (₹)',
                            controller: _amountController,
                            keyboardType: TextInputType.number,
                            hintText: '0',
                            errorText: _amountErrorText, // Error pass kiya
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('PAYMENT METHOD', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                              const SizedBox(height: 6),
                              SizedBox(
                                height: 42,
                                child: DropdownButtonFormField<String>(
                                  value: _selectedMethod,
                                  style: textTheme.bodyMedium,
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: AppColors.surface,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                                    enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                    focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
                                  ),
                                  items: ['Cash', 'Online', 'Card', 'Cheque'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                                  onChanged: (v) => setState(() => _selectedMethod = v!),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),
                    
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('PAYMENT DATE', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                              const SizedBox(height: 6),
                              SizedBox(
                                height: 42,
                                child: TextField(
                                  readOnly: true, // SIRF READ ONLY, EDIT NAHI HOGA
                                  controller: TextEditingController(text: _currentDate),
                                  style: textTheme.bodyMedium?.copyWith(color: AppColors.slate), // Thoda greyish taaki disabled lage
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: const Color(0xFFF8F9FB), // Thoda grey background
                                    suffixIcon: const Icon(LucideIcons.calendar, size: 18, color: AppColors.slate),
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                                    enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                    focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('PAYMENT STATUS', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                              const SizedBox(height: 6),
                              SizedBox(
                                height: 42,
                                child: DropdownButtonFormField<String>(
                                  value: _selectedStatus,
                                  style: textTheme.bodyMedium,
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: AppColors.surface,
                                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                                    enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                    focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
                                  ),
                                  items: ['Pending', 'Completed'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                                  onChanged: (v) => setState(() => _selectedStatus = v!),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 20),
                    const Divider(color: AppColors.line, height: 1), // Ye ek patli line banayega
                    const SizedBox(height: 16),
                    
                    // BOTTOM BUTTONS: Cancel & Save
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            side: const BorderSide(color: AppColors.line),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          ),
                          onPressed: () => Navigator.pop(context),
                          child: Text('Cancel', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.navy2,
                            disabledBackgroundColor: AppColors.line, // Disabled colour
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                          ),
                          onPressed: _isSaveEnabled ? () {
                            // Yahan backend API call aayegi future mein
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Payment saved successfully!'), backgroundColor: AppColors.green),
                            );
                          } : null, // Validation fail hai toh NULL paas kiya, isse button disable ho jayega
                          child: Text('Save Payment', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: _isSaveEnabled ? Colors.white : AppColors.slate)),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

