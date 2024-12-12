#!/bin/bash

echo "Setting up test environment..."

# Paths
PRISMA_FOLDER="./prisma"

MIGRATIONS_FOLDER="$PRISMA_FOLDER/migrations"

BACKUP_MIGRATIONS_FOLDER="$PRISMA_FOLDER/backup_migrations"

TEST_SCHEMA="$PRISMA_FOLDER/schema.test.prisma"

TEST_DB="$PRISMA_FOLDER/test.sqlite"

# Step 1: Backup existing migrations
if [ -d "$MIGRATIONS_FOLDER" ]; then
    echo "Backing up existing migrations folder..."
    mv "$MIGRATIONS_FOLDER" "$BACKUP_MIGRATIONS_FOLDER"
else
    echo "No existing migrations folder to back up."
fi

# Step 2: Set environment variables for testing
echo "Setting environment variables for SQLite testing..."
export DATABASE_URL="file:$TEST_DB"
export PRISMA_SCHEMA="$TEST_SCHEMA"

# Step 3: Generate Prisma Client for SQLite schema
echo "Generating Prisma Client for SQLite..."
npx prisma generate --schema="$PRISMA_SCHEMA"

# Step 4: Run migrations for SQLite
echo "Running migrations for SQLite..."
npx prisma migrate dev --schema="$PRISMA_SCHEMA" --name init

# Step 5: Run tests
echo "Running e2e tests..."
npm run test:e2e

# Step 6: Cleanup
echo "Cleaning up test environment..."
rm -rf "$MIGRATIONS_FOLDER"
rm -f "$TEST_DB" "$TEST_DB-journal"

# Step 7: Restore original migrations
if [ -d "$BACKUP_MIGRATIONS_FOLDER" ]; then
    echo "Restoring original migrations folder..."
    mv "$BACKUP_MIGRATIONS_FOLDER" "$MIGRATIONS_FOLDER"
else
    echo "No backup migrations folder found. Original migrations not restored!"
fi

echo "Test environment setup and cleanup completed."
