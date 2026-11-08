import type { Tag } from '../../../types/tag'
import styles from './TagSelector.module.css'

interface TagSelectorProps {
  tags: Tag[]
  selectedIds: number[]
  onChange: (selectedIds: number[]) => void
}

export function TagSelector({ tags, selectedIds, onChange }: TagSelectorProps) {
  if (tags.length === 0) {
    return <p className={styles.empty}>No tags yet</p>
  }

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <div className={styles.list}>
      {tags.map((tag) => {
        const isSelected = selectedIds.includes(tag.id)
        return (
          <button
            key={tag.id}
            type="button"
            className={styles.chip}
            aria-pressed={isSelected}
            style={isSelected ? { background: tag.color, borderColor: tag.color } : undefined}
            onClick={() => toggle(tag.id)}
          >
            {tag.name}
          </button>
        )
      })}
    </div>
  )
}
