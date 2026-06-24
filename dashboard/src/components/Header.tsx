import { useApp } from '@/context/AppContext'
import { ChevronDown, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PeriodMode } from '@/types'

const dayOptions = [
  { label: '6月17日 周二', value: '2025-06-17' },
  { label: '6月16日 周一', value: '2025-06-16' },
  { label: '6月15日 周日', value: '2025-06-15' },
  { label: '6月14日 周六', value: '2025-06-14' },
  { label: '6月13日 周五', value: '2025-06-13' },
]

const weekOptions = [
  { label: '第25周 (6/16–6/22)', value: '2025-W25' },
  { label: '第24周 (6/9–6/15)', value: '2025-W24' },
  { label: '第23周 (6/2–6/8)', value: '2025-W23' },
]

const monthOptions = [
  { label: '2025年6月', value: '2025-06' },
  { label: '2025年5月', value: '2025-05' },
  { label: '2025年4月', value: '2025-04' },
]

export function Header() {
  const { selectedDate, setSelectedDate, periodMode, setPeriodMode, dailyData } = useApp()
  const [showPicker, setShowPicker] = useState(false)
  const navigate = useNavigate()

  const getOptions = () => {
    switch (periodMode) {
      case 'week': return weekOptions
      case 'month': return monthOptions
      default: return dayOptions
    }
  }

  const currentLabel = periodMode === 'week'
    ? (weekOptions.find(w => w.value === selectedDate)?.label || weekOptions[0].label)
    : periodMode === 'month'
      ? (monthOptions.find(m => m.value === selectedDate)?.label || monthOptions[0].label)
      : (dayOptions.find(d => d.value === selectedDate)?.label || selectedDate)

  const score = dailyData.storeScore
  const scoreStatus = score >= 90 ? 'good' : score >= 75 ? 'warning' : 'danger'
  const scoreColor = {
    good: 'border-green-200 text-green-700 bg-green-50',
    warning: 'border-amber-200 text-amber-700 bg-amber-50',
    danger: 'border-red-200 text-red-700 bg-red-50',
  }[scoreStatus]

  const scoreLabel = {
    good: '优秀',
    warning: '待提升',
    danger: '需整改',
  }[scoreStatus]

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-gradient-header text-white px-4 pt-12 pb-4 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-heading-md font-bold drop-shadow-sm">{dailyData.storeName}</h1>
            <button
              onClick={() => navigate('/store-score')}
              className="flex items-center gap-3 mt-3 active:opacity-80 transition-opacity"
            >
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-heading-md font-bold ${scoreColor}`}>
                {score}
              </div>
              <div className="text-left">
                <span className="text-white/90 text-caption font-medium">门店得分 · {scoreLabel}</span>
                <div className={`flex items-center gap-1 text-body-sm font-semibold ${
                  dailyData.storeScoreChange >= 0 ? 'text-green-200' : 'text-red-200'
                }`}>
                  {dailyData.storeScoreChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {dailyData.storeScoreChange >= 0 ? '+' : ''}{dailyData.storeScoreChange}%
                </div>
              </div>
            </button>
          </div>
          <div className="self-end">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-2 text-body-sm font-medium border border-white/30 shadow-sm"
            >
              <Calendar size={14} className="opacity-90" />
              <span>{currentLabel}</span>
              <ChevronDown size={14} className={`transition-transform ${showPicker ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      {showPicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
          <div className="absolute top-full right-3 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 w-52">
            <div className="flex border-b border-gray-100">
              {(['day', 'week', 'month'] as PeriodMode[]).map((mode) => {
                const label = mode === 'day' ? '日' : mode === 'week' ? '周' : '月'
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      setPeriodMode(mode)
                      setSelectedDate(mode === 'week' ? weekOptions[0].value : mode === 'month' ? monthOptions[0].value : dayOptions[0].value)
                    }}
                    className={`flex-1 py-3 text-body-sm font-medium transition-colors ${
                      periodMode === mode
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div className="max-h-56 overflow-y-auto">
              {getOptions().map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSelectedDate(opt.value)
                    setShowPicker(false)
                  }}
                  className={`block w-full text-left px-4 py-3 text-body-sm border-b border-gray-50 last:border-0 transition-colors ${
                    opt.value === selectedDate
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-900 active:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
