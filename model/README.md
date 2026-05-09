# SecureTanza Crime Forecasting API

Production-ready ARIMA-based crime forecasting service with multi-year training and validation.

## Features

- ✅ **Multi-year Training**: Uses 2023-2025 data for robust predictions
- ✅ **Automatic Optimization**: Auto-selects best ARIMA parameters
- ✅ **Built-in Validation**: Compares predictions with actual 2026 data
- ✅ **Barangay-specific**: Forecast for specific areas or general dashboard
- ✅ **REST API**: Easy integration with frontend

## Quick Start

### 1. Install Dependencies

```bash
cd model
pip install -r requirements.txt
```

### 2. Start API Server

```bash
./start.sh
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs

## API Endpoints

### Health Check
```bash
GET /
```

Returns service status and database connection.

### Get Forecast
```bash
GET /api/forecast?barangay=Bagtas&periods=12&validate=true
```

**Parameters:**
- `barangay` (optional): Barangay name (omit for general forecast)
- `periods` (optional): Number of months to forecast (1-24, default: 12)
- `confidence` (optional): Confidence level (0.8-0.99, default: 0.95)
- `validate` (optional): Include validation (default: true)

**Response:**
```json
{
  "success": true,
  "message": "Forecast generated successfully",
  "training_period": "2023-01 to 2025-12",
  "forecast_period": "2026-05 to 2026-12",
  "data": [
    {
      "date": "2026-05-01",
      "forecast": 46,
      "lower_bound": 15,
      "upper_bound": 78,
      "threat_level": "critical"
    }
  ],
  "metrics": {
    "mae": 11.90,
    "rmse": 15.96,
    "mape": 24.39,
    "aic": 283.04,
    "bic": 295.25
  },
  "summary": {
    "avg_forecast": 48.0,
    "min_forecast": 38,
    "max_forecast": 55,
    "total_forecast": 384,
    "training_months": 36,
    "training_total_crimes": 1899,
    "training_avg_crimes": 52.75
  },
  "validation": {
    "months_validated": 4,
    "mae": 38.25,
    "rmse": 34.29,
    "mape": 421.07,
    "accuracy_assessment": "poor",
    "comparison": [
      {
        "month": "2026-01",
        "actual": 15,
        "forecast": 54,
        "error": -39,
        "abs_error": 39,
        "pct_error": -260.0,
        "accuracy": "poor"
      }
    ]
  }
}
```

## Frontend Integration

### Fetch Forecast Data

```typescript
async function getForecast(barangay?: string, periods: number = 12) {
  const params = new URLSearchParams();
  if (barangay) params.append('barangay', barangay);
  params.append('periods', periods.toString());
  params.append('validate', 'true');
  
  const response = await fetch(`http://localhost:8000/api/forecast?${params}`);
  const data = await response.json();
  
  return data;
}
```

### Display in React Component

```tsx
import { useEffect, useState } from 'react';

function ForecastChart({ barangay }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadForecast() {
      try {
        const data = await getForecast(barangay);
        setForecast(data);
      } catch (error) {
        console.error('Failed to load forecast:', error);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, [barangay]);

  if (loading) return <div>Loading forecast...</div>;
  if (!forecast) return <div>No forecast available</div>;

  return (
    <div>
      <h3>Crime Forecast</h3>
      <p>Training: {forecast.training_period}</p>
      <p>Forecast: {forecast.forecast_period}</p>
      
      {/* Display forecast data */}
      {forecast.data.map(point => (
        <div key={point.date}>
          {point.date}: {point.forecast} crimes ({point.threat_level})
        </div>
      ))}
      
      {/* Display validation if available */}
      {forecast.validation && (
        <div>
          <h4>Validation Results</h4>
          <p>Accuracy: {forecast.validation.accuracy_assessment}</p>
          <p>MAE: {forecast.validation.mae.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
```

## Project Structure

```
model/
├── api/
│   ├── __init__.py
│   └── main.py              # FastAPI service
├── forecasting/
│   ├── __init__.py
│   └── arima_forecaster.py  # ARIMA model
├── utils/
│   ├── __init__.py
│   └── database.py          # Database utilities
├── requirements.txt
├── start.sh                 # Startup script
└── README.md
```

## Model Details

### ARIMA Model
- **Auto-parameter Selection**: Finds optimal (p, d, q) parameters
- **Stationarity Testing**: Uses Augmented Dickey-Fuller test
- **Multi-year Training**: Uses 2023-2025 data (36 months)
- **Validation**: Compares with actual 2026 data

### Threat Levels
- **Secure**: 0 crimes
- **Low**: 1-5 crimes
- **Moderate**: 6-10 crimes
- **High**: 11-15 crimes
- **Critical**: 16+ crimes

## Environment Setup

Ensure `.env.local` in project root contains:
```
DIRECT_URL=postgresql://user:password@host:port/database
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in start.sh or run manually:
cd api
python3 -m uvicorn main:app --port 8001
```

### Database Connection Issues
- Check `.env.local` file exists in project root
- Verify `DIRECT_URL` or `DATABASE_URL` is set correctly
- Test connection: `python3 -c "from utils.database import DatabaseConnection; db = DatabaseConnection(); print(db.test_connection())"`

### Import Errors
- Ensure you're in the `model` directory
- Install dependencies: `pip install -r requirements.txt`

## Performance

- **Model Training**: ~2-5 seconds for 36 months of data
- **Forecast Generation**: <1 second for 12-month forecast
- **API Response Time**: <2 seconds including validation

## Production Deployment

For production, update CORS settings in `api/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Support

For issues or questions, check:
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/
