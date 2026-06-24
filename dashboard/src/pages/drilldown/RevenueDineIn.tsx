import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

type TrendTab = 'revenue' | 'avgTicket' | 'customerFlow' | 'tableTurnover'

const TABS: { key: TrendTab; label: string; color: string }[] = [
  { key: 'revenue', label: '营收', color: '#3b82f6' },
  { key: 'avgTicket', label: '客单价', color: '#f59e0b' },
  { key: 'customerFlow', label: '客流', color: '#10b981' },
  { key: 'tableTurnover', label: '翻台率', color: '#06b6d4' },
]

export function RevenueDineIn() {
  const { dailyData } = useApp()
  const { dineIn } = dailyData.revenue
  const [activeTab, setActiveTab] = useState<TrendTab>('revenue')

  const chartConfig = useMemo(() => {
    const activeColor = TABS.find(t => t.key === activeTab)!.color
    switch (activeTab) {
      case 'revenue':
        return { data: dineIn.revenueTrend, current: `¥${dineIn.revenueTotal.toLocaleString()}`, change: dineIn.revenueChange, unit: '¥', prefix: '¥', color: activeColor }
      case 'avgTicket':
        return { data: dineIn.avgTicketTrend, current: `¥${dineIn.avgTicket}`, change: dineIn.avgTicketChange, unit: '¥', prefix: '¥', color: activeColor }
      case 'customerFlow':
        return { data: dineIn.customerFlowTrend, current: `${dineIn.customerFlow}人`, change: dineIn.customerFlowChange, unit: '人', prefix: '', color: activeColor }
      case 'tableTurnover':
      default:
        return { data: dineIn.tableTurnoverTrend, current: `${dineIn.tableTurnoverRate}次/天`, change: dineIn.tableTurnoverChange, unit: '次/天', prefix: '', color: activeColor }
    }
  }, [activeTab, dineIn])

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="堂食分析" />

      {/* Revenue Attribution */}
      <div className="mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">营收归因分析</h2>
        </div>

        <div className="card-elevated p-4 mb-4 flex items-center justify-between">
          <span className="metric-label">营收变化金额</span>
          <div className={`flex items-center gap-1.5 text-body-sm font-bold ${dineIn.revenueAttribution.totalChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {dineIn.revenueAttribution.totalChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {dineIn.revenueAttribution.totalChange >= 0 ? '+' : ''}¥{Math.abs(dineIn.revenueAttribution.totalChange).toLocaleString()}
          </div>
        </div>

        {dineIn.revenueAttribution.factors.map(factor => {
          const isPositive = factor.amount >= 0
          const colors = isPositive
            ? { bg: 'bg-green-50', border: 'border-green-100', bar: 'bg-green-500', accent: 'text-green-600', strip: 'bg-green-500' }
            : { bg: 'bg-red-50', border: 'border-red-100', bar: 'bg-red-500', accent: 'text-red-500', strip: 'bg-red-500' }
          return (
            <div key={factor.label} className="card-elevated p-0 overflow-hidden mb-4">
              <div className={`flex items-center justify-between px-4 py-3.5 ${colors.bg} border-b ${colors.border}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-4 rounded-full ${colors.strip}`} />
                  <span className={`text-body-sm font-bold ${colors.accent}`}>{factor.label}</span>
                </div>
                <div className={`flex items-center gap-1 text-body-sm font-bold ${colors.accent}`}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isPositive ? '+' : ''}¥{factor.amount.toLocaleString()}
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="metric-label">贡献占比</span>
                  <span className={`text-caption font-semibold ${colors.accent}`}>{Math.abs(factor.pct)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${Math.abs(factor.pct)}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Trend Tabs: 营收 / 客单价 / 客流 / 订单数 */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">堂食趋势</h2>
          <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1 rounded-md text-caption font-medium transition-colors ${
                  activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartConfig.data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                content={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    const val = payload[0].value
                    const display = chartConfig.prefix
                      ? `${chartConfig.prefix}${typeof val === 'number' ? val.toLocaleString() : val}`
                      : `${val}${chartConfig.unit}`
                    return (
                      <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        {display}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="value" stroke={chartConfig.color} strokeWidth={2.5}
                dot={{ r: 4, fill: chartConfig.color, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: chartConfig.color, stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Turnover Trend */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">翻台率趋势</h2>
          <div className="text-body-sm text-gray-500">
            当前 <span className="font-bold text-gray-900">{dineIn.tableTurnoverRate}次/天</span>
            <span className={`ml-1 font-medium ${dineIn.tableTurnoverChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {dineIn.tableTurnoverChange >= 0 ? '+' : ''}{dineIn.tableTurnoverChange}%
            </span>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dineIn.tableTurnoverTrend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 0.3', 'dataMax + 0.3']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                content={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        {payload[0].value}次/天
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={2.5}
                dot={{ r: 4, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#06b6d4', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funnel */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">客流转化漏斗</h2>
        </div>
        <div className="space-y-2">
          {dineIn.funnel.map((step, idx) => {
            const maxVal = dineIn.funnel[0].value
            const width = (step.value / maxVal) * 100
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between text-body-sm text-gray-600 mb-1.5">
                  <span className="font-medium">{step.label}</span>
                  <span className="font-bold text-gray-900">{step.value.toLocaleString()}</span>
                </div>
                <div className="h-9 bg-gray-50 rounded-lg relative overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-end pr-3"
                    style={{ width: `${Math.max(width, 12)}%` }}
                  >
                    {step.rate && (
                      <span className="text-caption text-white font-bold">
                        {step.rate}%
                      </span>
                    )}
                  </div>
                </div>
                {idx < dineIn.funnel.length - 1 && (
                  <div className="flex justify-center my-1">
                    <span className="text-gray-300 text-body-sm">↓</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
