import { useState, type FormEvent } from 'react'
import { ConfirmDialog } from '../../../components/ConfirmDialog'
import { useCreateTag, useDeleteTag, useTags } from '../../../hooks/useTags'
import type { Tag } from '../../../types/tag'
import { TagBadge } from './TagBadge'
import styles from './TagManager.module.css'

const DEFAULT_COLOR = '#2563eb'

export function TagManager() {
  const { data: tags = [] } = useTags()
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()
  const [name, setName] = useState('')
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    createTag.mutate({ name: trimmedName, color }, { onSuccess: () => setName('') })
  }

  const confirmDelete = () => {
    if (!tagToDelete) return
    deleteTag.mutate(tagToDelete.id, { onSuccess: () => setTagToDelete(null) })
  }

  return (
    <section className={styles.panel} aria-labelledby="tag-manager-title">
      <h2 id="tag-manager-title" className={styles.title}>
        Tags
      </h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          aria-label="Tag name"
          placeholder="New tag"
          maxLength={50}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          type="color"
          aria-label="Tag color"
          value={color}
          onChange={(event) => setColor(event.target.value)}
        />
        <button type="submit" className="button" disabled={createTag.isPending}>
          Add
        </button>
      </form>
      {createTag.error && <p className="error-text">{createTag.error.message}</p>}
      <ul className={styles.list}>
        {tags.map((tag) => (
          <li key={tag.id} className={styles.item}>
            <TagBadge tag={tag} />
            <button
              type="button"
              className="button button-ghost"
              aria-label={`Delete tag ${tag.name}`}
              onClick={() => setTagToDelete(tag)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      {tagToDelete && (
        <ConfirmDialog
          title="Delete tag"
          message={`Delete "${tagToDelete.name}"? It will be removed from all todos.`}
          isPending={deleteTag.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setTagToDelete(null)}
        />
      )}
    </section>
  )
}
