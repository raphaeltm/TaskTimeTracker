#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $PGHOST -p $PGPORT -U $PGUSER
do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

# Print out info fetched from postgres to make sure it's working
echo "PostgreSQL is up - fetching info"
psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -c "SELECT version();"

echo "PostgreSQL is up - executing migrations"
npm run db:push

# Start the application
echo "Starting the application"
exec npm start