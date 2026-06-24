import { useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { Trophy, Clock } from 'lucide-react'
import type { RatingTrend } from '@/types'

type Dimension = 'total' | 'taste' | 'environment' | 'service' | 'delivery' | 'packaging'

const dimensions: { key: Dimension; label: string; color: string }[] = [
  { key: 'total', label: '总分', color: '#3b82f6' },
  { key: 'taste', label: '口味', color: '#f59e0b' },
  { key: 'environment', label: '环境', color: '#10b981' },
  { key: 'service', label: '服务', color: '#6366f1' },
  { key: 'delivery', label: '配送', color: '#8b5cf6' },
  { key: 'packaging', label: '包装', color: '#ec4899' },
]

export function VoiceDeliveryDetail() {
  const { dailyData } = useApp()
  const { id } = useParams<{ id: string }>()
  const idx = parseInt(id || '0', 10)
  const platform = dailyData.customerVoice.deliveryRatings[idx]
  const [activeDim, setActiveDim] = useState<Dimension>('total')

  const avg = useMemo(() => {
    if (!platform) return '0'
    return ((platform.taste + platform.environment + platform.service + platform.delivery + platform.packaging) / 5).toFixed(1)
  }, [platform])

  if (!platform) return null

  const scoreMap: Record<Dimension, number> = {
    total: parseFloat(avg),
    taste: platform.taste,
    environment: platform.environment,
    service: platform.service,
    delivery: platform.delivery,
    packaging: platform.packaging,
  }

  const trendMap: Record<Dimension, RatingTrend[]> = {
    total: platform.totalTrend,
    taste: platform.tasteTrend,
    environment: platform.totalTrend, // reuse total as environment trend not available separately
    service: platform.totalTrend,
    delivery: platform.deliveryTrend,
    packaging: platform.packagingTrend,
  }

  const activeConfig = dimensions.find(d => d.key === activeDim)!

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title={`${platform.platform}评分`} />

      {/* Section 1: Overall Score + Dimension Scores */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">评分概览</h2>
        </div>

        <div className="text-center mb-4">
          <div className="metric-label mb-1">平台总分</div>
          <div className="text-3xl font-bold text-blue-600">{avg}</div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { label: '口味', value: platform.taste, color: 'text-amber-500' },
            { label: '环境', value: platform.environment, color: 'text-green-600' },
            { label: '服务', value: platform.service, color: 'text-indigo-500' },
            { label: '配送', value: platform.delivery, color: 'text-violet-600' },
            { label: '包装', value: platform.packaging, color: 'text-pink-500' },
          ].map(dim => (
            <div key={dim.label} className="text-center">
              <div className="metric-label mb-0.5">{dim.label}</div>
              <div className={`text-body-sm font-bold ${dim.color}`}>{dim.value}</div>
            </div>
          ))}
        </div>

        {/* Timeout Rate for delivery platforms */}
        {platform.timeoutRate != null && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-orange-500" />
                <span className="text-body-sm text-gray-700 font-medium">出餐超时率</span>
              </div>
              <span className={`text-body-sm font-bold ${platform.timeoutRate > 5 ? 'text-red-500' : 'text-green-600'}`}>
                {platform.timeoutRate}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full ${platform.timeoutRate > 5 ? 'bg-red-400' : 'bg-green-400'}`}
                style={{ width: `${Math.min(platform.timeoutRate * 5, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Ranking */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">打榜信息</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy size={13} className="text-amber-500" />
              <span className="metric-label">商圈排名</span>
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-body-sm font-bold text-amber-600">#{platform.areaRank}</span>
              <span className="metric-label text-gray-500">/{platform.areaTotal}</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy size={13} className="text-blue-500" />
              <span className="metric-label">品类排名</span>
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-body-sm font-bold text-blue-600">#{platform.categoryRank}</span>
              <span className="metric-label text-gray-500">/{platform.categoryTotal}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="metric-label mb-1">差评率</div>
            <div className="text-body-sm font-bold text-red-500">{platform.badReviewRate}%</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="metric-label mb-1">营收占比</div>
            <div className="text-body-sm font-bold text-gray-900">{platform.revenueShare}%</div>
          </div>
        </div>
      </div>

      {/* Section 3: Trend Chart with tabs */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">评分趋势</h2>
        </div>

        <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1 overflow-x-auto">
          {dimensions.map((dim) => (
            <button
              key={dim.key}
              onClick={() => setActiveDim(dim.key)}
              className={`flex-1 py-1.5 px-1 rounded-lg text-caption font-medium transition-colors whitespace-nowrap ${
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
          <span className="text-body-sm font-bold" style={{ color: activeConfig.color }}>
            {scoreMap[activeDim]}分
          </span>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendMap[activeDim]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                content={(props: any) => {
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
