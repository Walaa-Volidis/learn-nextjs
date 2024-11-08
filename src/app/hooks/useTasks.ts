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

const ZUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().optional(),
});

export type Task = z.infer<typeof ZTaskSchema>;

export type User = z.infer<typeof ZUserSchema>;
export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User>();
  useEffect(() => {
    if (!userId) return;
    const fetchTasks = async () => {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
      });
      if (!tasks) return;
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

  const addUser = async (user: User) => {
    await ZUserSchema.parse(user);
    const existedUser = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!existedUser) {
      const newUser = await prisma.user.create({
        data: {
          ...user,
          email: user.email ?? "",
        },
      });

      setUser(newUser);
    }
  };

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    addUser,
  };
};
