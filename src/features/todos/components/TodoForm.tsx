import { useState, type FormEvent } from 'react'
import type { Tag } from '../../../types/tag'
import { PRIORITIES, type Todo, type TodoInput } from '../../../types/todo'
import { TagSelector } from '../../tags/components/TagSelector'
import { PRIORITY_LABELS } from '../priority'
import styles from './TodoForm.module.css'

interface TodoFormProps {
  tags: Tag[]
  initialTodo?: Todo
  isSubmitting?: boolean
  errorMessage?: string
  onSubmit: (input: TodoInput) => void
  onCancel: () => void
}

function toInitialInput(todo?: Todo): TodoInput {
  return {
    title: todo?.title ?? '',
    description: todo?.description ?? '',
    dueDate: todo?.dueDate ?? '',
    priority: todo?.priority ?? 'medium',
    tagIds: todo?.tags.map((tag) => tag.id) ?? [],
  }
}

export function TodoForm({
  tags,
  initialTodo,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: TodoFormProps) {
  const [input, setInput] = useState<TodoInput>(() => toInitialInput(initialTodo))

  const update = <K extends keyof TodoInput>(key: K, value: TodoInput[K]) => {
    setInput((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const title = input.title.trim()
    if (!title) return
    onSubmit({
      ...input,
      title,
      description: input.description?.trim() || null,
      dueDate: input.dueDate || null,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Title
        <input
          required
          autoFocus
          maxLength={200}
          value={input.title}
          onChange={(event) => update('title', event.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          rows={3}
          value={input.description ?? ''}
          onChange={(event) => update('description', event.target.value)}
        />
      </label>
      <div className={styles.row}>
        <label>
          Due date
          <input
            type="date"
            value={input.dueDate ?? ''}
            onChange={(event) => update('dueDate', event.target.value)}
          />
        </label>
        <label>
          Priority
          <select
            value={input.priority}
            onChange={(event) => update('priority', event.target.value as TodoInput['priority'])}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className={styles.fieldset}>
        <legend>Tags</legend>
        <TagSelector
          tags={tags}
          selectedIds={input.tagIds}
          onChange={(tagIds) => update('tagIds', tagIds)}
        />
      </fieldset>
      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <div className={styles.actions}>
        <button type="button" className="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {initialTodo ? 'Save' : 'Add todo'}
        </button>
      </div>
    </form>
  )
}
