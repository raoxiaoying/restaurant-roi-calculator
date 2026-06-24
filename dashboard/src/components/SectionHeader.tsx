import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  action?: { label: string; onClick: () => void }
  icon?: ReactNode
  className?: string
}

export function SectionHeader({ title, action, icon, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-heading">{title}</h2>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-0.5 text-label text-primary font-medium"
        >
          {action.label}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  )
}
