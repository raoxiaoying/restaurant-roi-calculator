import { useParams } from 'react-router-dom'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function InternalAuditDetail() {
  const { id } = useParams<{ id: string }>()
  const { dailyData } = useApp()
  const { internalAudit } = dailyData

  const dimIdx = id !== undefined ? parseInt(id, 10) : 0
  const dim = internalAudit.dimensions[dimIdx]

  if (!dim) {
    return (
      <div className="page-container bg-page-body">
        <DrillDownHeader title="稽核详情" />
        <div className="card-elevated p-4 text-center text-gray-500">未找到该维度数据</div>
      </div>
    )
  }

  const dimPercent = (dim.score / dim.fullScore) * 100

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title={dim.name} />

      {/* Section 1: Score Overview */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
            <h2 className="section-heading">评分概览</h2>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div>
            <span className="metric-highlight text-gray-900">{dim.score}</span>
            <span className="metric-label text-gray-400 ml-1">/{dim.fullScore}</span>
          </div>
          <div className="text-right">
            <span className="metric-label text-gray-500">得分率</span>
            <span className="metric-secondary ml-1">{dimPercent.toFixed(1)}%</span>
          </div>
        </div>
        {dim.change !== undefined && (
          <div className="mt-2">
            <span className={`text-caption font-medium ${dim.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              环比{dim.change >= 0 ? '+' : ''}{dim.change}%
            </span>
          </div>
        )}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
          <div
            className={`h-full rounded-full ${dimPercent >= 90 ? 'bg-green-500' : dimPercent >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${dimPercent}%` }}
          />
        </div>
      </div>

      {/* Section 2: Score Trend */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">评分趋势</h2>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dim.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                formatter={(value: number) => [`${value}分`, '评分']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Deduction Details */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-red-500 rounded-full"></div>
          <h2 className="section-heading">扣分明细</h2>
        </div>
        <div className="space-y-2">
          {dim.items.map((item) => (
            <div key={item.item} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-body-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg shrink-0">-{item.deduction}</span>
              <div className="flex-1 min-w-0">
                <div className="text-body-sm font-medium text-gray-900">{item.item}</div>
                <div className="text-caption text-gray-500 mt-1">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
