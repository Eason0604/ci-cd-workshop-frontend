import { useQuery } from '@tanstack/react-query'
import { todosApi } from '../api/todos'
import { queryKeys } from './queryKeys'

export function useTodoStats() {
  return useQuery({
    queryKey: queryKeys.todoStats,
    queryFn: todosApi.stats,
  })
}
