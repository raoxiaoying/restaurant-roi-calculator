import { useState } from 'react';
import { DrillDownHeader } from './DrillDownHeader';
import { Star, Filter } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const VoiceReviews = () => {
  const { data } = useData();
  const go = useGo();
  const [filter, setFilter] = useState<string>('all');

  const platforms = ['all', ...new Set(data.voice.reviews.map(r => r.platform))];

  const filteredReviews = filter === 'all' 
    ? data.voice.reviews 
    : data.voice.reviews.filter(r => r.platform === filter);

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="顾客评价" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-text-caption" />
            <span className="text-caption">平台筛选</span>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setFilter(platform)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === platform
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                }`}
              >
                {platform === 'all' ? '全部' : platform}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="card-standard p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
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
                <span className="text-caption">{review.time}</span>
              </div>
              <div className="text-body-sm text-text-primary mb-3">{review.content}</div>
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => go(`/voice/tag/${tag}`)}
                    className="px-3 py-1 bg-gray-100 text-caption rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
