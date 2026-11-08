import type { TodoFilters } from '../types/todo'

export const queryKeys = {
  todos: ['todos'] as const,
  todoList: (filters: TodoFilters) => ['todos', 'list', filters] as const,
  todoStats: ['todos', 'stats'] as const,
  tags: ['tags'] as const,
}
