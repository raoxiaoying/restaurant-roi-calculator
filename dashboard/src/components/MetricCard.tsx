import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: { value: number; label: string }
  status?: 'success' | 'warning' | 'danger' | 'neutral'
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  status = 'neutral',
  icon,
  onClick,
  className,
}: MetricCardProps) {
  const statusColors = {
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning',
    danger: 'border-l-4 border-l-danger',
    neutral: '',
  }

  return (
    <div
      className={cn(
        "metric-card",
        statusColors[status],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-label text-muted-foreground">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-metric-sm text-foreground">{value}</span>
        {unit && <span className="text-label text-muted-foreground">{unit}</span>}
      </div>
      {trend && (
        <div className="flex items-center justify-between mt-2">
          <span className={cn(
            "text-xs font-medium",
            trend.value >= 0 ? "text-success" : "text-danger"
          )}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-[0.6875rem] text-muted-foreground">{trend.label}</span>
        </div>
      )}
      {onClick && (
        <div className="flex justify-end mt-1">
          <ChevronRight size={14} className="drill-down-indicator" />
        </div>
      )}
    </div>
  )
}
