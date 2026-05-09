/**
 * Crime Forecasting API Client
 */

const FORECAST_API_URL = process.env.NEXT_PUBLIC_FORECAST_API_URL || 'http://localhost:8000';

export interface ForecastPoint {
  date: string;
  forecast: number;
  lower_bound: number;
  upper_bound: number;
  threat_level: 'secure' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface ValidationPoint {
  month: string;
  actual: number;
  forecast: number;
  error: number;
  abs_error: number;
  pct_error: number;
  accuracy: 'good' | 'moderate' | 'poor';
}

export interface ForecastMetrics {
  mae: number;
  rmse: number;
  mape: number;
  aic: number;
  bic: number;
}

export interface ForecastSummary {
  avg_forecast: number;
  min_forecast: number;
  max_forecast: number;
  total_forecast: number;
  training_months: number;
  training_total_crimes: number;
  training_avg_crimes: number;
}

export interface ForecastValidation {
  months_validated: number;
  mae: number;
  rmse: number;
  mape: number;
  accuracy_assessment: 'excellent' | 'good' | 'moderate' | 'poor';
  comparison: ValidationPoint[];
}

export interface ForecastResponse {
  success: boolean;
  message: string;
  training_period: string;
  forecast_period: string;
  data: ForecastPoint[];
  metrics: ForecastMetrics;
  summary: ForecastSummary;
  validation?: ForecastValidation;
}

export interface ForecastOptions {
  barangay?: string;
  periods?: number;
  confidence?: number;
  validate?: boolean;
}

/**
 * Fetch crime forecast from API
 */
export async function getForecast(options: ForecastOptions = {}): Promise<ForecastResponse> {
  const {
    barangay,
    periods = 12,
    confidence = 0.95,
    validate = true
  } = options;

  const params = new URLSearchParams();
  if (barangay && barangay !== 'General Dashboard') {
    params.append('barangay', barangay);
  }
  params.append('periods', periods.toString());
  params.append('confidence', confidence.toString());
  params.append('validate', validate.toString());

  const url = `${FORECAST_API_URL}/api/forecast?${params}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Forecast API error:', error);
    throw error;
  }
}

/**
 * Check API health
 */
export async function checkForecastAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${FORECAST_API_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('Forecast API health check failed:', error);
    return false;
  }
}

/**
 * Format forecast data for charts
 */
export function formatForecastForChart(forecast: ForecastResponse) {
  return forecast.data.map(point => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    forecast: point.forecast,
    lower: point.lower_bound,
    upper: point.upper_bound,
    threatLevel: point.threat_level
  }));
}

/**
 * Get threat level color
 */
export function getThreatLevelColor(level: string): string {
  const colors = {
    secure: '#10B981',   // green
    low: '#3B82F6',      // blue
    moderate: '#F59E0B', // yellow
    high: '#F97316',     // orange
    critical: '#EF4444'  // red
  };
  return colors[level as keyof typeof colors] || colors.moderate;
}
