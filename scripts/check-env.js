#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const example = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
const required = example
  .split('\n')
  .filter((l) => l && !l.startsWith('#'))
  .map((l) => l.split('=')[0]);

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing environment variables:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.info('Environment OK');
