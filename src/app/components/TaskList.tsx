import { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  //onUpdate: (id: string) => void; I will add it later
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onDelete }: TaskListProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={"flex items-start justify-between p-4 border rounded-lg bg-white transition-colors"}
        >
          <div className="flex items-start space-x-3 flex-1">
            <div className="space-y-1">
              <label
                htmlFor={`task-${task.id}`}
                className={"font-medium text-gray-900"}
              >
                {task.title}
              </label>
              <p className="text-sm text-gray-500">{task.description}</p>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {task.category}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  Date: {task.date}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
