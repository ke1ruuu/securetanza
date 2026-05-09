import { useMapContext } from '@/context/MapContext';

export interface TimeRangeParams {
  mode: 'year' | 'quarter' | 'half-year' | 'month' | 'day';
  year: number | null;
  quarter?: number;
  halfYear?: number;
  month?: number;
  day?: Date;
}

export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Hook to get current time range parameters from TimeSelector
 * TODO: This is a stub implementation. Full integration pending.
 * For now, it returns the selectedYear for backward compatibility.
 */
export function useTimeRangeParams(): TimeRangeParams | null {
  const { selectedYear } = useMapContext();
  
  if (selectedYear === null) {
    return null;
  }
  
  return {
    mode: 'year',
    year: selectedYear
  };
}

/**
 * Convert time range params to date ranges for API queries
 */
export function getDateRangesFromTimeRange(params: TimeRangeParams | null): DateRange[] {
  if (!params) {
    return [];
  }
  
  switch (params.mode) {
    case 'year':
      if (params.year) {
        return [{
          start: new Date(params.year, 0, 1), // Jan 1
          end: new Date(params.year, 11, 31, 23, 59, 59, 999) // Dec 31
        }];
      }
      return [];
      
    case 'quarter':
      if (params.year && params.quarter) {
        const startMonth = (params.quarter - 1) * 3;
        const endMonth = startMonth + 2;
        return [{
          start: new Date(params.year, startMonth, 1),
          end: new Date(params.year, endMonth + 1, 0, 23, 59, 59, 999)
        }];
      }
      return [];
      
    case 'half-year':
      if (params.year && params.halfYear) {
        const startMonth = params.halfYear === 1 ? 0 : 6;
        const endMonth = params.halfYear === 1 ? 5 : 11;
        return [{
          start: new Date(params.year, startMonth, 1),
          end: new Date(params.year, endMonth + 1, 0, 23, 59, 59, 999)
        }];
      }
      return [];
      
    case 'month':
      if (params.year && params.month) {
        return [{
          start: new Date(params.year, params.month - 1, 1),
          end: new Date(params.year, params.month, 0, 23, 59, 59, 999)
        }];
      }
      return [];
      
    case 'day':
      if (params.day) {
        const start = new Date(params.day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(params.day);
        end.setHours(23, 59, 59, 999);
        return [{ start, end }];
      }
      return [];
      
    default:
      return [];
  }
}
