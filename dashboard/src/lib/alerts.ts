import type { DailyData, ModuleAlert, MetricAlert, AlertSeverity } from '@/types'
import { thresholds, type MetricThreshold } from '@/data/thresholds'

function evaluateMetric(
  value: number,
  threshold: MetricThreshold,
  metricName: string
): MetricAlert {
  const { target, brandAvg, thirtyDayAvg, direction, redThreshold, yellowThreshold } = threshold

  // For schedule variance, use absolute comparison
  if (metricName === '排班差异') {
    if (value > redThreshold) {
      return { name: metricName, severity: 'red', currentValue: value, reason: `差异${value}人，超出标准` }
    }
    if (value > yellowThreshold) {
      return { name: metricName, severity: 'yellow', currentValue: value, reason: `差异${value}人，需关注` }
    }
    return { name: metricName, severity: 'green', currentValue: value, reason: '' }
  }

  let severity: AlertSeverity = 'green'
  let reason = ''

  const benchmarks = [
    { name: '目标值', val: target },
    { name: '品牌平均', val: brandAvg },
    { name: '30天均值', val: thirtyDayAvg },
  ]

  for (const benchmark of benchmarks) {
    let deviation: number
    if (direction === 'higher-is-better') {
      deviation = (benchmark.val - value) / benchmark.val
    } else {
      deviation = (value - benchmark.val) / benchmark.val
    }

    if (deviation >= redThreshold && severity !== 'red') {
      severity = 'red'
      reason = `${direction === 'higher-is-better' ? '低于' : '高于'}${benchmark.name}${Math.round(deviation * 100)}%`
    } else if (deviation >= yellowThreshold && severity === 'green') {
      severity = 'yellow'
      reason = `${direction === 'higher-is-better' ? '低于' : '高于'}${benchmark.name}${Math.round(deviation * 100)}%`
    }
  }

  return { name: metricName, severity, currentValue: value, reason }
}

export function evaluateAlerts(data: DailyData): ModuleAlert[] {
  const modules: ModuleAlert[] = []

  // Revenue module
  const revenueMetrics: MetricAlert[] = []
  if (thresholds['revenue.total']) {
    revenueMetrics.push(evaluateMetric(data.revenue.total, thresholds['revenue.total'], '总营收'))
  }
  const dineIn = data.revenue.channels.find(c => c.name === '堂食')
  if (dineIn && thresholds['revenue.dineIn']) {
    revenueMetrics.push(evaluateMetric(dineIn.amount, thresholds['revenue.dineIn'], '堂食营收'))
  }
  const delivery = data.revenue.channels.find(c => c.name === '外卖')
  if (delivery && thresholds['revenue.delivery']) {
    revenueMetrics.push(evaluateMetric(delivery.amount, thresholds['revenue.delivery'], '外卖营收'))
  }
  const revenueSeverity = getModuleSeverity(revenueMetrics)
  modules.push({ moduleId: 'revenue', moduleName: '营收', severity: revenueSeverity, metrics: revenueMetrics })

  // Food cost module
  const foodCostMetrics: MetricAlert[] = []
  if (thresholds['foodCost.rate']) {
    foodCostMetrics.push(evaluateMetric(data.foodCost.rate, thresholds['foodCost.rate'], '食材成本率'))
  }
  const foodCostSeverity = getModuleSeverity(foodCostMetrics)
  modules.push({ moduleId: 'foodCost', moduleName: '食材', severity: foodCostSeverity, metrics: foodCostMetrics })

  // HR module
  const hrMetrics: MetricAlert[] = []
  if (thresholds['hr.laborEfficiency']) {
    hrMetrics.push(evaluateMetric(data.hr.laborEfficiency, thresholds['hr.laborEfficiency'], '人效'))
  }
  if (thresholds['hr.scheduleVariance']) {
    hrMetrics.push(evaluateMetric(data.hr.scheduleVariance, thresholds['hr.scheduleVariance'], '排班差异'))
  }
  if (thresholds['hr.trainingRate']) {
    hrMetrics.push(evaluateMetric(data.hr.training.completionRate, thresholds['hr.trainingRate'], '训练率'))
  }
  if (thresholds['hr.turnoverRate']) {
    hrMetrics.push(evaluateMetric(data.hr.turnoverRate, thresholds['hr.turnoverRate'], '离职率'))
  }
  const hrSeverity = getModuleSeverity(hrMetrics)
  modules.push({ moduleId: 'hr', moduleName: '人才', severity: hrSeverity, metrics: hrMetrics })

  // Kitchen module
  const kitchenMetrics: MetricAlert[] = []
  if (thresholds['kitchen.avgPrepTime']) {
    kitchenMetrics.push(evaluateMetric(data.kitchen.avgPrepTime, thresholds['kitchen.avgPrepTime'], '平均出餐时长'))
  }
  const kitchenSeverity = getModuleSeverity(kitchenMetrics)
  modules.push({ moduleId: 'kitchen', moduleName: '出餐', severity: kitchenSeverity, metrics: kitchenMetrics })

  // Audit module
  const auditMetrics: MetricAlert[] = []
  if (thresholds['audit.returnsTotal']) {
    auditMetrics.push(evaluateMetric(data.audit.returnsTotal, thresholds['audit.returnsTotal'], '退菜金额'))
  }
  if (thresholds['audit.complimentaryTotal']) {
    auditMetrics.push(evaluateMetric(data.audit.complimentaryTotal, thresholds['audit.complimentaryTotal'], '赠菜金额'))
  }
  if (thresholds['audit.priceChangeTotal']) {
    auditMetrics.push(evaluateMetric(data.audit.priceChangeTotal, thresholds['audit.priceChangeTotal'], '改价金额'))
  }
  if (thresholds['audit.soldOutRate']) {
    auditMetrics.push(evaluateMetric(data.audit.soldOutRate, thresholds['audit.soldOutRate'], '沽清率'))
  }
  const auditSeverity = getModuleSeverity(auditMetrics)
  modules.push({ moduleId: 'audit', moduleName: '稽核', severity: auditSeverity, metrics: auditMetrics })

  // Customer voice module
  const voiceMetrics: MetricAlert[] = []
  if (thresholds['voice.meituanScore']) {
    voiceMetrics.push(evaluateMetric(data.customerVoice.meituan.score, thresholds['voice.meituanScore'], '美团美食评分'))
  }
  if (thresholds['voice.dianpingTotal']) {
    voiceMetrics.push(evaluateMetric(data.customerVoice.dianping.total, thresholds['voice.dianpingTotal'], '大众点评评分'))
  }
  const voiceSeverity = getModuleSeverity(voiceMetrics)
  modules.push({ moduleId: 'voice', moduleName: '顾客声音', severity: voiceSeverity, metrics: voiceMetrics })

  // Internal audit module
  const internalMetrics: MetricAlert[] = []
  if (thresholds['internalAudit.score']) {
    internalMetrics.push(evaluateMetric(data.internalAudit.overallScore, thresholds['internalAudit.score'], '门店稽核评分'))
  }
  const internalSeverity = getModuleSeverity(internalMetrics)
  modules.push({ moduleId: 'internalAudit', moduleName: '巡店稽核', severity: internalSeverity, metrics: internalMetrics })

  return modules
}

function getModuleSeverity(metrics: MetricAlert[]): AlertSeverity {
  if (metrics.some(m => m.severity === 'red')) return 'red'
  if (metrics.some(m => m.severity === 'yellow')) return 'yellow'
  return 'green'
}
