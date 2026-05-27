const businessTypes = {
  '快餐简餐类': {
    subCategories: '粉面、米饭套餐、便当、包子粥铺、中式简餐',
    foodCost: 0.375,
    laborCost: 0.20,
    rentCost: 0.135,
    utilityCost: 0.04,
    marketingCost: 0.03,
    suppliesCost: 0.025,
    otherCost: 0.015,
    investRange: '15-40万'
  },
  '茶饮甜品烘焙类': {
    subCategories: '奶茶、果茶、咖啡、甜品、蛋糕面包、冰淇淋',
    foodCost: 0.275,
    laborCost: 0.165,
    rentCost: 0.175,
    utilityCost: 0.05,
    marketingCost: 0.065,
    suppliesCost: 0.04,
    otherCost: 0.025,
    investRange: '20-80万'
  },
  '正餐特色中餐类': {
    subCategories: '家常菜、川菜、湘菜、粤菜、特色私房菜',
    foodCost: 0.415,
    laborCost: 0.275,
    rentCost: 0.12,
    utilityCost: 0.06,
    marketingCost: 0.04,
    suppliesCost: 0.025,
    otherCost: 0.03,
    investRange: '50-200万'
  },
  '火锅烧烤夜宵类': {
    subCategories: '火锅、串串、烤肉、烧烤、龙虾夜宵',
    foodCost: 0.40,
    laborCost: 0.25,
    rentCost: 0.14,
    utilityCost: 0.10,
    marketingCost: 0.05,
    suppliesCost: 0.035,
    otherCost: 0.025,
    investRange: '60-250万'
  },
  '小吃卤味外带类': {
    subCategories: '卤味、炸串、小吃、零食、无堂食纯外带',
    foodCost: 0.325,
    laborCost: 0.125,
    rentCost: 0.075,
    utilityCost: 0.03,
    marketingCost: 0.04,
    suppliesCost: 0.025,
    otherCost: 0.015,
    investRange: '5-20万'
  },
  '轻食西餐简餐类': {
    subCategories: '轻食沙拉、汉堡披萨、西式简餐',
    foodCost: 0.35,
    laborCost: 0.20,
    rentCost: 0.16,
    utilityCost: 0.05,
    marketingCost: 0.055,
    suppliesCost: 0.035,
    otherCost: 0.025,
    investRange: '25-60万'
  }
}

function calculate(params) {
  const {
    businessType, operationMode,
    initialInvestment, monthlyRevenue,
    franchiseTypeIndex, brandFee, amortizeYears, manageFee, revenueRate, profitRate,
    jointTypeIndex, operationFee, jointRevenueRate, jointProfitRate
  } = params

  const typeData = businessTypes[businessType]
  if (!typeData) {
    throw new Error(`Unknown business type: ${businessType}`)
  }

  const totalCostRate = typeData.foodCost + typeData.laborCost + typeData.rentCost +
    typeData.utilityCost + typeData.marketingCost + typeData.suppliesCost + typeData.otherCost

  const annualRevenue = monthlyRevenue * 12
  const baseProfit = annualRevenue * (1 - totalCostRate)

  let modelFee = 0
  if (operationMode === '加盟') {
    switch (franchiseTypeIndex) {
      case 0:
        modelFee = brandFee / amortizeYears
        break
      case 1:
        modelFee = brandFee / 3 + manageFee
        break
      case 2:
        modelFee = brandFee / 3 + annualRevenue * (revenueRate / 100)
        break
      case 3:
        modelFee = brandFee / 3 + baseProfit * (profitRate / 100)
        break
      case 4:
        modelFee = brandFee / 3 + manageFee + annualRevenue * (revenueRate / 100)
        break
      case 5:
        modelFee = brandFee / 3 + manageFee + baseProfit * (profitRate / 100)
        break
      case 6:
        modelFee = 0
        break
      default:
        throw new Error(`Unknown franchise type index: ${franchiseTypeIndex}`)
    }
  } else if (operationMode === '联营') {
    switch (jointTypeIndex) {
      case 0:
        modelFee = operationFee
        break
      case 1:
        modelFee = operationFee + annualRevenue * (jointRevenueRate / 100)
        break
      case 2:
        modelFee = operationFee + baseProfit * (jointProfitRate / 100)
        break
      default:
        throw new Error(`Unknown joint type index: ${jointTypeIndex}`)
    }
  }

  const annualProfit = baseProfit - modelFee
  const annualProfitRate = annualRevenue > 0 ? (annualProfit / annualRevenue) : 0
  const monthlyProfit = annualProfit / 12
  const paybackMonths = monthlyProfit > 0 ? Math.ceil(initialInvestment / monthlyProfit) : -1
  const roi = initialInvestment > 0 ? (annualProfit / initialInvestment) : 0
  const annualCost = annualRevenue * totalCostRate

  let assessmentLevel, assessmentIcon, assessmentTitle, assessmentDesc
  if (paybackMonths > 0 && paybackMonths <= 18 && roi > 0.5) {
    assessmentLevel = 'level-good'
    assessmentIcon = '优'
    assessmentTitle = '投资回报较好'
    assessmentDesc = `预计${paybackMonths}个月可收回投资，年ROI为${(roi * 100).toFixed(1)}%，整体回报表现优秀。建议关注实际运营中的成本管控。`
  } else if (paybackMonths > 0 && paybackMonths <= 36 && roi > 0.2) {
    assessmentLevel = 'level-medium'
    assessmentIcon = '中'
    assessmentTitle = '投资回报一般'
    assessmentDesc = `预计${paybackMonths}个月可收回投资，年ROI为${(roi * 100).toFixed(1)}%，回报周期较长。建议优化成本结构或提升营收能力。`
  } else {
    assessmentLevel = 'level-poor'
    assessmentIcon = '差'
    assessmentTitle = '投资风险较高'
    assessmentDesc = paybackMonths > 0
      ? `回收期长达${paybackMonths}个月，年ROI仅${(roi * 100).toFixed(1)}%，投资风险较大。建议重新评估选址、业态或运营模式。`
      : '当前测算显示项目处于亏损状态，无法收回投资。建议重新评估商业模式和成本结构。'
  }

  return {
    annualRevenue,
    annualCost,
    baseProfit,
    modelFee,
    annualProfit,
    annualProfitRate,
    monthlyProfit,
    paybackMonths,
    roi,
    assessmentLevel,
    assessmentIcon,
    assessmentTitle,
    assessmentDesc
  }
}

module.exports = {
  businessTypes,
  calculate
}