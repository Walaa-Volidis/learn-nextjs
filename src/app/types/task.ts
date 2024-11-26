export interface Task {
  title: string;
  description: string;
  category: string;
  date: string;
  userId: string;
}

export interface TaskWithId extends Task {
  id: string;
}

export interface TaskSearch {
  search?: string;
  category?: string;
  date?: string;
}
