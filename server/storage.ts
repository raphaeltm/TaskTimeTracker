import { 
  users, type User, type InsertUser, 
  tasks, type Task, type InsertTask, 
  userSettings, type UserSettings, type InsertUserSettings, type UpdateUserSettings,
  updateTaskSchema
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: string, settings: UpdateUserSettings): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private settings: Map<string, UserSettings>;
  
  private userCurrentId: number;
  private taskCurrentId: number;
  private settingsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.settings = new Map();
    
    this.userCurrentId = 1;
    this.taskCurrentId = 1;
    this.settingsCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.userId === userId);
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    const newTask: Task = { 
      ...task, 
      id, 
      createdAt: now
    };
    this.tasks.set(id, newTask);
    return newTask;
  }
  
  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.settings.values())
      .find(setting => setting.userId === userId);
  }
  
  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.settingsCurrentId++;
    const settings: UserSettings = { ...insertSettings, id };
    this.settings.set(insertSettings.userId, settings);
    return settings;
  }
  
  async updateUserSettings(userId: string, updates: UpdateUserSettings): Promise<UserSettings | undefined> {
    const settings = await this.getUserSettings(userId);
    if (!settings) return undefined;
    
    const updatedSettings: UserSettings = { 
      ...settings, 
      ...updates
    };
    this.settings.set(userId, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
