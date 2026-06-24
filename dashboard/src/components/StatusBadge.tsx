import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger'
  children: ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const variants = {
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
  }

  return (
    <span className={cn("status-badge", variants[status], className)}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === 'success' && "bg-success",
        status === 'warning' && "bg-warning",
        status === 'danger' && "bg-danger"
      )} />
      {children}
    </span>
  )
}
