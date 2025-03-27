import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onTimeChange: (time: number) => void;
  badgeColor: string;
}

const timeOptions = [
  { value: 5, label: "5m" },
  { value: 10, label: "10m" },
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 45, label: "45m" },
  { value: 60, label: "60m" },
  { value: 90, label: "90m" }
];

const TaskCard = ({ task, onDelete, onTimeChange, badgeColor }: TaskCardProps) => {
  return (
    <div className="task-card bg-white border rounded-md shadow-sm p-3" data-task-id={task.id}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-medium pr-2">{task.title}</h4>
        <div className="flex items-center">
          <Select
            value={task.time.toString()}
            onValueChange={(value) => onTimeChange(parseInt(value))}
          >
            <SelectTrigger className="text-xs bg-gray-100 border-0 rounded py-1 px-2 w-16 h-7">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button 
            onClick={onDelete}
            className="ml-1.5 text-gray-400 hover:text-red-500"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <span className={`text-xs px-2 py-0.5 rounded ${badgeColor}`}>{task.time} min</span>
        <div className="ml-auto flex items-center text-xs text-gray-500">
          <i className="ri-draggable text-gray-400 cursor-move"></i>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
