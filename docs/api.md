# REST API

All routes live under `/api` and require a session.

| Method | Path                      | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/portfolios`         | List portfolios with total value     |
| POST   | `/api/portfolios`         | Create a portfolio                   |
| GET    | `/api/holdings?portfolio=`| Holdings with unrealised gain        |
| GET    | `/api/networth`           | Net-worth time series                |
| GET    | `/api/budgets`            | Budgets with month-to-date spend     |
| GET    | `/api/goals`              | Goals with projected completion      |
| GET    | `/api/tax?year=`          | Realised gain report                 |
| POST   | `/api/alerts`             | Create a price alert                 |
| POST   | `/api/forecast`           | Run a Monte Carlo projection         |
