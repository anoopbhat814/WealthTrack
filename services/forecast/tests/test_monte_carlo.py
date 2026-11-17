import numpy as np

from app.services import monte_carlo


def test_zero_vol_matches_deterministic_growth():
    paths = monte_carlo.simulate_paths(1000, 0, 0.12, 0.0, 1, 10, seed=1)
    assert paths.shape == (10, 13)
    assert np.allclose(paths[:, -1], 1000 * np.exp(0.12), rtol=1e-6)


def test_contributions_increase_terminal_value():
    base = monte_carlo.simulate_paths(1000, 0, 0.05, 0.1, 5, 500, seed=7)
    more = monte_carlo.simulate_paths(1000, 100, 0.05, 0.1, 5, 500, seed=7)
    assert more[:, -1].mean() > base[:, -1].mean()


def test_probability_bounds():
    paths = monte_carlo.simulate_paths(1000, 50, 0.06, 0.15, 10, 1000, seed=3)
    assert monte_carlo.probability_of_reaching(paths, 0) == 1.0
    assert monte_carlo.probability_of_reaching(paths, 1e12) == 0.0


def test_summary_is_monotonic():
    paths = monte_carlo.simulate_paths(1000, 50, 0.06, 0.15, 2, 800, seed=9)
    row = monte_carlo.summarise(paths)[-1]
    assert row["p5"] <= row["p25"] <= row["p50"] <= row["p75"] <= row["p95"]
