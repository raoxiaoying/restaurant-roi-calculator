import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { useState } from 'react'
import { Trophy } from 'lucide-react'

type Dimension = 'total' | 'taste' | 'environment' | 'service'

const dimensions: { key: Dimension; label: string; color: string }[] = [
  { key: 'total', label: '总分', color: '#3b82f6' },
  { key: 'taste', label: '口味', color: '#f59e0b' },
  { key: 'environment', label: '环境', color: '#10b981' },
  { key: 'service', label: '服务', color: '#8b5cf6' },
]

export function VoiceDianping() {
  const { dailyData } = useApp()
  const { dianping } = dailyData.customerVoice
  const [activeDim, setActiveDim] = useState<Dimension>('total')

  const trendMap: Record<Dimension, typeof dianping.totalTrend> = {
    total: dianping.totalTrend,
    taste: dianping.tasteTrend,
    environment: dianping.environmentTrend,
    service: dianping.serviceTrend,
  }

  const scoreMap: Record<Dimension, number> = {
    total: dianping.total,
    taste: dianping.taste,
    environment: dianping.environment,
    service: dianping.service,
  }

  const activeConfig = dimensions.find(d => d.key === activeDim)!

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="大众点评评分" />

      {/* Score summary */}
      <div className="card-elevated p-4 mb-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="metric-label mb-1">总分</div>
            <div className="metric-secondary text-blue-600">{dianping.total}</div>
          </div>
          <div>
            <div className="metric-label mb-1">口味</div>
            <div className="metric-secondary text-amber-500">{dianping.taste}</div>
          </div>
          <div>
            <div className="metric-label mb-1">环境</div>
            <div className="metric-secondary text-green-600">{dianping.environment}</div>
          </div>
          <div>
            <div className="metric-label mb-1">服务</div>
            <div className="metric-secondary text-violet-600">{dianping.service}</div>
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
              <span className="metric-secondary text-amber-500">#{dianping.areaRank}</span>
              <span className="metric-label">/{dianping.areaTotal}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="metric-label mb-1">品类排名</div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="metric-secondary text-blue-600">#{dianping.categoryRank}</span>
              <span className="metric-label">/{dianping.categoryTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trend chart with tabs */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
          {dimensions.map((dim) => (
            <button
              key={dim.key}
              onClick={() => setActiveDim(dim.key)}
              className={`flex-1 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                activeDim === dim.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {dim.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-body-sm text-gray-600">{activeConfig.label}趋势</span>
          <span className="metric-secondary" style={{ color: activeConfig.color }}>
            {scoreMap[activeDim]}
          </span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendMap[activeDim]}>
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
              <Line
                type="monotone"
                dataKey="score"
                stroke={activeConfig.color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: activeConfig.color, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: activeConfig.color, stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
