import type { Tag } from '../../../types/tag'
import { PRIORITIES, type SortField } from '../../../types/todo'
import { TagSelector } from '../../tags/components/TagSelector'
import type { DateFilterMode, FilterState, StatusFilter } from '../filterState'
import { PRIORITY_LABELS } from '../priority'
import styles from './TodoFilters.module.css'

const DATE_MODES: { value: DateFilterMode; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'date', label: 'Pick date' },
  { value: 'range', label: 'Date range' },
]

const STATUSES: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

const SORT_FIELDS: { value: SortField; label: string }[] = [
  { value: 'created_at', label: 'Created' },
  { value: 'due_date', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
]

interface TodoFiltersProps {
  filters: FilterState
  tags: Tag[]
  onChange: (filters: FilterState) => void
  onReset: () => void
}

export function TodoFilters({ filters, tags, onChange, onReset }: TodoFiltersProps) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <section className={styles.panel} aria-label="Filters">
      <input
        type="search"
        aria-label="Search todos"
        placeholder="Search title or description"
        value={filters.search}
        onChange={(event) => update('search', event.target.value)}
      />

      <div className={styles.segmented} role="group" aria-label="Due date filter">
        {DATE_MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            aria-pressed={filters.dateMode === mode.value}
            onClick={() => update('dateMode', mode.value)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {filters.dateMode === 'date' && (
        <label>
          Due on
          <input
            type="date"
            value={filters.date}
            onChange={(event) => update('date', event.target.value)}
          />
        </label>
      )}

      {filters.dateMode === 'range' && (
        <div className={styles.range}>
          <label>
            From
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => update('dateFrom', event.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={filters.dateTo}
              onChange={(event) => update('dateTo', event.target.value)}
            />
          </label>
        </div>
      )}

      <div className={styles.row}>
        <label>
          Status
          <select
            value={filters.status}
            onChange={(event) => update('status', event.target.value as StatusFilter)}
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Priority
          <select
            value={filters.priority}
            onChange={(event) => update('priority', event.target.value as FilterState['priority'])}
          >
            <option value="all">All</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Sort by
          <select
            value={filters.sortBy}
            onChange={(event) => update('sortBy', event.target.value as SortField)}
          >
            {SORT_FIELDS.map((field) => (
              <option key={field.value} value={field.value}>
                {field.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Order
          <select
            value={filters.order}
            onChange={(event) => update('order', event.target.value as FilterState['order'])}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </div>

      <fieldset className={styles.fieldset}>
        <legend>Tags</legend>
        <TagSelector
          tags={tags}
          selectedIds={filters.tagIds}
          onChange={(tagIds) => update('tagIds', tagIds)}
        />
      </fieldset>

      <button type="button" className={styles.reset} onClick={onReset}>
        Reset filters
      </button>
    </section>
  )
}
