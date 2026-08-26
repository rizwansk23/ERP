import 'package:flutter/material.dart';
import 'constants/mock_data.dart';
import '../models/customer_model.dart';
import '../models/payment_model.dart';
import '../models/staff_model.dart';
import '../models/work_item_model.dart';

/// Central, app-wide state: auth/role, current nav view, app-lock, and
/// the in-memory mock dataset. Provided at the root via [ChangeNotifierProvider]
/// so every screen can read/mutate it without prop-drilling.
class AppState extends ChangeNotifier {
  // ---- auth / role ----
  bool signedIn = false;
  String mode = 'admin'; // 'admin' | 'staff'
  String currentStaffName = 'Staff';
  String currentView = 'dashboard';

  // ---- app lock ----
  bool appLocked = false;
  String appLockPassword = 'ilock2026';

  // ---- dashboard ----
  String activeDashRange = '1M';

  // ---- data ----
  final List<ServiceModel> services = MockData.services();
  final List<PaymentModel> payments = MockData.payments();
  final List<WorkItemModel> works = MockData.works();
  final List<StaffModel> staff = MockData.staff();
  final List<CustomerModel> customers = MockData.customers();
  final List<ActivityEntry> activityLog = [];

  void signIn({required String asMode, String staffName = 'Staff'}) {
    signedIn = true;
    mode = asMode;
    currentStaffName = staffName;
    currentView = asMode == 'admin' ? 'dashboard' : 'intake';
    notifyListeners();
  }

  void signOut() {
    signedIn = false;
    appLocked = false;
    currentView = 'dashboard';
    notifyListeners();
  }

  void toggleMode() {
    mode = mode == 'admin' ? 'staff' : 'admin';
    final validViews = MockData.nav[mode]!.map((e) => e.key).toList();
    if (!validViews.contains(currentView)) {
      currentView = validViews.first;
    }
    notifyListeners();
  }

  void goTo(String view) {
    currentView = view;
    notifyListeners();
  }

  void lockApp() {
    appLocked = true;
    notifyListeners();
  }

  bool unlockApp(String password) {
    if (password == appLockPassword) {
      appLocked = false;
      notifyListeners();
      return true;
    }
    return false;
  }

  void setDashRange(String range) {
    activeDashRange = range;
    notifyListeners();
  }

  void logActivity(String action, String detail) {
    activityLog.insert(
      0,
      ActivityEntry(
        actor: mode == 'staff' ? currentStaffName : 'Admin',
        role: mode,
        action: action,
        detail: detail,
        ts: DateTime.now(),
      ),
    );
    notifyListeners();
  }

  void addCustomer(CustomerModel customer) {
    customers.insert(0, customer);
    logActivity('Customer intake', '${customer.name} · ${customer.service}');
    notifyListeners();
  }

  void addStaff(StaffModel s) {
    staff.add(s);
    notifyListeners();
  }

  void addService(ServiceModel s) {
    services.add(s);
    notifyListeners();
  }

  void updatePaymentStatus(PaymentModel p, PaymentStatus status) {
    p.status = status;
    logActivity('Payment updated', '${p.name} · ${status.label}');
    notifyListeners();
  }

  void updateWorkStatus(WorkItemModel w, WorkStatus status) {
    w.status = status;
    w.processed = true;
    logActivity('Job ${status.label.toLowerCase()}', '${w.name} · ${w.service}');
    notifyListeners();
  }

  void toggleWorkCompleted(WorkItemModel w) {
    w.completed = !w.completed;
    logActivity('Job ${w.completed ? 'marked complete' : 'reopened'}', '${w.name} · ${w.service}');
    notifyListeners();
  }

  void toggleWorkDelivered(WorkItemModel w) {
    w.delivered = !w.delivered;
    logActivity('Job ${w.delivered ? 'delivered' : 'delivery undone'}', '${w.name} · ${w.service}');
    notifyListeners();
  }

  void updateRemark(WorkItemModel w, String remark) {
    w.remark = remark;
    notifyListeners();
  }
}
