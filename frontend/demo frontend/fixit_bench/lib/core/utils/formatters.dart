import 'package:intl/intl.dart';

/// Helper for date/time and currency formatting used across the app.
class Formatters {
  Formatters._();

  static final NumberFormat _inr = NumberFormat.currency(
    locale: 'en_IN',
    symbol: '₹',
    decimalDigits: 0,
  );

  static String currency(num value) => _inr.format(value);

  static String currencyPlain(num value) =>
      NumberFormat.decimalPattern('en_IN').format(value);

  static final DateFormat _dayMonth = DateFormat('dd MMM');
  static final DateFormat _dayMonthTime = DateFormat('dd MMM · hh:mm a');
  static final DateFormat _longDate = DateFormat('MMM d, yyyy');

  static String shortDate(DateTime d) => _dayMonth.format(d);

  static String logTimestamp(DateTime d) => _dayMonthTime.format(d);

  static String longDate(DateTime d) => _longDate.format(d);
}
