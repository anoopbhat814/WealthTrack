"""Runtime configuration read from environment variables."""
from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    max_simulations: int = int(os.getenv("FORECAST_MAX_SIMS", "20000"))
    default_simulations: int = int(os.getenv("FORECAST_DEFAULT_SIMS", "5000"))
    risk_free_rate: float = float(os.getenv("RISK_FREE_RATE", "0.04"))
    seed: int | None = int(os.environ["FORECAST_SEED"]) if "FORECAST_SEED" in os.environ else None


settings = Settings()
