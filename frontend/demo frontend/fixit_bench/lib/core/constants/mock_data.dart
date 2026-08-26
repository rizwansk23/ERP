import '../../models/customer_model.dart';
import '../../models/payment_model.dart';
import '../../models/staff_model.dart';
import '../../models/work_item_model.dart';

/// A single service offered, with its default charge. [builtin] services
/// ship with the app; custom ones are added via Form Management.
class ServiceModel {
  String name;
  double charge;
  bool builtin;
  ServiceModel({required this.name, required this.charge, this.builtin = false});
}

/// One row in the Activity Log — every staff-made change is recorded here.
class ActivityEntry {
  final String actor;
  final String role; // admin / staff
  final String action;
  final String detail;
  final DateTime ts;
  ActivityEntry({
    required this.actor,
    required this.role,
    required this.action,
    required this.detail,
    required this.ts,
  });
}

/// Temp arrays used to seed the app before a real backend is wired up.
class MockData {
  MockData._();

  static List<ServiceModel> services() => [
        ServiceModel(name: 'Screen Repair', charge: 2200),
        ServiceModel(name: 'Battery Replacement', charge: 950),
        ServiceModel(name: 'Diagnostic Check', charge: 300),
        ServiceModel(name: 'Data Recovery', charge: 4000),
        ServiceModel(name: 'Software Setup', charge: 600),
      ];

  static List<PaymentModel> payments() => [
        PaymentModel(name: 'Rohan Mehta', phone: '98200 11234', receipt: 'RCP-1001', service: 'Screen Repair', charge: 2200, advance: 2200, status: PaymentStatus.completed, method: 'Cash'),
        PaymentModel(name: 'Ayesha Khan', phone: '99870 55621', receipt: 'RCP-1002', service: 'Battery Replacement', charge: 950, advance: 500, status: PaymentStatus.balance, method: 'Online'),
        PaymentModel(name: 'Vikram Sethi', phone: '90040 87765', receipt: 'RCP-1003', service: 'Data Recovery', charge: 4000, advance: 0, status: PaymentStatus.pending, method: '—'),
        PaymentModel(name: 'Neha Joshi', phone: '98211 33440', receipt: 'RCP-1004', service: 'Diagnostic Check', charge: 300, advance: 300, status: PaymentStatus.completed, method: 'Cash'),
        PaymentModel(name: 'Farhan Ali', phone: '91674 20981', receipt: 'RCP-1005', service: 'Software Setup', charge: 600, advance: 200, status: PaymentStatus.balance, method: 'Cheque'),
        PaymentModel(name: 'Priya Nair', phone: '97022 66190', receipt: 'RCP-1006', service: 'Screen Repair', charge: 2200, advance: 0, status: PaymentStatus.pending, method: '—'),
      ];

  static List<WorkItemModel> works() => [
        WorkItemModel(name: 'Rohan Mehta', service: 'Screen Repair', deadline: '03 Aug 2026', remark: 'Cracked display, part ordered', processed: true, status: WorkStatus.accepted, completed: true, delivered: true),
        WorkItemModel(name: 'Ayesha Khan', service: 'Battery Replacement', deadline: '02 Aug 2026', processed: true, status: WorkStatus.accepted),
        WorkItemModel(name: 'Vikram Sethi', service: 'Data Recovery', deadline: '30 Jul 2026', remark: 'Drive unresponsive, escalate'),
        WorkItemModel(name: 'Neha Joshi', service: 'Diagnostic Check', deadline: '01 Aug 2026', processed: true, status: WorkStatus.accepted, completed: true),
        WorkItemModel(name: 'Farhan Ali', service: 'Software Setup', deadline: '05 Aug 2026'),
        WorkItemModel(name: 'Priya Nair', service: 'Screen Repair', deadline: '04 Aug 2026', remark: 'Part unavailable locally', status: WorkStatus.rejected),
      ];

  static List<StaffModel> staff() => [
        StaffModel(name: 'Aman Verma', id: 'STF-1042', pass: 'k3n9Qz'),
        StaffModel(name: 'Sana Iqbal', id: 'STF-1043', pass: 'x82vLp'),
      ];

  static List<CustomerModel> customers() => [
        CustomerModel(id: 'CUST-9001', name: 'Rohan Mehta', phone: '98200 11234', date: 'Aug 1, 2026', deadline: '2026-08-03', service: 'Screen Repair', charge: 2200, discount: 0, advance: 2200, mode: 'Cash', createdBy: 'Admin'),
        CustomerModel(id: 'CUST-9002', name: 'Ayesha Khan', phone: '99870 55621', date: 'Aug 1, 2026', deadline: '2026-08-02', service: 'Battery Replacement', charge: 950, discount: 50, advance: 500, mode: 'Online', createdBy: 'Admin'),
      ];

  /// value = number of jobs, used for the dashboard bar chart.
  static List<MapEntry<String, int>> chartData() => const [
        MapEntry('Screen Repair', 42),
        MapEntry('Battery', 31),
        MapEntry('Diagnostic', 25),
        MapEntry('Software', 18),
        MapEntry('Data Recovery', 12),
      ];

  /// Sidebar nav items per role. id -> label.
  static const Map<String, List<MapEntry<String, String>>> nav = {
    'admin': [
      MapEntry('dashboard', 'Dashboard'),
      MapEntry('intake', 'Customer Intake'),
      MapEntry('payments', 'Payment Dashboard'),
      MapEntry('works', 'Works Dashboard'),
      MapEntry('staff', 'Staff Management'),
      MapEntry('activity', 'Activity Log'),
      MapEntry('formmgmt', 'Form Management'),
      MapEntry('profile', 'Profile'),
    ],
    'staff': [
      MapEntry('intake', 'Customer Intake'),
      MapEntry('payments', 'Payment Dashboard'),
      MapEntry('works', 'Works Dashboard'),
    ],
  };

  /// view id -> [eyebrow, title] shown in the topbar.
  static const Map<String, List<String>> titles = {
    'dashboard': ['Overview', 'Dashboard'],
    'intake': ['New entry', 'Customer Intake'],
    'payments': ['Accounts', 'Payment Dashboard'],
    'works': ['Job tracking', 'Works Dashboard'],
    'staff': ['Team', 'Staff Management'],
    'formmgmt': ['Services & fields', 'Form Management'],
    'profile': ['Settings', 'Profile'],
    'activity': ['Audit trail', 'Activity Log'],
  };

  static const List<String> fyRanges = ['1M', '3M', '6M', '12M', 'FY_CURRENT', 'FY_LAST', 'FY_LAST3'];

  static const Map<String, String> fyLabels = {
    '1M': '1M',
    '3M': '3M',
    '6M': '6M',
    '12M': '12M',
    'FY_CURRENT': 'Current FY',
    'FY_LAST': 'Last FY',
    'FY_LAST3': 'Last 3 FY',
  };

  /// range -> {works, revenue, pending, trend}
  static const Map<String, Map<String, dynamic>> fyData = {
    '1M': {'works': 128, 'revenue': 184600, 'pending': 32400, 'trend': '↑ 12 vs last period', 'mult': 1.0},
    '3M': {'works': 361, 'revenue': 512400, 'pending': 48200, 'trend': '↑ 54 vs last period', 'mult': 2.6},
    '6M': {'works': 702, 'revenue': 998200, 'pending': 61500, 'trend': '↑ 121 vs last period', 'mult': 4.9},
    '12M': {'works': 1340, 'revenue': 1942000, 'pending': 74800, 'trend': '↑ 268 vs last period', 'mult': 9.1},
    'FY_CURRENT': {'works': 842, 'revenue': 1218400, 'pending': 58200, 'trend': 'FY 2026–27 (Apr 2026 – Mar 2027) so far', 'mult': 5.8},
    'FY_LAST': {'works': 1512, 'revenue': 2186900, 'pending': 21400, 'trend': 'FY 2025–26 (Apr 2025 – Mar 2026)', 'mult': 10.4},
    'FY_LAST3': {'works': 4028, 'revenue': 5734200, 'pending': 96700, 'trend': 'FY 2023–24 to FY 2025–26', 'mult': 27.6},
  };
}
