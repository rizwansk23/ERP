/// A customer intake entry — created by Admin or Staff during intake.
class CustomerModel {
  final String id;
  String name;
  String phone;
  final String date;
  String deadline;
  String service;
  double charge;
  double discount;
  double advance;
  String mode; // Cash / Online / Cheque
  final String createdBy; // Admin / Staff

  CustomerModel({
    required this.id,
    required this.name,
    required this.phone,
    required this.date,
    required this.deadline,
    required this.service,
    required this.charge,
    required this.discount,
    required this.advance,
    required this.mode,
    required this.createdBy,
  });

  double get balance => (charge - discount) - advance;
}
