import { DrillDownHeader } from './DrillDownHeader';
import { Star, Truck } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const VoiceDeliveryRatings = () => {
  const { data } = useData();
  const deliveryPlatforms = data.voice.platforms.filter(p => ['美团外卖', '京东外卖'].includes(p.platform));

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="外卖平台口碑" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {deliveryPlatforms.map((platform) => (
            <div key={platform.platform} className="metric-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary-500" />
                  <span className="text-body-sm font-medium">{platform.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-warning-400 text-warning-400" />
                <div className="text-metric-sm font-bold text-primary-600">{platform.rating}</div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-caption">好评率</div>
                  <div className="text-body-sm font-semibold text-success-600">{platform.positiveRate}%</div>
                </div>
                <div>
                  <div className="text-caption">评价数</div>
                  <div className="text-body-sm font-semibold text-text-primary">{platform.reviewCount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">评分对比</div>
          <div className="space-y-4">
            {deliveryPlatforms.map((platform) => (
              <div key={platform.platform}>
                <div className="text-caption font-medium mb-2">{platform.platform}</div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((score) => (
                    <div key={score} className="flex items-center gap-2">
                      <div className="w-8 text-caption">{score}星</div>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${score >= 4 ? 'bg-success-500' : score >= 3 ? 'bg-warning-500' : 'bg-danger-500'}`}
                          style={{ width: score >= 5 ? '55%' : score === 4 ? '30%' : score === 3 ? '10%' : score === 2 ? '4%' : '1%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">外卖配送指标</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-success-600">98%</div>
              <div className="text-caption mt-1">准时送达率</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-warning-600">25分钟</div>
              <div className="text-caption mt-1">平均配送时间</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-success-600">4.8</div>
              <div className="text-caption mt-1">包装评分</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-danger-600">2%</div>
              <div className="text-caption mt-1">差评率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
