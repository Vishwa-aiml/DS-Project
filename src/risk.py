import pandas as pd
import numpy as np

def calculate_baseline_risk(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate a baseline heat risk score (0-100) using a weighted formula.
    """
    df = df.copy()
    
    # Normalize features to 0-1 range (simplified max/min values for mock data)
    # LST: 30-55 C
    lst_norm = (df["lst_c"] - 30) / 25.0
    lst_norm = np.clip(lst_norm, 0, 1)
    
    # NDBI: -0.2 to 0.7
    ndbi_norm = (df["ndbi"] + 0.2) / 0.9
    ndbi_norm = np.clip(ndbi_norm, 0, 1)
    
    # NDVI: -0.1 to 0.8 (inverse relationship to risk)
    ndvi_inv_norm = 1.0 - np.clip((df["ndvi"] + 0.1) / 0.9, 0, 1)
    
    # Vulnerability Index: 0 to 100
    vuln_norm = df["vulnerability_index"] / 100.0
    
    # Weights for baseline score
    w_lst = 0.4
    w_ndbi = 0.2
    w_ndvi_inv = 0.2
    w_vuln = 0.2
    
    raw_score = (w_lst * lst_norm) + (w_ndbi * ndbi_norm) + (w_ndvi_inv * ndvi_inv_norm) + (w_vuln * vuln_norm)
    
    # Convert to 0-100 score
    df["baseline_risk_score"] = raw_score * 100.0
    
    return df
