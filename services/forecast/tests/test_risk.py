import numpy as np

from app.services import risk


def test_var_is_positive_for_losing_tail():
    r = np.array([-0.05, -0.02, 0.01, 0.02, 0.03] * 20)
    assert risk.value_at_risk(r, 0.95) > 0
    assert risk.expected_shortfall(r, 0.95) >= risk.value_at_risk(r, 0.95)


def test_max_drawdown():
    assert risk.max_drawdown(np.array([100, 120, 90, 110.0])) == -0.25
