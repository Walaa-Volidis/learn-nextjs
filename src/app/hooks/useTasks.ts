import { useState, useEffect } from "react";
import { z } from "zod";

const ZTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
});

export type Task = z.infer<typeof ZTaskSchema>;
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (!storedTasks) {
      setTasks([]);
      return;
    }
    const parsedTask = ZTaskSchema.array().parse(JSON.parse(storedTasks));
    setTasks(parsedTask);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id">) => {
    const parsedTask = ZTaskSchema.omit({ id: true }).parse(task);
    const newTask: Task = {
      ...parsedTask,
      id: crypto.randomUUID().toString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = (task: Task) => {
    const parsedTask = ZTaskSchema.parse(task);
    setTasks((prev) =>
      prev.map((t) => (t.id === parsedTask.id ? parsedTask : t))
    );
  };
  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
  };
};
