import { useState } from 'react'
import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react'
import { ComposedChart, Line, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'

const SHOW_DEFAULT = 10
const SHOW_MAX = 30

export function InventoryEfficiency() {
  const { dailyData } = useApp()
  const { turnoverRate, amount, turnoverRateMoM, amountMoM, amountTrend, turnoverDaysTrend, items } = dailyData.inventory

  const [showAll, setShowAll] = useState(false)

  const sortedItems = [...items].sort((a, b) => b.amount - a.amount)
  const displayedItems = showAll ? sortedItems.slice(0, SHOW_MAX) : sortedItems.slice(0, SHOW_DEFAULT)
  const hasMore = sortedItems.length > SHOW_DEFAULT

  // Merge trends for composed chart
  const chartData = amountTrend.map((a, i) => ({
    date: a.date,
    amount: a.amount,
    days: turnoverDaysTrend[i]?.days ?? 0,
  }))

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="库存效率详情" />

      {/* Section 1: Overview */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">库存效率概览</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="metric-label mb-1">库存周转率</div>
            <div className="metric-highlight text-gray-900">
              {turnoverRate}<span className="metric-secondary text-gray-500">次</span>
            </div>
            <div className={`flex items-center justify-center gap-0.5 text-caption font-medium mt-1 ${
              turnoverRateMoM > 0 ? 'text-green-600' : turnoverRateMoM < 0 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {turnoverRateMoM > 0 && <TrendingUp size={11} />}
              {turnoverRateMoM < 0 && <TrendingDown size={11} />}
              {turnoverRateMoM === 0 && <Minus size={11} />}
              环比{turnoverRateMoM > 0 ? '+' : ''}{turnoverRateMoM}%
            </div>
          </div>
          <div>
            <div className="metric-label mb-1">库存金额</div>
            <div className="metric-highlight text-gray-900">
              ¥{(amount / 10000).toFixed(1)}<span className="metric-secondary text-gray-500">万</span>
            </div>
            <div className={`flex items-center justify-center gap-0.5 text-caption font-medium mt-1 ${
              amountMoM > 0 ? 'text-red-500' : amountMoM < 0 ? 'text-green-600' : 'text-gray-500'
            }`}>
              {amountMoM > 0 && <TrendingUp size={11} />}
              {amountMoM < 0 && <TrendingDown size={11} />}
              {amountMoM === 0 && <Minus size={11} />}
              环比{amountMoM > 0 ? '+' : ''}{amountMoM}%
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Trend Chart - Inventory Amount + Turnover Days */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">库存金额 & 周转天数趋势</h2>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="amount"
                orientation="left"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={45}
                tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}万`}
              />
              <YAxis
                yAxisId="days"
                orientation="right"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={30}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip
                content={(props: any) => {
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    const amt = payload.find((p: any) => p.dataKey === 'amount')
                    const days = payload.find((p: any) => p.dataKey === 'days')
                    return (
                      <div className="bg-gray-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg space-y-1">
                        {amt && <div>金额: ¥{amt.value.toLocaleString()}</div>}
                        {days && <div>周转: {days.value}天</div>}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar yAxisId="amount" dataKey="amount" fill="#8b5cf6" radius={[3, 3, 0, 0]} barSize={20} opacity={0.7} />
              <Line
                yAxisId="days"
                type="monotone"
                dataKey="days"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500 opacity-70"></div>
            <span className="text-caption text-gray-500">库存金额</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-orange-500 rounded"></div>
            <span className="text-caption text-gray-500">周转天数</span>
          </div>
        </div>
      </div>

      {/* Section 3: Inventory Efficiency Table */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">库存效率报表</h2>
        </div>
        <div className="metric-label mb-3">按库存金额倒序</div>

        {/* Table with sticky first column */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-caption font-semibold text-gray-500 border-r border-gray-200 min-w-[100px]">货品名称</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500">规格</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500 text-center">单位</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500 text-right">库存量</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500 text-right">库存金额</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500 text-right">周转天数</th>
                <th className="px-3 py-2 text-caption font-semibold text-gray-500 text-right">可售天数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedItems.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50/50">
                  <td className="sticky left-0 z-10 bg-white px-3 py-2.5 text-body-sm text-gray-900 font-medium border-r border-gray-200 truncate max-w-[120px]">{item.name}</td>
                  <td className="px-3 py-2.5 text-body-sm text-gray-600">{item.spec}</td>
                  <td className="px-3 py-2.5 text-body-sm text-gray-600 text-center">{item.unit}</td>
                  <td className="px-3 py-2.5 text-body-sm text-gray-900 text-right">{item.quantity}</td>
                  <td className="px-3 py-2.5 text-body-sm font-medium text-gray-900 text-right">¥{item.amount.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-body-sm text-right">
                    <span className={item.turnoverDays > 10 ? 'text-red-500 font-medium' : item.turnoverDays > 7 ? 'text-amber-600' : 'text-green-600'}>
                      {item.turnoverDays}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-body-sm text-gray-600 text-right">{item.estimatedSaleDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show More / Show Less */}
        {hasMore && (
          <div className="mt-3 text-center">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-1 text-caption text-blue-500 font-medium active:opacity-70"
              >
                展开更多（共{Math.min(sortedItems.length, SHOW_MAX)}项）
                <ChevronDown size={14} />
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="inline-flex items-center gap-1 text-caption text-blue-500 font-medium active:opacity-70"
              >
                收起
                <ChevronDown size={14} className="rotate-180" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
