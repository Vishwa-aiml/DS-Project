# THERMALENS 🌡️

**See the Heat. Predict the Risk. Prioritize the Response.**

THERMALENS is an advanced, AI-powered urban heat-risk intelligence platform built specifically for **Chennai, India**. It moves beyond generalized city-wide temperature readings to provide hyper-localized, block-by-block heat stress intelligence, empowering emergency responders, city planners, and citizens to make data-driven decisions.

---

## 🛑 The Problem Statement

As climate change accelerates, extreme heat events are becoming more frequent and severe. In rapidly expanding coastal cities like Chennai:
- **Urban Heat Island (UHI) Effect:** Dense concrete jungles trap heat, making certain neighborhoods significantly hotter than surrounding areas.
- **Generalized Advisories:** Traditional weather forecasts provide a single temperature for a massive metropolitan area, failing to capture micro-climate variations.
- **Vulnerability Disparity:** High temperatures do not affect everyone equally. A 38°C day in a highly vegetated, affluent neighborhood has a vastly different human impact than a 38°C day in a dense industrial zone with zero tree canopy and high population density.
- **Lack of Actionable Insights:** Without knowing *why* an area is hot or *who* is most vulnerable, authorities cannot effectively allocate resources (e.g., cooling centers, medical aid, power grid load management).

## 💡 The Solution

**THERMALENS** solves this by generating a high-resolution (1km x 1km) spatial grid over the Chennai Metropolitan Area. It correlates environmental, meteorological, and socioeconomic data into a unified, predictive **Risk Score (0-100)** for every single grid cell. 

Instead of just reporting "It's 40°C", THERMALENS reports: 
*"Grid G143 is at Critical Risk (Score: 88). This is driven by high Land Surface Temperature (46°C), severe lack of vegetation (NDVI < 0.1), and high demographic vulnerability. Peak risk expected at 14:00."*

## ⚙️ How It Works (Methodology)

THERMALENS utilizes a multi-layered approach to urban micro-climate analysis based on 4 pillars:

1. **Meteorology (Dynamic):** Real-time and 48-hour forecasted air temperature, relative humidity, and wind speeds.
2. **Environment (Static):** Satellite-derived Land Surface Temperature (LST), Normalized Difference Vegetation Index (NDVI), and Albedo.
3. **Urban Morphology (Static):** Normalized Difference Built-up Index (NDBI) and structural thermal retention metrics.
4. **Exposure (Static):** Population density and socio-economic vulnerability indexing.

These features are fed into a trained Machine Learning model which outputs a localized Risk Score. Crucially, the model utilizes **SHAP (SHapley Additive exPlanations)** to break down the score and explain exactly which factors are driving the risk in that specific zone.

## 🏗️ Implementation Details

The project is structured into three decoupled layers:

### 1. Data Pipeline & ML Engine (`/src`, `/notebooks`)
- **Grid Generation:** A Python-based geo-spatial engine divides Chennai into thousands of 1km vector polygons.
- **Feature Engineering:** Computes composite indices (like Heat Index and Veg-Urban Ratio).
- **Model Training:** Evaluated Baseline Logistic Regression against Random Forest and ultimately deployed an **XGBoost Regressor** due to its superior handling of non-linear environmental interactions and high R² score.
- **Explainability:** SHAP values are extracted post-inference to ensure the AI's decisions are transparent.

### 2. Backend API (`/api`)
- Built with **FastAPI** for high-performance, asynchronous request handling.
- Exposes endpoints for the full city grid, 48-hour forward-looking ML forecasts (`/forecast`), 7-day historical back-testing (`/history`), and detailed zone risk profiles (`/risk-score`).

### 3. Interactive Dashboard (`/frontend`)
- Built with **React, TypeScript, and Vite**.
- Uses **Leaflet.js** to render a highly interactive, color-coded map overlaying the generated GeoJSON grid.
- Features real-time temporal scrubbing, charting via **Recharts**, and actionable "AI Heat Narratives".

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS, Leaflet.js, Recharts, Lucide Icons |
| **Backend API** | Python 3.11, FastAPI, Uvicorn, Pydantic, SQLAlchemy |
| **Data & ML** | Pandas, GeoPandas, Scikit-Learn, XGBoost, SHAP, NumPy |
| **Geospatial & Storage**| GeoJSON, PostgreSQL, PostGIS (Docker) |

## 📊 Final Output & Capabilities

- **Live Risk Map:** View Chennai through the lens of Heat Risk, LST, NDVI, or Population Density.
- **48-Hour ML Forecasts:** An interactive timeline scrubber allows users to see exactly how heat risk will evolve over the next two days, hour by hour.
- **Zone Deep Dives:** Clicking any grid cell reveals its precise metrics, exact location, and the SHAP explanation of its danger level.
- **Statistical Analytics:** Correlative scatter plots (LST vs NDVI) and city-wide risk distributions.

---

## 🚀 Setup & Installation

### 1. Backend Setup
Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows
.\venv\Scripts\Activate.ps1
# macOS/Linux
# source venv/bin/activate

pip install -r requirements.txt
```

### 2. Generate Data and Train Model
Generate the synthetic 1km grid for Chennai, pull live Open-Meteo data, and train the XGBoost model:
```bash
export PYTHONPATH="."  # (Use $env:PYTHONPATH="." on Windows PowerShell)
python src/grid.py
python src/generate_static_features.py
python src/update_live_weather.py
python src/train.py
```

### 3. Run the Backend API
Start the FastAPI server:
```bash
uvicorn api.main:app --reload --port 8000
```

### 4. Run the Frontend
In a new terminal window, navigate to the frontend folder and start the React app:
```bash
cd frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---
*Disclaimer: The data pipeline currently utilizes generated synthetic morphological data to emulate Chennai's geography for MVP demonstration purposes. It should not replace official governmental meteorological advisories.*
