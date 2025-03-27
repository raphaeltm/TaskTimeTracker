import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "@/components/TaskCard";
import { Task } from "@shared/schema";

interface TaskColumnProps {
  title: string;
  icon: string;
  iconColor: string;
  tasks: Task[];
  onTaskMove: (taskId: number, targetList: "today" | "backlog") => void;
  onTaskDelete: (taskId: number) => void;
  onTaskTimeChange: (taskId: number, time: number) => void;
  columnType: "today" | "backlog";
  badgeColor: string;
}

const TaskColumn = ({
  title,
  icon,
  iconColor,
  tasks,
  onTaskMove,
  onTaskDelete,
  onTaskTimeChange,
  columnType,
  badgeColor
}: TaskColumnProps) => {
  return (
    <div className="task-column">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium flex items-center">
            <i className={`${icon} mr-2 ${iconColor}`}></i>
            {title}
            <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
              {tasks.length}
            </span>
          </h3>
        </div>
        
        <Droppable droppableId={columnType}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`p-2 min-h-[300px] ${snapshot.isDraggingOver ? "bg-gray-50" : ""}`}
            >
              {tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={task.id.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-2 ${snapshot.isDragging ? "opacity-60" : ""}`}
                    >
                      <TaskCard
                        task={task}
                        onDelete={() => onTaskDelete(task.id)}
                        onTimeChange={(time) => onTaskTimeChange(task.id, time)}
                        badgeColor={badgeColor}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default TaskColumn;
