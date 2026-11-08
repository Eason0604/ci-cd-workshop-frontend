import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Todo } from '../../../types/todo'
import { TodoItem } from './TodoItem'

const baseTodo: Todo = {
  id: 1,
  title: 'Prepare workshop',
  description: 'Slides and demo',
  dueDate: '2000-01-01',
  priority: 'urgent',
  isCompleted: false,
  completedAt: null,
  createdAt: '2000-01-01T00:00:00Z',
  updatedAt: '2000-01-01T00:00:00Z',
  tags: [{ id: 1, name: 'work', color: '#2563eb' }],
}

function renderItem(todo: Todo = baseTodo) {
  const handlers = { onToggle: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() }
  render(<TodoItem todo={todo} {...handlers} />)
  return handlers
}

describe('TodoItem', () => {
  it('renders todo details', () => {
    renderItem()

    expect(screen.getByText('Prepare workshop')).toBeInTheDocument()
    expect(screen.getByText('Urgent')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText(/Overdue/)).toBeInTheDocument()
  })

  it('does not flag completed todos as overdue', () => {
    renderItem({ ...baseTodo, isCompleted: true })

    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument()
  })

  it('calls handlers for toggle, edit and delete', async () => {
    const user = userEvent.setup()
    const handlers = renderItem()

    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    expect(handlers.onToggle).toHaveBeenCalledWith(baseTodo)
    expect(handlers.onEdit).toHaveBeenCalledWith(baseTodo)
    expect(handlers.onDelete).toHaveBeenCalledWith(baseTodo)
  })
})
