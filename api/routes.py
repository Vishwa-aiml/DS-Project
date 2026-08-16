from fastapi import APIRouter, HTTPException, Depends
import json
import os
import pandas as pd
import geopandas as gpd
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from src.models import HeatRiskModel
from src.features import engineer_features
from api.database import get_db, User
from api.auth import get_password_hash, verify_password, create_access_token

router = APIRouter()

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Paths
BASE_DIR = os.path.dirname(__file__)
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "synthetic_features.geojson")
MODEL_PATH = os.path.join(BASE_DIR, "..", "data", "xgboost_model.joblib")

# Global variables to cache data and model
grid_gdf = None
risk_model = None

def load_resources():
    global grid_gdf, risk_model
    if grid_gdf is None and os.path.exists(DATA_PATH):
        grid_gdf = gpd.read_file(DATA_PATH)
        # Set grid_id as index for fast lookup
        grid_gdf.set_index("grid_id", inplace=True)
        
    if risk_model is None and os.path.exists(MODEL_PATH):
        risk_model = HeatRiskModel("xgboost")
        risk_model.load(MODEL_PATH)

@router.on_event("startup")
async def startup_event():
    load_resources()

# --- Auth Routes ---
@router.post("/auth/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, name=user.name, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return JWT immediately on register
    access_token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email, "name": new_user.name})
    return {"access_token": access_token, "token_type": "bearer", "user": {"name": new_user.name, "email": new_user.email}}

@router.post("/auth/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": str(db_user.id), "email": db_user.email, "name": db_user.name})
    return {"access_token": access_token, "token_type": "bearer", "user": {"name": db_user.name, "email": db_user.email}}


@router.get("/grid")
def get_grid_data():
    """
    Returns the GeoJSON of the grid with features and live risk scores.
    """
    load_resources()
    
    if grid_gdf is None or risk_model is None:
        if not os.path.exists(DATA_PATH):
            raise HTTPException(status_code=404, detail="Data not found. Please run data generation scripts.")
        with open(DATA_PATH, "r") as f:
            return json.load(f)
            
    # Calculate live risk score for the entire grid
    df = grid_gdf.copy()
    df = engineer_features(df)
    
    features = ['temperature_c', 'humidity_pct', 'ndvi', 'ndbi', 'vulnerability_index', 'heat_index', 'veg_urban_ratio']
    X = df[features]
    
    df['baseline_risk_score'] = risk_model.predict(X)
    
    return json.loads(df.to_json())

@router.get("/risk-score/{grid_id}")
def get_risk_score(grid_id: str):
    """
    Returns the heat risk score and SHAP values for a specific grid_id.
    """
    load_resources()
    
    if grid_gdf is None or risk_model is None:
        raise HTTPException(status_code=500, detail="Data or model not loaded. Run src/train.py first.")
        
    if grid_id not in grid_gdf.index:
        raise HTTPException(status_code=404, detail=f"Grid ID {grid_id} not found.")
        
    # Get the row
    row = grid_gdf.loc[[grid_id]].copy()
    
    # Engineer features required by the model
    row = engineer_features(row)
    
    features = ['temperature_c', 'humidity_pct', 'ndvi', 'ndbi', 'vulnerability_index', 'heat_index', 'veg_urban_ratio']
    X = row[features]
    
    # Predict
    score = risk_model.predict(X)[0]
    
    # Explain (SHAP)
    shap_vals = risk_model.explain(X)[0] # get first row
    
    # Create dict of SHAP values
    shap_dict = {feat: float(val) for feat, val in zip(features, shap_vals)}
    
    return {
        "grid_id": grid_id,
        "risk_score": float(score),
        "shap_values": shap_dict
    }

@router.get("/forecast/{grid_id}")
def get_forecast(grid_id: str):
    """
    Fetches 48-hour forecast from Open-Meteo and predicts ML Risk Score for each hour.
    """
    load_resources()
    if grid_gdf is None or risk_model is None or grid_id not in grid_gdf.index:
        raise HTTPException(status_code=404, detail="Grid not found or model not loaded.")
        
    row = grid_gdf.loc[grid_id]
    
    # Simple centroid for Open-Meteo
    if hasattr(row.geometry, 'centroid'):
        lat = row.geometry.centroid.y
        lon = row.geometry.centroid.x
    else:
        lat, lon = 13.0827, 80.2707 # Fallback Chennai
        
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&forecast_days=2"
    resp = requests.get(url)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch forecast from Open-Meteo")
        
    data = resp.json()
    times = data['hourly']['time']
    temps = data['hourly']['temperature_2m']
    hums = data['hourly']['relative_humidity_2m']
    winds = data['hourly']['wind_speed_10m']
    
    forecast_results = []
    
    # We will create a DataFrame to run through the model
    # We need: temperature_c, humidity_pct, ndvi, ndbi, vulnerability_index
    df_forecast = pd.DataFrame({
        'temperature_c': temps,
        'humidity_pct': hums,
        'wind_speed_ms': [w * 0.27778 for w in winds], # km/h to m/s
    })
    
    # Add static features from the grid cell
    df_forecast['ndvi'] = row['ndvi']
    df_forecast['ndbi'] = row['ndbi']
    df_forecast['vulnerability_index'] = row.get('vulnerability_index', 0.5)
    df_forecast['lst_c'] = temps # Rough approximation: LST ~ Air Temp for future
    
    # Engineer features
    df_forecast = engineer_features(df_forecast)
    features = ['temperature_c', 'humidity_pct', 'ndvi', 'ndbi', 'vulnerability_index', 'heat_index', 'veg_urban_ratio']
    X = df_forecast[features]
    
    scores = risk_model.predict(X)
    
    for i in range(len(times)):
        dt = datetime.fromisoformat(times[i])
        forecast_results.append({
            "time": dt.strftime("%H:%00"),
            "displayTime": dt.strftime("%H:%00") + (" (+1d)" if dt.day != datetime.now().day else ""),
            "riskScore": float(scores[i]),
            "temperature": float(temps[i]),
            "lstTemp": float(temps[i] + 2.5), # Approx LST
            "humidity": float(hums[i])
        })
        
    return forecast_results

@router.get("/history/{grid_id}")
def get_history(grid_id: str):
    """
    Fetches 7-day history from Open-Meteo and computes ML Risk Scores.
    """
    load_resources()
    if grid_gdf is None or risk_model is None or grid_id not in grid_gdf.index:
        raise HTTPException(status_code=404, detail="Grid not found or model not loaded.")
        
    row = grid_gdf.loc[grid_id]
    if hasattr(row.geometry, 'centroid'):
        lat = row.geometry.centroid.y
        lon = row.geometry.centroid.x
    else:
        lat, lon = 13.0827, 80.2707 # Fallback Chennai
        
    # Past 7 days
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={start_date}&end_date={end_date}&daily=temperature_2m_mean,apparent_temperature_max&timezone=auto"
    resp = requests.get(url)
    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch history from Open-Meteo")
        
    data = resp.json()
    if 'daily' not in data:
        return []
        
    dates = data['daily']['time']
    temps = data['daily']['temperature_2m_mean']
    
    history_results = []
    
    # We will run a daily average prediction
    df_hist = pd.DataFrame({
        'temperature_c': temps,
        'humidity_pct': 65, # Approx historical humidity
        'wind_speed_ms': 3.5, 
    })
    df_hist['ndvi'] = row['ndvi']
    df_hist['ndbi'] = row['ndbi']
    df_hist['vulnerability_index'] = row.get('vulnerability_index', 0.5)
    df_hist['lst_c'] = [t + 3.0 if t is not None else 30 for t in temps]
    
    # Fill Nones
    df_hist.fillna(30, inplace=True)
    
    df_hist = engineer_features(df_hist)
    features = ['temperature_c', 'humidity_pct', 'ndvi', 'ndbi', 'vulnerability_index', 'heat_index', 'veg_urban_ratio']
    X = df_hist[features]
    
    scores = risk_model.predict(X)
    
    for i in range(len(dates)):
        if temps[i] is None: continue
        dt = datetime.strptime(dates[i], "%Y-%m-%d")
        score = float(scores[i])
        history_results.append({
            "date": dt.strftime("%b %d"),
            "risk": score,
            "lst": float(temps[i] + 3.0),
            "air": float(temps[i]),
            "alert": score > 80
        })
        
    return history_results
