"""Portfolio risk metrics."""
import numpy as np


def value_at_risk(returns: np.ndarray, confidence: float = 0.95) -> float:
    """Historical one-period VaR expressed as a positive loss fraction."""
    return float(-np.percentile(returns, (1 - confidence) * 100))


def expected_shortfall(returns: np.ndarray, confidence: float = 0.95) -> float:
    cutoff = np.percentile(returns, (1 - confidence) * 100)
    tail = returns[returns <= cutoff]
    return float(-tail.mean()) if tail.size else 0.0


def max_drawdown(values: np.ndarray) -> float:
    running_peak = np.maximum.accumulate(values)
    return float(((values - running_peak) / running_peak).min())


def beta(asset: np.ndarray, benchmark: np.ndarray) -> float:
    cov = np.cov(asset, benchmark)
    return float(cov[0, 1] / cov[1, 1])
