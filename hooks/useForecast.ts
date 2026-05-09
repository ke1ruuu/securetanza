/**
 * React hook for crime forecasting
 */
import { useState, useEffect } from 'react';
import { getForecast, ForecastResponse, ForecastOptions } from '@/lib/forecast-api';

interface UseForecastResult {
  forecast: ForecastResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useForecast(options: ForecastOptions = {}): UseForecastResult {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getForecast(options);
      setForecast(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load forecast';
      setError(errorMessage);
      console.error('Forecast error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [options.barangay, options.periods, options.confidence, options.validate]);

  return {
    forecast,
    loading,
    error,
    refetch: fetchForecast
  };
}
