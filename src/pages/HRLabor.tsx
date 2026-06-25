import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calculator } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const HRLabor = () => {
  const { data } = useData();
  const hr = data.hr;

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

  

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="人效分析" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">人效（营收/人数）</div>
              <div className="text-metric font-bold text-primary-600">{formatCurrency(hr.laborEfficiency)}</div>
            </div>
            <div className={`kpi-tag ${hr.laborEfficiency >= hr.target ? 'bg-success-500' : hr.laborEfficiency >= hr.target * 0.8 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {hr.laborEfficiency >= hr.target ? '达标' : hr.laborEfficiency >= hr.target * 0.8 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-text-caption" />
                <span className="text-caption">目标</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-secondary">{formatCurrency(hr.target)}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption">实际</span>
              </div>
              <div className="text-metric-sm font-semibold text-primary-600">{formatCurrency(hr.laborEfficiency)}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(hr.laborEfficiency, hr.yesterday)}
              <span className="text-caption">较昨日 +10.6%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(hr.laborEfficiency, hr.lastWeek)}
              <span className="text-caption">较上周 +5.4%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-primary-500" />
            <span className="text-body-sm font-medium">人效归因分析</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-center mb-4">
              <div className="text-caption mb-1">人效差距</div>
              <div className="text-metric font-bold text-danger-500">-{formatCurrency(hr.attribution.gapAmount)}</div>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: '营收因子', value: hr.attribution.revenueImpact.total, color: '#2e72c6' },
                  { name: '人数因子', value: hr.attribution.headcountImpact.total, color: '#ef4444' },
                ]}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`-${formatCurrency(Math.abs(value as number))}`, '影响']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {[{ name: '营收因子', color: '#2e72c6' }, { name: '人数因子', color: '#ef4444' }].map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-caption mb-2">营收因子影响</div>
              {hr.attribution.revenueImpact.factors.map((factor) => (
                <div key={factor.label} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <span className="text-body-sm">{factor.label}</span>
                  <span className="text-body-sm font-semibold text-danger-500">-{formatCurrency(Math.abs(factor.amount))}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-caption mb-2">人数因子影响</div>
              {hr.attribution.headcountImpact.factors.map((factor) => (
                <div key={factor.label} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <span className="text-body-sm">{factor.label}</span>
                  <span className="text-body-sm font-semibold text-danger-500">-{formatCurrency(Math.abs(factor.amount))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">排班效率趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hr.scheduleTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="efficiency" stroke="#2e72c6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">人力结构</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-primary-600">18</div>
              <div className="text-caption mt-1">正式工</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-success-600">12</div>
              <div className="text-caption mt-1">小时工</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
