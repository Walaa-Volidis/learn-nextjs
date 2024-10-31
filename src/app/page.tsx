"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import TaskForm from "@/app/components/TaskForm";
import { TaskList } from "@/app/components/TaskList";
import { useTasks } from "@/app/hooks/useTasks";

type TaskFilter = {
  search: string;
  category: string;
  date: string;
};

export default function TodoPage() {
  const { tasks, addTask, deleteTask } = useTasks();
  const [filters, setFilters] = useState<TaskFilter>({
    search: "",
    category: "choose",
    date: "",
  });

  // Filter tasks
  // const filteredTasks = tasks.filter((task) => {
  //   const searchText = filters.search.toLowerCase();
  //   const matchSearch =
  //     task.title.toLowerCase().includes(searchText) ||
  //     task.description.toLowerCase().includes(searchText) ||
  //     task.category.toLowerCase().includes(searchText);

  //   const matchCategory = task.category
  //     .toLowerCase()
  //     .includes(filters.category);
  //   const matchDate = task.date === filters.date;

  //   return matchSearch && matchCategory && matchDate;
  // });

  const handleSearch = () => {
    console.log("searched tasks");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-white border-b">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Task Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Work">Work</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-[180px]"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Add Task Form */}
          <TaskForm onSubmit={addTask} />

          {/* Task List */}
          <TaskList
            //tasks={filteredTasks}
            tasks={tasks}
            onDelete={deleteTask}
          />
        </CardContent>
      </Card>
    </div>
  );
}
