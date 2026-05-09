#!/bin/bash

echo "🚀 Starting SecureTanza Crime Forecasting API..."
echo ""

# Start the API server
cd api && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
