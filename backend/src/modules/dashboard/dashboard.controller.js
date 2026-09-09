import { asyncHandler } from '../../utils/asyncHandler.js';

import { getDashboardSummaryData, getWorksByServiceData, exportDashboardReport } from './dashboard.service.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const { period = '1M' } = req.query;

  const summary = await getDashboardSummaryData(period);

  res.status(200).json({
    success: true,
    message: 'Dashboard summary fetched successfully',
    data: summary,
  });
});

export const getWorksByService = asyncHandler(async (req, res) => {
  const { period = '1M' } = req.query;

  const data = await getWorksByServiceData(period);

  res.status(200).json({
    success: true,
    message: 'Works by service fetched successfully',
    data,
  });
});

export const exportReport = asyncHandler(async (req, res) => {
  const {
    period = '1M',
    format = 'pdf',
  } = req.query;

  await exportDashboardReport(
    res,
    period,
    format.toLowerCase()
  );
});