import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, Tooltip } from 'recharts'

const AREA_COLORS: Record<string, { bg: string; text: string; bar: string; header: string }> = {
  前厅: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500', header: 'bg-blue-500' },
  后厨: { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500', header: 'bg-orange-500' },
}

export function HRTurnover() {
  const { dailyData, periodMode } = useApp()
  const { turnoverRate, turnoverChange, turnoverByPosition, turnoverTrend } = dailyData.hr

  const areas = [...new Set(turnoverByPosition.map(p => p.area))]
  const totalHeadcount = turnoverByPosition.reduce((s, p) => s + p.headcount, 0)

  const periodLabel = periodMode === 'week' ? '近10周' : periodMode === 'month' ? '近12月' : '近15日'
  const avg = Math.round(turnoverTrend.reduce((s, d) => s + d.rate, 0) / turnoverTrend.length * 10) / 10

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader
        title="离职率详情"
      />

      {/* Section 1: Overall Turnover Overview */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">离职率概览</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center mb-5">
          <div>
            <div className="metric-label mb-1">整体离职率</div>
            <div className="metric-highlight text-gray-900">
              {turnoverRate}
              <span className="metric-secondary text-gray-500">%</span>
            </div>
          </div>
          <div>
            <div className="metric-label mb-1">在职人数</div>
            <div className="metric-highlight text-gray-900">{totalHeadcount}</div>
          </div>
          <div>
            <div className="metric-label mb-1">环比变化</div>
            <div className={`flex items-center justify-center gap-1 metric-highlight ${
              turnoverChange > 0 ? 'text-red-500' : turnoverChange < 0 ? 'text-green-600' : 'text-gray-500'
            }`}>
              {turnoverChange > 0 ? `+${turnoverChange}` : turnoverChange === 0 ? '0' : turnoverChange}
              <span className="metric-secondary text-caption font-normal">ppt</span>
              {turnoverChange > 0 && <TrendingUp size={14} />}
              {turnoverChange < 0 && <TrendingDown size={14} />}
              {turnoverChange === 0 && <Minus size={14} />}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between metric-label mb-2">
            <span>离职率</span>
            <span className={`font-medium ${turnoverRate > 10 ? 'text-red-500' : 'text-green-600'}`}>
              {turnoverRate > 10 ? '超标' : '达标'} · 目标 ≤10%
            </span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${turnoverRate > 10 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(turnoverRate * 5, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Trend Chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">{periodLabel}离职率趋势</h2>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={turnoverTrend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
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
              <ReferenceLine y={10} stroke="#10b981" strokeDasharray="4 4"
                label={{ value: '目标10%', position: 'right', fontSize: 10, fill: '#10b981' }} />
              <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="4 4"
                label={{ value: `均${avg}%`, position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Position Breakdown */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">分岗位离职率</h2>
        </div>

        {areas.map(area => {
          const positions = turnoverByPosition.filter(p => p.area === area)
          const colors = AREA_COLORS[area] ?? { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-400', header: 'bg-gray-500' }
          const areaAvg = (positions.reduce((s, p) => s + p.turnoverRate, 0) / positions.length).toFixed(1)

          return (
            <div key={area} className="card-standard p-0 overflow-hidden mb-3 last:mb-0">
              {/* Card header */}
              <div className={`flex items-center justify-between px-4 py-2.5 ${colors.bg}`}>
                <span className={`text-body-sm font-bold ${colors.text}`}>{area}</span>
                <span className={`text-body-sm font-bold ${colors.text}`}>均 {areaAvg}%</span>
              </div>

              {/* Position rows */}
              <div className="px-4 py-3 space-y-3">
                {positions.map(pos => (
                  <div key={pos.role}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm text-gray-900 font-medium">{pos.role}</span>
                        <span className="metric-label">{pos.headcount}人</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-sm font-bold text-gray-900">{pos.turnoverRate}%</span>
                        <span className={`flex items-center gap-0.5 text-caption font-medium ${
                          pos.turnoverChange > 0 ? 'text-red-500' : pos.turnoverChange < 0 ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {pos.turnoverChange > 0 && <TrendingUp size={11} />}
                          {pos.turnoverChange < 0 && <TrendingDown size={11} />}
                          {pos.turnoverChange === 0 && <Minus size={11} />}
                          {pos.turnoverChange > 0 ? `+${pos.turnoverChange}` : pos.turnoverChange === 0 ? '0' : pos.turnoverChange}ppt
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors.bar} rounded-full`}
                        style={{ width: `${Math.min(pos.turnoverRate * 4, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
