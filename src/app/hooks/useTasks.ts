import { useState, useEffect } from "react";
import { Task } from "../types/task";

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/listTasks");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const addTask = async (formData: FormData) => {
    try {
      const response = await fetch("/api/createTask", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/deleteTask/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return { tasks, addTask, deleteTask };
}
