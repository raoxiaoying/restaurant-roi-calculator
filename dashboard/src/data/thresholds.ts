export interface MetricThreshold {
  target: number
  brandAvg: number
  thirtyDayAvg: number
  direction: 'higher-is-better' | 'lower-is-better'
  // red if deviation > redThreshold%, yellow if > yellowThreshold%
  redThreshold: number // e.g. 0.3 means 30% worse than benchmark
  yellowThreshold: number // e.g. 0.1 means 10% worse than benchmark
}

export const thresholds: Record<string, MetricThreshold> = {
  'revenue.total': {
    target: 25000,
    brandAvg: 22000,
    thirtyDayAvg: 21500,
    direction: 'higher-is-better',
    redThreshold: 0.3,
    yellowThreshold: 0.15,
  },
  'revenue.dineIn': {
    target: 10000,
    brandAvg: 9000,
    thirtyDayAvg: 8800,
    direction: 'higher-is-better',
    redThreshold: 0.3,
    yellowThreshold: 0.15,
  },
  'revenue.delivery': {
    target: 12000,
    brandAvg: 11000,
    thirtyDayAvg: 10500,
    direction: 'higher-is-better',
    redThreshold: 0.3,
    yellowThreshold: 0.15,
  },
  'foodCost.rate': {
    target: 35,
    brandAvg: 34,
    thirtyDayAvg: 35.5,
    direction: 'lower-is-better',
    redThreshold: 0.15,
    yellowThreshold: 0.05,
  },
  'hr.laborEfficiency': {
    target: 3500,
    brandAvg: 3200,
    thirtyDayAvg: 3100,
    direction: 'higher-is-better',
    redThreshold: 0.25,
    yellowThreshold: 0.1,
  },
  'hr.scheduleVariance': {
    target: 0,
    brandAvg: 2,
    thirtyDayAvg: 1.5,
    direction: 'lower-is-better',
    redThreshold: 3, // absolute value: >3 people difference is red
    yellowThreshold: 2,
  },
  'hr.trainingRate': {
    target: 100,
    brandAvg: 85,
    thirtyDayAvg: 80,
    direction: 'higher-is-better',
    redThreshold: 0.3,
    yellowThreshold: 0.15,
  },
  'hr.turnoverRate': {
    target: 8,
    brandAvg: 10,
    thirtyDayAvg: 9,
    direction: 'lower-is-better',
    redThreshold: 0.3,
    yellowThreshold: 0.15,
  },
  'kitchen.avgPrepTime': {
    target: 10,
    brandAvg: 11,
    thirtyDayAvg: 10.5,
    direction: 'lower-is-better',
    redThreshold: 0.4,
    yellowThreshold: 0.15,
  },
  'audit.returnsTotal': {
    target: 200,
    brandAvg: 300,
    thirtyDayAvg: 250,
    direction: 'lower-is-better',
    redThreshold: 1.0, // double the target
    yellowThreshold: 0.5,
  },
  'audit.complimentaryTotal': {
    target: 300,
    brandAvg: 400,
    thirtyDayAvg: 350,
    direction: 'lower-is-better',
    redThreshold: 1.0,
    yellowThreshold: 0.5,
  },
  'audit.priceChangeTotal': {
    target: 100,
    brandAvg: 150,
    thirtyDayAvg: 120,
    direction: 'lower-is-better',
    redThreshold: 1.0,
    yellowThreshold: 0.5,
  },
  'audit.soldOutRate': {
    target: 2,
    brandAvg: 3,
    thirtyDayAvg: 2.5,
    direction: 'lower-is-better',
    redThreshold: 1.0,
    yellowThreshold: 0.5,
  },
  'voice.meituanScore': {
    target: 4.7,
    brandAvg: 4.5,
    thirtyDayAvg: 4.6,
    direction: 'higher-is-better',
    redThreshold: 0.08,
    yellowThreshold: 0.04,
  },
  'voice.dianpingTotal': {
    target: 4.5,
    brandAvg: 4.3,
    thirtyDayAvg: 4.4,
    direction: 'higher-is-better',
    redThreshold: 0.1,
    yellowThreshold: 0.05,
  },
  'internalAudit.score': {
    target: 95,
    brandAvg: 88,
    thirtyDayAvg: 90,
    direction: 'higher-is-better',
    redThreshold: 0.2,
    yellowThreshold: 0.1,
  },
}
