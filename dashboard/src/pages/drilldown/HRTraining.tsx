import { DrillDownHeader } from '@/components/DrillDownHeader'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, ReferenceLine, Tooltip } from 'recharts'
import type { TrainingParticipant } from '@/types'

const STATUS_CONFIG: Record<TrainingParticipant['status'], { label: string; bg: string; text: string }> = {
  passed: { label: '通过', bg: 'bg-green-50', text: 'text-green-600' },
  failed: { label: '未通过', bg: 'bg-red-50', text: 'text-red-600' },
  pending: { label: '待培训', bg: 'bg-gray-100', text: 'text-gray-500' },
}

type FilterTab = 'all' | 'passed' | 'failed' | 'pending'

export function HRTraining() {
  const { dailyData, periodMode } = useApp()
  const { training, trainingTrend } = dailyData.hr
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const periodLabel = periodMode === 'week' ? '近10周' : periodMode === 'month' ? '近12月' : '近15日'
  const avg = Math.round(trainingTrend.reduce((s, d) => s + d.rate, 0) / trainingTrend.length * 10) / 10

  const filteredParticipants = activeTab === 'all'
    ? training.participants
    : training.participants.filter(p => p.status === activeTab)

  const passedCount = training.participants.filter(p => p.status === 'passed').length
  const failedCount = training.participants.filter(p => p.status === 'failed').length
  const pendingCount = training.participants.filter(p => p.status === 'pending').length

  return (
    <div className="page-container bg-page-body">
      <DrillDownHeader title="训练率详情" />

      {/* Section 1: Training Rate Completion */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">训练率完成情况</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center mb-5">
          <div>
            <div className="metric-label mb-1">应训人数</div>
            <div className="metric-highlight text-gray-900">{training.required}</div>
          </div>
          <div>
            <div className="metric-label mb-1">通过</div>
            <div className="metric-highlight text-green-600">{passedCount}</div>
          </div>
          <div>
            <div className="metric-label mb-1">未通过</div>
            <div className="metric-highlight text-red-500">{failedCount}</div>
          </div>
          <div>
            <div className="metric-label mb-1">待培训</div>
            <div className="metric-highlight text-gray-500">{pendingCount}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between metric-label mb-2">
            <span>完成进度</span>
            <span>{passedCount}/{training.required}</span>
          </div>
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${training.trainingRate >= 80 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${training.trainingRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Time Trend */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">{periodLabel}训练率趋势</h2>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trainingTrend} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
              <Tooltip
                content={(props: any) => {
                  const { active, payload } = props
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-gray-800 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                        {payload[0].value}%
                      </div>
                    )
                  }
                  return null
                }}
              />
              <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4"
                label={{ value: '目标80%', position: 'right', fontSize: 10, fill: '#10b981' }} />
              <ReferenceLine y={avg} stroke="#94a3b8" strokeDasharray="4 4"
                label={{ value: `均${avg}%`, position: 'right', fontSize: 10, fill: '#94a3b8' }} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#ef4444', stroke: '#fff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Participant List */}
      <div className="card-elevated p-4 mb-4">
        <div className="mb-3 px-1 flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
          <h2 className="section-heading">参训列表</h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {([
            { key: 'all' as FilterTab, label: '全部' },
            { key: 'passed' as FilterTab, label: '通过' },
            { key: 'failed' as FilterTab, label: '未通过' },
            { key: 'pending' as FilterTab, label: '待培训' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-caption font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Participant Items */}
        <div className="space-y-3">
          {filteredParticipants.map((p, idx) => {
            const cfg = STATUS_CONFIG[p.status]
            return (
              <div key={idx} className="card-standard p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-gray-900">{p.name}</span>
                    <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                  </div>
                  {p.score !== undefined && (
                    <span className={`text-body-sm font-bold ${p.score >= 60 ? 'text-gray-700' : 'text-red-500'}`}>
                      {p.score}分
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-caption text-gray-500">
                  <span>{p.area} · {p.role}</span>
                  <span className="text-gray-300">|</span>
                  <span>{p.course}</span>
                  {p.date && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{p.date}</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          {filteredParticipants.length === 0 && (
            <div className="text-center py-6 text-caption text-gray-400">暂无数据</div>
          )}
        </div>
      </div>
    </div>
  )
}
