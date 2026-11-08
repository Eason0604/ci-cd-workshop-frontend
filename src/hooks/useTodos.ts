import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todosApi, type TodoUpdate } from '../api/todos'
import type { TodoFilters, TodoInput } from '../types/todo'
import { queryKeys } from './queryKeys'

export function useTodos(filters: TodoFilters) {
  return useQuery({
    queryKey: queryKeys.todoList(filters),
    queryFn: () => todosApi.list(filters),
    placeholderData: (previous) => previous,
  })
}

function useInvalidateTodos() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.todos })
}

export function useCreateTodo() {
  const invalidate = useInvalidateTodos()
  return useMutation({
    mutationFn: (input: TodoInput) => todosApi.create(input),
    onSuccess: invalidate,
  })
}

export function useUpdateTodo() {
  const invalidate = useInvalidateTodos()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TodoUpdate }) => todosApi.update(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteTodo() {
  const invalidate = useInvalidateTodos()
  return useMutation({
    mutationFn: (id: number) => todosApi.remove(id),
    onSuccess: invalidate,
  })
}

export function useClearCompletedTodos() {
  const invalidate = useInvalidateTodos()
  return useMutation({
    mutationFn: () => todosApi.clearCompleted(),
    onSuccess: invalidate,
  })
}
