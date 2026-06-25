import { useParams } from 'react-router-dom';
import { DrillDownHeader } from './DrillDownHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useData } from '@/context/DataContext';

export const InternalAuditDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useData();

  const dimension = data.internalAudit.dimensions.find(d => d.id === id);
  const details = data.internalAudit.details.find(d => d.dimensionId === id);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 80) return 'text-primary-500';
    if (score >= 70) return 'text-warning-500';
    return 'text-danger-500';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return '优秀';
      case 'good': return '良好';
      case 'warning': return '待改进';
      case 'danger': return '需整改';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <DrillDownHeader title={dimension?.name || '稽核详情'} subtitle={data.date} />
      
      <div className="px-4 py-4 space-y-4">
        <div className="metric-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-caption mb-1">评分</div>
              <div className={`text-metric font-bold ${getScoreColor(dimension?.score || 0)}`}>
                {dimension?.score}
                <span className="text-body-sm font-normal text-text-secondary ml-1">/ {dimension?.maxScore}</span>
              </div>
            </div>
            <div className={`kpi-tag ${
              (dimension?.score ?? 0) >= 90 ? 'bg-success-500' : 
              (dimension?.score ?? 0) >= 80 ? 'bg-primary-500' : 
              (dimension?.score ?? 0) >= 70 ? 'bg-warning-500' : 'bg-danger-500'
            } text-white`}>
              {getStatusText(dimension?.status || '')}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-text-primary">{details?.items.length}</div>
              <div className="text-caption mt-1">检查项数</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-metric-sm font-semibold text-success-600">
                {details?.items.filter(i => i.score >= 80).length || 0}
              </div>
              <div className="text-caption mt-1">达标项数</div>
            </div>
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">检查项详情</div>
          <div className="space-y-4">
            {details?.items.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body-sm font-medium">{item.name}</span>
                  <span className={`text-body-sm font-semibold ${getScoreColor(item.score)}`}>
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${item.score >= 80 ? 'bg-success-500' : item.score >= 70 ? 'bg-warning-500' : 'bg-danger-500'}`}
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-caption text-text-secondary">{item.comment}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-standard p-4">
          <div className="text-body-sm font-medium mb-4">趋势</div>
          <div className="h-40">
            <LineChart data={data.internalAudit.trend} width={350} height={160}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="score" stroke="#2e72c6" strokeWidth={2} />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};
