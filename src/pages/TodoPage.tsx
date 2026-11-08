import { useDeferredValue, useMemo, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { TagManager } from '../features/tags/components/TagManager'
import { TodoFilters } from '../features/todos/components/TodoFilters'
import { TodoForm } from '../features/todos/components/TodoForm'
import { TodoList } from '../features/todos/components/TodoList'
import { TodoStatsBar } from '../features/todos/components/TodoStatsBar'
import { initialFilterState, toTodoFilters, type FilterState } from '../features/todos/filterState'
import { useTags } from '../hooks/useTags'
import { useTodoStats } from '../hooks/useTodoStats'
import {
  useClearCompletedTodos,
  useCreateTodo,
  useDeleteTodo,
  useTodos,
  useUpdateTodo,
} from '../hooks/useTodos'
import type { Todo, TodoInput } from '../types/todo'
import { formatLongDate } from '../utils/date'
import styles from './TodoPage.module.css'

type EditorState = { mode: 'create' } | { mode: 'edit'; todo: Todo } | null

type PendingConfirmation = { kind: 'delete'; todo: Todo } | { kind: 'clear-completed' } | null

export function TodoPage() {
  const [todayLabel] = useState(() => formatLongDate(new Date()))
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState)
  const deferredFilterState = useDeferredValue(filterState)
  const filters = useMemo(() => toTodoFilters(deferredFilterState), [deferredFilterState])
  const [editor, setEditor] = useState<EditorState>(null)
  const [confirmation, setConfirmation] = useState<PendingConfirmation>(null)

  const todosQuery = useTodos(filters)
  const statsQuery = useTodoStats()
  const { data: tags = [] } = useTags()

  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()
  const clearCompleted = useClearCompletedTodos()

  const saveMutation = editor?.mode === 'edit' ? updateTodo : createTodo

  const closeEditor = () => {
    createTodo.reset()
    updateTodo.reset()
    setEditor(null)
  }

  const handleSave = (input: TodoInput) => {
    const options = { onSuccess: closeEditor }
    if (editor?.mode === 'edit') {
      updateTodo.mutate({ id: editor.todo.id, input }, options)
    } else {
      createTodo.mutate(input, options)
    }
  }

  const handleToggle = (todo: Todo) => {
    updateTodo.mutate({ id: todo.id, input: { isCompleted: !todo.isCompleted } })
  }

  const handleConfirm = () => {
    if (!confirmation) return
    const options = { onSuccess: () => setConfirmation(null) }
    if (confirmation.kind === 'delete') {
      deleteTodo.mutate(confirmation.todo.id, options)
    } else {
      clearCompleted.mutate(undefined, options)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Todo List</h1>
          <p className={styles.subtitle}>{todayLabel}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className="button"
            disabled={!statsQuery.data?.completed}
            onClick={() => setConfirmation({ kind: 'clear-completed' })}
          >
            Clear completed
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setEditor({ mode: 'create' })}
          >
            + New todo
          </button>
        </div>
      </header>

      {statsQuery.data && <TodoStatsBar stats={statsQuery.data} />}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <TodoFilters
            filters={filterState}
            tags={tags}
            onChange={setFilterState}
            onReset={() => setFilterState(initialFilterState)}
          />
          <TagManager />
        </aside>

        <main className={styles.main}>
          {todosQuery.isPending && <p className={styles.status}>Loading…</p>}
          {todosQuery.isError && (
            <p className="error-text" role="alert">
              Failed to load todos: {todosQuery.error.message}
            </p>
          )}
          {todosQuery.data && (
            <>
              <p className={styles.status}>
                Showing {todosQuery.data.items.length} of {todosQuery.data.total}
              </p>
              <TodoList
                todos={todosQuery.data.items}
                onToggle={handleToggle}
                onEdit={(todo) => setEditor({ mode: 'edit', todo })}
                onDelete={(todo) => setConfirmation({ kind: 'delete', todo })}
              />
            </>
          )}
        </main>
      </div>

      {editor && (
        <Modal title={editor.mode === 'edit' ? 'Edit todo' : 'New todo'} onClose={closeEditor}>
          <TodoForm
            tags={tags}
            initialTodo={editor.mode === 'edit' ? editor.todo : undefined}
            isSubmitting={saveMutation.isPending}
            errorMessage={saveMutation.error?.message}
            onSubmit={handleSave}
            onCancel={closeEditor}
          />
        </Modal>
      )}

      {confirmation && (
        <ConfirmDialog
          title={confirmation.kind === 'delete' ? 'Delete todo' : 'Clear completed'}
          message={
            confirmation.kind === 'delete'
              ? `Delete "${confirmation.todo.title}"? This cannot be undone.`
              : 'Delete all completed todos? This cannot be undone.'
          }
          confirmLabel={confirmation.kind === 'delete' ? 'Delete' : 'Clear'}
          isPending={deleteTodo.isPending || clearCompleted.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmation(null)}
        />
      )}
    </div>
  )
}
