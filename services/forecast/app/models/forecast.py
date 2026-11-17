from pydantic import BaseModel, Field


class ForecastRequest(BaseModel):
    initial_value: float = Field(ge=0)
    monthly_contribution: float = Field(ge=0)
    expected_return: float = Field(ge=-0.5, le=0.5, description="Annualised arithmetic return")
    volatility: float = Field(ge=0, le=1.0, description="Annualised standard deviation")
    years: int = Field(ge=1, le=60)
    simulations: int = Field(default=5000, ge=100)
    goal_target: float | None = Field(default=None, gt=0)


class Band(BaseModel):
    month: int
    p5: float
    p25: float
    p50: float
    p75: float
    p95: float


class ForecastResponse(BaseModel):
    bands: list[Band]
    probability_of_goal: float | None
    median_final: float
