import numpy as np
from fastapi import APIRouter

from app.models.optimize import OptimizeRequest, OptimizeResponse
from app.services.optimizer import max_sharpe

router = APIRouter(tags=["optimize"])


@router.post("/optimize", response_model=OptimizeResponse)
def optimize(req: OptimizeRequest) -> OptimizeResponse:
    result = max_sharpe(np.array(req.returns), req.periods_per_year, req.max_weight)
    return OptimizeResponse(
        weights={s: round(float(w), 4) for s, w in zip(req.symbols, result["weights"])},
        expected_return=result["expected_return"],
        volatility=result["volatility"],
        sharpe=result["sharpe"],
    )
