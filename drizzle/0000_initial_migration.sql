-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "time" INTEGER NOT NULL,
  "list_type" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS "user_settings" (
  "id" SERIAL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "daily_time_limit" INTEGER NOT NULL DEFAULT 240
);

-- Create indices for faster queries
CREATE INDEX IF NOT EXISTS "tasks_user_id_idx" ON "tasks" ("user_id");
CREATE INDEX IF NOT EXISTS "user_settings_user_id_idx" ON "user_settings" ("user_id");