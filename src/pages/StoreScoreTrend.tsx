import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Star, TrendingUp, Award } from 'lucide-react';
import { useData } from '@/context/DataContext';

export const StoreScoreTrend = () => {
  const { data } = useData();

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#2e72c6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title="店分趋势" subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">当前店分</div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-warning-400 text-warning-400" />
                <div className="text-metric font-bold text-primary-600">{data.storeScore}</div>
              </div>
            </div>
            <div className={`kpi-tag ${
              data.storeScore >= 90 ? 'bg-success-500' : 
              data.storeScore >= 80 ? 'bg-primary-500' : 
              data.storeScore >= 70 ? 'bg-warning-500' : 'bg-danger-500'
            } text-white`}>
              {data.storeScore >= 90 ? '优秀' : data.storeScore >= 80 ? '良好' : data.storeScore >= 70 ? '待提升' : '需整改'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-success-600">+3</div>
              <div className="text-caption mt-1">较上月</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-text-primary">85</div>
              <div className="text-caption mt-1">区域排名</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="text-metric-sm font-semibold text-warning-600">4</div>
              <div className="text-caption mt-1">连续达标</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-success-500" />
            <span className="text-body-sm font-medium">店分趋势</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.storeScoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[70, 100]} />
                <Tooltip formatter={(value) => [`${value}分`, '']} />
                <Line type="monotone" dataKey="score" stroke="#2e72c6" strokeWidth={2} dot={{ fill: '#2e72c6', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-warning-500" />
            <span className="text-body-sm font-medium">店分构成</span>
          </div>
          <div className="space-y-4">
            {data.internalAudit.dimensions.map((dimension) => (
              <div key={dimension.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-medium">{dimension.name}</span>
                  <span className={`text-body-sm font-semibold`} style={{ color: getScoreColor(dimension.score) }}>
                    {dimension.score}分
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(dimension.score / dimension.maxScore) * 100}%`, backgroundColor: getScoreColor(dimension.score) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">提升建议</div>
          <div className="space-y-3">
            {[
              { title: '服务质量提升', suggestion: '加强员工服务培训，提高迎宾热情度', priority: 'high' },
              { title: '食品安全优化', suggestion: '完善食材储存温度控制流程', priority: 'medium' },
              { title: '菜品呈现改进', suggestion: '提升菜品摆盘美观度', priority: 'low' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className={`kpi-tag ${item.priority === 'high' ? 'bg-danger-500' : item.priority === 'medium' ? 'bg-warning-500' : 'bg-gray-400'} text-white`}>
                  {item.priority === 'high' ? '紧急' : item.priority === 'medium' ? '中等' : '一般'}
                </span>
                <div>
                  <div className="text-body-sm font-medium">{item.title}</div>
                  <div className="text-caption mt-1">{item.suggestion}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
