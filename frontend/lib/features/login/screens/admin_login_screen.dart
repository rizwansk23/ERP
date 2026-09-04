import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class AdminLoginScreen extends StatefulWidget {
  const AdminLoginScreen({super.key});

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  bool isAdmin = true; // Tracks the toggle state

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AppColors.navy1, AppColors.navy3],
          ),
        ),
        child: Center(
          child: Container(
            width: 380,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(color: Colors.black26, blurRadius: 20, offset: Offset(0, 10))
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Branding
                Container(
                  width: 34, height: 34,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(color: AppColors.navy1, borderRadius: BorderRadius.circular(7)),
                  child: const Text('PA', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                ),
                const SizedBox(height: 12),
                const Text('VYOM OS · ENTERPRISE ERP', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppColors.navy2, letterSpacing: 1.4)),
                const SizedBox(height: 6),
                const Text('Pritam Associates', style: TextStyle(fontSize: 19, fontWeight: FontWeight.bold, color: AppColors.ink)),
                const Text('Device & appliance service desk', style: TextStyle(fontSize: 12, color: AppColors.slate)),
                const SizedBox(height: 26),
                
                // Admin / Staff Toggle Tabs
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: AppColors.line),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.all(3),
                  margin: const EdgeInsets.only(bottom: 26),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => isAdmin = true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: isAdmin ? AppColors.navy2 : Colors.transparent,
                              borderRadius: BorderRadius.circular(18),
                            ),
                            alignment: Alignment.center,
                            child: Text('Admin login', style: TextStyle(color: isAdmin ? Colors.white : AppColors.slate, fontWeight: FontWeight.bold, fontSize: 12.5)),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => isAdmin = false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            decoration: BoxDecoration(
                              color: !isAdmin ? AppColors.navy2 : Colors.transparent,
                              borderRadius: BorderRadius.circular(18),
                            ),
                            alignment: Alignment.center,
                            child: Text('Staff login', style: TextStyle(color: !isAdmin ? Colors.white : AppColors.slate, fontWeight: FontWeight.bold, fontSize: 12.5)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Form Fields
                _buildTextField(isAdmin ? 'Admin user ID' : 'Staff user ID', isAdmin ? 'admin' : 'STF-1042', false),
                const SizedBox(height: 16),
                _buildTextField('Password', '••••••••', true),
                const SizedBox(height: 14),
                
                // Forgot Password (Only shown for Admin)
                if (isAdmin)
                  Align(
                    alignment: Alignment.centerLeft,
                    child: TextButton(
                      onPressed: () {},
                      style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 0), tapTargetSize: MaterialTapTargetSize.shrinkWrap),
                      child: const Text('Forgot application password?', style: TextStyle(color: AppColors.navy2, fontSize: 12, decoration: TextDecoration.none)),
                    ),
                  )
                else
                  const SizedBox(height: 12), // Keep spacing consistent when link is hidden
                  
                const SizedBox(height: 18),
                
                // Submit Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.navy2,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                    ),
                    onPressed: () {
                      if (isAdmin) {
                        context.go('/dashboard');
                      } else {
                        // Based on the HTML, staff login drops them at intake by default
                        context.go('/staff/intake');
                      }
                    },
                    child: const Text('Sign in', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String hint, bool isPassword) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppColors.slate)),
        const SizedBox(height: 6),
        TextField(
          obscureText: isPassword,
          decoration: InputDecoration(
            hintText: hint,
            filled: true,
            fillColor: AppColors.surface,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            enabledBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.line), borderRadius: BorderRadius.circular(6)),
            focusedBorder: OutlineInputBorder(borderSide: const BorderSide(color: AppColors.navy2, width: 2), borderRadius: BorderRadius.circular(6)),
          ),
        ),
      ],
    );
  }
}