import { useState, useMemo } from 'react'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

const PLATFORMS = ['全部', '美团外卖', '淘宝闪购', '京东外卖'] as const
type TrendMode = 'amount' | 'avgPerOrder'

export function RevenueDelivery() {
  const { dailyData } = useApp()
  const { delivery } = dailyData.revenue

  const [activePlatform, setActivePlatform] = useState<string>('全部')
  const [trendMode, setTrendMode] = useState<TrendMode>('amount')

  const currentData = useMemo(() => {
    if (activePlatform === '全部') {
      return { funnel: delivery.funnel, trend: delivery.trend }
    }
    const p = delivery.platforms.find(p => p.platform === activePlatform)
    return p ? { funnel: p.funnel, trend: p.trend } : { funnel: delivery.funnel, trend: delivery.trend }
  }, [delivery, activePlatform])

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="外卖分析" />

      {/* Revenue Attribution */}
      <div className="mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">外卖营收归因分析</h2>
        </div>

        <div className="card-elevated p-4 mb-4 flex items-center justify-between">
          <span className="metric-label">外卖营收影响金额</span>
          <div className={`flex items-center gap-1.5 text-body-sm font-bold ${delivery.revenueAttribution.totalChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {delivery.revenueAttribution.totalChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {delivery.revenueAttribution.totalChange >= 0 ? '+' : ''}¥{Math.abs(delivery.revenueAttribution.totalChange).toLocaleString()}
          </div>
        </div>

        {delivery.revenueAttribution.factors.map(factor => {
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

      {/* Platform Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {PLATFORMS.map(platform => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`px-3 py-1.5 rounded-full text-body-sm font-medium whitespace-nowrap transition-colors ${
              activePlatform === platform
                ? 'bg-green-500 text-white shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Funnel */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">外卖转化漏斗</h2>
        </div>
        <div className="space-y-2">
          {currentData.funnel.map((step, idx) => {
            const maxVal = currentData.funnel[0].value
            const width = (step.value / maxVal) * 100
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between text-body-sm text-gray-600 mb-1.5">
                  <span className="font-medium">{step.label}</span>
                  <span className="font-bold text-gray-900">{step.value.toLocaleString()}</span>
                </div>
                <div className="h-9 bg-gray-50 rounded-lg relative overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-end pr-3"
                    style={{ width: `${Math.max(width, 12)}%` }}
                  >
                    {step.rate && (
                      <span className="text-caption text-white font-bold">
                        {step.rate}%
                      </span>
                    )}
                  </div>
                </div>
                {idx < currentData.funnel.length - 1 && (
                  <div className="flex justify-center my-1">
                    <span className="text-gray-300 text-body-sm">↓</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title">外卖平台趋势</h2>
          <div className="inline-flex bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setTrendMode('amount')}
              className={`px-3 py-1 rounded-md text-caption font-medium transition-colors ${
                trendMode === 'amount' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              金额
            </button>
            <button
              onClick={() => setTrendMode('avgPerOrder')}
              className={`px-3 py-1 rounded-md text-caption font-medium transition-colors ${
                trendMode === 'avgPerOrder' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
              }`}
            >
              单均
            </button>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData.trend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={trendMode === 'amount' ? 45 : 35}
                tickFormatter={(v: number) => trendMode === 'amount' ? (v >= 10000 ? `${(v / 10000).toFixed(1)}w` : v.toLocaleString()) : String(v)}
              />
              <Tooltip
                content={(props: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                  const { active, payload, label } = props
                  if (active && payload && payload.length) {
                    const val = payload[0].value as number
                    return (
                      <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
                        <div className="text-caption text-gray-300 mb-1">{label}</div>
                        <div className="font-bold">
                          {trendMode === 'amount'
                            ? `\u00A5${val.toLocaleString()}`
                            : `\u00A5${val.toFixed(1)}/单`}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey={trendMode}
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
