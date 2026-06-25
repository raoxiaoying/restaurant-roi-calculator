import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const HRTraining = () => {
  const { data } = useData();
  const hr = data.hr;

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="员工训练" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">训练完成率</div>
              <div className="text-metric font-bold text-primary-600">{hr.trainingRate}%</div>
            </div>
            <div className={`kpi-tag ${hr.trainingRate >= 80 ? 'bg-success-500' : hr.trainingRate >= 60 ? 'bg-warning-500' : 'bg-danger-500'} text-white`}>
              {hr.trainingRate >= 80 ? '优秀' : hr.trainingRate >= 60 ? '良好' : '待提升'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">已训练员工</div>
              <div className="text-metric-sm font-semibold text-success-600">21人</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-caption mb-1">待训练员工</div>
              <div className="text-metric-sm font-semibold text-warning-600">8人</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-success-500" />
            <span className="text-body-sm font-medium">训练率趋势</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hr.trainingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-primary-500" />
            <span className="text-body-sm font-medium">训练课程</span>
          </div>
          <div className="space-y-3">
            {[
              { name: '服务礼仪', completed: 25, total: 30 },
              { name: '菜品知识', completed: 22, total: 30 },
              { name: 'POS系统操作', completed: 28, total: 30 },
              { name: '食品安全', completed: 20, total: 30 },
              { name: '应急处理', completed: 18, total: 30 },
            ].map((course) => (
              <div key={course.name} className="flex items-center gap-3">
                <div className="w-24 text-caption">{course.name}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(course.completed / course.total) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <div className="text-body-sm font-medium">{course.completed}/{course.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
