import type { Tag } from './tag'

export const PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const

export type Priority = (typeof PRIORITIES)[number]

export type SortField = 'due_date' | 'priority' | 'created_at'

export type SortOrder = 'asc' | 'desc'

export interface Todo {
  id: number
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  isCompleted: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface TodoInput {
  title: string
  description: string | null
  dueDate: string | null
  priority: Priority
  tagIds: number[]
}

export interface TodoFilters {
  dueDate?: string
  dueFrom?: string
  dueTo?: string
  overdue?: boolean
  isCompleted?: boolean
  priority?: Priority
  tagIds?: number[]
  search?: string
  sortBy: SortField
  order: SortOrder
}

export interface TodoPage {
  items: Todo[]
  total: number
}

export interface TodoStats {
  total: number
  completed: number
  active: number
  overdue: number
  dueToday: number
}
