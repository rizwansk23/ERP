export const getPeriodDates = (period) => {
  const now = new Date();

  let startDate;
  let endDate = now;

  switch (period) {
    case '1M':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;

    case '3M':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 3);
      break;

    case '6M':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 6);
      break;

    case '12M':
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
      break;

    case 'CURRENT_FY': {
      const year = now.getFullYear();

      if (now.getMonth() >= 3) {
        startDate = new Date(year, 3, 1);
        endDate = new Date(year + 1, 2, 31, 23, 59, 59, 999);
      } else {
        startDate = new Date(year - 1, 3, 1);
        endDate = new Date(year, 2, 31, 23, 59, 59, 999);
      }

      break;
    }

    case 'LAST_FY': {
      const year = now.getFullYear();

      if (now.getMonth() >= 3) {
        startDate = new Date(year - 1, 3, 1);
        endDate = new Date(year, 2, 31, 23, 59, 59, 999);
      } else {
        startDate = new Date(year - 2, 3, 1);
        endDate = new Date(year - 1, 2, 31, 23, 59, 59, 999);
      }

      break;
    }

    case 'LAST_3_FY': {
      const year = now.getFullYear();

      if (now.getMonth() >= 3) {
        startDate = new Date(year - 3, 3, 1);
        endDate = new Date(year, 2, 31, 23, 59, 59, 999);
      } else {
        startDate = new Date(year - 4, 3, 1);
        endDate = new Date(year - 1, 2, 31, 23, 59, 59, 999);
      }

      break;
    }

    default:
      throw new Error('Invalid period');
  }

  return { startDate, endDate };
};