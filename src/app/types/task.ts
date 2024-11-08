export interface Task {
    id: number
    title: string
    description: string
    category: string
    date: string
}

export interface TaskSearch{
    search?: string
    category?: string
    date?: string
}

export interface Users{
    id: string
    name: string
    email: string
    createdAt: string
}