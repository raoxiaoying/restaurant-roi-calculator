import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import type { DailyData, ModuleAlert, PeriodMode } from '@/types'
import { mockDailyData } from '@/data/mock-daily'
import { mockWeeklyData } from '@/data/mock-weekly'
import { mockMonthlyData } from '@/data/mock-monthly'
import { evaluateAlerts } from '@/lib/alerts'

interface AppContextType {
  selectedDate: string
  setSelectedDate: (date: string) => void
  periodMode: PeriodMode
  setPeriodMode: (mode: PeriodMode) => void
  dailyData: DailyData
  alerts: ModuleAlert[]
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState('2025-06-17')
  const [periodMode, setPeriodMode] = useState<PeriodMode>('day')

  const dailyData = periodMode === 'week' ? mockWeeklyData : periodMode === 'month' ? mockMonthlyData : mockDailyData
  const alerts = useMemo(() => evaluateAlerts(dailyData), [dailyData])

  return (
    <AppContext.Provider value={{ selectedDate, setSelectedDate, periodMode, setPeriodMode, dailyData, alerts }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
