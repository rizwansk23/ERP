/// A staff account, with generated login credentials.
class StaffModel {
  final String name;
  final String id; // e.g. STF-1042
  final String pass;

  StaffModel({
    required this.name,
    required this.id,
    required this.pass,
  });
}
