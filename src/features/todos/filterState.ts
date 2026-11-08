import type { Priority, SortField, SortOrder, TodoFilters } from '../../types/todo'
import { currentWeekRange, toIsoDate } from '../../utils/date'

export type DateFilterMode = 'all' | 'today' | 'week' | 'overdue' | 'date' | 'range'

export type StatusFilter = 'all' | 'active' | 'completed'

export interface FilterState {
  dateMode: DateFilterMode
  date: string
  dateFrom: string
  dateTo: string
  status: StatusFilter
  priority: Priority | 'all'
  tagIds: number[]
  search: string
  sortBy: SortField
  order: SortOrder
}

export const initialFilterState: FilterState = {
  dateMode: 'all',
  date: '',
  dateFrom: '',
  dateTo: '',
  status: 'all',
  priority: 'all',
  tagIds: [],
  search: '',
  sortBy: 'created_at',
  order: 'desc',
}

const STATUS_TO_COMPLETED: Record<StatusFilter, boolean | undefined> = {
  all: undefined,
  active: false,
  completed: true,
}

function toDateFilters(state: FilterState, reference: Date): Partial<TodoFilters> {
  switch (state.dateMode) {
    case 'today':
      return { dueDate: toIsoDate(reference) }
    case 'week': {
      const { from, to } = currentWeekRange(reference)
      return { dueFrom: from, dueTo: to }
    }
    case 'overdue':
      return { overdue: true }
    case 'date':
      return { dueDate: state.date || undefined }
    case 'range':
      return { dueFrom: state.dateFrom || undefined, dueTo: state.dateTo || undefined }
    case 'all':
      return {}
  }
}

export function toTodoFilters(state: FilterState, reference: Date = new Date()): TodoFilters {
  return {
    ...toDateFilters(state, reference),
    isCompleted: STATUS_TO_COMPLETED[state.status],
    priority: state.priority === 'all' ? undefined : state.priority,
    tagIds: state.tagIds.length > 0 ? state.tagIds : undefined,
    search: state.search.trim() || undefined,
    sortBy: state.sortBy,
    order: state.order,
  }
}
