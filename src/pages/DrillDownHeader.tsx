import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DrillDownHeaderProps {
  title: string;
  subtitle?: string;
}

export const DrillDownHeader = ({ title, subtitle }: DrillDownHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary-600 text-white px-4 pt-6 pb-4 sticky top-0 z-50">
      <div className="flex items-center gap-3 mb-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <div className="text-xs opacity-70 mt-0.5">{subtitle}</div>}
        </div>
      </div>
    </header>
  );
};
