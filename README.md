# Task Manager Application

A minimal task manager web app with time tracking, voice input, and drag-and-drop task organization.

## Features

- Create tasks quickly with text or voice input
- Estimate time for each task (5, 10, 15, 30, 60 minutes)
- Set daily time limits
- Organize tasks between "Today" and "Backlog" columns using drag-and-drop
- Track remaining time
- Persistent storage with PostgreSQL database

## Running with Docker Compose

The easiest way to run this application is using Docker Compose:

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

2. Clone this repository:
   ```
   git clone <repository-url>
   cd task-manager
   ```

3. Start the application:
   ```
   docker compose up
   ```
   
   For running in detached mode (in the background):
   ```
   docker compose up -d
   ```

4. Access the application in your browser at:
   ```
   http://localhost:5000
   ```

5. To stop the application:
   ```
   docker compose down
   ```
   
   To stop and remove all volumes (which will delete all data):
   ```
   docker compose down -v
   ```
   
6. To view logs when running in detached mode:
   ```
   docker compose logs -f
   ```

## Data Persistence

The PostgreSQL database data is stored in a Docker volume named `postgres-data`. This ensures your data persists even when you stop the containers.

To completely remove the volume and start fresh:
```
docker compose down -v
```

## Database Management

The application uses Drizzle ORM for database operations. When the application starts with Docker Compose, it automatically runs the database migration using `npm run db:push`.

If you need to manually push schema changes to the database:

```bash
# When running with Docker Compose
docker compose exec app npm run db:push

# When running locally
npm run db:push
```

The database schema is defined in `shared/schema.ts` and includes tables for:
- Users
- Tasks 
- User settings (including daily time limits)

## Development Setup

If you want to run the application in development mode without Docker:

1. Install the dependencies:
   ```
   npm install
   ```

2. Set up your PostgreSQL database and update the connection string in your environment variables.

3. Run the development server:
   ```
   npm run dev
   ```

## Environment Variables

The following environment variables can be configured:

- `NODE_ENV`: Set to "production" for production mode, otherwise it will run in development mode
- `DATABASE_URL`: PostgreSQL connection string
- `PGHOST`: PostgreSQL host
- `PGUSER`: PostgreSQL user
- `PGPASSWORD`: PostgreSQL password
- `PGDATABASE`: PostgreSQL database name
- `PGPORT`: PostgreSQL port

These variables are set in the `docker-compose.yml` file when running with Docker Compose.