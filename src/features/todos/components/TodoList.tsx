import { EmptyState } from '../../../components/EmptyState'
import type { Todo } from '../../../types/todo'
import { TodoItem } from './TodoItem'
import styles from './TodoList.module.css'

interface TodoListProps {
  todos: Todo[]
  onToggle: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  onDelete: (todo: Todo) => void
}

export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState title="No todos found" description="Add a todo or adjust your filters." />
  }

  return (
    <ul className={styles.list}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
