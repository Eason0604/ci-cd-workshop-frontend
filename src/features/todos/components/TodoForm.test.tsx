import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Tag } from '../../../types/tag'
import { TodoForm } from './TodoForm'

const tags: Tag[] = [{ id: 1, name: 'work', color: '#2563eb' }]

describe('TodoForm', () => {
  it('submits a normalized todo input', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TodoForm tags={tags} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Title'), '  Write slides  ')
    await user.selectOptions(screen.getByLabelText('Priority'), 'high')
    await user.click(screen.getByRole('button', { name: 'work' }))
    await user.click(screen.getByRole('button', { name: 'Add todo' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Write slides',
      description: null,
      dueDate: null,
      priority: 'high',
      tagIds: [1],
    })
  })

  it('does not submit an empty title', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<TodoForm tags={tags} onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Add todo' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
