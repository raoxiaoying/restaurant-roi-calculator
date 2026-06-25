import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Users } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const HRSchedule = () => {
  const { data } = useData();
  const hr = data.hr;

  

  const areas = [...new Set(hr.scheduleItems.map(item => item.area))];
  const periods = [...new Set(hr.scheduleItems.map(item => item.period))];
  const workerTypes = [...new Set(hr.scheduleItems.map(item => item.workerType))];

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="排班效率" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">排班效率</div>
              <div className="text-metric font-bold text-primary-600">{hr.scheduleEfficiency}%</div>
            </div>
            <div className={`kpi-tag ${hr.scheduleEfficiency >= 85 ? 'bg-success-500' : hr.scheduleEfficiency >= 70 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {hr.scheduleEfficiency >= 85 ? '高效' : hr.scheduleEfficiency >= 70 ? '一般' : '低效'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-text-caption" />
                <span className="text-caption">总人数</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-primary">30</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-text-caption" />
                <span className="text-caption">总工时</span>
              </div>
              <div className="text-metric-sm font-semibold text-text-primary">216小时</div>
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
          <div className="text-body-sm font-medium mb-4">排班明细</div>
          <div className="space-y-4">
            {periods.map((period) => (
              <div key={period}>
                <div className="text-caption font-medium mb-2">{period}</div>
                <div className="grid grid-cols-2 gap-2">
                  {areas.map((area) => (
                    <div key={area} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-body-sm font-medium">{area}</div>
                      <div className="flex items-center gap-4 mt-1">
                        {workerTypes.map((type) => {
                          const item = hr.scheduleItems.find(i => i.area === area && i.period === period && i.workerType === type);
                          return (
                            <div key={type}>
                              <div className="text-caption">{type}</div>
                              <div className="text-body-sm font-semibold">{item?.headcount || 0}人</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
