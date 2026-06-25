export interface RevenueData {
  total: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  dineIn: number;
  delivery: number;
  dineInTarget: number;
  deliveryTarget: number;
  channels: { name: string; value: number; percentage: number }[];
  periods: { name: string; value: number; percentage: number }[];
  trend: { date: string; value: number; target: number }[];
}

export interface FoodCostData {
  rate: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  lossDetails: { itemName: string; lossAmount: number; change: number; lossRate: number }[];
  complimentaryDetails: { dishName: string; amount: number; cost: number }[];
  trend: { date: string; value: number; target: number }[];
}

export interface ScheduleEfficiencyItem {
  area: string;
  period: string;
  workerType: string;
  headcount: number;
  hours: number;
  revenue: number;
}

export interface LaborEfficiencyAttributionFactor {
  label: string;
  amount: number;
}

export interface LaborEfficiencyAttribution {
  gapAmount: number;
  revenueImpact: { total: number; factors: LaborEfficiencyAttributionFactor[] };
  headcountImpact: { total: number; factors: LaborEfficiencyAttributionFactor[] };
}

export interface HRData {
  laborEfficiency: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  scheduleEfficiency: number;
  trainingRate: number;
  turnoverRate: number;
  scheduleItems: ScheduleEfficiencyItem[];
  attribution: LaborEfficiencyAttribution;
  trainingTrend: { date: string; rate: number }[];
  turnoverTrend: { date: string; rate: number }[];
  scheduleTrend: { date: string; efficiency: number }[];
}

export interface KitchenEfficiencyData {
  avgTime: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  peakTime: number;
  offPeakTime: number;
  trend: { date: string; avgTime: number; peakTime: number }[];
}

export interface AuditAdjustmentItem {
  type: 'refund' | 'complimentary' | 'modify' | 'price';
  orderNo: string;
  amount: number;
  reason: string;
  time: string;
}

export interface AuditAdjustmentsData {
  total: number;
  refund: number;
  complimentary: number;
  modify: number;
  price: number;
  refundRatio: number;
  complimentaryRatio: number;
  modifyRatio: number;
  priceRatio: number;
  items: AuditAdjustmentItem[];
}

export interface SoldOutData {
  rate: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  items: { name: string; count: number; category: string }[];
  trend: { date: string; rate: number }[];
}

export interface InventoryEfficiencyData {
  turnoverRate: number;
  target: number;
  yesterday: number;
  lastWeek: number;
  stockValue: number;
  outOfStockCount: number;
  slowMovingCount: number;
  items: { name: string; quantity: number; threshold: number; status: 'normal' | 'low' | 'out' }[];
  trend: { date: string; turnoverRate: number }[];
}

export interface VoicePlatformData {
  platform: string;
  rating: number;
  reviewCount: number;
  positiveRate: number;
}

export interface VoiceTagData {
  tag: string;
  count: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface VoiceData {
  platforms: VoicePlatformData[];
  radarData: { dimension: string; value: number; maxValue: number }[];
  tags: VoiceTagData[];
  reviews: {
    id: string;
    platform: string;
    content: string;
    rating: number;
    time: string;
    tags: string[];
  }[];
}

export interface InternalAuditDimension {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'warning' | 'danger';
}

export interface InternalAuditData {
  totalScore: number;
  maxScore: number;
  dimensions: InternalAuditDimension[];
  details: {
    dimensionId: string;
    items: { name: string; score: number; maxScore: number; comment: string }[];
  }[];
  trend: { date: string; score: number }[];
}

export interface AlertThreshold {
  key: string;
  name: string;
  value: number;
  warning: number;
  danger: number;
  isNegative: boolean;
}

export interface AlertItem {
  key: string;
  name: string;
  value: number;
  threshold: AlertThreshold;
  level: 'green' | 'yellow' | 'red';
  link: string;
}

export interface DailyData {
  storeName: string;
  date: string;
  dateRange: string;
  revenue: RevenueData;
  foodCost: FoodCostData;
  hr: HRData;
  kitchen: KitchenEfficiencyData;
  audit: AuditAdjustmentsData;
  soldOut: SoldOutData;
  inventory: InventoryEfficiencyData;
  voice: VoiceData;
  internalAudit: InternalAuditData;
  storeScore: number;
  storeScoreTrend: { date: string; score: number }[];
  alerts: AlertItem[];
}

export type TimeRange = 'daily' | 'weekly' | 'monthly';
