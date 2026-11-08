import { initialFilterState, toTodoFilters } from './filterState'

const reference = new Date(2026, 10, 8)

describe('toTodoFilters', () => {
  it('returns only sorting for the initial state', () => {
    expect(toTodoFilters(initialFilterState, reference)).toEqual({
      isCompleted: undefined,
      priority: undefined,
      tagIds: undefined,
      search: undefined,
      sortBy: 'created_at',
      order: 'desc',
    })
  })

  it('maps today to an exact due date', () => {
    const filters = toTodoFilters({ ...initialFilterState, dateMode: 'today' }, reference)
    expect(filters.dueDate).toBe('2026-11-08')
  })

  it('maps week to a monday-sunday range', () => {
    const filters = toTodoFilters({ ...initialFilterState, dateMode: 'week' }, reference)
    expect(filters).toMatchObject({ dueFrom: '2026-11-02', dueTo: '2026-11-08' })
  })

  it('maps a custom range and ignores empty bounds', () => {
    const filters = toTodoFilters(
      { ...initialFilterState, dateMode: 'range', dateFrom: '2026-11-01', dateTo: '' },
      reference,
    )
    expect(filters).toMatchObject({ dueFrom: '2026-11-01', dueTo: undefined })
  })

  it('maps status, priority, tags and search', () => {
    const filters = toTodoFilters(
      {
        ...initialFilterState,
        status: 'completed',
        priority: 'high',
        tagIds: [1, 2],
        search: '  report ',
      },
      reference,
    )
    expect(filters).toMatchObject({
      isCompleted: true,
      priority: 'high',
      tagIds: [1, 2],
      search: 'report',
    })
  })
})
