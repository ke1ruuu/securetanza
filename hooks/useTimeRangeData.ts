import { useMemo } from 'react';
import { useMapContext, TimeRange, TimeSelection } from '@/context/MapContext';

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Hook to get date ranges from the current time range selections in MapContext
 * Converts multiple time selections into an array of date ranges for API queries
 */
export function useTimeRangeData(): DateRange[] {
  const { timeRange, selectedYear } = useMapContext();

  return useMemo(() => {
    const ranges = getDateRangesFromTimeRange(timeRange);
    if (ranges.length > 0 || selectedYear === null) return ranges;

    // A year picked without a quarter/month/day still means the whole year. Without
    // this, consumers that read only date ranges (analytics, the crime matrix, the
    // report) see an empty list, skip their fetch, and keep showing the previous
    // period's numbers.
    return [
      {
        start: new Date(selectedYear, 0, 1),
        end: new Date(selectedYear, 11, 31, 23, 59, 59, 999),
      },
    ];
  }, [timeRange, selectedYear]);
}

/**
 * Convert time range selections to date ranges for API queries
 * Supports multiple selections - returns an array of date ranges
 */
export function getDateRangesFromTimeRange(timeRange: TimeRange): DateRange[] {
  if (!timeRange || timeRange.selections.length === 0) {
    return [];
  }
  
  const dateRanges: DateRange[] = [];
  
  timeRange.selections.forEach((selection: TimeSelection) => {
    switch (timeRange.mode) {
      case 'year':
        if (selection.year) {
          dateRanges.push({
            start: new Date(selection.year, 0, 1), // Jan 1
            end: new Date(selection.year, 11, 31, 23, 59, 59, 999) // Dec 31
          });
        }
        break;
        
      case 'quarter':
        if (selection.year && selection.quarter) {
          const startMonth = (selection.quarter - 1) * 3;
          const endMonth = startMonth + 2;
          dateRanges.push({
            start: new Date(selection.year, startMonth, 1),
            end: new Date(selection.year, endMonth + 1, 0, 23, 59, 59, 999)
          });
        }
        break;
        
      case 'half-year':
        if (selection.year && selection.halfYear) {
          const startMonth = selection.halfYear === 1 ? 0 : 6;
          const endMonth = selection.halfYear === 1 ? 5 : 11;
          dateRanges.push({
            start: new Date(selection.year, startMonth, 1),
            end: new Date(selection.year, endMonth + 1, 0, 23, 59, 59, 999)
          });
        }
        break;
        
      case 'month':
        if (selection.year && selection.month) {
          dateRanges.push({
            start: new Date(selection.year, selection.month - 1, 1),
            end: new Date(selection.year, selection.month, 0, 23, 59, 59, 999)
          });
        }
        break;
        
      case 'day':
        if (selection.day) {
          const start = new Date(selection.day);
          start.setHours(0, 0, 0, 0);
          const end = new Date(selection.day);
          end.setHours(23, 59, 59, 999);
          dateRanges.push({ start, end });
        }
        break;
    }
  });
  
  return dateRanges;
}
