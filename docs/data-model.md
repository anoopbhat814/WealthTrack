# Data model

Core entities: `User`, `Account`, `Portfolio`, `Holding`, `Security`, `Transaction`,
`TaxLot`, `PriceQuote`, `Budget`, `BudgetCategory`, `Goal`, `PriceAlert`,
`NetWorthSnapshot`, `ForecastRun`.

A `Portfolio` belongs to a `User` and groups `Holding`s. Each `Holding` points to a
`Security` and owns zero or more `TaxLot`s created by buy `Transaction`s. Sells
consume lots and write `realizedGain` onto the transaction.
