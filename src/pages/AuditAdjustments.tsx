import { useState } from 'react';
import { DrillDownHeader } from './DrillDownHeader';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RefreshCw, AlertCircle, Gift, Edit3, Tag } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const AuditAdjustments = () => {
  const { data } = useData();
  const audit = data.audit;
  const [activeTab, setActiveTab] = useState<'all' | 'refund' | 'complimentary' | 'modify' | 'price'>('all');

  const tabs = [
    { key: 'all', label: '全部', icon: RefreshCw },
    { key: 'refund', label: '退', icon: AlertCircle },
    { key: 'complimentary', label: '赠', icon: Gift },
    { key: 'modify', label: '改', icon: Edit3 },
    { key: 'price', label: '价', icon: Tag },
  ] as const;

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  };

  const pieData = [
    { name: '退', value: audit.refund, color: '#ef4444' },
    { name: '赠', value: audit.complimentary, color: '#f59e0b' },
    { name: '改', value: audit.modify, color: '#2e72c6' },
    { name: '价', value: audit.price, color: '#22c55e' },
  ];

  const filteredItems = activeTab === 'all' 
    ? audit.items 
    : audit.items.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="退赠改稽核" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">退赠改合计</div>
              <div className="text-metric font-bold text-danger-500">{formatCurrency(audit.total)}</div>
            </div>
            <div className="kpi-tag bg-danger-500 text-white">
              占营收 {(audit.total / data.revenue.total * 100).toFixed(2)}%
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={20} outerRadius={38} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="text-body-sm font-semibold text-danger-500">{formatCurrency(audit.refund)}</div>
                <div className="text-caption">退</div>
              </div>
              <div className="text-center">
                <div className="text-body-sm font-semibold text-warning-500">{formatCurrency(audit.complimentary)}</div>
                <div className="text-caption">赠</div>
              </div>
              <div className="text-center">
                <div className="text-body-sm font-semibold text-primary-500">{formatCurrency(audit.modify)}</div>
                <div className="text-caption">改</div>
              </div>
              <div className="text-center">
                <div className="text-body-sm font-semibold text-success-500">{formatCurrency(audit.price)}</div>
                <div className="text-caption">价</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex gap-2 mb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.orderNo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-body-sm font-medium">{item.orderNo}</div>
                  <div className="text-caption">{item.reason} · {item.time}</div>
                </div>
                <div className="text-body-sm font-semibold text-danger-500">-¥{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
