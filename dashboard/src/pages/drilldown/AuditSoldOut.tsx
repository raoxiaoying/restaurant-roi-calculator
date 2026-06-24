import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'

export function AuditSoldOut() {
  const { dailyData } = useApp()
  const { rate, rateMoM, trend, dishes } = dailyData.soldOut

  const sortedDishes = [...dishes].sort((a, b) => b.count - a.count)
  const avg = Math.round(trend.reduce((s, d) => s + d.rate, 0) / trend.length * 10) / 10

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="沽清率详情" />

      {/* Section 1: Overview */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">沽清率概览</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center mb-4">
          <div>
            <div className="metric-label mb-1">沽清率</div>
            <div className="metric-highlight text-gray-900">
              {rate}<span className="metric-secondary text-gray-500">%</span>
            </div>
          </div>
          <div>
            <div className="metric-label mb-1">环比变化</div>
            <div className={`flex items-center justify-center gap-1 metric-highlight ${
              rateMoM > 0 ? 'text-red-500' : rateMoM < 0 ? 'text-green-600' : 'text-gray-500'
            }`}>
              {rateMoM > 0 && <TrendingUp size={14} />}
              {rateMoM < 0 && <TrendingDown size={14} />}
              {rateMoM === 0 && <Minus size={14} />}
              {rateMoM > 0 ? `+${rateMoM}` : rateMoM}%
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Trend Chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">沽清趋势</h2>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                content={(props: any) => {
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        {payload[0].value}%
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#f97316', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Dish Sold-out Count Table */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">菜品沽清次数统计</h2>
        </div>
        <div className="metric-label mb-3">按沽清次数倒序</div>

        {/* Table Header */}
        <div className="grid grid-cols-[1fr_64px_72px] gap-2 px-3 py-2 bg-gray-50 rounded-t-lg">
          <span className="text-caption font-semibold text-gray-500">菜品名称</span>
          <span className="text-caption font-semibold text-gray-500 text-center">沽清次数</span>
          <span className="text-caption font-semibold text-gray-500 text-right">环比</span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-100">
          {sortedDishes.map((dish, idx) => (
            <div
              key={dish.dishName}
              className="grid grid-cols-[1fr_64px_72px] gap-2 px-3 py-2.5 items-center"
            >
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-caption font-bold text-white ${
                  idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-amber-500' : 'bg-gray-400'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-body-sm text-gray-900 font-medium truncate">{dish.dishName}</span>
              </div>
              <span className="text-body-sm font-bold text-gray-900 text-center">{dish.count}</span>
              <span className={`flex items-center justify-end gap-0.5 text-caption font-medium ${
                dish.countMoM > 0 ? 'text-red-500' : dish.countMoM < 0 ? 'text-green-600' : 'text-gray-500'
              }`}>
                {dish.countMoM > 0 && <TrendingUp size={10} />}
                {dish.countMoM < 0 && <TrendingDown size={10} />}
                {dish.countMoM === 0 && <Minus size={10} />}
                {dish.countMoM > 0 ? `+${dish.countMoM}` : dish.countMoM === 0 ? '-' : `${dish.countMoM}`}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
