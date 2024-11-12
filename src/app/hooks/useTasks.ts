import { Task } from "../types/task";
import useSWR, { mutate } from "swr";
import { useState } from "react";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export function useTasks(userId: string | undefined) {
  const { data: tasks = [], error } = useSWR<Task[]>(
    userId ? "/api/list-tasks" : null,
    fetcher
  );
  const [isAdding, setIsAdding] = useState(false);

  const addTask = async (formData: FormData) => {
    setIsAdding(true);
    try {
      const formDataTask = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        date: formData.get("date") as string,
        userId: formData.get("userId") as string,
      };

      mutate("/api/list-tasks", [...(tasks || []), formDataTask], false);

      const response = await fetch("/api/create-task", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();

      mutate("/api/list-tasks");
    } catch (error) {
      console.error("Failed to add task:", error);
      mutate("/api/list-tasks");
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      mutate(
        "/api/list-tasks",
        tasks.filter((task) => task.id !== id),
        false
      );

      const response = await fetch(`/api/delete-task/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      mutate("/api/list-tasks");
    } catch (error) {
      console.error("Failed to delete task:", error);
      mutate("/api/list-tasks");
    }
  };

  return {
    tasks,
    error,
    isLoading: !error && !tasks,
    isAdding,
    addTask,
    deleteTask,
  };
}
