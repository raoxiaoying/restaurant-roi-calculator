import { Star, Calendar, ChevronRight } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';
import type { TimeRange } from '@/types';

export const Header = () => {
  const { data, timeRange, setTimeRange } = useData();
  const go = useGo();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 80) return 'text-primary-500';
    if (score >= 70) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getDateRange = () => {
    switch (timeRange) {
      case 'daily': return '今日';
      case 'weekly': return '本周';
      case 'monthly': return '本月';
      default: return '';
    }
  };

  return (
    <header className="bg-primary-600 text-white px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold">{data.storeName}</h1>
          <button 
            onClick={() => go('/store-score')}
            className="flex items-center gap-1 mt-1 text-sm opacity-90 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              <span className={`font-bold ${getScoreColor(data.storeScore)}`}>{data.storeScore}</span>
              <span className="text-xs opacity-70">店分</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">{getDateRange()}</div>
          <div className="text-xs opacity-70 mt-1">{data.date}</div>
        </div>
      </div>
      
      <div className="bg-primary-700/50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 opacity-70" />
          <span className="text-sm font-medium">时间维度</span>
        </div>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-white text-primary-600'
                  : 'text-white/70 hover:text-white hover:bg-primary-600'
              }`}
            >
              {range === 'daily' ? '日' : range === 'weekly' ? '周' : '月'}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
