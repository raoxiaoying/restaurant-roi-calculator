import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Truck } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const RevenueDelivery = () => {
  const { data } = useData();
  const revenue = data.revenue;

  const achievementRate = (revenue.delivery / revenue.deliveryTarget) * 100;

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

  const mockDeliveryTrend = [
    { date: '1/9', value: 28200, target: 40000 },
    { date: '1/10', value: 31500, target: 40000 },
    { date: '1/11', value: 29200, target: 40000 },
    { date: '1/12', value: 33300, target: 40000 },
    { date: '1/13', value: 34100, target: 40000 },
    { date: '1/14', value: 29200, target: 40000 },
    { date: '1/15', value: 34220, target: 40000 },
  ];

  const mockPlatforms = [
    { name: '美团外卖', value: 18500, orders: 156 },
    { name: '饿了么', value: 15720, orders: 132 },
  ];

  const barColors = ['#2e72c6', '#22c55e'];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="外卖营收" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">外卖营收达成率</div>
              <div className="text-metric font-bold text-primary-600">{achievementRate.toFixed(1)}%</div>
            </div>
            <div className={`kpi-tag ${achievementRate >= 80 ? 'bg-success-500' : achievementRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {achievementRate >= 100 ? '超额' : achievementRate >= 80 ? '良好' : achievementRate >= 60 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-text-caption" />
                <span className="text-caption">目标</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-secondary">{formatCurrency(revenue.deliveryTarget)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption">实际</span>
              </div>
              <div className="text-metric-sm font-semibold text-primary-600">{formatCurrency(revenue.delivery)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.delivery, revenue.delivery * 0.92)}
              <span className="text-caption">较昨日 +8.7%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(revenue.delivery, revenue.delivery * 0.95)}
              <span className="text-caption">较上周 +5.3%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">外卖趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDeliveryTrend}>
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
          <div className="text-body-sm font-medium mb-4">平台分布</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPlatforms} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip formatter={(value, name) => name === 'value' ? [formatCurrency(value as number), ''] : [value, '订单']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mockPlatforms.map((entry, index) => (
                    <Cell key={entry.name} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">配送指标</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-primary-600">288</div>
              <div className="text-caption mt-1">订单数</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-success-600">98%</div>
              <div className="text-caption mt-1">准时送达率</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-warning-600">25分钟</div>
              <div className="text-caption mt-1">平均配送时间</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-text-primary">4.4分</div>
              <div className="text-caption mt-1">配送评分</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
