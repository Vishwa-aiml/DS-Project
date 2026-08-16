from fastapi.testclient import TestClient
from api.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to THERMALENS API"}

def test_get_grid_data():
    response = client.get("/api/v1/grid")
    # Will be 404 if data not generated, 200 if generated
    assert response.status_code in [200, 404]

def test_get_risk_score():
    response = client.get("/api/v1/risk-score/GRID_00001")
    assert response.status_code == 200
    data = response.json()
    assert "grid_id" in data
    assert "risk_score" in data
    assert "shap_values" in data
