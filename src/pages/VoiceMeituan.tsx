import { DrillDownHeader } from './DrillDownHeader';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const VoiceMeituan = () => {
  const { data } = useData();
  const platform = data.voice.platforms.find(p => p.platform === '美团美食') || data.voice.platforms[0];

  const reviews = data.voice.reviews.filter(r => r.platform === '美团美食');

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="美团美食口碑" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">综合评分</div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-warning-400 text-warning-400" />
                <div className="text-metric font-bold text-primary-600">{platform.rating}</div>
              </div>
            </div>
            <div className="kpi-tag bg-warning-500 text-white">
              4.5分以上
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-4 h-4 text-success-500" />
                <span className="text-caption">好评率</span>
              </div>
              <div className="text-metric-sm font-semibold text-success-600">{platform.positiveRate}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-4 h-4 text-text-caption" />
                <span className="text-caption">评价数</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-primary">{platform.reviewCount}</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">评分分布</div>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((score) => (
              <div key={score} className="flex items-center gap-3">
                <div className="w-12 text-caption">{score}星</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${score >= 4 ? 'bg-success-500' : score >= 3 ? 'bg-warning-500' : 'bg-danger-500'}`}
                    style={{ width: score >= 5 ? '65%' : score === 4 ? '25%' : score === 3 ? '7%' : score === 2 ? '2%' : '1%' }}
                  />
                </div>
                <div className="w-12 text-right text-body-sm font-medium">
                  {score >= 5 ? '65%' : score === 4 ? '25%' : score === 3 ? '7%' : score === 2 ? '2%' : '1%'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">最新评价</div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'fill-warning-400 text-warning-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-caption">{review.time}</span>
                </div>
                <div className="text-body-sm text-text-primary">{review.content}</div>
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {review.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-200 text-caption rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
