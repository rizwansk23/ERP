import { getDashboardSummary, getWorksByService } from './dashboard.repository.js';
import { getPeriodDates } from './dashboard.utils.js';
import { generateExcelReport, generatePdfReport } from './dashboard.report.js';

export const getDashboardSummaryData = async (period) => {
  const { startDate, endDate } = getPeriodDates(period);

  return await getDashboardSummary(startDate, endDate);
};

export const getWorksByServiceData = async (period) => {
  const { startDate, endDate } = getPeriodDates(period);

  return await getWorksByService(startDate, endDate);
};

export const exportDashboardReport = async (res, period, format) => {
  const { startDate, endDate } = getPeriodDates(period);

  const summary = await getDashboardSummary(startDate, endDate);

  const worksByService = await getWorksByService(
    startDate,
    endDate
  );

  if (format === 'pdf') {
    generatePdfReport(
      res,
      period,
      summary,
      worksByService
    );
    return;
  }

  if (format === 'excel') {
    await generateExcelReport(
      res,
      period,
      summary,
      worksByService
    );
    return;
  }

  throw new Error('Invalid report format. Use pdf or excel');
};