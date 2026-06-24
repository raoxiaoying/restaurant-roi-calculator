import { useApp } from '@/context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingUp, TrendingDown, UtensilsCrossed, Bike, AlertTriangle } from 'lucide-react'

function ChangeTag({ value, label }: { value: number; label: string }) {
  const isPositive = value >= 0
  const isGood = isPositive
  return (
    <span className={`text-caption font-medium flex items-center gap-0.5 ${isGood ? 'text-green-600' : 'text-red-500'}`}>
      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {label}{isPositive ? '+' : ''}{value}%
    </span>
  )
}

function StatusBadge({ severity }: { severity: 'red' | 'yellow' | 'green' }) {
  if (severity === 'green') return null
  return (
    <span className={`text-caption font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${
      severity === 'red' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
    }`}>
      <AlertTriangle size={10} />
      {severity === 'red' ? '紧急' : '提醒'}
    </span>
  )
}

export function BusinessOverview() {
  const { dailyData, alerts } = useApp()
  const navigate = useNavigate()

  const revenuePercent = Math.round((dailyData.revenue.total / dailyData.revenue.target) * 100)
  const statusColor = revenuePercent >= 100 ? 'green' : revenuePercent >= 85 ? 'amber' : 'red'

  const revenueAlert = alerts.find(a => a.moduleId === 'revenue')
  const alertMetric = revenueAlert?.metrics.find(m => m.severity !== 'green')

  const dineIn = dailyData.revenue.channels[0]
  const deliveryChannels = dailyData.revenue.channels.slice(2)
  const deliveryTotal = deliveryChannels.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="section-container-primary">
      <div className="mb-3 px-1 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        <h2 className="section-heading">营收总览</h2>
      </div>

      <div className="card-elevated p-4 mb-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="text-body-sm font-bold">收</span>
            </div>
            <div>
              <h3 className="card-title">总营收</h3>
              <p className="text-caption text-gray-500">目标 ¥{dailyData.revenue.target.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/revenue/total')}
            className="flex items-center gap-2 active:bg-gray-50 rounded-full px-1 py-1 transition-colors"
          >
            {alertMetric && <StatusBadge severity={alertMetric.severity} />}
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Main Number */}
        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-metric font-bold text-gray-900">¥{dailyData.revenue.total.toLocaleString()}</span>
          <span className={`text-body-sm font-semibold px-3 py-1 rounded-full ${
            statusColor === 'green' ? 'bg-green-100 text-green-700' :
            statusColor === 'amber' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            完成{revenuePercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              statusColor === 'green' ? 'bg-green-500' :
              statusColor === 'amber' ? 'bg-amber-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(revenuePercent, 100)}%` }}
          />
        </div>

        {/* Alert / Trend */}
        <div className="flex items-center gap-2 text-caption mb-4">
          {dailyData.revenue.totalChange >= 0 ? (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <TrendingUp size={12} /> 环比 +{dailyData.revenue.totalChange}%
            </span>
          ) : (
            <span className="text-red-500 font-medium flex items-center gap-1">
              <TrendingDown size={12} /> 环比 {dailyData.revenue.totalChange}%
            </span>
          )}
        </div>

        {/* Channel Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/revenue/dine-in')}
            className="bg-gray-50 rounded-xl p-3 text-left active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={14} className="text-gray-400" />
              <span className="text-caption font-medium text-gray-500">堂食</span>
            </div>
            <div className="text-metric-sm font-bold text-gray-900">¥{dineIn.amount.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <ChangeTag value={dailyData.revenue.dineIn.revenueMoM} label="环比" />
            </div>
          </button>

          <button
            onClick={() => navigate('/revenue/delivery')}
            className="bg-gray-50 rounded-xl p-3 text-left active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Bike size={14} className="text-gray-400" />
              <span className="text-caption font-medium text-gray-500">外卖</span>
            </div>
            <div className="text-metric-sm font-bold text-gray-900">¥{deliveryTotal.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <ChangeTag value={dailyData.revenue.delivery.revenueMoM} label="环比" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
