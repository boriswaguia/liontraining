#!/usr/bin/env bash
# ============================================================
# LionLearn - Database Restore Helper
# ============================================================
# Usage:
#   ./scripts/restore.sh <backup-file.sql.gz>
#
# Examples:
#   ./scripts/restore.sh lionlearn-manual-2025-02-17T00-00-00.sql.gz
#   ./scripts/restore.sh /path/to/backup.sql.gz
#
# Requirements:
#   - docker compose is running (db container must be up)
#   - The backup file must be accessible from this machine
#
# WARNING: This will DROP and recreate the public schema,
#          destroying all existing data!
# ============================================================

set -euo pipefail

BACKUP_FILE="${1:-}"

if [ -z "$BACKUP_FILE" ]; then
  echo "ERROR: No backup file specified."
  echo "Usage: $0 <backup-file.sql.gz>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "ERROR: File not found: $BACKUP_FILE"
  exit 1
fi

DB_CONTAINER="${DB_CONTAINER:-tutoring-app-db-1}"
DB_USER="${PGUSER:-lionlearn}"
DB_NAME="${PGDATABASE:-lionlearn}"

echo "============================================================"
echo "  LionLearn Database Restore"
echo "============================================================"
echo "  Source file : $BACKUP_FILE"
echo "  DB container: $DB_CONTAINER"
echo "  Database    : $DB_NAME"
echo "  User        : $DB_USER"
echo "============================================================"
echo ""
read -r -p "⚠️  This will ERASE all existing data. Continue? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "→ Dropping and recreating public schema..."
docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME" \
  -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

echo "→ Restoring from $BACKUP_FILE ..."
gunzip -c "$BACKUP_FILE" | docker compose exec -T db psql -U "$DB_USER" -d "$DB_NAME"

echo ""
echo "✅ Restore complete."
echo ""
echo "Next step: restart the app container to re-run migrations:"
echo "  docker compose restart app"
