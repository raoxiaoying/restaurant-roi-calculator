import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function HRLabor() {
  const { dailyData } = useApp()
  const { laborDetails, laborEfficiency, laborEfficiencyTarget, laborEfficiencyAttribution: attr } = dailyData.hr
  const [showRevenueReasons, setShowRevenueReasons] = useState(false)
  const [showLaborReasons, setShowLaborReasons] = useState(false)

  const isUnder = laborEfficiency < laborEfficiencyTarget

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="人效详情" />

      {/* Summary card */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="metric-label mb-1">人效</div>
            <div className="metric-highlight text-amber-500">
              ¥{laborEfficiency.toLocaleString()}
              <span className="metric-secondary text-gray-500">/人</span>
            </div>
          </div>
          <div className="text-right">
            <div className="metric-label mb-1">目标</div>
            <div className="metric-secondary text-gray-700">¥{laborEfficiencyTarget.toLocaleString()}</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full ${isUnder ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(attr.achievementRate, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="metric-label">达成率</span>
            <span className="text-body-sm font-bold text-gray-900">
              {attr.achievementRate}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-body-sm font-semibold text-gray-900">
            <span>{attr.gapPct > 0 ? '+' : ''}{attr.gapPct}%</span>
          </div>
        </div>
      </div>

      {/* Attribution section */}
      {isUnder && (
        <>
          {/* Section title */}
          <div className="mb-3 px-1 flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h2 className="section-heading">人效归因分析</h2>
          </div>

          {/* Revenue contrib card */}
          <div className="card-elevated p-0 overflow-hidden mb-4">
            <button
              onClick={() => setShowRevenueReasons(!showRevenueReasons)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-orange-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-orange-500" />
                <span className="text-body-sm font-bold text-orange-500">营收影响</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="metric-secondary text-orange-500">{attr.revenueContribAmount < 0 ? '↓' : '↑'}¥{Math.abs(attr.revenueContribAmount).toLocaleString()}</span>
                <ChevronDown size={15} className={`text-orange-300 transition-transform ${showRevenueReasons ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className="px-4 pt-3 pb-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${attr.revenueContrib}%` }} />
              </div>
            </div>
            {showRevenueReasons && (
              <div className="px-4 pb-4 space-y-3">
                {attr.revenueReasons.map(r => (
                  <div key={r.label} className="bg-orange-50 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm text-gray-600">{r.label}</span>
                      <span className="text-body-sm font-bold text-orange-500">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-300 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Labor contrib card */}
          <div className="card-elevated p-0 overflow-hidden mb-4">
            <button
              onClick={() => setShowLaborReasons(!showLaborReasons)}
              className="w-full flex items-center justify-between px-4 py-4 border-b border-purple-50"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-purple-500" />
                <span className="text-body-sm font-bold text-purple-600">排班影响</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="metric-secondary text-purple-500">{attr.laborContribAmount < 0 ? '↓' : '↑'}¥{Math.abs(attr.laborContribAmount).toLocaleString()}</span>
                <ChevronDown size={15} className={`text-purple-300 transition-transform ${showLaborReasons ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <div className="px-4 pt-3 pb-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${attr.laborContrib}%` }} />
              </div>
            </div>
            {showLaborReasons && (
              <div className="px-4 pb-4 space-y-3">
                {attr.laborReasons.map(r => (
                  <div key={r.label} className="bg-purple-50 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-body-sm text-gray-600">{r.label}</span>
                      <span className="text-body-sm font-bold text-purple-500">{r.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-purple-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-300 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Detail Table */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">分区域 x 分餐段</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-gray-500 font-medium">区域</th>
                <th className="text-left py-3 text-gray-500 font-medium">餐段</th>
                <th className="text-right py-3 text-gray-500 font-medium">营收</th>
                <th className="text-right py-3 text-gray-500 font-medium">人数</th>
                <th className="text-right py-3 text-gray-500 font-medium">人效</th>
              </tr>
            </thead>
            <tbody>
              {laborDetails.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 text-gray-700">{item.area}</td>
                  <td className="py-3 text-gray-700">{item.period}</td>
                  <td className="py-3 text-right text-gray-700">¥{item.revenue.toLocaleString()}</td>
                  <td className="py-3 text-right text-gray-700">{item.headcount}</td>
                  <td className="py-3 text-right font-semibold text-gray-900">¥{item.efficiency.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
