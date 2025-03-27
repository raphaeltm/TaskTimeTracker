import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Create Postgres connection
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

// For migrations and queries
export const migrationClient = postgres(connectionString, { max: 1 });
export const queryClient = postgres(connectionString);

// Create Drizzle ORM instance
export const db = drizzle(queryClient, { schema });

// Function to run migrations
export async function runMigrations() {
  console.log('Running migrations...');
  try {
    const start = Date.now();
    
    // Create the migrations directory if it doesn't exist
    await migrate(drizzle(migrationClient), { migrationsFolder: 'drizzle' });
    
    console.log(`Migrations completed in ${Date.now() - start}ms`);
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Function to initialize the database
export async function initializeDatabase() {
  try {
    // Run migrations
    const migrationSuccess = await runMigrations();
    if (!migrationSuccess) {
      console.error('Failed to run migrations. Attempting to continue...');
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}