class PaymentModel {
  final String id;
  final String firstName;
  final String lastName;
  final String phone;
  final String argumentNumber;
  final String service;
  final double charge;
  final double discount;
  final double advance;
  final String paymentMethod;

  PaymentModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.argumentNumber,
    required this.service,
    required this.charge,
    required this.discount,
    required this.advance,
    required this.paymentMethod,
  });

  String get fullName => '$firstName $lastName';
  
  double get netCharge {
    final net = charge - discount;
    return net > 0 ? net : 0;
  }

  double get pendingBalance {
    final pending = netCharge - advance;
    return pending > 0 ? pending : 0;
  }

  String get status {
    if (pendingBalance <= 0 && advance > 0) return 'Completed';
    if (advance > 0 && pendingBalance > 0) return 'Balance Due';
    return 'Pending';
  }
}
