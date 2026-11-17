"""Geometric Brownian motion simulation with monthly contributions."""
from __future__ import annotations

import numpy as np

PERCENTILES = (5, 25, 50, 75, 95)


def simulate_paths(
    initial: float,
    monthly_contribution: float,
    expected_return: float,
    volatility: float,
    years: int,
    simulations: int,
    seed: int | None = None,
) -> np.ndarray:
    """Return array of shape (simulations, months + 1) of portfolio values."""
    rng = np.random.default_rng(seed)
    months = years * 12
    dt = 1 / 12
    drift = (expected_return - 0.5 * volatility**2) * dt
    shock = volatility * np.sqrt(dt) * rng.standard_normal((simulations, months))
    growth = np.exp(drift + shock)

    paths = np.empty((simulations, months + 1))
    paths[:, 0] = initial
    for m in range(months):
        paths[:, m + 1] = paths[:, m] * growth[:, m] + monthly_contribution
    return paths


def summarise(paths: np.ndarray) -> list[dict[str, float]]:
    pct = np.percentile(paths, PERCENTILES, axis=0)
    return [
        {"month": m, **{f"p{p}": float(pct[i, m]) for i, p in enumerate(PERCENTILES)}}
        for m in range(paths.shape[1])
    ]


def probability_of_reaching(paths: np.ndarray, target: float) -> float:
    """Share of simulations whose terminal value meets the target."""
    return float(np.mean(paths[:, -1] >= target))
