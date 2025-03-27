import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskInputProps {
  addTasks: (tasks: string[]) => void;
  openVoiceModal: () => void;
}

const TaskInput = ({ addTasks, openVoiceModal }: TaskInputProps) => {
  const [value, setValue] = useState("");

  const handleCreate = () => {
    if (value.trim()) {
      const tasks = value.trim().split('\n').filter(task => task.trim());
      addTasks(tasks);
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-start mb-3">
        <h2 className="text-lg font-semibold">Add Tasks</h2>
        <span className="ml-2 text-sm text-gray-500">(one per line)</span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Textarea
            id="taskInput"
            rows={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your tasks here, one per line..."
            className="resize-none"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleCreate}
            className="inline-flex items-center justify-center"
          >
            <i className="ri-add-line mr-1"></i>
            Create Tasks
          </Button>
          
          <Button 
            variant="outline" 
            onClick={openVoiceModal}
            className="inline-flex items-center justify-center"
          >
            <i className="ri-mic-line mr-1 text-primary"></i>
            Voice Input
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
