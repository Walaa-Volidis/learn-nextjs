import React, { useState, FormEvent } from "react";
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
import { toast } from "react-toastify";

const CategoriesList = ["choose", "Work", "Personal", "Health", "Other"];

interface TaskFormProps {
  userId: string;
  addTask: (formData: FormData) => Promise<void>;
}

export default function TaskForm({ userId, addTask }: TaskFormProps) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    category: "choose",
    date: "",
  });

  // function containsArabic(text: string): boolean {
  //   const arabicRegex = /[\u0600-\u06FF]/;
  //   return arabicRegex.test(text);
  // }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("userId", userId);

    try {
      // if (containsArabic(task.title)) {
      //   const translatedTitle = await translateText(task.title);
      //   formData.set("title", translatedTitle);
      // }

      // if (containsArabic(task.description)) {
      //   const translatedDescription = await translateText(task.description);
      //   console.log("translatedDescription", translatedDescription);
      //   formData.set("description", translatedDescription);
      // }

      await addTask(formData);
      toast.success("Task added successfully.");

      setTask({
        title: "",
        description: "",
        category: "choose",
        date: "",
      });
    } catch (error) {
      toast.error("Error submitting task. Please try again.");
      console.error("Error submitting task:", error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <PlusCircle />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New ToDo Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            name="title"
            value={task.title}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <Input
            placeholder="Description"
            name="description"
            value={task.description}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, description: e.target.value }))
            }
            required
          />
          <Select
            name="category"
            value={task.category}
            onValueChange={(value) =>
              setTask((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CategoriesList.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="date"
            type="date"
            value={task.date}
            onChange={(e) =>
              setTask((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
