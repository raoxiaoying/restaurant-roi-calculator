import { useApp } from '@/context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Star, MessageCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

type PlatformPosition = 'top' | 'upper-right' | 'lower-right' | 'lower-left' | 'upper-left'

interface PlatformItem {
  name: string
  score: number
  badRate: number
  share: number
  color: string
  position: PlatformPosition
  route: string
}

const POSITION_STYLE: Record<PlatformPosition, React.CSSProperties> = {
  top: { left: '50%', top: '0%', transform: 'translateX(-50%)', textAlign: 'center' },
  'upper-right': { left: '95%', top: '18%', transform: 'translateX(-100%)', textAlign: 'right', whiteSpace: 'nowrap' },
  'lower-right': { left: '72%', top: '78%', transform: 'translateX(-100%)', textAlign: 'right' },
  'lower-left': { left: '28%', top: '78%', textAlign: 'left' },
  'upper-left': { left: '12%', top: '18%', textAlign: 'left' },
}

function avgScore(p: { taste: number; environment: number; service: number; delivery: number; packaging: number }) {
  return parseFloat(((p.taste + p.environment + p.service + p.delivery + p.packaging) / 5).toFixed(1))
}

function PlatformLabel({ platform }: { platform: PlatformItem }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(platform.route)}
      style={POSITION_STYLE[platform.position]}
      className="absolute active:opacity-70 transition-opacity cursor-pointer z-10"
    >
      <div className="text-[11px] font-medium text-gray-700 leading-tight">{platform.name}</div>
      <div className="text-base font-bold leading-tight" style={{ color: platform.color }}>{platform.score}分</div>
      <div className="text-[10px] text-gray-400 leading-tight">占比{platform.share}%</div>
      <div className="text-[10px] text-red-400 leading-tight">差评{platform.badRate}%</div>
    </div>
  )
}

export function CustomerVoice() {
  const navigate = useNavigate()
  const { dailyData } = useApp()
  const { customerVoice } = dailyData

  const deliveryPlatforms = customerVoice.deliveryRatings
  const taobaoIdx = deliveryPlatforms.findIndex(p => p.platform === '淘宝闪购')
  const meituanWmIdx = deliveryPlatforms.findIndex(p => p.platform === '美团外卖')
  const jdWmIdx = deliveryPlatforms.findIndex(p => p.platform === '京东外卖')

  const taobao = taobaoIdx >= 0 ? deliveryPlatforms[taobaoIdx] : undefined
  const meituanWaimai = meituanWmIdx >= 0 ? deliveryPlatforms[meituanWmIdx] : undefined
  const jdWaimai = jdWmIdx >= 0 ? deliveryPlatforms[jdWmIdx] : undefined

  const platformItems: PlatformItem[] = [
    { name: '美团美食', score: customerVoice.meituan.score, badRate: customerVoice.meituan.badReviewRate, share: customerVoice.meituan.revenueShare, color: '#3b82f6', position: 'top', route: '/voice/meituan' },
    { name: '大众点评', score: customerVoice.dianping.total, badRate: customerVoice.dianping.badReviewRate, share: customerVoice.dianping.revenueShare, color: '#f59e0b', position: 'upper-right', route: '/voice/dianping' },
    { name: '淘宝闪购', score: taobao ? avgScore(taobao) : 0, badRate: taobao?.badReviewRate ?? 0, share: taobao?.revenueShare ?? 0, color: '#10b981', position: 'lower-right', route: `/voice/delivery/${taobaoIdx}` },
    { name: '美团外卖', score: meituanWaimai ? avgScore(meituanWaimai) : 0, badRate: meituanWaimai?.badReviewRate ?? 0, share: meituanWaimai?.revenueShare ?? 0, color: '#8b5cf6', position: 'lower-left', route: `/voice/delivery/${meituanWmIdx}` },
    { name: '京东外卖', score: jdWaimai ? avgScore(jdWaimai) : 0, badRate: jdWaimai?.badReviewRate ?? 0, share: jdWaimai?.revenueShare ?? 0, color: '#ef4444', position: 'upper-left', route: `/voice/delivery/${jdWmIdx}` },
  ]

  const radarData = platformItems.map(p => ({ subject: p.name, score: p.score }))

  const sortedTags = [...customerVoice.reviewTags]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  const totalTagCount = customerVoice.reviewTags.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="section-container-tertiary">
      <div className="mb-3 px-1 flex items-center gap-2">
        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
        <h2 className="section-heading">顾客声音</h2>
      </div>

      {/* Platform Scores */}
      <div className="card-elevated p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Star size={18} />
          </div>
          <h3 className="card-title">平台评分</h3>
        </div>

        {/* Radar Chart with Platform Labels */}
        <div className="relative h-72 mb-2">
          {platformItems.map(platform => (
            <PlatformLabel key={platform.name} platform={platform} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="38%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={false} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar
                    name="评分"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Negative Review Analysis */}
      <div className="card-elevated p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <MessageCircle size={18} />
          </div>
          <h3 className="card-title">差评分析</h3>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-1 px-2 py-2 text-caption text-gray-400 border-b border-gray-100 mb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-4">评价标签</div>
          <div className="col-span-2 text-center">次数</div>
          <div className="col-span-2 text-center">占比</div>
          <div className="col-span-1 text-center">上期</div>
          <div className="col-span-2 text-right">环比</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {sortedTags.map((tag, idx) => {
            const percentage = ((tag.count / totalTagCount) * 100).toFixed(1)
            return (
              <div
                key={tag.tag}
                className="w-full text-left"
              >
                <div className="grid grid-cols-12 gap-1 items-center px-2 py-2">
                  <div className="col-span-1">
                    <span className="text-caption font-medium text-gray-500">{idx + 1}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-body-sm font-medium text-gray-900">{tag.tag}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <button
                      onClick={() => navigate(`/voice/tag/${encodeURIComponent(tag.tag)}`)}
                      className="text-body-sm font-bold text-blue-500 active:opacity-70 transition-opacity"
                    >
                      {tag.count}
                    </button>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-body-sm text-gray-600">{percentage}%</span>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="text-body-sm text-gray-600">{tag.lastCount}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className={`flex items-center justify-end gap-0.5 text-body-sm font-semibold ${
                      tag.change > 0 ? 'text-red-500' : tag.change < 0 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {tag.change > 0 ? '+' : ''}{tag.change}
                      {tag.change > 0 && <TrendingUp size={12} />}
                      {tag.change < 0 && <TrendingDown size={12} />}
                      {tag.change === 0 && <Minus size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
