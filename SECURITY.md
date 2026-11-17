# Security Policy

## Supported versions

| Version | Supported          |
|---------|--------------------|
| 0.4.x   | Yes                |
| 0.3.x   | Security fixes only |
| < 0.3   | No                 |

## Reporting a vulnerability

Please report vulnerabilities privately to `security@wealthtrack.example` or through GitHub's
"Report a vulnerability" form on the Security tab. Do not open a public issue.

Include, where possible:

- A description of the issue and its impact
- Steps to reproduce or a proof of concept
- Affected version or commit
- Any suggested mitigation

You can expect an acknowledgement within 3 business days and a status update within 10. We will
credit reporters in the release notes unless they prefer to stay anonymous.

## Scope

In scope: the web app and its API routes, the worker, the marketdata and forecast services,
Docker images and CI workflows in this repository.

Out of scope: vulnerabilities in third-party data providers, denial of service from unrealistic
traffic volumes, and issues requiring a compromised user device.

## Handling of sensitive data

WealthTrack stores financial data. Never include real account numbers, broker exports or
production database dumps in issues, pull requests or test fixtures. Webhook callbacks from the
alert daemon must be signed (see `apps/web/src/app/api/alerts/webhook`).
