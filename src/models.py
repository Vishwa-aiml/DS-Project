import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from sklearn.metrics import mean_squared_error, r2_score
import shap
import joblib
import os

class HeatRiskModel:
    def __init__(self, model_type="xgboost"):
        self.model_type = model_type
        if model_type == "linear":
            self.model = LinearRegression()
        elif model_type == "rf":
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        elif model_type == "xgboost":
            self.model = XGBRegressor(n_estimators=100, learning_rate=0.1, random_state=42)
        else:
            raise ValueError(f"Unknown model_type: {model_type}")

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def evaluate(self, X_test, y_test):
        preds = self.model.predict(X_test)
        mse = mean_squared_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        return {"mse": mse, "r2": r2}

    def predict(self, X):
        return self.model.predict(X)

    def explain(self, X):
        """
        Returns SHAP values for the given dataset using the trained model.
        """
        if self.model_type == "linear":
            explainer = shap.LinearExplainer(self.model, X)
        elif self.model_type in ["rf", "xgboost"]:
            explainer = shap.TreeExplainer(self.model)
            
        shap_values = explainer.shap_values(X)
        return shap_values

    def save(self, filepath):
        joblib.dump(self.model, filepath)

    def load(self, filepath):
        self.model = joblib.load(filepath)

if __name__ == "__main__":
    # Test execution
    np.random.seed(42)
    # create dummy data
    X = pd.DataFrame({
        "temperature_c": np.random.uniform(30, 45, 100),
        "humidity_pct": np.random.uniform(40, 90, 100),
        "ndvi": np.random.uniform(-0.1, 0.8, 100),
        "ndbi": np.random.uniform(-0.2, 0.7, 100),
        "vulnerability_index": np.random.uniform(0, 100, 100)
    })
    
    # Target: simulate learning a risk score
    y = X["temperature_c"] * 0.5 - X["ndvi"] * 10 + X["ndbi"] * 10 + np.random.normal(0, 2, 100)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = HeatRiskModel(model_type="xgboost")
    model.train(X_train, y_train)
    metrics = model.evaluate(X_test, y_test)
    print("XGBoost Metrics:", metrics)
    
    # SHAP
    shap_vals = model.explain(X_test)
    print("SHAP values shape:", shap_vals.shape)
