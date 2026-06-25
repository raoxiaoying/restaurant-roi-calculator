import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingDown, Users, AlertTriangle } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const HRTurnover = () => {
  const { data } = useData();
  const hr = data.hr;

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="离职分析" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">离职率</div>
              <div className={`text-metric font-bold ${hr.turnoverRate <= 10 ? 'text-success-500' : hr.turnoverRate <= 15 ? 'text-warning-500' : 'text-danger-500'}`}>
                {hr.turnoverRate}%
              </div>
            </div>
            <div className={`kpi-tag ${hr.turnoverRate <= 10 ? 'bg-success-500' : hr.turnoverRate <= 15 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {hr.turnoverRate <= 10 ? '正常' : hr.turnoverRate <= 15 ? '预警' : '异常'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">本月离职</div>
              <div className="text-metric-sm font-semibold text-danger-500">3人</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">在职人数</div>
              <div className="text-metric-sm font-semibold text-text-primary">30人</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-4 h-4 text-danger-500" />
            <span className="text-body-sm font-medium">离职率趋势</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hr.turnoverTrend}>
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
            <span className="text-body-sm font-medium">离职原因</span>
          </div>
          <div className="space-y-3">
            {[
              { reason: '薪资待遇', count: 8, percentage: 32 },
              { reason: '工作压力', count: 6, percentage: 24 },
              { reason: '个人发展', count: 5, percentage: 20 },
              { reason: '通勤距离', count: 4, percentage: 16 },
              { reason: '其他', count: 2, percentage: 8 },
            ].map((item) => (
              <div key={item.reason} className="flex items-center gap-3">
                <div className="w-28 text-caption">{item.reason}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${item.percentage >= 20 ? 'bg-danger-500' : item.percentage >= 10 ? 'bg-warning-500' : 'bg-gray-400'}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right">
                  <div className="text-body-sm font-medium">{item.count}人</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary-500" />
            <span className="text-body-sm font-medium">离职人员明细</span>
          </div>
          <div className="space-y-3">
            {[
              { name: '张三', position: '前厅服务员', tenure: '6个月', reason: '薪资待遇' },
              { name: '李四', position: '后厨帮工', tenure: '3个月', reason: '工作压力' },
              { name: '王五', position: '收银员', tenure: '9个月', reason: '个人发展' },
            ].map((employee) => (
              <div key={employee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-body-sm font-medium">{employee.name}</div>
                  <div className="text-caption">{employee.position} · {employee.tenure}</div>
                </div>
                <div className="text-caption text-danger-500">{employee.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
