import type { Tag, TagInput } from '../types/tag'
import { request } from './client'

export const tagsApi = {
  list: () => request<Tag[]>('/tags'),
  create: (input: TagInput) => request<Tag>('/tags', { method: 'POST', body: input }),
  update: (id: number, input: Partial<TagInput>) =>
    request<Tag>(`/tags/${id}`, { method: 'PATCH', body: input }),
  remove: (id: number) => request<void>(`/tags/${id}`, { method: 'DELETE' }),
}
