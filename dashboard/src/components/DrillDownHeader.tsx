import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

interface DrillDownHeaderProps {
  title: string
  summary?: string
}

export function DrillDownHeader({ title, summary }: DrillDownHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-50 bg-gradient-header text-white px-4 pt-14 pb-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 -ml-1 rounded-xl hover:bg-white/10 active:bg-white/20">
          <ChevronLeft size={22} />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {summary && <p className="text-white/70 text-xs mt-0.5">{summary}</p>}
        </div>
      </div>
    </div>
  )
}
