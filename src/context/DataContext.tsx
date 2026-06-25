import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { dailyData, weeklyData, monthlyData } from '@/data/mockData';
import type { DailyData, TimeRange } from '@/types';

interface DataContextType {
  data: DailyData;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const getData = useCallback((): DailyData => {
    switch (timeRange) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  }, [timeRange]);

  return (
    <DataContext.Provider value={{ data: getData(), timeRange, setTimeRange }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
