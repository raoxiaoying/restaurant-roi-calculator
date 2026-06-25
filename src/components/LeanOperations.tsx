import { TrendingUp, TrendingDown, PieChart, ArrowUpRight } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const LeanOperations = () => {
  const { data } = useData();
  const go = useGo();
  const { foodCost, hr, kitchen, audit, soldOut, inventory } = data;

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

  const pieData = [
    { name: '退', value: audit.refund, color: '#ef4444' },
    { name: '赠', value: audit.complimentary, color: '#f59e0b' },
    { name: '改', value: audit.modify, color: '#2e72c6' },
  ];

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="card-standard p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-body-sm font-medium">精益运营</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => go('/food-cost')} className="text-left">
            <div className="text-caption mb-1">食材成本率</div>
            <div className="text-metric-sm font-semibold text-text-primary">{foodCost.rate}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(foodCost.rate, foodCost.yesterday, true)}
              <span className="text-caption">目标 {foodCost.target}%</span>
            </div>
          </button>

          <button onClick={() => go('/hr/labor')} className="text-left">
            <div className="text-caption mb-1">人效</div>
            <div className="text-metric-sm font-semibold text-text-primary">{formatCurrency(hr.laborEfficiency)}</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(hr.laborEfficiency, hr.yesterday)}
              <span className="text-caption">目标 {formatCurrency(hr.target)}</span>
            </div>
          </button>

          <button onClick={() => go('/kitchen')} className="text-left">
            <div className="text-caption mb-1">出餐效率</div>
            <div className="text-metric-sm font-semibold text-text-primary">{kitchen.avgTime}分钟</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(kitchen.avgTime, kitchen.yesterday, true)}
              <span className="text-caption">目标 {kitchen.target}分钟</span>
            </div>
          </button>

          <button onClick={() => go('/sold-out')} className="text-left">
            <div className="text-caption mb-1">沽清率</div>
            <div className="text-metric-sm font-semibold text-text-primary">{soldOut.rate}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(soldOut.rate, soldOut.yesterday, true)}
              <span className="text-caption">目标 {soldOut.target}%</span>
            </div>
          </button>
        </div>
      </div>

      <div className="card-standard p-4">
        <button onClick={() => go('/audit/adjustments')} className="w-full flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary-500" />
            <span className="text-body-sm font-medium">退赠改合计</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-metric-sm font-semibold text-danger-500">{formatCurrency(audit.total)}</span>
            <ArrowUpRight className="w-4 h-4 text-text-caption" />
          </div>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="w-24 h-24">
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
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-caption">退</span>
              <span className="text-body-sm font-medium text-danger-500">{formatCurrency(audit.refund)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption">赠</span>
              <span className="text-body-sm font-medium text-warning-500">{formatCurrency(audit.complimentary)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-caption">改</span>
              <span className="text-body-sm font-medium text-primary-500">{formatCurrency(audit.modify)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-standard p-4">
        <button onClick={() => go('/inventory')} className="w-full text-left">
          <div className="text-caption mb-1">库存效率</div>
          <div className="text-metric-sm font-semibold text-text-primary">{inventory.turnoverRate}次/月</div>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-caption">缺货 {inventory.outOfStockCount}项</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-caption">滞销 {inventory.slowMovingCount}项</span>
            </div>
          </div>
        </button>
      </div>

      <div className="card-standard p-4">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => go('/hr/training')} className="text-left">
            <div className="text-caption mb-1">训练率</div>
            <div className="text-metric-sm font-semibold text-text-primary">{hr.trainingRate}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(hr.trainingRate, hr.trainingRate * 0.9)}
              <span className="text-caption">持续提升</span>
            </div>
          </button>

          <button onClick={() => go('/hr/turnover')} className="text-left">
            <div className="text-caption mb-1">离职率</div>
            <div className="text-metric-sm font-semibold text-text-primary">{hr.turnoverRate}%</div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(hr.turnoverRate, hr.turnoverRate * 1.1, true)}
              <span className="text-caption">低于预警线</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
