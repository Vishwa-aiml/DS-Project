import pytest
import pandas as pd
import numpy as np
from src.features import engineer_features
from src.risk import calculate_baseline_risk
from src.models import HeatRiskModel

def test_engineer_features():
    df = pd.DataFrame({
        "temperature_c": [35, 40],
        "humidity_pct": [50, 80],
        "ndvi": [0.5, 0.1],
        "ndbi": [0.1, 0.6]
    })
    
    out_df = engineer_features(df)
    
    assert "heat_index" in out_df.columns
    assert "veg_urban_ratio" in out_df.columns
    assert "vulnerability_index" in out_df.columns
    
    assert out_df["heat_index"].iloc[0] == 35 + (0.05 * 50)

def test_calculate_baseline_risk():
    df = pd.DataFrame({
        "lst_c": [35, 45],
        "ndbi": [0.1, 0.6],
        "ndvi": [0.5, 0.1],
        "vulnerability_index": [30, 80]
    })
    
    out_df = calculate_baseline_risk(df)
    assert "baseline_risk_score" in out_df.columns
    
    # 2nd should be higher risk than 1st
    assert out_df["baseline_risk_score"].iloc[1] > out_df["baseline_risk_score"].iloc[0]

def test_heat_risk_model():
    X = pd.DataFrame({
        "feat1": np.random.uniform(0, 1, 50),
        "feat2": np.random.uniform(0, 1, 50)
    })
    y = X["feat1"] + X["feat2"]
    
    model = HeatRiskModel("rf")
    model.train(X, y)
    metrics = model.evaluate(X, y)
    
    assert "mse" in metrics
    assert "r2" in metrics
    
    # SHAP test
    shap_vals = model.explain(X)
    assert shap_vals is not None
