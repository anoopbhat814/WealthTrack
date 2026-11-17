# Forecasting

The forecast service simulates geometric Brownian motion paths for a weighted
portfolio. Inputs: expected annual return, volatility, monthly contributions and
horizon. Output: percentile bands (5, 25, 50, 75, 95) per month and the
probability of reaching each goal target.

The optimiser solves a long-only mean-variance problem with `scipy.optimize`.
