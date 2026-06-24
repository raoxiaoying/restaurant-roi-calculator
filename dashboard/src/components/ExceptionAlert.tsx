import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ExceptionModule {
  id: string
  name: string
  desc: string
  severity: 'warning' | 'danger' // warning=橙色, danger=红色
}

interface ExceptionAlertProps {
  modules: ExceptionModule[]
}

export function ExceptionAlert({ modules }: ExceptionAlertProps) {
  const [expanded, setExpanded] = useState(false)
  const exceptionCount = modules.length

  if (exceptionCount === 0) {
    return null
  }

  return (
    <div className="px-4 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="exception-banner w-full"
      >
        <div className="exception-banner-left">
          <div className="exception-banner-icon">⚠️</div>
          <div className="exception-banner-content">
            <div className="exception-banner-title">
              {exceptionCount}项指标需要关注
            </div>
            <div className="exception-banner-subtitle">
              涉及{new Set(modules.map(m => m.id.split('-')[0])).size}个模块
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="exception-banner-count">
            {exceptionCount}
          </div>
          <div className="text-gray-400">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 mb-3">
          {modules.map((module) => (
            <div key={module.id} className="exception-module-item tap-card">
              <div className="exception-module-left">
                <div className={`exception-dot ${
                  module.severity === 'danger' 
                    ? 'exception-dot-danger' 
                    : 'exception-dot-warning'
                }`} />
                <div>
                  <div className="exception-module-title">{module.name}</div>
                  <div className="exception-module-desc">{module.desc}</div>
                </div>
              </div>
              <div className="exception-module-arrow">›</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
