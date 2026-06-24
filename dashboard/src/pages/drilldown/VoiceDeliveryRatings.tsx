import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'

export function VoiceDeliveryRatings() {
  const { dailyData } = useApp()
  const { deliveryRatings } = dailyData.customerVoice

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="外卖平台评分" />

      <div className="space-y-4">
        {deliveryRatings.map((platform) => (
          <div key={platform.platform} className="card-elevated p-4 mb-4">
            <h2 className="card-title mb-4">{platform.platform}</h2>
            <div className="space-y-3">
              {[
                { label: '口味', value: platform.taste },
                { label: '环境', value: platform.environment },
                { label: '服务', value: platform.service },
                { label: '配送', value: platform.delivery },
                { label: '包装', value: platform.packaging },
              ].map((dim) => (
                <div key={dim.label} className="card-standard p-3 flex items-center gap-3">
                  <span className="text-body-sm text-gray-500 w-8">{dim.label}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(dim.value / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-body-sm font-semibold text-gray-900 w-8 text-right">{dim.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
