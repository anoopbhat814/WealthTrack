#!/usr/bin/env bash
set -euo pipefail
# Dump the database to backups/ with a timestamp.
mkdir -p backups
pg_dump "$DATABASE_URL" --format=custom --file "backups/wealthtrack-$(date +%Y%m%d-%H%M%S).dump"
echo "backup complete"
