/// PDF and Excel export logic.
///
/// This is a light scaffold so screens can call `ExportHelper.toCsv(...)`
/// today. CSV opens cleanly in Excel/Sheets with zero extra packages.
/// For a real PDF export, add the `pdf` + `printing` packages and swap
/// `toPdfBytes` for a real implementation (kept as a stub below so the
/// rest of the app already has a stable call site).
class ExportHelper {
  ExportHelper._();

  /// Builds a CSV string from a header row + list of row values.
  /// Pass the result to a file-save / share flow of your choice.
  static String toCsv({
    required List<String> headers,
    required List<List<String>> rows,
  }) {
    final buffer = StringBuffer();
    buffer.writeln(headers.map(_escape).join(','));
    for (final row in rows) {
      buffer.writeln(row.map(_escape).join(','));
    }
    return buffer.toString();
  }

  static String _escape(String value) {
    if (value.contains(',') || value.contains('"') || value.contains('\n')) {
      return '"${value.replaceAll('"', '""')}"';
    }
    return value;
  }

  /// TODO: wire up with the `pdf` + `printing` packages for a real
  /// receipt / report PDF. Kept as a stub so callers have a stable API.
  static Future<void> exportPdf({
    required String title,
    required List<String> lines,
  }) async {
    throw UnimplementedError(
      'Add the pdf + printing packages, then generate a document here.',
    );
  }
}
