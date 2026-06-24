import { useState } from 'react'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { ChevronDown } from 'lucide-react'

export function AuditReturns() {
  const { dailyData } = useApp()
  const { returnsTotal, returnsDetails, returnsDishes } = dailyData.audit
  const sorted = [...returnsDetails].sort((a, b) => b.percentage - a.percentage)
  const sortedDishes = [...returnsDishes].sort((a, b) => b.percentage - a.percentage)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="退菜详情" />

      {/* Section 1: Reason Analysis */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">原因分析</h2>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <h2 className="card-title">退菜金额</h2>
          <span className="metric-secondary">¥{returnsTotal}</span>
        </div>

        {/* Column Header */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
          <span className="metric-label pl-7">原因</span>
          <div className="flex items-center gap-3">
            <span className="metric-label">影响金额</span>
            <span className="metric-label w-12 text-right">占比</span>
          </div>
        </div>

        <div className="space-y-0">
          {sorted.map((item, idx) => (
            <div key={item.reason}>
              <button
                onClick={() => item.timePeriods && setExpanded(expanded === item.reason ? null : item.reason)}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-gray-400 w-5">{idx + 1}</span>
                  <span className="text-body-sm text-gray-700 font-medium">{item.reason}</span>
                  {item.timePeriods && (
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${expanded === item.reason ? 'rotate-180' : ''}`} />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-body-sm font-semibold text-gray-900">¥{item.amount}</span>
                  <span className="metric-label w-12 text-right">{item.percentage}%</span>
                </div>
              </button>

              {expanded === item.reason && item.timePeriods && (
                <div className="ml-7 mr-1 mb-2 card-standard p-3 space-y-1.5">
                  <div className="flex items-center justify-between metric-label pb-1 border-b border-gray-100">
                    <span>时间区间</span>
                    <div className="flex gap-4">
                      <span>金额</span>
                      <span className="w-10 text-right">占比</span>
                    </div>
                  </div>
                  {item.timePeriods.map(tp => (
                    <div key={tp.period} className="flex items-center justify-between">
                      <span className="text-caption text-gray-600">{tp.period}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-caption font-medium text-gray-700">¥{tp.amount}</span>
                        <span className="metric-label w-10 text-right">{tp.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Dish Statistics */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">菜品统计</h2>
        </div>

        {/* Column Header */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
          <span className="metric-label pl-7">菜品</span>
          <div className="flex items-center gap-3">
            <span className="metric-label">次数</span>
            <span className="metric-label">金额</span>
            <span className="metric-label w-12 text-right">占比</span>
          </div>
        </div>

        <div className="space-y-0">
          {sortedDishes.map((item, idx) => (
            <div key={item.dishName} className="py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-gray-400 w-5">{idx + 1}</span>
                  <span className="text-body-sm text-gray-700 font-medium">{item.dishName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-body-sm text-gray-500">{item.count}次</span>
                  <span className="text-body-sm font-semibold text-gray-900">¥{item.amount}</span>
                  <span className="metric-label w-12 text-right">{item.percentage}%</span>
                </div>
              </div>
              <div className="ml-7 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
