import type { TodoStats } from '../../../types/todo'
import styles from './TodoStatsBar.module.css'

interface TodoStatsBarProps {
  stats: TodoStats
}

export function TodoStatsBar({ stats }: TodoStatsBarProps) {
  const items = [
    { label: 'Total', value: stats.total },
    { label: 'Active', value: stats.active },
    { label: 'Completed', value: stats.completed },
    { label: 'Due today', value: stats.dueToday },
    { label: 'Overdue', value: stats.overdue, isAlert: stats.overdue > 0 },
  ]
  const progress = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100)

  return (
    <section className={styles.container} aria-label="Statistics">
      <dl className={styles.stats}>
        {items.map((item) => (
          <div key={item.label} className={item.isAlert ? styles.alert : undefined}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label="Completion"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </section>
  )
}
