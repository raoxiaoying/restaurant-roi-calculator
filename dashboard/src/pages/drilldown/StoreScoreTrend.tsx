import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

const scoreBreakdown = [
  { name: '营收总览', score: 88, fullScore: 100, color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
  { name: '精益运营', score: 82, fullScore: 100, color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600' },
  { name: '顾客声音', score: 85, fullScore: 100, color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-500' },
  { name: '巡店稽核', score: 77, fullScore: 100, color: '#8b5cf6', bg: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-600' },
]

export function StoreScoreTrend() {
  const { dailyData, periodMode } = useApp()
  const { storeScoreTrend, storeScore, storeScoreChange } = dailyData

  const periodLabel = periodMode === 'week' ? '近10周' : periodMode === 'month' ? '近12月' : '近15日'

  const avg = Math.round(storeScoreTrend.reduce((s, d) => s + d.score, 0) / storeScoreTrend.length)

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="门店得分趋势" />

      {/* Score Summary */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="metric-label mb-1">当前得分</div>
            <div className="metric-highlight text-gray-900">{storeScore}</div>
          </div>
          <div className="text-right">
            <div className="metric-label mb-1">环比变化</div>
            <div className={`flex items-center justify-end gap-1 metric-secondary ${
              storeScoreChange >= 0 ? 'text-green-600' : 'text-red-500'
            }`}>
              {storeScoreChange >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {storeScoreChange >= 0 ? '+' : ''}{storeScoreChange}%
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="metric-label">{periodLabel}均分</span>
          <span className="text-body-sm font-semibold text-gray-700">{avg}分</span>
        </div>
      </div>

      {/* Score Breakdown Radar */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">得分构成</h2>
        </div>

        {/* Dimension Tags */}
        <div className="grid grid-cols-2 gap-2.5">
          {scoreBreakdown.map(item => (
            <div key={item.name}
              className={`${item.bg} border-l-[3px] ${item.border} rounded-lg px-3 py-2.5 flex items-center justify-between`}>
              <span className="text-body-sm font-medium text-gray-900">{item.name}</span>
              <span className={`metric-secondary ${item.text}`}>{item.score}<span className="text-caption font-normal text-gray-500 ml-0.5">分</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">{periodLabel}得分趋势</h2>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={storeScoreTrend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 3', 'dataMax + 3']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                content={(props: any) => {  // eslint-disable-line @typescript-eslint/no-explicit-any
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        {payload[0].value}分
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: `均${avg}`, position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
