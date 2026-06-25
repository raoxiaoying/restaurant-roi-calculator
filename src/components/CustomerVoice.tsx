import { Star, MessageCircle, ArrowUpRight } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const CustomerVoice = () => {
  const { data } = useData();
  const go = useGo();
  const voice = data.voice;

  const platformLinks: Record<string, string> = {
    '美团美食': '/voice/meituan',
    '大众点评': '/voice/dianping',
    '淘宝闪购': '/voice/meituan',
    '美团外卖': '/voice/delivery-ratings',
    '京东外卖': '/voice/delivery-ratings',
  };

  const getTagColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-success-50 text-success-600';
      case 'negative': return 'bg-danger-50 text-danger-600';
      default: return 'bg-gray-100 text-text-secondary';
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary-500" />
            <span className="text-body-sm font-medium">顾客口碑</span>
          </div>
          <button onClick={() => go('/voice/reviews')} className="flex items-center gap-1 text-primary-500">
            <span className="text-xs">查看全部</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {voice.platforms.map((platform) => (
            <button
              key={platform.platform}
              onClick={() => go(platformLinks[platform.platform])}
              className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-3 h-3 fill-warning-400 text-warning-400" />
                <span className="text-xs font-medium">{platform.rating}</span>
              </div>
              <div className="text-caption truncate w-full text-center">{platform.platform}</div>
            </button>
          ))}
        </div>

        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={voice.radarData}>
              <PolarGrid stroke="#e5e5e5" />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: '#666', fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#999', fontSize: 8 }} />
              <Radar name="口碑" dataKey="value" stroke="#2e72c6" fill="#2e72c6" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="text-caption mb-2">评价标签</div>
          <div className="flex flex-wrap gap-2">
            {voice.tags.slice(0, 8).map((tag) => (
              <button
                key={tag.tag}
                onClick={() => go(`/voice/tag/${tag.tag}`)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag.sentiment)} hover:opacity-80 transition-opacity`}
              >
                {tag.tag}
                <span className="ml-1 opacity-70">{tag.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
