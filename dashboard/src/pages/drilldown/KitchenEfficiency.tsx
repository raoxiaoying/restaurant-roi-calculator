import { useState } from 'react'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { ChevronDown } from 'lucide-react'

export function KitchenEfficiency() {
  const { dailyData } = useApp()
  const { dishes, avgPrepTime, target, timeIntervals } = dailyData.kitchen

  const sortedDishes = [...dishes].sort((a, b) => b.avgTime - a.avgTime)
  const maxTime = sortedDishes[0]?.avgTime || 1
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="出餐效率" />

      {/* Summary */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="metric-label mb-1">平均制作时长</div>
            <div className="metric-highlight text-gray-900">
              {avgPrepTime}<span className="metric-secondary text-gray-700">分钟</span>
            </div>
          </div>
          <div className="text-right">
            <div className="metric-label mb-1">目标</div>
            <div className="metric-secondary text-gray-700">≤{target}分钟</div>
          </div>
        </div>
      </div>

      {/* Time Interval Cards */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">时间区间订单分布</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {timeIntervals.map((interval, idx) => {
            const CARD_COLORS = [
              { bg: 'bg-green-50', title: 'text-green-700', pct: 'text-green-600' },
              { bg: 'bg-teal-50', title: 'text-teal-700', pct: 'text-teal-600' },
              { bg: 'bg-blue-50', title: 'text-blue-700', pct: 'text-blue-600' },
              { bg: 'bg-amber-50', title: 'text-amber-700', pct: 'text-amber-500' },
              { bg: 'bg-orange-50', title: 'text-orange-700', pct: 'text-orange-500' },
              { bg: 'bg-red-50', title: 'text-gray-700', pct: 'text-gray-900' },
            ]
            const c = CARD_COLORS[idx % CARD_COLORS.length]
            return (
              <div key={interval.period} className={`${c.bg} rounded-xl px-3 py-2.5`}>
                <div className={`text-caption font-semibold ${c.title} mb-2`}>{interval.period}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="metric-label">订单数</span>
                    <span className="text-body-sm font-bold text-gray-900">{interval.orders.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="metric-label">总订单数</span>
                    <span className="metric-label">{interval.totalOrders.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="metric-label">占比</span>
                    <span className={`text-caption font-semibold ${c.pct}`}>{interval.percentage}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dish List */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">各菜品制作时长</h2>
        </div>
        <div className="metric-label mb-4">按平均时长倒序排列，点击查看时间分布</div>
        <div className="space-y-3">
          {sortedDishes.map((dish) => (
            <div key={dish.name} className="card-standard p-3">
              <button
                onClick={() => dish.timePeriods && setExpanded(expanded === dish.name ? null : dish.name)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm text-gray-900 font-medium">{dish.name}</span>
                    <span className="metric-label bg-gray-50 px-2 py-0.5 rounded-full">{dish.counter}</span>
                    {dish.timePeriods && (
                      <ChevronDown size={12} className={`text-gray-400 transition-transform ${expanded === dish.name ? 'rotate-180' : ''}`} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-gray-900">
                      {dish.avgTime}分钟
                    </span>
                    <span className="metric-label">{dish.orderCount}单</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${dish.avgTime > target ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${(dish.avgTime / maxTime) * 100}%` }}
                  />
                </div>
              </button>
              {expanded === dish.name && dish.timePeriods && (
                <div className="mt-2 card-standard p-3">
                  {/* Table Header */}
                  <div className="flex items-center justify-between metric-label pb-1.5 mb-1 border-b border-gray-100">
                    <span className="w-20">时间区间</span>
                    <span className="w-14 text-right">订单数</span>
                    <span className="w-14 text-right">总订单数</span>
                    <span className="w-20 text-right">占比</span>
                  </div>
                  {dish.timePeriods.map(tp => {
                    const isOver = tp.period === '25分钟以上'
                    return (
                      <div key={tp.period} className={`flex items-center justify-between py-1.5 ${isOver ? 'bg-red-50 -mx-3 px-3 rounded' : ''}`}>
                        <span className="text-caption w-20 text-gray-900">{tp.period}</span>
                        <span className="text-caption font-medium text-gray-700 w-14 text-right">{tp.orders > 0 ? tp.orders : '–'}</span>
                        <span className="metric-label w-14 text-right">{tp.totalOrders}</span>
                        <div className="w-20 flex items-center justify-end gap-1">
                          {tp.percentage > 0 && (
                            <div className="w-10 h-2.5 bg-gray-200 rounded overflow-hidden">
                              <div className="h-full bg-blue-500 rounded" style={{ width: `${tp.percentage}%` }} />
                            </div>
                          )}
                          <span className="metric-label w-10 text-right">{tp.percentage > 0 ? `${tp.percentage}%` : '–'}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
