import pandas as pd
import numpy as np

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Given a dataframe with base features, engineer additional indicators.
    """
    df = df.copy()
    
    # Heat Index Approximation (simplified)
    # HI = c1 + c2*T + c3*R + c4*T*R ... 
    # For now, just a linear combination of temp and humidity to simulate discomfort
    df["heat_index"] = df["temperature_c"] + (0.05 * df["humidity_pct"])
    
    # Vegetation/Urban ratio
    # Add a small epsilon to avoid division by zero
    df["veg_urban_ratio"] = (df["ndvi"] + 1) / (df["ndbi"] + 1 + 1e-5)
    
    # Mock vulnerable population metric based on ndbi (proxy for density)
    # (Just a synthetic feature for the ML model)
    df["vulnerability_index"] = np.clip(df["ndbi"] * 10 + 20, 0, 100)
    
    return df
