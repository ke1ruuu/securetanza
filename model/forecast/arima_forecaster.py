"""
ARIMA Time Series Forecasting for Crime Data
"""
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf, pacf
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Tuple, Dict, Optional
import warnings
warnings.filterwarnings('ignore')

class CrimeForecaster:
    """
    ARIMA-based time series forecasting for crime data
    """
    
    def __init__(self, data: pd.DataFrame, date_column: str = 'month', value_column: str = 'crime_count'):
        """
        Initialize the forecaster with time series data
        
        Args:
            data: DataFrame with time series data
            date_column: Name of the date column
            value_column: Name of the value column to forecast
        """
        self.data = data.copy()
        self.date_column = date_column
        self.value_column = value_column
        
        # Ensure date column is datetime
        self.data[date_column] = pd.to_datetime(self.data[date_column])
        self.data = self.data.sort_values(date_column)
        
        # Set date as index
        self.data.set_index(date_column, inplace=True)
        
        # Time series
        self.ts = self.data[value_column]
        
        # Model and results
        self.model = None
        self.model_fit = None
        self.forecast_result = None
        
    def check_stationarity(self) -> Dict:
        """
        Perform Augmented Dickey-Fuller test to check stationarity
        
        Returns:
            Dictionary with test results
        """
        result = adfuller(self.ts.dropna())
        
        return {
            'adf_statistic': result[0],
            'p_value': result[1],
            'critical_values': result[4],
            'is_stationary': result[1] < 0.05
        }
    
    def make_stationary(self, diff_order: int = 1) -> pd.Series:
        """
        Make the time series stationary by differencing
        
        Args:
            diff_order: Order of differencing
            
        Returns:
            Differenced time series
        """
        return self.ts.diff(diff_order).dropna()
    
    def plot_diagnostics(self, figsize: Tuple[int, int] = (15, 10)):
        """
        Plot diagnostic charts for time series analysis
        
        Args:
            figsize: Figure size (width, height)
        """
        fig, axes = plt.subplots(2, 2, figsize=figsize)
        
        # Original time series
        axes[0, 0].plot(self.ts)
        axes[0, 0].set_title('Original Time Series')
        axes[0, 0].set_xlabel('Date')
        axes[0, 0].set_ylabel('Crime Count')
        axes[0, 0].grid(True, alpha=0.3)
        
        # ACF plot
        plot_acf(self.ts.dropna(), lags=min(20, len(self.ts)//2), ax=axes[0, 1])
        axes[0, 1].set_title('Autocorrelation Function (ACF)')
        
        # PACF plot
        plot_pacf(self.ts.dropna(), lags=min(20, len(self.ts)//2), ax=axes[1, 0])
        axes[1, 0].set_title('Partial Autocorrelation Function (PACF)')
        
        # Distribution
        axes[1, 1].hist(self.ts.dropna(), bins=20, edgecolor='black', alpha=0.7)
        axes[1, 1].set_title('Distribution of Crime Counts')
        axes[1, 1].set_xlabel('Crime Count')
        axes[1, 1].set_ylabel('Frequency')
        axes[1, 1].grid(True, alpha=0.3)
        
        plt.tight_layout()
        return fig
    
    def find_best_order(self, max_p: int = 5, max_d: int = 2, max_q: int = 5) -> Tuple[int, int, int]:
        """
        Find the best ARIMA order using AIC criterion
        
        Args:
            max_p: Maximum AR order
            max_d: Maximum differencing order
            max_q: Maximum MA order
            
        Returns:
            Tuple of (p, d, q) with lowest AIC
        """
        best_aic = np.inf
        best_order = None
        
        print("Searching for best ARIMA order...")
        
        for p in range(max_p + 1):
            for d in range(max_d + 1):
                for q in range(max_q + 1):
                    try:
                        model = ARIMA(self.ts, order=(p, d, q))
                        model_fit = model.fit()
                        
                        if model_fit.aic < best_aic:
                            best_aic = model_fit.aic
                            best_order = (p, d, q)
                            print(f"  New best: ARIMA{best_order} - AIC: {best_aic:.2f}")
                    except:
                        continue
        
        print(f"\nBest ARIMA order: {best_order} with AIC: {best_aic:.2f}")
        return best_order
    
    def fit(self, order: Optional[Tuple[int, int, int]] = None, auto_order: bool = True):
        """
        Fit ARIMA model to the data
        
        Args:
            order: ARIMA order (p, d, q). If None, will auto-select
            auto_order: Whether to automatically find best order
        """
        if order is None and auto_order:
            order = self.find_best_order()
        elif order is None:
            # Default order
            order = (1, 1, 1)
        
        print(f"\nFitting ARIMA{order} model...")
        self.model = ARIMA(self.ts, order=order)
        self.model_fit = self.model.fit()
        
        print("\nModel Summary:")
        print(self.model_fit.summary())
        
        return self.model_fit
    
    def forecast(self, periods: int = 12, confidence_level: float = 0.95) -> pd.DataFrame:
        """
        Generate forecasts for future periods
        
        Args:
            periods: Number of periods to forecast
            confidence_level: Confidence level for prediction intervals
            
        Returns:
            DataFrame with forecasts and confidence intervals
        """
        if self.model_fit is None:
            raise ValueError("Model not fitted. Call fit() first.")
        
        # Generate forecast
        forecast_result = self.model_fit.get_forecast(steps=periods)
        
        # Get forecast values and confidence intervals
        forecast_mean = forecast_result.predicted_mean
        forecast_ci = forecast_result.conf_int(alpha=1-confidence_level)
        
        # Create date range for forecast
        last_date = self.ts.index[-1]
        forecast_dates = pd.date_range(
            start=last_date + pd.DateOffset(months=1),
            periods=periods,
            freq='MS'  # Month start
        )
        
        # Create forecast DataFrame
        forecast_df = pd.DataFrame({
            'date': forecast_dates,
            'forecast': forecast_mean.values,
            'lower_bound': forecast_ci.iloc[:, 0].values,
            'upper_bound': forecast_ci.iloc[:, 1].values
        })
        
        # Round to integers (crime counts should be whole numbers)
        forecast_df['forecast'] = forecast_df['forecast'].round().astype(int)
        forecast_df['lower_bound'] = forecast_df['lower_bound'].clip(lower=0).round().astype(int)
        forecast_df['upper_bound'] = forecast_df['upper_bound'].round().astype(int)
        
        self.forecast_result = forecast_df
        
        return forecast_df
    
    def plot_forecast(self, figsize: Tuple[int, int] = (15, 6)):
        """
        Plot historical data with forecast
        
        Args:
            figsize: Figure size (width, height)
        """
        if self.forecast_result is None:
            raise ValueError("No forecast available. Call forecast() first.")
        
        fig, ax = plt.subplots(figsize=figsize)
        
        # Plot historical data
        ax.plot(self.ts.index, self.ts.values, label='Historical Data', 
                color='#0EA5E9', linewidth=2, marker='o', markersize=4)
        
        # Plot forecast
        ax.plot(self.forecast_result['date'], self.forecast_result['forecast'],
                label='Forecast', color='#EF4444', linewidth=2, 
                marker='s', markersize=4, linestyle='--')
        
        # Plot confidence interval
        ax.fill_between(
            self.forecast_result['date'],
            self.forecast_result['lower_bound'],
            self.forecast_result['upper_bound'],
            alpha=0.2,
            color='#EF4444',
            label='95% Confidence Interval'
        )
        
        ax.set_xlabel('Date', fontsize=12, fontweight='bold')
        ax.set_ylabel('Crime Count', fontsize=12, fontweight='bold')
        ax.set_title('Crime Forecast using ARIMA', fontsize=14, fontweight='bold')
        ax.legend(loc='best', fontsize=10)
        ax.grid(True, alpha=0.3)
        
        plt.tight_layout()
        return fig
    
    def evaluate_model(self) -> Dict:
        """
        Evaluate model performance on training data
        
        Returns:
            Dictionary with evaluation metrics
        """
        if self.model_fit is None:
            raise ValueError("Model not fitted. Call fit() first.")
        
        # Get fitted values
        fitted_values = self.model_fit.fittedvalues
        
        # Calculate metrics
        residuals = self.ts - fitted_values
        mae = np.mean(np.abs(residuals))
        rmse = np.sqrt(np.mean(residuals**2))
        mape = np.mean(np.abs(residuals / self.ts)) * 100
        
        return {
            'mae': mae,
            'rmse': rmse,
            'mape': mape,
            'aic': self.model_fit.aic,
            'bic': self.model_fit.bic
        }
    
    def get_threat_level_forecast(self) -> pd.DataFrame:
        """
        Classify forecast into threat levels based on crime counts
        
        Returns:
            DataFrame with threat level classifications
        """
        if self.forecast_result is None:
            raise ValueError("No forecast available. Call forecast() first.")
        
        def classify_threat(count: int) -> str:
            """Classify crime count into threat level"""
            if count == 0:
                return 'secure'
            elif count <= 5:
                return 'low'
            elif count <= 10:
                return 'moderate'
            elif count <= 15:
                return 'high'
            else:
                return 'critical'
        
        result = self.forecast_result.copy()
        result['threat_level'] = result['forecast'].apply(classify_threat)
        result['threat_level_lower'] = result['lower_bound'].apply(classify_threat)
        result['threat_level_upper'] = result['upper_bound'].apply(classify_threat)
        
        return result
