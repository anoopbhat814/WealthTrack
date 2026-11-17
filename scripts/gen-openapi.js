#!/usr/bin/env node
'use strict';
// Builds docs/openapi.json from the route table below.
const fs = require('node:fs');
const path = require('node:path');

const routes = [
  ['get', '/api/portfolios', 'List portfolios'],
  ['post', '/api/portfolios', 'Create portfolio'],
  ['get', '/api/networth', 'Net-worth series and allocation'],
  ['get', '/api/budgets', 'Budgets with spend'],
  ['get', '/api/goals', 'Goals with projections'],
  ['get', '/api/tax', 'Tax report for a year'],
  ['post', '/api/alerts', 'Create price alert'],
  ['post', '/api/forecast', 'Run Monte Carlo forecast'],
];

const paths = {};
for (const [method, route, summary] of routes) {
  paths[route] = { ...(paths[route] || {}), [method]: { summary, responses: { 200: { description: 'OK' } } } };
}

const spec = { openapi: '3.0.3', info: { title: 'WealthTrack API', version: '0.4.0' }, paths };
fs.writeFileSync(path.join(__dirname, '..', 'docs', 'openapi.json'), JSON.stringify(spec, null, 2));
console.info(`Wrote ${routes.length} operations`);
