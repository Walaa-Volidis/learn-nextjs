export interface Task {
    id: string
    title: string
    description: string
    category: string
    date: string
}

export interface TaskSearch{
    title?: string
    category?: string
    description?: string
    date?: string
}