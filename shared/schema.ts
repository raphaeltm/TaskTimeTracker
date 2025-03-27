import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Task table definition
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  time: integer("time").notNull(), // Time in minutes
  listType: text("list_type").notNull(), // "today" or "backlog"
  userId: text("user_id").notNull(), // Anonymous user ID from frontend
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create insert schema for tasks
export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  time: true,
  listType: true,
  userId: true,
});

// Create update schema for tasks
export const updateTaskSchema = createInsertSchema(tasks).pick({
  time: true,
  listType: true,
});

// Define user time settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  dailyTimeLimit: integer("daily_time_limit").notNull().default(240), // Default to 4 hours (240 minutes)
});

// Create insert schema for user settings
export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  dailyTimeLimit: true,
});

// Create update schema for user settings
export const updateUserSettingsSchema = createInsertSchema(userSettings).pick({
  dailyTimeLimit: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type UpdateUserSettings = z.infer<typeof updateUserSettingsSchema>;
