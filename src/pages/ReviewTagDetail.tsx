import { useParams } from 'react-router-dom';
import { DrillDownHeader } from './DrillDownHeader';
import { Tag, Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const ReviewTagDetail = () => {
  const { tag } = useParams<{ tag: string }>();
  const { data } = useData();

  const tagData = data.voice.tags.find(t => t.tag === tag);
  const reviewsWithTag = data.voice.reviews.filter(r => r.tags.includes(tag || ''));

  const sentimentColors = {
    positive: 'bg-success-50 text-success-600',
    negative: 'bg-danger-50 text-danger-600',
    neutral: 'bg-gray-100 text-text-secondary',
  };

  const sentimentText = {
    positive: '正面',
    negative: '负面',
    neutral: '中性',
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="标签详情" subtitle={tag} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-6 h-6 text-primary-500" />
              <div className="text-metric font-bold text-primary-600">{tag}</div>
            </div>
            <span className={`kpi-tag ${sentimentColors[tagData?.sentiment || 'neutral']}`}>
              {sentimentText[tagData?.sentiment || 'neutral']}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-4 h-4 text-success-500" />
                <span className="text-caption">出现次数</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-primary">{tagData?.count || 0}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ThumbsDown className="w-4 h-4 text-danger-500" />
                <span className="text-caption">占比</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-primary">
                {(((tagData?.count || 0) / data.voice.tags.reduce((sum, t) => sum + t.count, 0)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">相关评价</div>
          <div className="space-y-4">
            {reviewsWithTag.map((review) => (
              <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-medium">{review.platform}</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'fill-warning-400 text-warning-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="text-body-sm text-text-primary">{review.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">同类标签</div>
          <div className="flex flex-wrap gap-2">
            {data.voice.tags
              .filter(t => t.sentiment === tagData?.sentiment && t.tag !== tag)
              .slice(0, 6)
              .map((t) => (
                <span key={t.tag} className={`px-3 py-1 rounded-full text-xs font-medium ${sentimentColors[t.sentiment]}`}>
                  {t.tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
