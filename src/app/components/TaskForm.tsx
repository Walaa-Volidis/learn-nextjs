import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const Categories_List = ["choose", "Work", "Personal", "Health", "Other"];

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    category: string;
    date: string;
    userId: string;
  }) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const {user} = useUser();
  const userId = user?.id;
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "choose",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({...task, userId: userId!});
    setTask({
      title: "",
      description: "",
      category: "choose",
      date: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircle />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New ToDo Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={task.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            placeholder="Description"
            value={task.description}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <Select
            value={task.category}
            onValueChange={(value) =>
              setTask((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Categories_List.map((category) => {
                return (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={task.date}
            onChange={(e) => setTask({ ...task, date: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
