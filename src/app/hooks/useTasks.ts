import { useState, useEffect } from "react";
import { z } from "zod";
import prisma from "@/lib/prisma";

const ZTaskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
  userId: z.string(),
});


export type Task = z.infer<typeof ZTaskSchema>;
export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!userId) return;
    const fetchTasks = async () => {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
      });
      const paresedTasks = tasks.map((task) => ({
        ...task,
        date: task.date.toISOString(),
      }));
      const zTasks = ZTaskSchema.array().parse(paresedTasks);
      setTasks(zTasks);
    };
    fetchTasks();
  }, [userId]);

  const addTask = async (task: Omit<Task, "id">) => {
    const parsedTask = ZTaskSchema.omit({ id: true }).parse(task);

    const newTask = await prisma.task.create({
      data: {
        ...parsedTask,
        userId: userId!,
        date: new Date(task.date),
      },
    });
    setTasks((prev) => [
      ...prev,
      { ...newTask, date: new Date(newTask.date).toISOString() },
    ]);
  };

  const deleteTask = async (id: number) => {
    await prisma.task.delete({
      where: {
        id,
      },
    });
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTask = async (task: Task) => {
    const parsedTask = ZTaskSchema.parse(task);
    const updatedTask = await prisma.task.update({
      where: {
        id: parsedTask.id,
      },
      data: {
        ...parsedTask,
        date: new Date(parsedTask.date),
      },
    });
    setTasks((prev) =>
      prev.map((t) =>
        t.id === updatedTask.id
          ? { ...updatedTask, date: updatedTask.date.toISOString() }
          : t
      )
    );
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
  };
};
