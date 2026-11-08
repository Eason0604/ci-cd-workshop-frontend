import type { Tag } from '../../../types/tag'
import styles from './TagBadge.module.css'

interface TagBadgeProps {
  tag: Tag
}

export function TagBadge({ tag }: TagBadgeProps) {
  return (
    <span className={styles.badge} style={{ borderColor: tag.color, color: tag.color }}>
      <span className={styles.dot} style={{ background: tag.color }} />
      {tag.name}
    </span>
  )
}
