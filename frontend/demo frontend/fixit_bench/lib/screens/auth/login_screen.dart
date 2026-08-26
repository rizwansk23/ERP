import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/app_state.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_fonts.dart';
import '../../widgets/app_toast.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_input.dart';

/// Unauthenticated login screen. Handles both the Admin and Staff login
/// tabs (mirrors `#login-view` in the HTML reference).
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  String tab = 'admin';
  bool showForgot = false;
  final idController = TextEditingController(text: 'admin');
  final passController = TextEditingController(text: 'password');

  void _setTab(String t) {
    setState(() {
      tab = t;
      showForgot = false;
      idController.text = t == 'admin' ? 'admin' : 'STF-1042';
    });
  }

  void _signIn() {
    final state = context.read<AppState>();
    if (idController.text.trim().isEmpty || passController.text.trim().isEmpty) {
      AppToast.show(context, 'Enter your ID and password');
      return;
    }
    state.signIn(
      asMode: tab,
      staffName: tab == 'staff' ? 'Aman Verma' : 'Staff',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paper,
      body: Center(
        child: Container(
          width: 380,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: AppColors.surface,
            border: Border.all(color: AppColors.line),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Column(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.accent,
                      borderRadius: BorderRadius.circular(AppColors.radius),
                    ),
                    child: Text('FB', style: AppFonts.display(size: 15, weight: FontWeight.w700, color: Colors.white)),
                  ),
                  const SizedBox(height: 12),
                  Text('Fixit Bench', style: AppFonts.display(size: 17)),
                  const SizedBox(height: 2),
                  Text('Device & appliance service desk',
                      style: AppFonts.body(size: 12, color: AppColors.slate)),
                ],
              ),
              const SizedBox(height: 26),
              Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.line),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Expanded(child: _LoginTab(label: 'Admin login', active: tab == 'admin', onTap: () => _setTab('admin'))),
                    Expanded(child: _LoginTab(label: 'Staff login', active: tab == 'staff', onTap: () => _setTab('staff'))),
                  ],
                ),
              ),
              const SizedBox(height: 26),
              CustomInput(label: tab == 'admin' ? 'Admin user ID' : 'Staff ID', controller: idController),
              const SizedBox(height: 16),
              CustomInput(label: 'Password', controller: passController, obscure: true),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerLeft,
                child: TextButton(
                  onPressed: () => setState(() => showForgot = !showForgot),
                  style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 30)),
                  child: Text('Forgot application password?',
                      style: AppFonts.body(size: 12, color: AppColors.accent).copyWith(decoration: TextDecoration.underline)),
                ),
              ),
              if (showForgot)
                Container(
                  margin: const EdgeInsets.only(top: 6),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.paper,
                    border: Border.all(color: AppColors.line),
                    borderRadius: BorderRadius.circular(AppColors.radius),
                  ),
                  child: Text(
                    'Enter your default admin login password to reset the application lock.\n'
                    '1. Select Forgot password\n2. Enter your default admin login password\n'
                    '3. Password verified\n4. Set a new application lock password',
                    style: AppFonts.body(size: 12, color: AppColors.slate),
                  ),
                ),
              const SizedBox(height: 18),
              PrimaryButton(label: 'Sign in', onPressed: _signIn, fullWidth: true),
            ],
          ),
        ),
      ),
    );
  }
}

class _LoginTab extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const _LoginTab({required this.label, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? AppColors.accent : Colors.transparent,
      borderRadius: BorderRadius.circular(18),
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 7),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: AppFonts.body(
              size: 12.5,
              weight: FontWeight.w600,
              color: active ? Colors.white : AppColors.slate,
            ),
          ),
        ),
      ),
    );
  }
}
