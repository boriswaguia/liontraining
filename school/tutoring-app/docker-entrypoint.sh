#!/bin/sh
set -e

# Build DATABASE_URL from individual PG* vars (avoids special-char issues in compose interpolation)
if [ -z "$DATABASE_URL" ]; then
  # URL-encode the password (handle @, #, /, : etc.)
  ENCODED_PW=$(printf '%s' "$PGPASSWORD" | node -e "
    let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>process.stdout.write(encodeURIComponent(d)));
  ")
  export DATABASE_URL="postgresql://${PGUSER}:${ENCODED_PW}@${PGHOST}:${PGPORT}/${PGDATABASE}"
fi

echo "Running database migrations..."
node node_modules/prisma/build/index.js db push --skip-generate 2>&1 || true

echo "Database ready"
exec "$@"
