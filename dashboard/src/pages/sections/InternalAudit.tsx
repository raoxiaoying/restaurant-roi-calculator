import { useApp } from '@/context/AppContext'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AlertSeverity } from '@/types'

function StatusBadge({ severity }: { severity: AlertSeverity }) {
  if (severity === 'green') return null
  return (
    <span className={`text-caption font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
      severity === 'red' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
    }`}>
      <AlertTriangle size={10} />
      {severity === 'red' ? '紧急' : '提醒'}
    </span>
  )
}


function ScoreRing({ percent, colorClass }: { percent: number; colorClass: string }) {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-gray-100"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className={colorClass}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${percent}, 100`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function InternalAudit() {
  const navigate = useNavigate()
  const { dailyData } = useApp()
  const { internalAudit } = dailyData

  const scorePercent = (internalAudit.overallScore / internalAudit.fullScore) * 100
  const scoreStatus: AlertSeverity = scorePercent >= 90 ? 'green' : scorePercent >= 75 ? 'yellow' : 'red'

  const dimNameToIdx: Record<string, number> = { '产品卡': 0, '服务卡': 1, '环境卡': 2, '食安卡': 3 }

  return (
    <div className="section-container-tertiary mb-6">
      <div className="mb-3 px-1 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        <h2 className="section-heading">巡店稽核</h2>
      </div>

      {/* Main Score Card */}
      <div className="card-elevated p-4 mb-3">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center relative">
            <ScoreRing percent={scorePercent} colorClass={scoreStatus === 'green' ? 'text-green-500' : scoreStatus === 'yellow' ? 'text-amber-500' : 'text-red-500'} />
            <span className="absolute text-metric-sm font-bold text-gray-900">{Math.round(internalAudit.overallScore)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="card-title">综合评分</h3>
              <StatusBadge severity={scoreStatus} />
            </div>
            <p className="text-caption text-gray-500 mt-1">{internalAudit.lastDate} 巡店结果</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${scoreStatus === 'green' ? 'bg-green-500' : scoreStatus === 'yellow' ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dimension Grid */}
        <div className="grid grid-cols-2 gap-3">
          {internalAudit.dimensions.map((dim, idx) => {
            const dimPercent = (dim.score / dim.fullScore) * 100
            const dimSeverity: AlertSeverity = dimPercent >= 90 ? 'green' : dimPercent >= 75 ? 'yellow' : 'red'
            return (
              <button
                key={dim.name}
                onClick={() => navigate(`/internal-audit/${dimNameToIdx[dim.name] ?? idx}`)}
                className="p-3 text-left rounded-xl border-2 border-gray-100 bg-gray-50 transition-all active:scale-[0.98] flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption font-medium text-gray-500">{dim.name}</span>
                  <div className="flex items-center gap-1">
                    {dimSeverity !== 'green' && <AlertTriangle size={10} className={dimSeverity === 'red' ? 'text-red-500' : 'text-amber-500'} />}
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-metric-sm font-bold text-gray-900">{dim.score}</span>
                  <span className="text-caption text-gray-400">/{dim.fullScore}</span>
                </div>
                {dim.change !== undefined && (
                  <span className={`text-caption font-medium ${dim.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    环比{dim.change >= 0 ? '+' : ''}{dim.change}%
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
