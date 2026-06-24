import { useApp } from '@/context/AppContext'
import { AlertTriangle, TrendingDown, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { MetricAlert, AlertSeverity, ModuleAlert } from '@/types'

const metricOrder = [
  '总营收',
  '堂食营收',
  '外卖营收',
  '食材成本率',
  '人效',
  '训练率',
  '离职率',
  '平均出餐时长',
  '退菜金额',
  '赠菜金额',
  '改价金额',
  '沽清率',
  '美团美食评分',
  '大众点评评分',
  '门店稽核评分',
]

const moduleRouteMap: Record<string, string> = {
  revenue: '/revenue/total',
  foodCost: '/food-cost',
  hr: '/hr/labor',
  kitchen: '/kitchen',
  audit: '/audit/returns',
  voice: '/voice/reviews',
  internalAudit: '/internal-audit',
}

const metricModuleMap: Record<string, string> = {
  '总营收': 'revenue',
  '堂食营收': 'revenue',
  '外卖营收': 'revenue',
  '食材成本率': 'foodCost',
  '人效': 'hr',
  '训练率': 'hr',
  '离职率': 'hr',
  '平均出餐时长': 'kitchen',
  '退菜金额': 'audit',
  '赠菜金额': 'audit',
  '改价金额': 'audit',
  '沽清率': 'audit',
  '美团美食评分': 'voice',
  '大众点评评分': 'voice',
  '门店稽核评分': 'internalAudit',
}

function formatMetricValue(metric: MetricAlert): string {
  const value = metric.currentValue
  switch (metric.name) {
    case '总营收':
    case '堂食营收':
    case '外卖营收':
    case '退菜金额':
    case '赠菜金额':
    case '改价金额':
      return `¥${Math.round(value).toLocaleString()}`
    case '食材成本率':
    case '训练率':
    case '离职率':
    case '沽清率':
      return `${value}%`
    case '平均出餐时长':
      return `${value}分钟`
    case '美团美食评分':
    case '大众点评评分':
    case '门店稽核评分':
      return `${value}`
    default:
      return `${value}`
  }
}

function getSeverityDot(severity: AlertSeverity) {
  if (severity === 'red') return 'bg-red-500'
  if (severity === 'yellow') return 'bg-amber-500'
  return 'bg-blue-500'
}

function AlertItem({ metric }: { metric: MetricAlert }) {
  const navigate = useNavigate()
  const moduleId = metricModuleMap[metric.name] || 'revenue'
  const route = moduleRouteMap[moduleId] || '/'

  return (
    <button
      onClick={() => navigate(route)}
      className="w-full flex items-center gap-3 px-3 py-2 bg-white rounded-xl active:bg-gray-50 transition-colors text-left"
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${getSeverityDot(metric.severity)}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold text-gray-900">{metric.name}</span>
          <span className="text-body-sm font-bold text-gray-900">{formatMetricValue(metric)}</span>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-500 shrink-0" />
    </button>
  )
}

export function AlertBanner() {
  const { alerts } = useApp()

  const abnormalMetrics = alerts
    .flatMap((a: ModuleAlert) => a.metrics)
    .filter((m: MetricAlert) => m.severity !== 'green')

  const sortedMetrics = abnormalMetrics.sort((a: MetricAlert, b: MetricAlert) => {
    const indexA = metricOrder.indexOf(a.name)
    const indexB = metricOrder.indexOf(b.name)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  if (sortedMetrics.length === 0) {
    return (
      <div className="mt-3 card-elevated p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <TrendingDown size={16} className="rotate-180" />
        </div>
        <div>
          <p className="text-body-sm font-semibold text-gray-900">今日运营正常</p>
          <p className="text-caption text-gray-500">各项指标均在合理范围内</p>
        </div>
      </div>
    )
  }

  const redCount = sortedMetrics.filter(m => m.severity === 'red').length

  return (
    <div className="mt-3">
      <div className={`rounded-xl p-3 ${
        redCount > 0
          ? 'bg-red-50 border border-red-100'
          : 'bg-amber-50 border border-amber-100'
      }`}>
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
              redCount > 0 ? 'bg-red-500' : 'bg-amber-500'
            }`}>
              <AlertTriangle size={16} />
            </div>
            <div className="text-left">
              <p className="text-section font-bold text-gray-900">改善机会</p>
              <p className="text-caption text-gray-500">
                {redCount > 0 ? '需优先处理的问题' : '需要注意的指标'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {sortedMetrics.slice(0, 5).map((metric, index) => (
            <AlertItem key={`${metric.name}-${index}`} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  )
}
