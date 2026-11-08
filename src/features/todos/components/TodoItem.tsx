import type { Todo } from '../../../types/todo'
import { formatDate, isOverdue } from '../../../utils/date'
import { TagBadge } from '../../tags/components/TagBadge'
import { PriorityBadge } from './PriorityBadge'
import styles from './TodoItem.module.css'

interface TodoItemProps {
  todo: Todo
  onToggle: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const overdue = isOverdue(todo.dueDate, todo.isCompleted)
  const classNames = [styles.item, todo.isCompleted && styles.completed, overdue && styles.overdue]

  return (
    <li className={classNames.filter(Boolean).join(' ')}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={todo.isCompleted}
        aria-label={`Mark "${todo.title}" as ${todo.isCompleted ? 'active' : 'completed'}`}
        onChange={() => onToggle(todo)}
      />
      <div className={styles.content}>
        <div className={styles.heading}>
          <span className={styles.title}>{todo.title}</span>
          <PriorityBadge priority={todo.priority} />
        </div>
        {todo.description && <p className={styles.description}>{todo.description}</p>}
        <div className={styles.meta}>
          {todo.dueDate && (
            <span className={styles.dueDate}>
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(todo.dueDate)}
            </span>
          )}
          {todo.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      </div>
      <div className={styles.actions}>
        <button type="button" className="button button-ghost" onClick={() => onEdit(todo)}>
          Edit
        </button>
        <button
          type="button"
          className={`button button-ghost ${styles.deleteButton}`}
          onClick={() => onDelete(todo)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
