import useSWR, { mutate } from "swr";
import { z } from "zod";
import { TaskSearch } from "../types/task";

const ZTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  date: z.string(),
  userId: z.string(),
});

const TaskWithIdSchema = ZTaskSchema.extend({
  id: z.string(),
});

export type Task = z.infer<typeof ZTaskSchema>;
export type TaskWithId = z.infer<typeof TaskWithIdSchema>;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  const data = await response.json();
  return TaskWithIdSchema.array().parse(data);
};

export function useTasks(userId: string | undefined, filters: TaskSearch) {
  const query = new URLSearchParams(
    filters as Record<string, string>
  ).toString();

  const { data: tasks = [], error } = useSWR<TaskWithId[]>(
    userId ? `/api/list-tasks?${query}` : null,
    fetcher
  );

  const addTask = async (formData: FormData) => {
    try {
      const formDataTask = ZTaskSchema.parse({
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
        userId: formData.get("userId"),
      });

      mutate(
        `/api/list-tasks?${query}`,
        [...(tasks || []), formDataTask],
        false
      );

      const response = await fetch("/api/create-task", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();
      TaskWithIdSchema.parse(newTask);
      mutate(`/api/list-tasks?${query}`);
    } catch (error) {
      console.error("Failed to add task:", error);
      mutate(`/api/list-tasks?${query}`);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      mutate(
        `/api/list-tasks?${query}`,
        tasks.filter((task) => task.id !== id),
        false
      );

      const response = await fetch(`/api/delete-task/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      mutate(`/api/list-tasks?${query}`);
    } catch (error) {
      console.error("Failed to delete task:", error);
      mutate(`/api/list-tasks?${query}`);
    }
  };

  const updateTask = async (formData: FormData, id: string) => {
    try {
      const formDataTask = ZTaskSchema.parse({
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        date: formData.get("date"),
        userId: formData.get("userId"),
      });

      mutate(
        `/api/list-tasks?${query}`,
        tasks.map((task) =>
          task.id === id ? { ...task, ...formDataTask } : task
        ),
        false
      );

      const response = await fetch(`/api/update-task/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      TaskWithIdSchema.parse(await response.json());
      mutate(`/api/list-tasks?${query}`);
    } catch (error) {
      console.error("Failed to update task:", error);
      mutate(`/api/list-tasks?${query}`);
    }
  };

  return {
    tasks,
    error,
    isLoading: !error && !tasks,
    addTask,
    deleteTask,
    updateTask,
  };
}
