"""
SecureTanza Crime Forecasting API Service
ARIMA-based forecasting with validation
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from forecasting.arima_forecaster import CrimeForecaster
from utils.database import DatabaseConnection
import pandas as pd
import numpy as np

app = FastAPI(
    title="SecureTanza Crime Forecasting API",
    description="ARIMA-based crime forecasting with multi-year training and validation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class ForecastPoint(BaseModel):
    date: str
    forecast: int
    lower_bound: int
    upper_bound: int
    threat_level: str

class ValidationPoint(BaseModel):
    month: str
    actual: int
    forecast: int
    error: float
    abs_error: float
    pct_error: float
    accuracy: str

class ForecastResponse(BaseModel):
    success: bool
    message: str
    training_period: str
    forecast_period: str
    data: List[ForecastPoint]
    metrics: dict
    summary: dict
    validation: Optional[dict] = None

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database_connected: bool

def get_training_data(barangay: Optional[str] = None, years: List[int] = [2023, 2024, 2025]):
    """Fetch and combine multi-year training data"""
    db = DatabaseConnection()
    
    all_data = []
    for year in years:
        if barangay and barangay != "General Dashboard":
            monthly_data = db.get_monthly_crime_counts(year=year, barangay=barangay)
        else:
            monthly_data = db.get_monthly_crime_counts(year=year)
        
        if not monthly_data.empty:
            all_data.append(monthly_data)
    
    if not all_data:
        return None
    
    combined_data = pd.concat(all_data, ignore_index=True)
    combined_data = combined_data.sort_values('month').reset_index(drop=True)
    
    return combined_data

def train_model(training_data: pd.DataFrame) -> CrimeForecaster:
    """Train ARIMA model with automatic parameter selection"""
    forecaster = CrimeForecaster(training_data, date_column='month', value_column='crime_count')
    forecaster.fit(auto_order=True)
    return forecaster

def get_validation_data(barangay: Optional[str] = None, year: int = 2026):
    """Fetch validation data for comparison"""
    db = DatabaseConnection()
    if barangay and barangay != "General Dashboard":
        return db.get_monthly_crime_counts(year=year, barangay=barangay)
    else:
        return db.get_monthly_crime_counts(year=year)

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    db = DatabaseConnection()
    db_connected = db.test_connection()
    
    return HealthResponse(
        status="healthy" if db_connected else "degraded",
        service="Crime Forecasting API",
        version="1.0.0",
        database_connected=db_connected
    )

@app.get("/api/forecast", response_model=ForecastResponse)
async def get_forecast(
    barangay: Optional[str] = Query(None, description="Barangay name (optional, defaults to all)"),
    periods: int = Query(12, ge=1, le=24, description="Number of months to forecast"),
    confidence: float = Query(0.95, ge=0.8, le=0.99, description="Confidence level"),
    validate: bool = Query(True, description="Include validation against actual 2026 data")
):
    """
    Generate crime forecast using improved ARIMA model
    
    - Uses multi-year training data (2023-2025)
    - Automatic parameter optimization
    - Optional validation against actual data
    """
    try:
        # Fetch multi-year training data
        training_data = get_training_data(barangay=barangay)
        
        if training_data is None or training_data.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No training data available for {barangay or 'general dashboard'}"
            )
        
        # Train model
        forecaster = train_model(training_data)
        
        # Generate forecast
        forecast_df = forecaster.forecast(periods=periods, confidence_level=confidence)
        threat_forecast = forecaster.get_threat_level_forecast()
        
        # Get model metrics
        metrics = forecaster.evaluate_model()
        
        # Prepare forecast data
        forecast_points = []
        for _, row in threat_forecast.iterrows():
            forecast_points.append(ForecastPoint(
                date=row['date'].strftime('%Y-%m-%d'),
                forecast=int(row['forecast']),
                lower_bound=int(row['lower_bound']),
                upper_bound=int(row['upper_bound']),
                threat_level=row['threat_level']
            ))
        
        # Calculate summary
        training_start = training_data['month'].min().strftime('%Y-%m')
        training_end = training_data['month'].max().strftime('%Y-%m')
        forecast_start = forecast_df['date'].min().strftime('%Y-%m')
        forecast_end = forecast_df['date'].max().strftime('%Y-%m')
        
        summary = {
            'avg_forecast': float(forecast_df['forecast'].mean()),
            'min_forecast': int(forecast_df['forecast'].min()),
            'max_forecast': int(forecast_df['forecast'].max()),
            'total_forecast': int(forecast_df['forecast'].sum()),
            'training_months': len(training_data),
            'training_total_crimes': int(training_data['crime_count'].sum()),
            'training_avg_crimes': float(training_data['crime_count'].mean())
        }
        
        # Validation if requested
        validation_result = None
        if validate:
            validation_data = get_validation_data(barangay=barangay)
            
            if not validation_data.empty:
                # Generate forecast for validation period
                validation_forecast = forecaster.forecast(periods=len(validation_data), confidence_level=confidence)
                
                # Compare
                validation_points = []
                total_error = 0
                total_abs_error = 0
                
                for i, (_, actual_row) in enumerate(validation_data.iterrows()):
                    if i < len(validation_forecast):
                        forecast_row = validation_forecast.iloc[i]
                        actual = actual_row['crime_count']
                        predicted = forecast_row['forecast']
                        error = actual - predicted
                        abs_error = abs(error)
                        pct_error = (error / actual * 100) if actual > 0 else 0
                        
                        total_error += error
                        total_abs_error += abs_error
                        
                        accuracy = 'good' if abs(pct_error) < 20 else 'moderate' if abs(pct_error) < 40 else 'poor'
                        
                        validation_points.append(ValidationPoint(
                            month=actual_row['month'].strftime('%Y-%m'),
                            actual=int(actual),
                            forecast=int(predicted),
                            error=float(error),
                            abs_error=float(abs_error),
                            pct_error=float(pct_error),
                            accuracy=accuracy
                        ))
                
                mae = total_abs_error / len(validation_data)
                rmse = np.sqrt((sum((vp.error ** 2) for vp in validation_points)) / len(validation_points))
                mape = (total_abs_error / validation_data['crime_count'].sum() * 100)
                
                validation_result = {
                    'months_validated': len(validation_points),
                    'mae': float(mae),
                    'rmse': float(rmse),
                    'mape': float(mape),
                    'accuracy_assessment': 'excellent' if mape < 15 else 'good' if mape < 25 else 'moderate' if mape < 40 else 'poor',
                    'comparison': [vp.dict() for vp in validation_points]
                }
        
        return ForecastResponse(
            success=True,
            message=f"Forecast generated successfully for {barangay or 'all barangays'}",
            training_period=f"{training_start} to {training_end}",
            forecast_period=f"{forecast_start} to {forecast_end}",
            data=forecast_points,
            metrics={
                'mae': float(metrics['mae']),
                'rmse': float(metrics['rmse']),
                'mape': float(metrics['mape']),
                'aic': float(metrics['aic']),
                'bic': float(metrics['bic'])
            },
            summary=summary,
            validation=validation_result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
