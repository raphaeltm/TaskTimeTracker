import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Task } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const useTasks = () => {
  const [userId, setUserId] = useState<string>("");
  const [dailyLimit, setDailyLimit] = useState<number>(240); // Default 4 hours
  const { toast } = useToast();
  
  // Initialize or retrieve anonymous user ID
  useEffect(() => {
    const storedUserId = localStorage.getItem("tasktime_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${nanoid(8)}`;
      localStorage.setItem("tasktime_user_id", newUserId);
      setUserId(newUserId);
    }
  }, []);
  
  // Fetch user settings
  const { data: settings } = useQuery<{ dailyTimeLimit: number }>({
    queryKey: [`/api/settings/${userId}`],
    enabled: !!userId,
  });
  
  // Apply user settings
  useEffect(() => {
    if (settings && settings.dailyTimeLimit) {
      setDailyLimit(settings.dailyTimeLimit);
    }
  }, [settings]);
  
  // Fetch tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: [`/api/tasks/${userId}`],
    enabled: !!userId,
  });
  
  // Update daily time limit
  const updateSettings = useMutation({
    mutationFn: async (newLimit: number) => {
      return apiRequest("PATCH", `/api/settings/${userId}`, {
        dailyTimeLimit: newLimit,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update daily limit: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Create new task
  const createTask = useMutation({
    mutationFn: async (task: { title: string; time: number; listType: string }) => {
      return apiRequest("POST", `/api/tasks`, {
        ...task,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create task: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Update task
  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete task: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Clear all tasks
  const clearAllTasksMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/tasks/user/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${userId}`] });
      toast({
        title: "Success",
        description: "All tasks have been cleared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to clear tasks: ${error}`,
        variant: "destructive",
      });
    },
  });
  
  // Separate tasks by list type
  const todayTasks = tasks.filter(task => task.listType === "today");
  const backlogTasks = tasks.filter(task => task.listType === "backlog");
  
  // Calculate time totals
  const totalTime = todayTasks.reduce((sum, task) => sum + task.time, 0);
  const remainingTime = Math.max(0, dailyLimit - totalTime);
  
  // Add new tasks
  const addTasks = (taskTitles: string[]) => {
    if (!userId || !taskTitles.length) return;
    
    taskTitles.forEach((title) => {
      // Default time is 15 minutes
      const time = 15;
      
      // Add to today if there's room, otherwise to backlog
      const listType = totalTime + time <= dailyLimit ? "today" : "backlog";
      
      createTask.mutate({
        title,
        time,
        listType,
      });
    });
  };
  
  // Move task between today and backlog
  const moveTask = (taskId: number, targetList: "today" | "backlog") => {
    updateTask.mutate({
      id: taskId,
      updates: { listType: targetList },
    });
  };
  
  // Delete a task
  const deleteTask = (taskId: number) => {
    deleteTaskMutation.mutate(taskId);
  };
  
  // Update task time
  const updateTaskTime = (taskId: number, time: number) => {
    updateTask.mutate({
      id: taskId,
      updates: { time },
    });
  };
  
  // Clear all tasks
  const clearAllTasks = () => {
    clearAllTasksMutation.mutate();
  };
  
  // Save for later (just a notification in this implementation)
  const saveForLater = () => {
    toast({
      title: "Success",
      description: "Tasks saved successfully!",
    });
  };
  
  // Update daily limit
  const handleSetDailyLimit = (newLimit: number) => {
    setDailyLimit(newLimit);
    updateSettings.mutate(newLimit);
  };
  
  return {
    userId,
    dailyLimit,
    setDailyLimit: handleSetDailyLimit,
    todayTasks,
    backlogTasks,
    totalTime,
    remainingTime,
    addTasks,
    moveTask,
    deleteTask,
    updateTaskTime,
    clearAllTasks,
    saveForLater,
  };
};

export default useTasks;
