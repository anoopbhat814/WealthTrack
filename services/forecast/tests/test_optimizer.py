import numpy as np

from app.services.optimizer import max_sharpe


def make_returns():
    rng = np.random.default_rng(42)
    a = rng.normal(0.0008, 0.010, 500)
    b = rng.normal(0.0002, 0.004, 500)
    c = rng.normal(0.0004, 0.020, 500)
    return np.column_stack([a, b, c])


def test_weights_sum_to_one_and_nonnegative():
    out = max_sharpe(make_returns())
    assert abs(out["weights"].sum() - 1) < 1e-8
    assert (out["weights"] >= 0).all()


def test_max_weight_constraint_respected():
    out = max_sharpe(make_returns(), max_weight=0.5)
    assert out["weights"].max() <= 0.5 + 1e-6
