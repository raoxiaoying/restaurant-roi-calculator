import { ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const InternalAudit = () => {
  const { data } = useData();
  const go = useGo();
  const audit = data.internalAudit;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success-500';
      case 'good': return 'text-primary-500';
      case 'warning': return 'text-warning-500';
      case 'danger': return 'text-danger-500';
      default: return 'text-text-secondary';
    }
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-500';
    if (score >= 80) return 'text-primary-500';
    if (score >= 70) return 'text-warning-500';
    return 'text-danger-500';
  };

  return (
    <div className="px-4 py-3 space-y-3">
      <div className="card-elevated p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary-500" />
            <span className="text-body-sm font-medium">内部稽核</span>
          </div>
          <button onClick={() => go('/internal-audit/product')} className="flex items-center gap-1 text-primary-500">
            <span className="text-xs">查看详情</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-caption mb-1">综合评分</div>
            <div className={`text-metric font-bold ${getScoreColor(audit.totalScore)}`}>
              {audit.totalScore}
              <span className="text-body-sm font-normal text-text-secondary ml-1">/ {audit.maxScore}</span>
            </div>
          </div>
          <div className={`kpi-tag ${
            audit.totalScore >= 90 ? 'bg-success-500' : 
            audit.totalScore >= 80 ? 'bg-primary-500' : 
            audit.totalScore >= 70 ? 'bg-warning-500' : 'bg-danger-500'
          } text-white`}>
            {audit.totalScore >= 90 ? '优秀' : audit.totalScore >= 80 ? '良好' : audit.totalScore >= 70 ? '待改进' : '需整改'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {audit.dimensions.map((dimension) => (
            <button
              key={dimension.id}
              onClick={() => go(`/internal-audit/${dimension.id}`)}
              className="card-standard p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-sm font-medium text-text-primary">{dimension.name}</span>
                <span className={`text-xs font-medium ${getStatusColor(dimension.status)}`}>
                  {getStatusText(dimension.status)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className={`text-metric-sm font-bold ${getScoreColor(dimension.score)}`}>
                  {dimension.score}
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-caption" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
