/// Payment status shown as a colored dot/badge (red/amber/green).
enum PaymentStatus { pending, balance, completed }

extension PaymentStatusX on PaymentStatus {
  String get label {
    switch (this) {
      case PaymentStatus.pending:
        return 'Pending';
      case PaymentStatus.balance:
        return 'Balance due';
      case PaymentStatus.completed:
        return 'Completed';
    }
  }
}

class PaymentModel {
  final String name;
  final String phone;
  final String receipt;
  final String service;
  double charge;
  double advance;
  PaymentStatus status;
  String method; // Cash / Online / Cheque / —

  PaymentModel({
    required this.name,
    required this.phone,
    required this.receipt,
    required this.service,
    required this.charge,
    required this.advance,
    required this.status,
    required this.method,
  });

  double get balance => charge - advance;
}
