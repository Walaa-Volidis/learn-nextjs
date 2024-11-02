import { useState, useEffect } from 'react';
import { Task } from '../types/task';

export const useTasks = ()=>{
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(()=>{      
       const storedTasks = localStorage.getItem("tasks");
       setTasks(storedTasks? JSON.parse(storedTasks):[]);
    },[]);

    useEffect(()=>{
      localStorage.setItem("tasks", JSON.stringify(tasks)); 
    },[tasks]);

    const addTask = (task: Omit<Task, 'id'>)=>{
        const newTask:Task = {
             ...task,
             id: crypto.randomUUID().toString()
        }
        setTasks((prev)=>[...prev, newTask]);
    }

    const deleteTask = (id:string)=>{
        setTasks((prev)=>prev.filter(task=>task.id !== id));
    }

    const updateTask = (task:Task)=>{
        setTasks((prev)=>prev.map(t=>t.id === task.id? task: t));
    }
    return {
        tasks,
        addTask,
        deleteTask,
        updateTask
    }
}