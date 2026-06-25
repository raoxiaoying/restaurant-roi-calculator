import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const BusinessOverview = () => {
  const { data } = useData();
  const go = useGo();
  const revenue = data.revenue;

  const achievementRate = (revenue.total / revenue.target) * 100;

  const getTrendIcon = (current: number, previous: number, isNegative = false) => {
    const diff = current - previous;
    if (isNegative) {
      return diff < 0 ? <TrendingUp className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
    }
    return diff >= 0 ? <TrendingUp className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <button 
        onClick={() => go('/revenue/total')}
        className="w-full metric-card p-5 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-caption mb-1">营收达成率</div>
            <div className="text-metric font-bold text-primary-600">{achievementRate.toFixed(1)}%</div>
          </div>
          <div className={`kpi-tag ${achievementRate >= 80 ? 'bg-success-500' : achievementRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
            {achievementRate >= 100 ? '超额' : achievementRate >= 80 ? '良好' : achievementRate >= 60 ? '预警' : '异常'}
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <div className="text-caption mb-1">营收</div>
            <div className="text-metric-sm font-semibold">{formatCurrency(revenue.total)}</div>
          </div>
          <div className="flex-1">
            <div className="text-caption mb-1">目标</div>
            <div className="text-metric-sm font-semibold text-text-secondary">{formatCurrency(revenue.target)}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {getTrendIcon(revenue.total, revenue.yesterday)}
            <span className="text-caption">较昨日 {(Math.abs(revenue.total - revenue.yesterday) / revenue.yesterday * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon(revenue.total, revenue.lastWeek)}
            <span className="text-caption">较上周 {(Math.abs(revenue.total - revenue.lastWeek) / revenue.lastWeek * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-end text-primary-500">
          <span className="text-xs font-medium">查看详情</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => go('/revenue/dine-in')}
          className="card-standard p-4 hover:shadow-md transition-shadow"
        >
          <div className="text-caption mb-2">堂食营收</div>
          <div className="text-metric-sm font-semibold text-text-primary">{formatCurrency(revenue.dineIn)}</div>
          <div className="text-caption mt-2">
            达成率 {(revenue.dineIn / revenue.dineInTarget * 100).toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center justify-end text-primary-500">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </button>

        <button 
          onClick={() => go('/revenue/delivery')}
          className="card-standard p-4 hover:shadow-md transition-shadow"
        >
          <div className="text-caption mb-2">外卖营收</div>
          <div className="text-metric-sm font-semibold text-text-primary">{formatCurrency(revenue.delivery)}</div>
          <div className="text-caption mt-2">
            达成率 {(revenue.delivery / revenue.deliveryTarget * 100).toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center justify-end text-primary-500">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
