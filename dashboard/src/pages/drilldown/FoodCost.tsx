import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'

export function FoodCost() {
  const { dailyData } = useApp()
  const { foodCost, audit, revenue } = dailyData

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="食材成本分析" />

      {/* Overview */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="metric-label mb-1">成本率</div>
            <div className="metric-highlight text-gray-900">{foodCost.rate}<span className="metric-secondary text-gray-700">%</span></div>
          </div>
          <div className="text-right">
            <div className="metric-label mb-1">目标</div>
            <div className="metric-secondary text-gray-700">{foodCost.target}%</div>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-red-500 rounded-full"
            style={{ width: `${Math.min((foodCost.rate / 50) * 100, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="metric-label mb-1">实际金额</div>
            <div className="text-body-sm font-semibold text-gray-900">¥{foodCost.amount.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="metric-label mb-1">目标金额</div>
            <div className="text-body-sm font-semibold text-gray-700">¥{Math.round(revenue.total * foodCost.target / 100).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">成本归因分析</h2>
        </div>
        <div className="space-y-3">
          {[
            {
              label: '损耗影响金额',
              amount: foodCost.wasteAmount,
              lastAmount: foodCost.wasteLastAmount,
              color: 'orange' as const,
            },
            {
              label: '价格影响金额',
              amount: foodCost.priceFluctuationAmount,
              lastAmount: foodCost.priceFluctuationLastAmount,
              color: 'blue' as const,
            },
            {
              label: '赠菜影响金额',
              amount: audit.complimentaryTotal,
              lastAmount: audit.complimentaryLastAmount,
              color: 'amber' as const,
            },
          ].map((item) => {
            const revenueRatio = ((item.amount / revenue.total) * 100).toFixed(1)
            const lastRevenueRatio = ((item.lastAmount / revenue.total) * 100).toFixed(1)
            const revenueRatioChange = (parseFloat(revenueRatio) - parseFloat(lastRevenueRatio)).toFixed(1)
            const isRatioUp = parseFloat(revenueRatioChange) > 0
            const changeRate = (((item.amount - item.lastAmount) / item.lastAmount) * 100).toFixed(1)
            const isUp = item.amount > item.lastAmount
            const colorMap = {
              orange: { border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500' },
              blue: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
              amber: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-500', dot: 'bg-amber-500' },
            }
            const c = colorMap[item.color]

            return (
              <div key={item.label} className={`border ${c.border} rounded-xl overflow-hidden card-elevated p-0`}>
                {/* Header */}
                <div className={`${c.bg} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="card-title">{item.label}</span>
                  </div>
                  <span className={`metric-secondary ${c.text}`}>¥{item.amount.toLocaleString()}</span>
                </div>
                {/* Details */}
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="metric-label">上期金额</span>
                    <span className="text-body-sm text-gray-700">¥{item.lastAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="metric-label">金额环比</span>
                    <span className={`text-body-sm font-semibold ${isUp ? 'text-red-500' : 'text-green-600'}`}>
                      {isUp ? '+' : ''}{changeRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="metric-label">占收入比</span>
                    <span className="text-body-sm font-semibold text-gray-900">{revenueRatio}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="metric-label">占收入比环比</span>
                    <span className={`text-body-sm font-semibold ${isRatioUp ? 'text-red-500' : 'text-green-600'}`}>
                      {isRatioUp ? '+' : ''}{revenueRatioChange}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">分类明细</h2>
        </div>
        <div className="space-y-3">
          {foodCost.details.map((item) => (
            <div key={item.category} className="card-standard p-3 flex items-center justify-between">
              <span className="text-body-sm text-gray-900">{item.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-semibold text-gray-900">¥{item.amount.toLocaleString()}</span>
                {item.change !== 0 && (
                  <span className={`text-caption font-semibold ${item.change > 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
