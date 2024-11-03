import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Task } from '../types/task';

export const useTasks = ()=>{
    const [tasks, setTasks] = useState<Task[]>([]);
    const TaskSchema = z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string(),
      category: z.string(),
      date: z.string(),
    });
    useEffect(()=>{      
       const storedTasks = localStorage.getItem("tasks");
       setTasks(storedTasks? JSON.parse(storedTasks):[]);
    },[]);

    useEffect(()=>{
      localStorage.setItem("tasks", JSON.stringify(tasks)); 
    },[tasks]);


    const addTask = (task: Omit<Task, 'id'>)=>{
      const parsedTask = TaskSchema.omit({id: true}).parse(task);
        const newTask:Task = {
             ...parsedTask,
             id: crypto.randomUUID().toString()
        }
        setTasks((prev)=>[...prev, newTask]);
    }

    const deleteTask = (id:string)=>{
        setTasks((prev)=>prev.filter(task=>task.id !== id));
    }

    const updateTask = (task:Task)=>{
        const parsedTask = TaskSchema.parse(task) as Task;
        setTasks((prev) => prev.map((t) => (t.id === parsedTask.id ? parsedTask : t)));
    }
    return {
        tasks,
        addTask,
        deleteTask,
        updateTask
    }
}