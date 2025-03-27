import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { PgStorage } from "./pg-storage";
import { 
  insertTaskSchema, 
  updateTaskSchema, 
  insertUserSettingsSchema, 
  updateUserSettingsSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  const storage = new PgStorage();
  
  // Get all tasks for a user
  apiRouter.get("/tasks/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const tasks = await storage.getTasks(userId);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Error getting tasks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Create a new task
  apiRouter.post("/tasks", async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.safeParse(req.body);
      
      if (!taskData.success) {
        const validationError = fromZodError(taskData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const newTask = await storage.createTask(taskData.data);
      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update a task
  apiRouter.patch("/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      // Create a partial schema for validation that only includes the fields we want to update
      const updateSchema = z.object({
        time: z.number().optional(),
        listType: z.string().optional(),
      });
      
      const taskData = updateSchema.safeParse(req.body);
      
      if (!taskData.success) {
        const validationError = fromZodError(taskData.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const updatedTask = await storage.updateTask(id, taskData.data);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Delete a task
  apiRouter.delete("/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get user settings
  apiRouter.get("/settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      let settings = await storage.getUserSettings(userId);
      
      // If settings don't exist, create default settings
      if (!settings) {
        settings = await storage.createUserSettings({
          userId,
          dailyTimeLimit: 240, // Default to 4 hours
        });
      }
      
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error getting user settings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update user settings
  apiRouter.patch("/settings/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      const updateSchema = updateUserSettingsSchema.safeParse(req.body);
      
      if (!updateSchema.success) {
        const validationError = fromZodError(updateSchema.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      let settings = await storage.getUserSettings(userId);
      
      // If settings don't exist, create them first
      if (!settings) {
        settings = await storage.createUserSettings({
          userId,
          dailyTimeLimit: updateSchema.data.dailyTimeLimit,
        });
      } else {
        // Otherwise, update existing settings
        settings = await storage.updateUserSettings(userId, updateSchema.data);
      }
      
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Clear all tasks for a user
  apiRouter.delete("/tasks/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      
      // Use the clearAllTasks method
      await storage.clearAllTasks(userId);
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error clearing tasks:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
