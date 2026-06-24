// ============ Period Types ============
export type PeriodMode = 'day' | 'week' | 'month'

// ============ Revenue Types ============
export interface ChannelRevenue {
  name: string
  amount: number
  orders: number
  percentage: number
}

export interface FunnelStep {
  label: string
  value: number
  rate?: number // conversion rate to next step
}

export interface TrendPoint {
  date: string
  value: number
}

export interface RevenueAttribution {
  totalChange: number  // 营收环比变化金额
  factors: {
    label: string      // e.g. 客流影响金额 / 客单价影响金额 / 订单量影响金额 / 单均影响金额
    amount: number     // 贡献金额 (正=拉升 负=拖累)
    pct: number        // 贡献占比 %
  }[]
}

export interface DineInData {
  funnel: FunnelStep[]
  avgTicketTrend: TrendPoint[]
  avgTicket: number
  avgTicketChange: number // vs yesterday
  tableTurnoverTrend: TrendPoint[]
  tableTurnoverRate: number
  tableTurnoverChange: number
  revenueTrend: TrendPoint[]
  revenueTotal: number
  revenueChange: number
  revenueMoM: number  // 环比 %
  revenueAttribution: RevenueAttribution
  customerFlowTrend: TrendPoint[]
  customerFlow: number
  customerFlowChange: number
  orderCountTrend: TrendPoint[]
  orderCount: number
  orderCountChange: number
}

export interface DeliveryTrendPoint {
  date: string
  amount: number
  avgPerOrder: number
}

export interface PlatformDeliveryData {
  platform: string
  funnel: FunnelStep[]
  trend: DeliveryTrendPoint[]
}

export interface DeliveryData {
  funnel: FunnelStep[]
  trend: DeliveryTrendPoint[]
  platforms: PlatformDeliveryData[]
  revenueAttribution: RevenueAttribution
  revenueMoM: number  // 环比 %
}

export interface RevenueData {
  total: number
  target: number
  totalChange: number // vs yesterday %
  channels: ChannelRevenue[]
  dineIn: DineInData
  delivery: DeliveryData
}

// ============ Food Cost Types ============
export interface FoodCostData {
  rate: number // percentage
  target: number
  amount: number
  rateMoM: number  // 环比 %
  wasteAmount: number
  wastePercentage: number
  wasteLastAmount: number
  wasteLastRevenueRatio: number
  priceFluctuationAmount: number
  priceFluctuationPercentage: number
  priceFluctuationLastAmount: number
  priceFluctuationLastRevenueRatio: number
  details: { category: string; amount: number; change: number }[]
}

// ============ HR Types ============
export interface LaborEfficiencyItem {
  area: string // 前厅 / 后厨
  period: string // 午市 / 晚市
  revenue: number
  headcount: number
  efficiency: number // revenue per person
}

export interface ScheduleItem {
  area: string
  suggested: number
  actual: number
  difference: number
}

export interface MealPeriodScheduleItem {
  period: string // 午市 / 晚市
  suggested: number
  actual: number
  difference: number
}

export interface TrainingParticipant {
  name: string
  area: string       // 前厅 / 后厨
  role: string       // 岗位
  course: string     // 培训课程
  status: 'passed' | 'failed' | 'pending'  // 通过 / 未通过 / 待培训
  score?: number     // 考核分数 (passed/failed时)
  date?: string      // 完成日期
}

export interface TrainingData {
  required: number
  passed: number
  completionRate: number
  trainingRate: number  // 训练率 %
  participants: TrainingParticipant[]
}

export interface LaborEfficiencyAttribution {
  achievementRate: number   // 达成率 %
  gapPct: number            // 差距 % (负数表示未达标)
  revenueContrib: number    // 营收变化贡献 %
  revenueContribAmount: number  // 营收变化对人效的影响金额
  laborContrib: number      // 排班变化贡献 %
  laborContribAmount: number    // 排班变化对人效的影响金额
  revenueReasons: { label: string; pct: number }[]
  laborReasons: { label: string; pct: number }[]
}

export interface TurnoverPosition {
  area: string       // 前厅 / 后厨
  role: string       // 服务员 / 收银员 / 厨师 / 洗碗工 etc.
  headcount: number  // 在职人数
  turnoverRate: number // 离职率 %
  turnoverChange: number // 环比变化 ppt
}

export interface HRData {
  laborEfficiency: number // overall
  laborEfficiencyTarget: number
  laborEfficiencyMoM: number  // 环比 %
  laborEfficiencyAttribution: LaborEfficiencyAttribution
  laborDetails: LaborEfficiencyItem[]
  turnoverRate: number        // overall 离职率 %
  turnoverChange: number      // 环比 ppt
  turnoverByPosition: TurnoverPosition[]
  turnoverTrend: { date: string; rate: number }[]
  scheduleVariance: number // total difference
  scheduleDetails: ScheduleItem[]
  mealScheduleDetails: MealPeriodScheduleItem[]
  training: TrainingData
  trainingTrend: { date: string; rate: number }[]
}

// ============ Kitchen Types ============
export interface DishTimePeriod {
  period: string
  orders: number
  totalOrders: number
  percentage: number
}

export interface DishPerformance {
  name: string
  avgTime: number // minutes
  orderCount: number
  counter: string // 档口名称
  timePeriods?: DishTimePeriod[]
}

export interface KitchenTimeInterval {
  period: string
  orders: number
  totalOrders: number
  percentage: number
}

export interface KitchenData {
  avgPrepTime: number
  target: number
  totalOrders: number
  avgPrepTimeMoM: number  // 环比 %
  timeIntervals: KitchenTimeInterval[]
  dishes: DishPerformance[]
}

// ============ Audit Types ============
export interface AuditReasonItem {
  reason: string
  amount: number
  percentage: number
  timePeriods?: { period: string; amount: number; percentage: number }[]
}

export interface AuditDishItem {
  dishName: string
  count: number      // 发生次数
  amount: number     // 金额
  percentage: number // 占比 %
}

export interface SoldOutItem {
  dishName: string
  count: number
  countMoM: number  // 沽清次数环比 %
}

export interface SoldOutData {
  rate: number         // 沽清率 %
  rateMoM: number      // 沽清率环比 %
  trend: { date: string; rate: number }[]
  dishes: SoldOutItem[]
}

export interface InventoryItem {
  name: string          // 货品名称
  spec: string          // 规格
  unit: string          // 单位
  quantity: number      // 库存量
  amount: number        // 库存金额
  turnoverDays: number  // 库存周转天数
  estimatedSaleDays: number  // 预计可售天数
}

export interface InventoryData {
  turnoverRate: number    // 库存周转率
  amount: number          // 库存金额
  turnoverRateMoM: number // 周转率环比 %
  amountMoM: number       // 库存金额环比 %
  amountTrend: { date: string; amount: number }[]
  turnoverDaysTrend: { date: string; days: number }[]
  items: InventoryItem[]
}

export interface AuditData {
  returnsTotal: number
  returnsDetails: AuditReasonItem[]
  returnsDishes: AuditDishItem[]
  complimentaryTotal: number
  complimentaryLastAmount: number
  complimentaryLastRevenueRatio: number
  complimentaryDetails: AuditReasonItem[]
  complimentaryDishes: AuditDishItem[]
  priceChangeTotal: number
  priceChangeDetails: AuditReasonItem[]
  priceChangeDishes: AuditDishItem[]
  soldOutRate: number
  soldOutDetails: SoldOutItem[]
}

// ============ Customer Voice Types ============
export interface RatingTrend {
  date: string
  score: number
}

export interface MeituanRating {
  score: number
  change: number
  badReviewRate: number
  revenueShare: number
  areaRank: number
  areaTotal: number
  categoryRank: number
  categoryTotal: number
  trend: RatingTrend[]
}

export interface DianpingRating {
  total: number
  taste: number
  environment: number
  service: number
  badReviewRate: number
  revenueShare: number
  areaRank: number
  areaTotal: number
  categoryRank: number
  categoryTotal: number
  totalTrend: RatingTrend[]
  tasteTrend: RatingTrend[]
  environmentTrend: RatingTrend[]
  serviceTrend: RatingTrend[]
}

export interface DeliveryRatingDistribution {
  platform: string
  taste: number
  environment: number
  service: number
  delivery: number
  packaging: number
  badReviewRate: number
  revenueShare: number
  areaRank: number
  areaTotal: number
  categoryRank: number
  categoryTotal: number
  timeoutRate?: number  // 出餐超时率 % (only for delivery platforms)
  totalTrend: RatingTrend[]
  tasteTrend: RatingTrend[]
  deliveryTrend: RatingTrend[]
  packagingTrend: RatingTrend[]
}

export interface ReviewTag {
  tag: string
  count: number
  lastCount: number
  change: number // vs last period
  examples?: string[]
  reviews: {
    username: string
    platform: string
    content: string
    date: string
  }[]
}

export interface ReviewDetail {
  id: string
  platform: string
  username: string
  rating: number
  content: string
  date: string
  tags: string[]
  reply?: string
}

export interface CustomerVoiceData {
  meituan: MeituanRating
  dianping: DianpingRating
  deliveryRatings: DeliveryRatingDistribution[]
  reviewTags: ReviewTag[]
  reviews: ReviewDetail[]
}

// ============ Internal Audit Types ============
export interface AuditCheckItem {
  item: string
  deduction: number
  description: string
}

export interface AuditDimension {
  name: string
  score: number
  fullScore: number
  change?: number
  trend: { date: string; score: number }[]
  items: AuditCheckItem[]
}

export interface InternalAuditData {
  lastDate: string
  overallScore: number
  fullScore: number
  dimensions: AuditDimension[]
}

// ============ Combined Daily Data ============
export interface DailyData {
  date: string
  storeName: string
  storeScore: number
  storeScoreChange: number
  storeScoreTrend: { date: string; score: number }[]
  revenue: RevenueData
  foodCost: FoodCostData
  hr: HRData
  kitchen: KitchenData
  audit: AuditData
  soldOut: SoldOutData
  inventory: InventoryData
  customerVoice: CustomerVoiceData
  internalAudit: InternalAuditData
}

// ============ Alert Types ============
export type AlertSeverity = 'red' | 'yellow' | 'green'

export interface MetricAlert {
  name: string
  severity: AlertSeverity
  currentValue: number
  reason: string
}

export interface ModuleAlert {
  moduleId: string
  moduleName: string
  severity: AlertSeverity
  metrics: MetricAlert[]
}
