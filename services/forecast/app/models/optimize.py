from pydantic import BaseModel, Field, model_validator


class OptimizeRequest(BaseModel):
    symbols: list[str] = Field(min_length=2)
    returns: list[list[float]] = Field(description="Periodic returns, one row per period")
    periods_per_year: int = 252
    max_weight: float = Field(default=1.0, gt=0, le=1.0)

    @model_validator(mode="after")
    def check_shape(self) -> "OptimizeRequest":
        width = len(self.symbols)
        if any(len(row) != width for row in self.returns):
            raise ValueError("every returns row must have one value per symbol")
        if len(self.returns) < 3:
            raise ValueError("at least three periods are required")
        return self


class OptimizeResponse(BaseModel):
    weights: dict[str, float]
    expected_return: float
    volatility: float
    sharpe: float
