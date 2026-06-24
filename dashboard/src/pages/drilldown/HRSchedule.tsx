import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'

export function HRSchedule() {
  const { dailyData } = useApp()
  const { scheduleDetails, mealScheduleDetails, scheduleVariance } = dailyData.hr

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="排班差异" />

      {/* Summary */}
      <div className="card-elevated p-4 mb-4">
        <div className="metric-label mb-1">总差异</div>
        <div className="metric-highlight text-gray-900">
          +{scheduleVariance}人
        </div>
        <div className="metric-label mt-1">实际排班多于建议排班</div>
      </div>

      {/* Area Detail: 前厅 / 后厨 */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">前厅 / 后厨对比</h2>
        </div>
        <div className="space-y-3">
          {scheduleDetails.map((item) => (
            <div key={item.area} className="card-standard p-3">
              <div className="text-body-sm font-medium text-gray-900 mb-3">{item.area}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="metric-label mb-1">建议人数</div>
                  <div className="metric-secondary text-gray-700">{item.suggested}</div>
                </div>
                <div>
                  <div className="metric-label mb-1">实排人数</div>
                  <div className="metric-secondary text-gray-700">{item.actual}</div>
                </div>
                <div>
                  <div className="metric-label mb-1">差异</div>
                  <div className="metric-secondary text-gray-900">
                    {item.difference > 0 ? '+' : ''}{item.difference}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Period Detail: 午市 / 晚市 */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">餐段对比</h2>
        </div>
        <div className="space-y-3">
          {mealScheduleDetails.map((item) => (
            <div key={item.period} className="card-standard p-3">
              <div className="text-body-sm font-medium text-gray-900 mb-3">{item.period}</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="metric-label mb-1">建议人数</div>
                  <div className="metric-secondary text-gray-700">{item.suggested}</div>
                </div>
                <div>
                  <div className="metric-label mb-1">实排人数</div>
                  <div className="metric-secondary text-gray-700">{item.actual}</div>
                </div>
                <div>
                  <div className="metric-label mb-1">差异</div>
                  <div className="metric-secondary text-gray-900">
                    {item.difference > 0 ? '+' : ''}{item.difference}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
