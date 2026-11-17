# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Webhook signature verification for alert callbacks.
- Per-page loading and error boundaries in the web app.

### Changed
- Docker builds for `forecast` and `marketdata` now use the Dockerfiles in their service folders.

## [0.4.0] - 2024-06-18

### Added
- Price alerts with `ABOVE`, `BELOW` and percentage-change conditions.
- Tax-lot report with FIFO, LIFO, HIFO and average cost methods.
- Nightly net-worth snapshots computed by the worker.
- Stored forecast runs.

### Fixed
- Budget rollover double counted the previous month's spend.

## [0.3.0] - 2024-03-04

### Added
- Savings goals with projected completion dates.
- Schwab CSV import.
- Efficient frontier optimisation endpoint in the forecast service.

## [0.2.0] - 2024-02-15

### Added
- Budgets with category limits and rollover.
- Monte Carlo forecast fan chart.

### Changed
- Extracted `@wealthtrack/types` and `@wealthtrack/utils` into workspace packages.

## [0.1.0] - 2024-01-08

### Added
- Initial release: accounts, portfolios, holdings and net-worth dashboard.

[Unreleased]: https://github.com/wealthtrack/wealthtrack/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/wealthtrack/wealthtrack/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/wealthtrack/wealthtrack/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/wealthtrack/wealthtrack/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/wealthtrack/wealthtrack/releases/tag/v0.1.0
