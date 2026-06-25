import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const RevenueDineIn = () => {
  const { data } = useData();
  const revenue = data.revenue;

  const achievementRate = (revenue.dineIn / revenue.dineInTarget) * 100;

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

  const mockDineInTrend = [
    { date: '1/9', value: 48200, target: 60000 },
    { date: '1/10', value: 52500, target: 60000 },
    { date: '1/11', value: 49200, target: 60000 },
    { date: '1/12', value: 53300, target: 60000 },
    { date: '1/13', value: 56100, target: 60000 },
    { date: '1/14', value: 49200, target: 60000 },
    { date: '1/15', value: 52300, target: 60000 },
  ];

  const mockMealTypes = [
    { name: '正餐', value: 38500, percentage: 73.6 },
    { name: '下午茶', value: 6800, percentage: 13.0 },
    { name: '夜宵', value: 7000, percentage: 13.4 },
  ];

  const barColors = ['#2e72c6', '#22c55e', '#f59e0b'];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="堂食营收" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">堂食营收达成率</div>
              <div className="text-metric font-bold text-primary-600">{achievementRate.toFixed(1)}%</div>
            </div>
            <div className={`kpi-tag ${achievementRate >= 80 ? 'bg-success-500' : achievementRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {achievementRate >= 100 ? '超额' : achievementRate >= 80 ? '良好' : achievementRate >= 60 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-text-caption" />
                <span className="text-caption">目标</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-secondary">{formatCurrency(revenue.dineInTarget)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption">实际</span>
              </div>
              <div className="text-metric-sm font-semibold text-primary-600">{formatCurrency(revenue.dineIn)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.dineIn, revenue.dineIn * 0.95)}
              <span className="text-caption">较昨日 +5.2%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.dineIn, revenue.dineIn * 0.97)}
              <span className="text-caption">较上周 +3.1%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">堂食趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDineInTrend}>
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
          <div className="text-body-sm font-medium mb-4">餐型分布</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMealTypes} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), '']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mockMealTypes.map((entry, index) => (
                    <Cell key={entry.name} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">时段明细</div>
          <div className="space-y-3">
            {[
              { period: '早餐', revenue: 6200, covers: 45 },
              { period: '午餐', revenue: 22800, covers: 162 },
              { period: '晚餐', revenue: 21300, covers: 152 },
              { period: '夜宵', revenue: 2000, covers: 18 },
            ].map((item) => (
              <div key={item.period} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-body-sm font-medium">{item.period}</div>
                <div className="text-right">
                  <div className="text-body-sm font-semibold">{formatCurrency(item.revenue)}</div>
                  <div className="text-caption">{item.covers}桌</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
