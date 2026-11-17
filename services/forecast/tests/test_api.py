from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz():
    assert client.get("/healthz").json() == {"status": "ok"}


def test_forecast_endpoint():
    body = {"initial_value": 10000, "monthly_contribution": 200, "expected_return": 0.06,
            "volatility": 0.12, "years": 5, "simulations": 500, "goal_target": 30000}
    res = client.post("/v1/forecast", json=body)
    assert res.status_code == 200
    data = res.json()
    assert len(data["bands"]) == 61
    assert 0 <= data["probability_of_goal"] <= 1


def test_optimize_rejects_ragged_rows():
    body = {"symbols": ["A", "B"], "returns": [[0.01, 0.02], [0.01], [0.0, 0.1]]}
    assert client.post("/v1/optimize", json=body).status_code == 422
