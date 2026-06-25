import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Timer, TrendingDown, Clock } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const KitchenEfficiency = () => {
  const { data } = useData();
  const kitchen = data.kitchen;

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    return diff < 0 ? <TrendingDown className="w-4 h-4 text-success-500" /> : <TrendingDown className="w-4 h-4 text-danger-500" />;
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="出餐效率" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">平均出餐时长</div>
              <div className={`text-metric font-bold ${kitchen.avgTime <= kitchen.target ? 'text-success-500' : kitchen.avgTime <= kitchen.target + 3 ? 'text-warning-500' : 'text-danger-500'}`}>
                {kitchen.avgTime}分钟
              </div>
            </div>
            <div className={`kpi-tag ${kitchen.avgTime <= kitchen.target ? 'bg-success-500' : kitchen.avgTime <= kitchen.target + 3 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {kitchen.avgTime <= kitchen.target ? '达标' : kitchen.avgTime <= kitchen.target + 3 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-text-caption" />
                <span className="text-caption">目标</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-secondary">{kitchen.target}分钟</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-caption">实际</span>
              </div>
              <div className={`text-metric-sm font-semibold ${kitchen.avgTime <= kitchen.target ? 'text-success-500' : 'text-danger-500'}`}>
                {kitchen.avgTime}分钟
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {getTrendIcon(kitchen.avgTime, kitchen.yesterday)}
              <span className="text-caption">较昨日 {(kitchen.avgTime - kitchen.yesterday).toFixed(1)}分钟</span>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(kitchen.avgTime, kitchen.lastWeek)}
              <span className="text-caption">较上周 {(kitchen.avgTime - kitchen.lastWeek).toFixed(1)}分钟</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">出餐时长趋势</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kitchen.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}分钟`, '']} />
                <Line type="monotone" dataKey="avgTime" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="peakTime" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">时段对比</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-warning-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-warning-500" />
                <span className="text-caption">高峰期</span>
              </div>
              <div className="text-metric-sm font-semibold text-warning-600">{kitchen.peakTime}分钟</div>
            </div>
            <div className="bg-success-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-success-500" />
                <span className="text-caption">平峰期</span>
              </div>
              <div className="text-metric-sm font-semibold text-success-600">{kitchen.offPeakTime}分钟</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">菜品出餐时长排行</div>
          <div className="space-y-3">
            {[
              { name: '招牌红烧肉', time: 22, status: 'slow' },
              { name: '清蒸鲈鱼', time: 20, status: 'slow' },
              { name: '蒜蓉西兰花', time: 8, status: 'fast' },
              { name: '米饭', time: 3, status: 'fast' },
              { name: '酸梅汤', time: 2, status: 'fast' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-body-sm font-medium">{item.name}</div>
                <div className={`text-body-sm font-semibold ${item.status === 'slow' ? 'text-danger-500' : 'text-success-500'}`}>
                  {item.time}分钟
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
