// formatDateTime returns: "Mon Jun 10 2024 12:34:56 PM" (date string + time string)
// formatDate returns: "10 jun 2024" (day month year, month in lowercase 3-letter English)
export const formatDateTime = (date) => {
  // Return format: "Mon Jun 10 2024 12:34:56 PM"
  return new Date(date).toDateString() + ' ' + new Date(date).toLocaleTimeString();
};

export const formatDate = (date) => {
  // Return format: "10 jun 2024"
  const d = new Date(date);
  return `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' }).toLowerCase()} ${d.getFullYear()}`;
};
