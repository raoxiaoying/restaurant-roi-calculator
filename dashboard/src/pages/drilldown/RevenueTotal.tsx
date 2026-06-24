import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function RevenueTotal() {
  const { dailyData } = useApp()
  const { channels } = dailyData.revenue

  const pieData = channels.map(c => ({ name: c.name, value: c.amount }))
  const sortedChannels = [...channels].sort((a, b) => b.amount - a.amount)

  const renderLabel = ({ name, percent, cx, cy, midAngle, outerRadius }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + 24
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
      <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
        {name} {(percent * 100).toFixed(0)}%
      </text>
    )
  }

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="营收构成" />

      {/* Pie Chart */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">营收占比</h2>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                dataKey="value"
                label={renderLabel}
                labelLine={{ stroke: '#ccc', strokeWidth: 1 }}
                fontSize={11}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Details */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">渠道明细</h2>
        </div>
        <div className="space-y-3">
          {sortedChannels.map((ch) => {
            const avgOrder = Math.round(ch.amount / ch.orders)
            const isDineIn = ch.name === '堂食'
            const colorIdx = channels.findIndex(c => c.name === ch.name)
            return (
              <div key={ch.name} className="card-standard p-3 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[colorIdx] }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-gray-900 font-bold">{ch.name}</span>
                    <span className="text-body-sm font-bold text-gray-900">¥{ch.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    {isDineIn ? (
                      <span className="metric-label">{ch.orders}人 · 客单价¥{dailyData.revenue.dineIn.avgTicket}</span>
                    ) : (
                      <span className="metric-label">{ch.orders}单 · 单均¥{avgOrder}</span>
                    )}
                    <span className="metric-label">{ch.percentage}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
