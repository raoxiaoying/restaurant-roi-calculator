import { ChevronRight } from 'lucide-react';
import { useGo } from '@/hooks/useGo';
import { useData } from '@/context/DataContext';

const modules = [
  { id: 'revenue', name: '营收', indicator: '总营收', link: '/revenue/total' },
  { id: 'foodCost', name: '食材', indicator: '食材成本率', link: '/food-cost' },
  { id: 'hr', name: '人才', indicator: '人效、排班差异、训练完成率', link: '/hr/labor' },
  { id: 'kitchen', name: '出餐', indicator: '出餐效率', link: '/kitchen' },
  { id: 'audit', name: '稽核', indicator: '退菜金额、沽清率', link: '/audit/adjustments' },
  { id: 'internalAudit', name: '巡店稽核', indicator: '稽核得分', link: '/internal-audit/product' },
];

const getModuleColor = (id: string, data: typeof useData extends () => { data: infer D } ? D : never) => {
  const alert = data.alerts.find(a => a.key === id);
  if (alert?.level === 'red') return 'bg-danger-500';
  if (alert?.level === 'yellow') return 'bg-warning-500';
  return 'bg-warning-500';
};

export const ModuleNav = () => {
  const { data } = useData();
  const go = useGo();

  return (
    <div className="px-4 pb-3">
      <div className="card-standard overflow-hidden">
        {modules.map((module, index) => (
          <button
            key={module.id}
            onClick={() => go(module.link)}
            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
              index !== modules.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getModuleColor(module.id, data)}`} />
              <span className="text-body-sm font-medium text-text-primary">{module.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption text-text-secondary">{module.indicator}</span>
              <ChevronRight className="w-4 h-4 text-text-caption" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
