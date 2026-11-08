import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from '../api/tags'
import type { TagInput } from '../types/tag'
import { queryKeys } from './queryKeys'

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: tagsApi.list,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TagInput) => tagsApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tags }),
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tagsApi.remove(id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tags }),
        queryClient.invalidateQueries({ queryKey: queryKeys.todos }),
      ]),
  })
}
