import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import useTasks from "@/hooks/useTasks";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import AppHeader from "@/components/AppHeader";
import TaskInput from "@/components/TaskInput";
import TimeStatus from "@/components/TimeStatus";
import TaskColumn from "@/components/TaskColumn";
import AppFooter from "@/components/AppFooter";
import VoiceInputModal from "@/components/VoiceInputModal";

const Home = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const {
    userId,
    dailyLimit,
    setDailyLimit,
    todayTasks,
    backlogTasks,
    totalTime,
    remainingTime,
    addTasks,
    moveTask,
    deleteTask,
    updateTaskTime,
    clearAllTasks,
    saveForLater
  } = useTasks();
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back in its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Get the taskId from the draggableId (which is a string)
    const taskId = parseInt(draggableId, 10);
    
    // Move the task to the destination list
    moveTask(taskId, destination.droppableId as "today" | "backlog");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-800">
      <AppHeader dailyLimit={dailyLimit} setDailyLimit={setDailyLimit} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TaskInput 
          addTasks={addTasks} 
          openVoiceModal={() => setIsVoiceModalOpen(true)} 
        />
        
        <TimeStatus 
          totalTime={totalTime} 
          remainingTime={remainingTime}
          dailyLimit={dailyLimit}
        />
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TaskColumn 
              title="Today's Tasks"
              icon="ri-calendar-check-line"
              iconColor="text-primary"
              tasks={todayTasks}
              onTaskMove={moveTask}
              onTaskDelete={deleteTask}
              onTaskTimeChange={updateTaskTime}
              columnType="today"
              badgeColor="bg-blue-100 text-blue-800"
            />
            
            <TaskColumn 
              title="Backlog"
              icon="ri-stack-line"
              iconColor="text-gray-500"
              tasks={backlogTasks}
              onTaskMove={moveTask}
              onTaskDelete={deleteTask}
              onTaskTimeChange={updateTaskTime}
              columnType="backlog"
              badgeColor="bg-gray-100 text-gray-800"
            />
          </div>
        </DragDropContext>
      </main>
      
      <AppFooter 
        onClearAll={clearAllTasks}
        onSaveForLater={saveForLater}
      />
      
      <VoiceInputModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)}
        onAddTasks={addTasks}
      />
    </div>
  );
};

export default Home;
