import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const AuditSoldOut = () => {
  const { data } = useData();
  const soldOut = data.soldOut;

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    return diff < 0 ? <TrendingDown className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
  };

  const barColors = ['#ef4444', '#f59e0b', '#2e72c6', '#22c55e', '#999'];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="沽清分析" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">沽清率</div>
              <div className={`text-metric font-bold ${soldOut.rate <= soldOut.target ? 'text-success-500' : soldOut.rate <= soldOut.target + 2 ? 'text-warning-500' : 'text-danger-500'}`}>
                {soldOut.rate}%
              </div>
            </div>
            <div className={`kpi-tag ${soldOut.rate <= soldOut.target ? 'bg-success-500' : soldOut.rate <= soldOut.target + 2 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {soldOut.rate <= soldOut.target ? '达标' : soldOut.rate <= soldOut.target + 2 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">目标</div>
              <div className="text-metric-sm font-semibold text-text-secondary">{soldOut.target}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">实际</div>
              <div className={`text-metric-sm font-semibold ${soldOut.rate <= soldOut.target ? 'text-success-500' : 'text-danger-500'}`}>
                {soldOut.rate}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(soldOut.rate, soldOut.yesterday)}
              <span className="text-caption">较昨日 {(soldOut.rate - soldOut.yesterday).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(soldOut.rate, soldOut.lastWeek)}
              <span className="text-caption">较上周 {(soldOut.rate - soldOut.lastWeek).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">沽清率趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={soldOut.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning-500" />
            <span className="text-body-sm font-medium">沽清菜品</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={soldOut.items}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}次`, '沽清']} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {soldOut.items.map((entry, index) => (
                    <Cell key={entry.name} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">沽清明细</div>
          <div className="space-y-3">
            {soldOut.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-body-sm font-medium">{item.name}</div>
                  <div className="text-caption">{item.category}</div>
                </div>
                <div className="text-body-sm font-semibold text-danger-500">{item.count}次</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
