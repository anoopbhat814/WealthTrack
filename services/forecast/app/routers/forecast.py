from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.forecast import Band, ForecastRequest, ForecastResponse
from app.services import monte_carlo

router = APIRouter(tags=["forecast"])


@router.post("/forecast", response_model=ForecastResponse)
def forecast(req: ForecastRequest) -> ForecastResponse:
    if req.simulations > settings.max_simulations:
        raise HTTPException(status_code=422, detail=f"simulations capped at {settings.max_simulations}")
    paths = monte_carlo.simulate_paths(
        req.initial_value,
        req.monthly_contribution,
        req.expected_return,
        req.volatility,
        req.years,
        req.simulations,
        settings.seed,
    )
    prob = monte_carlo.probability_of_reaching(paths, req.goal_target) if req.goal_target else None
    return ForecastResponse(
        bands=[Band(**row) for row in monte_carlo.summarise(paths)],
        probability_of_goal=prob,
        median_final=float(__import__("numpy").median(paths[:, -1])),
    )
