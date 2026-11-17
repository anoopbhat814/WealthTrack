"""FastAPI entrypoint for the forecasting service."""
from fastapi import FastAPI

from app.routers import forecast, optimize

app = FastAPI(title="WealthTrack Forecast", version="0.4.0")
app.include_router(forecast.router, prefix="/v1")
app.include_router(optimize.router, prefix="/v1")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
