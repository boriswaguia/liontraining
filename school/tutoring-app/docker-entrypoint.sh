#!/bin/sh
set -e

echo "Running database migrations..."
node node_modules/prisma/build/index.js db push --skip-generate 2>&1 || true

echo "Database ready"
exec "$@"
