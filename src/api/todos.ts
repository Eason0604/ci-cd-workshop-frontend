import type { Tag } from '../types/tag'
import type { Priority, Todo, TodoFilters, TodoInput, TodoPage, TodoStats } from '../types/todo'
import { request } from './client'

interface TodoResponse {
  id: number
  title: string
  description: string | null
  due_date: string | null
  priority: Priority
  is_completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
  tags: Tag[]
}

interface TodoStatsResponse {
  total: number
  completed: number
  active: number
  overdue: number
  due_today: number
}

export type TodoUpdate = Partial<TodoInput> & { isCompleted?: boolean }

function toTodo(response: TodoResponse): Todo {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    dueDate: response.due_date,
    priority: response.priority,
    isCompleted: response.is_completed,
    completedAt: response.completed_at,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    tags: response.tags,
  }
}

function toRequestBody(input: TodoUpdate) {
  const body = {
    title: input.title,
    description: input.description,
    due_date: input.dueDate,
    priority: input.priority,
    tag_ids: input.tagIds,
    is_completed: input.isCompleted,
  }
  return Object.fromEntries(Object.entries(body).filter(([, value]) => value !== undefined))
}

function toQuery(filters: TodoFilters) {
  return {
    due_date: filters.dueDate,
    due_from: filters.dueFrom,
    due_to: filters.dueTo,
    overdue: filters.overdue,
    is_completed: filters.isCompleted,
    priority: filters.priority,
    tag_ids: filters.tagIds,
    search: filters.search,
    sort_by: filters.sortBy,
    order: filters.order,
    limit: 200,
  }
}

export const todosApi = {
  list: async (filters: TodoFilters): Promise<TodoPage> => {
    const page = await request<{ items: TodoResponse[]; total: number }>('/todos', {
      query: toQuery(filters),
    })
    return { items: page.items.map(toTodo), total: page.total }
  },
  stats: async (): Promise<TodoStats> => {
    const stats = await request<TodoStatsResponse>('/todos/stats')
    return { ...stats, dueToday: stats.due_today }
  },
  create: async (input: TodoInput) =>
    toTodo(await request<TodoResponse>('/todos', { method: 'POST', body: toRequestBody(input) })),
  update: async (id: number, input: TodoUpdate) =>
    toTodo(
      await request<TodoResponse>(`/todos/${id}`, { method: 'PATCH', body: toRequestBody(input) }),
    ),
  remove: (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' }),
  clearCompleted: () => request<{ deleted: number }>('/todos/completed', { method: 'DELETE' }),
}
