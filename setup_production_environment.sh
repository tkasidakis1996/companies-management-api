#!/bin/bash

# Define paths
PRISMA_FOLDER="./prisma"
MIGRATIONS_FOLDER="$PRISMA_FOLDER/migrations"
BACKUP_MIGRATIONS_FOLDER="$PRISMA_FOLDER/backup_migrations"
SQLITE_DB_FILE="$PRISMA_FOLDER/test.sqlite"

echo "Switching to PostgreSQL environment..."

# Step 1: Read DATABASE_URL from .env and export it
DATABASE_URL=$(grep ^DATABASE_URL .env | cut -d '=' -f2)
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL not found in .env file."
    exit 1
fi

export DATABASE_URL
echo "Exported DATABASE_URL=$DATABASE_URL"

# Step 2: Restore the migrations folder
if [ -d "$BACKUP_MIGRATIONS_FOLDER" ]; then
    echo "Restoring PostgreSQL migrations folder..."
    rm -rf "$MIGRATIONS_FOLDER"
    mv "$BACKUP_MIGRATIONS_FOLDER" "$MIGRATIONS_FOLDER"
else
    echo "No backup migrations folder found. Skipping restoration."
fi

# Step 3: Regenerate Prisma Client for PostgreSQL
echo "Regenerating Prisma Client for PostgreSQL..."
npx prisma generate --schema=$PRISMA_FOLDER/schema.prisma

# Step 4: Clean up test-related artifacts
if [ -f "$SQLITE_DB_FILE" ]; then
    echo "Removing SQLite database file..."
    rm -f "$SQLITE_DB_FILE"
fi

echo "PostgreSQL environment setup completed successfully."
