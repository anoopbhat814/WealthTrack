"""Long-only mean-variance optimiser maximising the Sharpe ratio."""
from __future__ import annotations

import numpy as np
from scipy.optimize import minimize

from app.config import settings


def annualise(returns: np.ndarray, periods_per_year: int) -> tuple[np.ndarray, np.ndarray]:
    mu = returns.mean(axis=0) * periods_per_year
    cov = np.cov(returns, rowvar=False) * periods_per_year
    return mu, cov


def portfolio_stats(w: np.ndarray, mu: np.ndarray, cov: np.ndarray) -> tuple[float, float]:
    return float(w @ mu), float(np.sqrt(w @ cov @ w))


def max_sharpe(returns: np.ndarray, periods_per_year: int = 252, max_weight: float = 1.0) -> dict:
    mu, cov = annualise(returns, periods_per_year)
    n = len(mu)
    rf = settings.risk_free_rate

    def neg_sharpe(w: np.ndarray) -> float:
        ret, vol = portfolio_stats(w, mu, cov)
        return -(ret - rf) / vol if vol > 1e-12 else 0.0

    result = minimize(
        neg_sharpe,
        x0=np.full(n, 1 / n),
        method="SLSQP",
        bounds=[(0.0, max_weight)] * n,
        constraints=[{"type": "eq", "fun": lambda w: w.sum() - 1}],
    )
    w = np.clip(result.x, 0, None)
    w = w / w.sum()
    ret, vol = portfolio_stats(w, mu, cov)
    return {"weights": w, "expected_return": ret, "volatility": vol, "sharpe": (ret - rf) / vol}


def efficient_frontier(returns: np.ndarray, periods_per_year: int = 252, points: int = 25) -> list[tuple[float, float]]:
    mu, cov = annualise(returns, periods_per_year)
    n = len(mu)
    out = []
    for target in np.linspace(mu.min(), mu.max(), points):
        res = minimize(
            lambda w: w @ cov @ w,
            np.full(n, 1 / n),
            method="SLSQP",
            bounds=[(0, 1)] * n,
            constraints=[
                {"type": "eq", "fun": lambda w: w.sum() - 1},
                {"type": "eq", "fun": lambda w, t=target: w @ mu - t},
            ],
        )
        if res.success:
            out.append((float(np.sqrt(res.fun)), float(target)))
    return out
