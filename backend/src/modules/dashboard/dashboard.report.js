import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export const generatePdfReport = (res, period, summary, worksByService) => {
  const doc = new PDFDocument({
    margin: 50,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="dashboard-report-${period}.pdf"`
  );

  doc.pipe(res);

  doc.fontSize(20).text('Government ERP', { align: 'center' });
  doc.moveDown();

  doc.fontSize(16).text('Main Dashboard Report', { align: 'center' });
  doc.moveDown();

  doc.fontSize(11).text(`Period: ${period}`);
  doc.text(`Generated On: ${new Date().toLocaleString()}`);

  doc.moveDown();
  doc.fontSize(14).text('Summary');
  doc.moveDown(0.5);

  doc.fontSize(11);
  doc.text(`Total Works Done: ${summary.totalWorksDone}`);
  doc.text(`Total Revenue Earned: ₹${summary.totalRevenueEarned}`);
  doc.text(`Pending Payments: ₹${summary.pendingPayments}`);

  doc.moveDown();
  doc.fontSize(14).text('Works By Service');
  doc.moveDown(0.5);

  doc.fontSize(11);

  worksByService.forEach((service) => {
    doc.text(
      `${service.serviceName}: ${service.totalWorks} works`
    );
  });

  doc.moveDown(2);

  doc.fontSize(9).text(
    'This report was generated from the Government ERP Main Dashboard.'
  );

  doc.end();
};


export const generateExcelReport = async (
  res,
  period,
  summary,
  worksByService
) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet('Dashboard Report');

  worksheet.mergeCells('A1:B1');
  worksheet.getCell('A1').value = 'Government ERP - Main Dashboard Report';
  worksheet.getCell('A1').font = {
    bold: true,
    size: 16,
  };

  worksheet.mergeCells('A2:B2');
  worksheet.getCell('A2').value = `Period: ${period}`;

  worksheet.mergeCells('A3:B3');
  worksheet.getCell('A3').value =
    `Generated On: ${new Date().toLocaleString()}`;

  worksheet.addRow([]);

  worksheet.addRow(['Summary', 'Value']);

  worksheet.addRow([
    'Total Works Done',
    summary.totalWorksDone,
  ]);

  worksheet.addRow([
    'Total Revenue Earned',
    summary.totalRevenueEarned,
  ]);

  worksheet.addRow([
    'Pending Payments',
    summary.pendingPayments,
  ]);

  worksheet.addRow([]);

  worksheet.addRow(['Works By Service', 'Total Works']);

  worksByService.forEach((service) => {
    worksheet.addRow([
      service.serviceName,
      service.totalWorks,
    ]);
  });

  worksheet.getColumn(1).width = 30;
  worksheet.getColumn(2).width = 20;

  worksheet.getRow(5).font = { bold: true };
  worksheet.getRow(10).font = { bold: true };

  worksheet.getColumn(2).numFmt = '#,##0.00';

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="dashboard-report-${period}.xlsx"`
  );

  await workbook.xlsx.write(res);

  res.end();
};