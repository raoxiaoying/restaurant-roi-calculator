import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const InventoryEfficiency = () => {
  const { data } = useData();
  const inventory = data.inventory;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'out': return 'bg-danger-100 text-danger-600';
      case 'low': return 'bg-warning-100 text-warning-600';
      default: return 'bg-success-100 text-success-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out': return '缺货';
      case 'low': return '库存不足';
      default: return '正常';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}万`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="库存效率" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">库存周转率</div>
              <div className={`text-metric font-bold ${inventory.turnoverRate >= inventory.target ? 'text-success-500' : inventory.turnoverRate >= inventory.target * 0.8 ? 'text-warning-500' : 'text-danger-500'}`}>
                {inventory.turnoverRate}次/月
              </div>
            </div>
            <div className={`kpi-tag ${inventory.turnoverRate >= inventory.target ? 'bg-success-500' : inventory.turnoverRate >= inventory.target * 0.8 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {inventory.turnoverRate >= inventory.target ? '达标' : inventory.turnoverRate >= inventory.target * 0.8 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-text-primary">{inventory.turnoverRate}</div>
              <div className="text-caption mt-1">周转率</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-danger-500">{inventory.outOfStockCount}</div>
              <div className="text-caption mt-1">缺货项</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-warning-500">{inventory.slowMovingCount}</div>
              <div className="text-caption mt-1">滞销项</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-text-caption" />
                <span className="text-caption">库存总值</span>
              </div>
              <span className="text-body-sm font-semibold">{formatCurrency(inventory.stockValue)}</span>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-success-500" />
            <span className="text-body-sm font-medium">周转率趋势</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventory.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}次/月`, '']} />
                <Line type="monotone" dataKey="turnoverRate" stroke="#2e72c6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-warning-500" />
            <span className="text-body-sm font-medium">库存预警</span>
          </div>
          <div className="space-y-3">
            {inventory.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-body-sm font-medium">{item.name}</div>
                  <div className="text-caption">库存 {item.quantity} / 警戒线 {item.threshold}</div>
                </div>
                <span className={`kpi-tag ${getStatusStyle(item.status)}`}>
                  {getStatusText(item.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">库存分类</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-danger-50 rounded-xl p-4">
              <div className="text-metric-sm font-semibold text-danger-600">{inventory.outOfStockCount}</div>
              <div className="text-caption mt-1">缺货商品</div>
            </div>
            <div className="bg-warning-50 rounded-xl p-4">
              <div className="text-metric-sm font-semibold text-warning-600">{inventory.slowMovingCount}</div>
              <div className="text-caption mt-1">滞销商品</div>
            </div>
            <div className="bg-success-50 rounded-xl p-4">
              <div className="text-metric-sm font-semibold text-success-600">{inventory.items.length - inventory.outOfStockCount - inventory.slowMovingCount}</div>
              <div className="text-caption mt-1">正常商品</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-metric-sm font-semibold text-text-primary">{inventory.items.length}</div>
              <div className="text-caption mt-1">商品总数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
