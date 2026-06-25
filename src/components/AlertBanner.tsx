import { AlertTriangle, ChevronRight } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

export const AlertBanner = () => {
  const { data } = useData();
  const go = useGo();
  
  const sortedAlerts = [...data.alerts].sort((a, b) => {
    const levelOrder = { red: 0, yellow: 1, green: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  if (sortedAlerts.length === 0) return null;

  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'red': return 'bg-danger-500';
      case 'yellow': return 'bg-warning-500';
      case 'green': return 'bg-success-500';
      default: return 'bg-gray-400';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'red': return '异常';
      case 'yellow': return '预警';
      case 'green': return '正常';
      default: return '';
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="card-standard p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-warning-500" />
          <span className="text-body-sm font-medium text-text-primary">运营告警</span>
        </div>
        <div className="space-y-3">
          {sortedAlerts.slice(0, 4).map((alert) => (
            <button
              key={alert.key}
              onClick={() => go(alert.link)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`alert-dot ${getLevelStyle(alert.level)}`} />
                <div className="text-left">
                  <div className="text-body-sm font-medium text-text-primary">{alert.name}</div>
                  <div className="text-caption">
                    当前值: {alert.value} {alert.threshold.isNegative ? '(越小越好)' : '(越大越好)'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${
                  alert.level === 'red' ? 'text-danger-500' : 
                  alert.level === 'yellow' ? 'text-warning-500' : 'text-success-500'
                }`}>
                  {getLevelText(alert.level)}
                </span>
                <ChevronRight className="w-4 h-4 text-text-caption" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
