import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { Trophy } from 'lucide-react'

export function VoiceMeituan() {
  const { dailyData } = useApp()
  const { meituan } = dailyData.customerVoice

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="美团美食评分" />

      {/* Score summary */}
      <div className="card-elevated p-4 mb-4">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="metric-label mb-1">当前评分</div>
            <div className="metric-secondary text-amber-500">{meituan.score}</div>
          </div>
          <div>
            <div className="metric-label mb-1">环比变化</div>
            <div className={`metric-secondary ${meituan.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {meituan.change >= 0 ? '+' : ''}{meituan.change}
            </div>
          </div>
        </div>
      </div>

      {/* Ranking card */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={15} className="text-amber-500" />
          <h2 className="card-title">商圈/品类排名</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="metric-label mb-1">商圈排名</div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="metric-secondary text-amber-500">#{meituan.areaRank}</span>
              <span className="metric-label">/{meituan.areaTotal}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="metric-label mb-1">品类排名</div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="metric-secondary text-blue-600">#{meituan.categoryRank}</span>
              <span className="metric-label">/{meituan.categoryTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-body-sm text-gray-600">评分趋势</span>
          <span className="metric-secondary text-amber-500">{meituan.score}</span>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={meituan.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                content={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#f59e0b', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
