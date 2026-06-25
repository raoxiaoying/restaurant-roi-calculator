import type { AlertThreshold } from '@/types';

export const thresholds: AlertThreshold[] = [
  { key: 'revenue', name: '营收达成率', value: 86.5, warning: 80, danger: 60, isNegative: false },
  { key: 'foodCost', name: '食材成本率', value: 32.5, warning: 31, danger: 33, isNegative: true },
  { key: 'laborEfficiency', name: '人效', value: 8652, warning: 8000, danger: 6000, isNegative: false },
  { key: 'kitchenTime', name: '出餐时长', value: 18.5, warning: 16, danger: 20, isNegative: true },
  { key: 'soldOut', name: '沽清率', value: 5.2, warning: 4, danger: 6, isNegative: true },
  { key: 'inventory', name: '库存周转率', value: 4.2, warning: 4, danger: 3, isNegative: false },
  { key: 'training', name: '训练率', value: 72, warning: 60, danger: 40, isNegative: false },
  { key: 'turnover', name: '离职率', value: 8.5, warning: 10, danger: 15, isNegative: true },
];
