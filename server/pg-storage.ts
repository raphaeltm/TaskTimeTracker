import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';
import { 
  InsertTask, InsertUser, InsertUserSettings, 
  Task, UpdateUserSettings, User, UserSettings,
  tasks, userSettings, users
} from '../shared/schema';

export class PgStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning();
    return results[0];
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const results = await db.insert(tasks).values(task).returning();
    return results[0];
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const results = await db.update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    
    return results.length > 0 ? results[0] : undefined;
  }

  async deleteTask(id: number): Promise<boolean> {
    const results = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return results.length > 0;
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const results = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    return results.length > 0 ? results[0] : undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    // Ensure dailyTimeLimit is provided with a default value if not present
    const settingsWithDefaults = {
      ...settings,
      dailyTimeLimit: settings.dailyTimeLimit || 240, // Default to 4 hours (240 minutes)
    };
    
    const results = await db.insert(userSettings).values(settingsWithDefaults).returning();
    return results[0];
  }

  async updateUserSettings(userId: string, updates: UpdateUserSettings): Promise<UserSettings | undefined> {
    const results = await db.update(userSettings)
      .set(updates)
      .where(eq(userSettings.userId, userId))
      .returning();
    
    return results.length > 0 ? results[0] : undefined;
  }

  // Clear all tasks for a user
  async clearAllTasks(userId: string): Promise<boolean> {
    const results = await db.delete(tasks).where(eq(tasks.userId, userId)).returning();
    return results.length > 0;
  }
}