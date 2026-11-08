import { currentWeekRange, isOverdue, toIsoDate } from './date'

describe('toIsoDate', () => {
  it('formats a date as yyyy-mm-dd', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})

describe('currentWeekRange', () => {
  it('returns monday to sunday of the reference week', () => {
    expect(currentWeekRange(new Date(2026, 10, 8))).toEqual({
      from: '2026-11-02',
      to: '2026-11-08',
    })
  })
})

describe('isOverdue', () => {
  it('is true for past incomplete todos', () => {
    expect(isOverdue('2026-01-01', false, '2026-01-02')).toBe(true)
  })

  it('is false for completed todos', () => {
    expect(isOverdue('2026-01-01', true, '2026-01-02')).toBe(false)
  })

  it('is false without a due date', () => {
    expect(isOverdue(null, false, '2026-01-02')).toBe(false)
  })
})
