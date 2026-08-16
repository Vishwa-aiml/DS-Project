import os
import pandas as pd
import geopandas as gpd
from sklearn.model_selection import train_test_split
from src.features import engineer_features
from src.risk import calculate_baseline_risk
from src.models import HeatRiskModel

def train_model(data_path, model_path):
    print(f"Loading data from {data_path}...")
    gdf = gpd.read_file(data_path)
    
    # Feature engineering
    print("Engineering features...")
    df = engineer_features(gdf)
    
    # Calculate target (baseline_risk_score)
    print("Calculating baseline risk scores...")
    df = calculate_baseline_risk(df)
    
    # Prepare training data
    features = ['temperature_c', 'humidity_pct', 'ndvi', 'ndbi', 'vulnerability_index', 'heat_index', 'veg_urban_ratio']
    target = 'baseline_risk_score'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    print("Training XGBoost model...")
    model = HeatRiskModel("xgboost")
    model.train(X_train, y_train)
    
    # Evaluate
    metrics = model.evaluate(X_test, y_test)
    print(f"Metrics: {metrics}")
    
    # Save model
    print(f"Saving model to {model_path}...")
    model.save(model_path)
    print("Done!")

if __name__ == "__main__":
    base_dir = os.path.dirname(__file__)
    data_file = os.path.join(base_dir, "..", "data", "synthetic_features.geojson")
    model_file = os.path.join(base_dir, "..", "data", "xgboost_model.joblib")
    
    train_model(data_file, model_file)
