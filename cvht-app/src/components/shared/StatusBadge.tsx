import { cn, statusColor, statusLabel } from '../../lib/utils'
import type { StudentStatus } from '../../types'

interface BadgeProps {
  status: StudentStatus
  className?: string
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusColor(status),
      className
    )}>
      {statusLabel(status)}
    </span>
  )
}

interface GpaBadgeProps {
  gpa: number
  className?: string
}

export function GpaBadge({ gpa, className }: GpaBadgeProps) {
  const color = gpa >= 3.5 ? 'bg-green-100 text-green-800'
    : gpa >= 2.5 ? 'bg-blue-100 text-blue-800'
    : gpa >= 2.0 ? 'bg-yellow-100 text-yellow-800'
    : gpa >= 1.0 ? 'bg-orange-100 text-orange-800'
    : 'bg-red-100 text-red-800'

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold',
      color,
      className
    )}>
      {gpa.toFixed(2)}
    </span>
  )
}
