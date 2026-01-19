/**
 * Calculate duration between two dates
 * @param startedAt - Start date in YYYY-MM format
 * @param endedAt - End date in YYYY-MM format, or null for current/ongoing
 * @returns Formatted duration string like "2 years 3 months"
 */
export const calculateDuration = (startedAt: string, endedAt: string | null): string => {
  const [startYear, startMonth] = startedAt.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1);
  
  let end: Date;
  if (endedAt) {
    const [endYear, endMonth] = endedAt.split('-').map(Number);
    end = new Date(endYear, endMonth - 1);
  } else {
    end = new Date();
  }
  
  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  // Add 1 to include both start and end months
  totalMonths = Math.max(1, totalMonths + 1);
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
};
