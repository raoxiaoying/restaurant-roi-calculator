const { calculate, businessTypes } = require('../utils/calculator')

function assertAlmostEqual(actual, expected, tolerance = 0.0001) {
  return Math.abs(actual - expected) <= tolerance
}

function runTests() {
  const tests = [
    {
      name: '【数学验证】年营收计算正确',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const expectedAnnualRevenue = 30 * 12
        return assertAlmostEqual(result.annualRevenue, expectedAnnualRevenue)
      },
      description: '月营收30万 × 12个月 = 年营收360万'
    },
    {
      name: '【数学验证】总成本率计算正确',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const typeData = businessTypes['快餐简餐类']
        const expectedTotalCost = typeData.foodCost + typeData.laborCost + 
          typeData.rentCost + typeData.utilityCost + typeData.marketingCost + 
          typeData.suppliesCost + typeData.otherCost
        const actualCostRate = result.annualCost / result.annualRevenue
        return assertAlmostEqual(actualCostRate, expectedTotalCost)
      },
      description: '7项成本占比之和 = 总成本率'
    },
    {
      name: '【数学验证】基础利润计算正确',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const expectedBaseProfit = result.annualRevenue - result.annualCost
        return assertAlmostEqual(result.baseProfit, expectedBaseProfit)
      },
      description: '年营收 - 年成本 = 基础利润'
    },
    {
      name: '【数学验证】年利润 = 基础利润 - 模式费用',
      params: {
        businessType: '茶饮甜品烘焙类',
        operationMode: '加盟',
        franchiseTypeIndex: 1,
        brandFee: 10,
        manageFee: 2,
        initialInvestment: 30,
        monthlyRevenue: 25
      },
      validate: (result) => {
        const expectedAnnualProfit = result.baseProfit - result.modelFee
        return assertAlmostEqual(result.annualProfit, expectedAnnualProfit)
      },
      description: '基础利润 - 经营模式费用 = 年利润'
    },
    {
      name: '【数学验证】ROI计算正确',
      params: {
        businessType: '小吃卤味外带类',
        operationMode: '直营',
        initialInvestment: 10,
        monthlyRevenue: 8
      },
      validate: (result) => {
        const expectedROI = result.annualProfit / result.annualRevenue * (result.annualRevenue / 10)
        return assertAlmostEqual(result.roi, result.annualProfit / 10)
      },
      description: 'ROI = 年利润 / 初始投资'
    },
    {
      name: '【数学验证】回收期计算正确',
      params: {
        businessType: '轻食西餐简餐类',
        operationMode: '直营',
        initialInvestment: 40,
        monthlyRevenue: 35
      },
      validate: (result) => {
        const monthlyProfit = result.annualProfit / 12
        const expectedPayback = Math.ceil(40 / monthlyProfit)
        return result.paybackMonths === expectedPayback
      },
      description: '回收期 = 初始投资 / 月利润（向上取整）'
    },
    {
      name: '【逻辑验证】加盟模式0：一次性授权费分摊',
      params: {
        businessType: '快餐简餐类',
        operationMode: '加盟',
        franchiseTypeIndex: 0,
        brandFee: 12,
        amortizeYears: 5,
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const expectedModelFee = 12 / 5
        return assertAlmostEqual(result.modelFee, expectedModelFee)
      },
      description: '品牌费12万 / 分摊5年 = 年费用2.4万'
    },
    {
      name: '【逻辑验证】加盟模式1：授权费+管理费',
      params: {
        businessType: '茶饮甜品烘焙类',
        operationMode: '加盟',
        franchiseTypeIndex: 1,
        brandFee: 15,
        manageFee: 3,
        initialInvestment: 40,
        monthlyRevenue: 25
      },
      validate: (result) => {
        const expectedModelFee = 15 / 3 + 3
        return assertAlmostEqual(result.modelFee, expectedModelFee)
      },
      description: '(15/3) + 3 = 8万/年'
    },
    {
      name: '【逻辑验证】加盟模式2：授权费+营收抽成',
      params: {
        businessType: '正餐特色中餐类',
        operationMode: '加盟',
        franchiseTypeIndex: 2,
        brandFee: 20,
        revenueRate: 5,
        initialInvestment: 80,
        monthlyRevenue: 60
      },
      validate: (result) => {
        const annualRevenue = 60 * 12
        const expectedModelFee = 20 / 3 + annualRevenue * (5 / 100)
        return assertAlmostEqual(result.modelFee, expectedModelFee)
      },
      description: '(20/3) + 720×5% = 约43.67万/年'
    },
    {
      name: '【逻辑验证】加盟模式6：零加盟费',
      params: {
        businessType: '小吃卤味外带类',
        operationMode: '加盟',
        franchiseTypeIndex: 6,
        initialInvestment: 10,
        monthlyRevenue: 8
      },
      validate: (result) => {
        return result.modelFee === 0
      },
      description: '零加盟费模式，年费用应为0'
    },
    {
      name: '【逻辑验证】联营模式0：固定服务费',
      params: {
        businessType: '轻食西餐简餐类',
        operationMode: '联营',
        jointTypeIndex: 0,
        operationFee: 5,
        initialInvestment: 40,
        monthlyRevenue: 35
      },
      validate: (result) => {
        return result.modelFee === 5
      },
      description: '固定运营服务费5万/年'
    },
    {
      name: '【逻辑验证】联营模式1：服务费+营收抽成',
      params: {
        businessType: '快餐简餐类',
        operationMode: '联营',
        jointTypeIndex: 1,
        operationFee: 3,
        jointRevenueRate: 3,
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const annualRevenue = 30 * 12
        const expectedModelFee = 3 + annualRevenue * (3 / 100)
        return assertAlmostEqual(result.modelFee, expectedModelFee)
      },
      description: '3 + 360×3% = 13.8万/年'
    },
    {
      name: '【边界验证】亏损状态回收期为-1',
      params: {
        businessType: '正餐特色中餐类',
        operationMode: '加盟',
        franchiseTypeIndex: 5,
        brandFee: 50,
        manageFee: 10,
        profitRate: 50,
        initialInvestment: 100,
        monthlyRevenue: 20
      },
      validate: (result) => {
        return result.paybackMonths === -1 && result.annualProfit < 0
      },
      description: '年利润为负时，回收期应为-1'
    },
    {
      name: '【边界验证】初始投资为0时ROI处理',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 0,
        monthlyRevenue: 30
      },
      validate: (result) => {
        return !isNaN(result.roi) && result.roi === 0
      },
      description: '初始投资为0时，ROI应为0而非NaN'
    },
    {
      name: '【边界验证】营收为0时利润率处理',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 50,
        monthlyRevenue: 0
      },
      validate: (result) => {
        return !isNaN(result.annualProfitRate)
      },
      description: '营收为0时，利润率不应为NaN'
    },
    {
      name: '【业务验证】低成本业态应有更高ROI',
      params: {
        businessType: '小吃卤味外带类',
        operationMode: '直营',
        initialInvestment: 10,
        monthlyRevenue: 8
      },
      validate: (result) => {
        const result2 = calculate({
          businessType: '正餐特色中餐类',
          operationMode: '直营',
          initialInvestment: 10,
          monthlyRevenue: 8
        })
        return result.roi > result2.roi
      },
      description: '小吃卤味成本率低，ROI应高于正餐中餐'
    },
    {
      name: '【业务验证】相同条件下直营模式ROI最高',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const franchiseResult = calculate({
          businessType: '快餐简餐类',
          operationMode: '加盟',
          franchiseTypeIndex: 1,
          brandFee: 10,
          manageFee: 2,
          initialInvestment: 50,
          monthlyRevenue: 30
        })
        const jointResult = calculate({
          businessType: '快餐简餐类',
          operationMode: '联营',
          jointTypeIndex: 0,
          operationFee: 5,
          initialInvestment: 50,
          monthlyRevenue: 30
        })
        return result.roi >= franchiseResult.roi && result.roi >= jointResult.roi
      },
      description: '直营无额外费用，ROI应不低于加盟和联营'
    },
    {
      name: '【业务验证】高成本业态需要更高营收',
      params: {
        businessType: '火锅烧烤夜宵类',
        operationMode: '直营',
        initialInvestment: 150,
        monthlyRevenue: 100
      },
      validate: (result) => {
        return result.annualProfit <= 0
      },
      description: '火锅烧烤成本率高(95%)，月营收100万仍亏损'
    },
    {
      name: '【评估验证】优秀等级条件',
      params: {
        businessType: '小吃卤味外带类',
        operationMode: '直营',
        initialInvestment: 10,
        monthlyRevenue: 15
      },
      validate: (result) => {
        return result.paybackMonths <= 18 && result.roi > 0.5 && 
               result.assessmentLevel === 'level-good'
      },
      description: '回收期≤18个月且ROI>50%，应评为"优"'
    },
    {
      name: '【评估验证】中等等级边界',
      params: {
        businessType: '快餐简餐类',
        operationMode: '直营',
        initialInvestment: 120,
        monthlyRevenue: 20
      },
      validate: (result) => {
        const isMedium = result.paybackMonths > 18 && result.paybackMonths <= 36 && 
                        result.roi > 0.2 && result.roi <= 0.5
        return isMedium && result.assessmentLevel === 'level-medium'
      },
      description: '回收期19-36个月且ROI20%-50%，应评为"中"'
    },
    {
      name: '【评估验证】风险等级条件',
      params: {
        businessType: '正餐特色中餐类',
        operationMode: '直营',
        initialInvestment: 100,
        monthlyRevenue: 25
      },
      validate: (result) => {
        const isPoor = result.paybackMonths > 36 || result.roi <= 0.2 || result.paybackMonths === -1
        return isPoor && result.assessmentLevel === 'level-poor'
      },
      description: '回收期>36个月或ROI≤20%，应评为"差"'
    },
    {
      name: '【极端值】极低投资额',
      params: {
        businessType: '小吃卤味外带类',
        operationMode: '直营',
        initialInvestment: 1,
        monthlyRevenue: 5
      },
      validate: (result) => {
        return result.paybackMonths > 0 && result.roi > 0
      },
      description: '投资1万，月营收5万，应快速回本'
    },
    {
      name: '【极端值】极高抽成比例',
      params: {
        businessType: '快餐简餐类',
        operationMode: '加盟',
        franchiseTypeIndex: 2,
        brandFee: 10,
        revenueRate: 90,
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        return result.annualProfit < 0 && result.paybackMonths === -1
      },
      description: '90%营收抽成，应导致亏损'
    },
    {
      name: '【一致性验证】相同参数计算结果一致',
      params: {
        businessType: '茶饮甜品烘焙类',
        operationMode: '联营',
        jointTypeIndex: 2,
        operationFee: 4,
        jointProfitRate: 15,
        initialInvestment: 50,
        monthlyRevenue: 30
      },
      validate: (result) => {
        const result2 = calculate({
          businessType: '茶饮甜品烘焙类',
          operationMode: '联营',
          jointTypeIndex: 2,
          operationFee: 4,
          jointProfitRate: 15,
          initialInvestment: 50,
          monthlyRevenue: 30
        })
        return result.roi === result2.roi && result.paybackMonths === result2.paybackMonths
      },
      description: '相同参数多次计算结果应一致'
    },
    {
      name: '【精度验证】浮点数计算精度',
      params: {
        businessType: '轻食西餐简餐类',
        operationMode: '直营',
        initialInvestment: 25.5,
        monthlyRevenue: 12.3
      },
      validate: (result) => {
        const annualRevenue = 12.3 * 12
        return assertAlmostEqual(result.annualRevenue, annualRevenue)
      },
      description: '小数输入计算精度应保持'
    }
  ]

  let passed = 0
  let failed = 0
  const failures = []

  console.log('='.repeat(90))
  console.log('餐饮投资测算计算器 - 计算正确性与合理性测试报告')
  console.log('='.repeat(90))

  tests.forEach((test, index) => {
    try {
      const result = calculate(test.params)
      const isPassed = test.validate(result)

      if (isPassed) {
        passed++
        console.log(`✓ [${String(index + 1).padStart(2, '0')}] ${test.name}`)
        console.log(`   说明: ${test.description}`)
        console.log(`   结果: ROI=${(result.roi * 100).toFixed(1)}%, 回收期=${result.paybackMonths > 0 ? result.paybackMonths + '个月' : '亏损'}, 评估=${result.assessmentIcon}`)
      } else {
        failed++
        failures.push({
          name: test.name,
          description: test.description,
          result: {
            roi: (result.roi * 100).toFixed(1) + '%',
            paybackMonths: result.paybackMonths > 0 ? result.paybackMonths + '个月' : '亏损',
            assessment: result.assessmentIcon
          }
        })
        console.log(`✗ [${String(index + 1).padStart(2, '0')}] ${test.name}`)
        console.log(`   说明: ${test.description}`)
        console.log(`   失败原因: 验证条件未满足`)
      }
      console.log()
    } catch (error) {
      failed++
      failures.push({
        name: test.name,
        description: test.description,
        error: error.message
      })
      console.log(`✗ [${String(index + 1).padStart(2, '0')}] ${test.name}`)
      console.log(`   说明: ${test.description}`)
      console.log(`   异常: ${error.message}`)
      console.log()
    }
  })

  console.log('='.repeat(90))
  console.log(`测试结果: 总计 ${tests.length} 个测试用例`)
  console.log(`  ✓ 通过: ${passed} 个`)
  console.log(`  ✗ 失败: ${failed} 个`)
  console.log('='.repeat(90))

  if (failures.length > 0) {
    console.log('\n📋 失败详情:')
    failures.forEach((f, i) => {
      console.log(`${i + 1}. ${f.name}`)
      console.log(`   说明: ${f.description}`)
      if (f.error) {
        console.log(`   异常: ${f.error}`)
      } else if (f.result) {
        console.log(`   计算结果: ROI=${f.result.roi}, 回收期=${f.result.paybackMonths}, 评估=${f.result.assessment}`)
      }
    })
  }

  return { passed, failed, total: tests.length }
}

runTests()