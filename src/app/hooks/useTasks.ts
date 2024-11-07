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
export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userId) return;
    const storedTasks = localStorage.getItem(`tasks_${userId}`);
    if (!storedTasks) {
      setTasks([]);
      return;
    }
    const parsedTask = ZTaskSchema.array().parse(JSON.parse(storedTasks));
    setTasks(parsedTask);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
  }, [tasks, userId]);

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
