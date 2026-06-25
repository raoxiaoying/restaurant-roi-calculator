import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const FoodCost = () => {
  const { data } = useData();
  const foodCost = data.foodCost;

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    return diff < 0 ? <TrendingUp className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
  };

  const getLossChangeColor = (change: number) => {
    return change >= 0 ? 'text-danger-500' : 'text-success-500';
  };

  const barColors = ['#ef4444', '#f59e0b', '#2e72c6', '#22c55e', '#999'];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="食材成本" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">食材成本率</div>
              <div className={`text-metric font-bold ${foodCost.rate > foodCost.target ? 'text-danger-500' : 'text-success-500'}`}>
                {foodCost.rate}%
              </div>
            </div>
            <div className={`kpi-tag ${foodCost.rate <= foodCost.target ? 'bg-success-500' : foodCost.rate <= foodCost.target + 2 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {foodCost.rate <= foodCost.target ? '达标' : foodCost.rate <= foodCost.target + 2 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">目标</div>
              <div className="text-metric-sm font-semibold text-text-secondary">{foodCost.target}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">实际</div>
              <div className={`text-metric-sm font-semibold ${foodCost.rate > foodCost.target ? 'text-danger-500' : 'text-success-500'}`}>
                {foodCost.rate}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(foodCost.rate, foodCost.yesterday)}
              <span className="text-caption">较昨日 {(foodCost.rate - foodCost.yesterday).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(foodCost.rate, foodCost.lastWeek)}
              <span className="text-caption">较上周 {(foodCost.rate - foodCost.lastWeek).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">成本率趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={foodCost.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="target" stroke="#999" strokeWidth={1} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500" />
              <span className="text-body-sm font-medium">损耗明细</span>
            </div>
          </div>
          <div className="space-y-3">
            {foodCost.lossDetails.map((item) => (
              <div key={item.itemName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-body-sm font-medium">{item.itemName}</div>
                  <div className="text-caption">损耗率 {item.lossRate}%</div>
                </div>
                <div className="text-right">
                  <div className="text-body-sm font-semibold text-danger-500">¥{item.lossAmount}</div>
                  <div className={`text-caption ${getLossChangeColor(item.change)}`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">赠菜明细</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodCost.complimentaryDetails} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="dishName" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip formatter={(value, name) => name === 'cost' ? [`¥${value}`, '成本'] : [`${value}份`, '数量']} />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                  {foodCost.complimentaryDetails.map((entry, index) => (
                    <Cell key={entry.dishName} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
