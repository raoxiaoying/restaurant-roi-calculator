import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const RevenueTotal = () => {
  const { data } = useData();
  const revenue = data.revenue;

  const achievementRate = (revenue.total / revenue.target) * 100;

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    return diff >= 0 ? <TrendingUp className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  };

  const barColors = ['#2e72c6', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="营收总览" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">营收达成率</div>
              <div className="text-metric font-bold text-primary-600">{achievementRate.toFixed(1)}%</div>
            </div>
            <div className={`kpi-tag ${achievementRate >= 80 ? 'bg-success-500' : achievementRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {achievementRate >= 100 ? '超额' : achievementRate >= 80 ? '良好' : achievementRate >= 60 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-text-caption" />
                <span className="text-caption">目标</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-secondary">{formatCurrency(revenue.target)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption">实际</span>
              </div>
              <div className="text-metric-sm font-semibold text-primary-600">{formatCurrency(revenue.total)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.total, revenue.yesterday)}
              <span className="text-caption">较昨日 +{(revenue.total - revenue.yesterday) / revenue.yesterday * 100}%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.total, revenue.lastWeek)}
              <span className="text-caption">较上周 +{(revenue.total - revenue.lastWeek) / revenue.lastWeek * 100}%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">达成趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                <Line type="monotone" dataKey="value" stroke="#2e72c6" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#999" strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">渠道拆解</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue.channels} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {revenue.channels.map((entry, index) => (
                    <Cell key={entry.name} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">餐段拆解</div>
          <div className="space-y-3">
            {revenue.periods.map((period) => (
              <div key={period.name} className="flex items-center gap-3">
                <div className="w-24 text-caption">{period.name}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${period.percentage}%` }}
                  />
                </div>
                <div className="w-20 text-right">
                  <div className="text-body-sm font-medium">{formatCurrency(period.value)}</div>
                  <div className="text-caption">{period.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
