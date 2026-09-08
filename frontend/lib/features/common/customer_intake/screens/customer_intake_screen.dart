import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/erp_text_field.dart';
import '../widgets/recent_entries_table.dart';

class CustomerIntakeScreen extends StatefulWidget {
  const CustomerIntakeScreen({super.key});

  @override
  State<CustomerIntakeScreen> createState() => _CustomerIntakeScreenState();
}

class _CustomerIntakeScreenState extends State<CustomerIntakeScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _surnameController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _argController = TextEditingController();
  final TextEditingController _deadlineController = TextEditingController();
  
  final TextEditingController _chargesController = TextEditingController(text: '2200');
  final TextEditingController _discountController = TextEditingController(text: '0');
  final TextEditingController _advanceController = TextEditingController(text: '0');
  final TextEditingController _remainingController = TextEditingController(text: '2,200');
  
  String _paymentMode = 'Cash'; 
  bool _isSaveEnabled = false; 
  String _selectedDeadlineChip = ''; 
  bool _isEditing = false; 

  // EDIT MODE KE LIYE INITIAL VALUES STORAGE
  String _initName = '';
  String _initSurname = '';
  String _initMobile = '';
  String _initArg = '';
  String _initDeadline = '';
  String _initCharges = '2200';
  String _initDiscount = '0';
  String _initAdvance = '0';
  String _initPaymentMode = 'Cash';

  @override
  void initState() {
    super.initState();
    _nameController.addListener(_validateForm);
    _surnameController.addListener(_validateForm);
    _mobileController.addListener(_validateForm);
    _deadlineController.addListener(_validateForm); 
    _argController.addListener(_validateForm);
    
    _chargesController.addListener(_calculateRemaining);
    _discountController.addListener(_calculateRemaining);
    _advanceController.addListener(_calculateRemaining);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _surnameController.dispose();
    _mobileController.dispose();
    _argController.dispose();
    _deadlineController.dispose();
    _chargesController.dispose();
    _discountController.dispose();
    _advanceController.dispose();
    _remainingController.dispose();
    super.dispose();
  }

  // ADVANCED VALIDATION LOGIC FOR ADD & EDIT
  void _validateForm() {
    final nameValid = _nameController.text.trim().isNotEmpty;
    final surnameValid = _surnameController.text.trim().isNotEmpty;
    final mobileValid = _mobileController.text.trim().length >= 10; 
    final deadlineValid = _deadlineController.text.trim().isNotEmpty; 

    bool requiredFieldsValid = nameValid && surnameValid && mobileValid && deadlineValid;

    if (_isEditing) {
      // Edit mode mein tabhi enable hoga jab required fields valid hon + koi value change hui ho
      bool hasChanged = 
          _nameController.text != _initName ||
          _surnameController.text != _initSurname ||
          _mobileController.text != _initMobile ||
          _argController.text != _initArg ||
          _deadlineController.text != _initDeadline ||
          _chargesController.text != _initCharges ||
          _discountController.text != _initDiscount ||
          _advanceController.text != _initAdvance ||
          _paymentMode != _initPaymentMode;

      setState(() {
        _isSaveEnabled = requiredFieldsValid && hasChanged;
      });
    } else {
      // Normal Add mode
      setState(() {
        _isSaveEnabled = requiredFieldsValid;
      });
    }
  }

  void _calculateRemaining() {
    double charges = double.tryParse(_chargesController.text) ?? 0;
    double discount = double.tryParse(_discountController.text) ?? 0;
    double advance = double.tryParse(_advanceController.text) ?? 0;
    
    double remaining = charges - discount - advance;
    if (remaining < 0) remaining = 0;
    
    _remainingController.text = remaining.toInt().toString();
    _validateForm(); // Charges change hone par bhi validation check ho
  }

  void _setDeadline(String type) {
    setState(() {
      _selectedDeadlineChip = type;
    });
    
    DateTime now = DateTime.now();
    DateTime deadline;
    
    if (type == '+10 days') {
      deadline = now.add(const Duration(days: 10));
    } else if (type == '+30 days') {
      deadline = now.add(const Duration(days: 30));
    } else if (type == '+2 months') {
      deadline = DateTime(now.year, now.month + 2, now.day);
    } else {
      _deadlineController.clear(); 
      return;
    }
    
    _deadlineController.text = '${deadline.day.toString().padLeft(2, '0')}-${deadline.month.toString().padLeft(2, '0')}-${deadline.year}';
  }

  void _resetForm() {
    _nameController.clear();
    _surnameController.clear();
    _mobileController.clear();
    _argController.clear();
    _deadlineController.clear();
    _chargesController.text = '2200';
    _discountController.text = '0';
    _advanceController.text = '0';
    
    // Reset initial trackers
    _initName = '';
    _initSurname = '';
    _initMobile = '';
    _initArg = '';
    _initDeadline = '';
    _initCharges = '2200';
    _initDiscount = '0';
    _initAdvance = '0';
    _initPaymentMode = 'Cash';

    setState(() {
      _paymentMode = 'Cash';
      _selectedDeadlineChip = '';
      _isSaveEnabled = false;
      _isEditing = false; 
    });
  }

  // YAHAN INITIAL VALUES SAVE HO RAHI HAIN EDIT CLICK HOTE HI
  void _populateForm(Map<String, dynamic> data) {
    _initName = data['name'] ?? '';
    _initSurname = data['surname'] ?? '';
    _initMobile = data['mobile'] ?? '';
    _initArg = data['argNo'] ?? '';
    _initDeadline = data['deadline'] ?? '';
    _initCharges = data['charges'] ?? '0';
    _initDiscount = data['discount'] ?? '0';
    _initAdvance = data['advance'] ?? '0';
    _initPaymentMode = data['paymentMode'] ?? 'Cash';

    // Controllers mein data set karna
    _nameController.text = _initName;
    _surnameController.text = _initSurname;
    _mobileController.text = _initMobile;
    _argController.text = _initArg;
    _deadlineController.text = _initDeadline;
    _chargesController.text = _initCharges;
    _discountController.text = _initDiscount;
    _advanceController.text = _initAdvance;

    setState(() {
      _paymentMode = _initPaymentMode;
      _selectedDeadlineChip = 'Custom'; 
      _isEditing = true; 
    });
    
    // Turant validate karenge (jo ki changes na hone ki wajah se false rahega)
    _validateForm();
  }

  Widget _buildDateChip(String label, TextTheme textTheme) {
    bool isSelected = _selectedDeadlineChip == label;
    return GestureDetector(
      onTap: () => _setDeadline(label),
      child: Container(
        margin: const EdgeInsets.only(right: 8, top: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navy2 : Colors.white,
          border: Border.all(color: isSelected ? AppColors.navy2 : AppColors.line),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Text(label, style: textTheme.labelSmall?.copyWith(color: isSelected ? Colors.white : AppColors.navy2, fontWeight: FontWeight.bold)),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final textTheme = Theme.of(context).textTheme;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.line),
              boxShadow: const [BoxShadow(color: Color.fromRGBO(15,49,93,0.04), blurRadius: 2, offset: Offset(0, 1))],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(child: ErpTextField(label: 'Name', hintText: 'e.g. Rohan', isRequired: true, controller: _nameController)),
                    const SizedBox(width: 24),
                    Expanded(child: ErpTextField(label: 'Surname', hintText: 'e.g. Mehta', isRequired: true, controller: _surnameController)),
                  ],
                ),
                const SizedBox(height: 24),
                
                Row(
                  children: [
                    Expanded(child: ErpTextField(label: 'Mobile Number', hintText: '10-digit mobile number', isRequired: true, keyboardType: TextInputType.phone, controller: _mobileController)),
                    const SizedBox(width: 24),
                    Expanded(child: ErpTextField(label: 'Reference', hintText: 'e.g. REF-001')),
                  ],
                ),
                const SizedBox(height: 24),
                
                Row(
                  children: [
                    Expanded(child: ErpTextField(label: 'Argument Number', hintText: 'e.g. ARG-2026-001', controller: _argController)),
                    const SizedBox(width: 24),
                    Expanded(child: ErpTextField(label: 'Date', hintText: 'Sep 5, 2026', helperText: 'Defaults to today if left blank')),
                  ],
                ),
                const SizedBox(height: 24),
                
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ErpTextField(
                            label: 'Deadline Date', 
                            hintText: 'dd-mm-yyyy', 
                            isRequired: true, 
                            controller: _deadlineController,
                            suffixIcon: const Icon(LucideIcons.calendar, size: 18, color: AppColors.slate)
                          ),
                          Wrap(
                            children: [
                              _buildDateChip('+10 days', textTheme),
                              _buildDateChip('+30 days', textTheme),
                              _buildDateChip('+2 months', textTheme),
                              _buildDateChip('Custom', textTheme),
                            ],
                          )
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('SERVICE', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                          const SizedBox(height: 6),
                          SizedBox(
                            height: 42,
                            child: DropdownButtonFormField<String>(
                              value: 'Screen Repair — ₹2,200',
                              style: textTheme.bodyMedium,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.surface,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                                enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
                              ),
                              items: ['Screen Repair — ₹2,200', 'Battery Replacement — ₹950'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                              onChanged: (v) {},
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                Row(
                  children: [
                    Expanded(child: ErpTextField(label: 'Payment Charges (₹)', controller: _chargesController, keyboardType: TextInputType.number)),
                    const SizedBox(width: 24),
                    Expanded(child: ErpTextField(label: 'Discounted Price (₹)', controller: _discountController, keyboardType: TextInputType.number)),
                  ],
                ),
                const SizedBox(height: 24),
                
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('PAYMENT MODE', style: textTheme.labelSmall?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                          const SizedBox(height: 6),
                          SizedBox(
                            height: 42,
                            child: DropdownButtonFormField<String>(
                              value: _paymentMode,
                              style: textTheme.bodyMedium,
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: AppColors.surface,
                                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 0),
                                enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
                                focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
                              ),
                              items: ['Cash', 'Online', 'Cheque'].map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                              onChanged: (v) {
                                setState(() => _paymentMode = v!);
                                _validateForm(); // Payment mode change par bhi validation check
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 24),
                    Expanded(child: ErpTextField(label: 'Payment Received / Advance (₹)', controller: _advanceController, keyboardType: TextInputType.number)),
                  ],
                ),
                const SizedBox(height: 16),
                
                Row(
                  children: [
                    Expanded(child: ErpTextField(label: 'Remaining Balance (₹)', controller: _remainingController, readOnly: true)),
                    const SizedBox(width: 24),
                    const Expanded(child: SizedBox()), 
                  ],
                ),
                
                const SizedBox(height: 32),
                const Divider(color: AppColors.line),
                const SizedBox(height: 24),
                
                if (_isEditing)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                          side: const BorderSide(color: AppColors.line),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        ),
                        onPressed: _resetForm,
                        child: Text('Cancel', style: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold, color: AppColors.slate)),
                      ),
                      const SizedBox(width: 16),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.navy1,
                          disabledBackgroundColor: AppColors.line,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                        ),
                        onPressed: _isSaveEnabled ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Customer updated successfully!'), backgroundColor: AppColors.green),
                          );
                          _resetForm(); 
                        } : null,
                        child: Text('Update customer', style: textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.bold, 
                          color: _isSaveEnabled ? Colors.white : AppColors.slate
                        )),
                      ),
                    ],
                  )
                else
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.navy1,
                      disabledBackgroundColor: AppColors.line,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                    ),
                    onPressed: _isSaveEnabled ? () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Customer Intake saved successfully!'), backgroundColor: AppColors.green),
                      );
                      _resetForm(); 
                    } : null,
                    child: Text('Save customer', style: textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.bold, 
                      color: _isSaveEnabled ? Colors.white : AppColors.slate
                    )),
                  ),
              ],
            ),
          ),
          
          const SizedBox(height: 40),
          
          RecentEntriesTable(onEdit: _populateForm), 
        ],
      ),
    );
  }
}