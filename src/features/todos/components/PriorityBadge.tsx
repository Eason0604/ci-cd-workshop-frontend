import type { Priority } from '../../../types/todo'
import { PRIORITY_LABELS } from '../priority'
import styles from './PriorityBadge.module.css'

interface PriorityBadgeProps {
  priority: Priority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <span className={`${styles.badge} ${styles[priority]}`}>{PRIORITY_LABELS[priority]}</span>
}
