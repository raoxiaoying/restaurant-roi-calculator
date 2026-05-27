const app = getApp()

Page({
  data: {
    city: '',
    businessType: '',
    paybackMonths: 0,
    roi: 0,
    roiDisplay: '',
    annualProfitRate: 0,
    profitRateDisplay: '',
    annualRevenueDisplay: '',
    annualCostDisplay: '',
    modelFeeDisplay: 0,
    annualProfit: 0,
    annualProfitDisplay: '',
    initialInvestmentDisplay: '',
    costBreakdown: [],
    assessmentLevel: '',
    assessmentIcon: '',
    assessmentTitle: '',
    assessmentDesc: '',
    // 反馈相关
    feedbackExpanded: false,
    feedbackSubmitted: false,
    feedbackContent: '',
    feedbackImages: [],
    feedbackContact: '',
    contactError: '',
    // 当前测算记录ID（用于关联反馈）
    calculationId: ''
  },

  onLoad() {
    const params = app.globalData.pendingParams
    if (params) {
      app.globalData.pendingParams = null
      this.calculate(params)
    }
  },

  calculate(params) {
    const {
      city, businessType, operationMode,
      initialInvestment, monthlyRevenue,
      foodCost, laborCost, rentCost, utilityCost, marketingCost, suppliesCost, otherCost, taxCost,
      franchiseTypeIndex, brandFee, amortizeYears, manageFee, revenueRate, profitRate,
      jointTypeIndex, operationFee, jointRevenueRate, jointProfitRate
    } = params

    const totalCostRate = foodCost + laborCost + rentCost + utilityCost + marketingCost + suppliesCost + otherCost + taxCost

    // 年营收（万元）
    const annualRevenue = monthlyRevenue * 12

    // 基础现金利润（扣除运营成本后）
    const baseProfit = annualRevenue * (1 - totalCostRate)

    // 计算经营模式附加费用（万元/年）
    let modelFee = 0
    if (operationMode === '加盟') {
      const annualBrandFee = brandFee / amortizeYears
      switch (franchiseTypeIndex) {
        case 0: // 一次性品牌授权费（纯固定加盟费）
          modelFee = annualBrandFee
          break
        case 1: // 授权费分摊 + 年度品牌管理费
          modelFee = annualBrandFee + manageFee
          break
        case 2: // 授权费分摊 + 营收抽成
          modelFee = annualBrandFee + annualRevenue * (revenueRate / 100)
          break
        case 3: // 授权费分摊 + 利润抽成（抽成基数 = baseProfit - 授权费分摊）
          modelFee = annualBrandFee + Math.max(0, baseProfit - annualBrandFee) * (profitRate / 100)
          break
        case 4: // 授权费分摊 + 管理费 + 营收抽成
          modelFee = annualBrandFee + manageFee + annualRevenue * (revenueRate / 100)
          break
        case 5: // 授权费分摊 + 管理费 + 利润抽成（抽成基数 = baseProfit - 授权费分摊 - 管理费）
          modelFee = annualBrandFee + manageFee + Math.max(0, baseProfit - annualBrandFee - manageFee) * (profitRate / 100)
          break
        case 6: // 零加盟费
          modelFee = 0
          break
      }
    } else if (operationMode === '联营') {
      switch (jointTypeIndex) {
        case 0: // 固定运营服务费
          modelFee = operationFee
          break
        case 1: // 固定运营服务费 + 营收抽成
          modelFee = operationFee + annualRevenue * (jointRevenueRate / 100)
          break
        case 2: // 固定运营服务费 + 利润抽成（抽成基数 = baseProfit - 运营服务费）
          modelFee = operationFee + Math.max(0, baseProfit - operationFee) * (jointProfitRate / 100)
          break
      }
    }
    // 直营、合伙模式无附加费用

    // 年现金利润额
    const annualProfit = baseProfit - modelFee

    // 年现金利润率
    const annualProfitRate = annualRevenue > 0 ? (annualProfit / annualRevenue) : 0

    // 投资回收期（月）
    const monthlyProfit = annualProfit / 12
    const paybackMonths = monthlyProfit > 0 ? Math.ceil(initialInvestment / monthlyProfit) : -1

    // ROI
    const roi = initialInvestment > 0 ? (annualProfit / initialInvestment) : 0

    // 年运营成本
    const annualCost = annualRevenue * totalCostRate

    // 成本结构（以实际最大成本项为100%基准，避免条超出容器）
    const maxCostRate = Math.max(foodCost, laborCost, rentCost, utilityCost, marketingCost, suppliesCost, otherCost, taxCost)
    const barScale = maxCostRate > 0 ? maxCostRate : 1
    const costBreakdown = [
      { name: '食材成本', percent: (foodCost * 100).toFixed(1), barWidth: (foodCost / barScale * 100).toFixed(1), color: '#3370ff' },
      { name: '人工成本', percent: (laborCost * 100).toFixed(1), barWidth: (laborCost / barScale * 100).toFixed(1), color: '#7b61ff' },
      { name: '房租物业', percent: (rentCost * 100).toFixed(1), barWidth: (rentCost / barScale * 100).toFixed(1), color: '#ff9500' },
      { name: '水电能耗', percent: (utilityCost * 100).toFixed(1), barWidth: (utilityCost / barScale * 100).toFixed(1), color: '#34c759' },
      { name: '营销推广', percent: (marketingCost * 100).toFixed(1), barWidth: (marketingCost / barScale * 100).toFixed(1), color: '#ff6b6b' },
      { name: '耗材物料', percent: (suppliesCost * 100).toFixed(1), barWidth: (suppliesCost / barScale * 100).toFixed(1), color: '#00c8d4' },
      { name: '其他杂费', percent: (otherCost * 100).toFixed(1), barWidth: (otherCost / barScale * 100).toFixed(1), color: '#8f959e' },
      { name: '增值税及附加', percent: (taxCost * 100).toFixed(1), barWidth: (taxCost / barScale * 100).toFixed(1), color: '#f0883e' }
    ]

    // 投资评估
    let assessmentLevel, assessmentIcon, assessmentTitle, assessmentDesc
    if (annualProfit < 0) {
      assessmentLevel = 'level-poor'
      assessmentIcon = '亏'
      assessmentTitle = '项目处于亏损状态'
      assessmentDesc = `年现金利润额为${annualProfit.toFixed(2)}万元，当前测算显示项目无法盈利。建议重新评估营收预期、成本结构或经营模式。`
    } else if (monthlyProfit === 0) {
      assessmentLevel = 'level-medium'
      assessmentIcon = '平'
      assessmentTitle = '收支基本平衡'
      assessmentDesc = '当前测算显示项目处于盈亏平衡状态，收入恰好覆盖全部成本与费用，无现金利润剩余。建议优化成本结构或提升营收以获得正向回报。'
    } else if (paybackMonths > 0 && paybackMonths <= 18 && roi > 0.5) {
      assessmentLevel = 'level-good'
      assessmentIcon = '优'
      assessmentTitle = '投资回报较好'
      assessmentDesc = `预计${paybackMonths}个月可收回投资，年ROI为${(roi * 100).toFixed(1)}%，整体回报表现优秀。建议关注实际运营中的成本管控。`
    } else if (paybackMonths > 0 && paybackMonths <= 36 && roi > 0.2) {
      assessmentLevel = 'level-medium'
      assessmentIcon = '中'
      assessmentTitle = '投资回报一般'
      assessmentDesc = `预计${paybackMonths}个月可收回投资，年ROI为${(roi * 100).toFixed(1)}%，回报周期较长。建议优化成本结构或提升营收能力。`
    } else if (paybackMonths > 0) {
      assessmentLevel = 'level-poor'
      assessmentIcon = '差'
      assessmentTitle = '投资风险较高'
      assessmentDesc = `回收期长达${paybackMonths}个月，年ROI仅${(roi * 100).toFixed(1)}%，投资风险较大。建议重新评估选址、业态或运营模式。`
    } else {
      assessmentLevel = 'level-poor'
      assessmentIcon = '差'
      assessmentTitle = '投资风险较高'
      assessmentDesc = '当前测算显示项目无法收回投资，建议重新评估商业模式和成本结构。'
    }

    this.setData({
      city,
      businessType,
      paybackMonths,
      roi,
      roiDisplay: (roi * 100).toFixed(1),
      annualProfitRate,
      profitRateDisplay: (annualProfitRate * 100).toFixed(1),
      initialInvestmentDisplay: initialInvestment.toFixed(2),
      annualRevenueDisplay: annualRevenue.toFixed(2),
      annualCostDisplay: annualCost.toFixed(2),
      modelFeeDisplay: modelFee,
      annualProfit,
      annualProfitDisplay: annualProfit.toFixed(2),
      costBreakdown,
      totalCostRateDisplay: (totalCostRate * 100).toFixed(1),
      assessmentLevel,
      assessmentIcon,
      assessmentTitle,
      assessmentDesc
    })

    // 将测算参数和结果存入云数据库
    this._saveCalculation(params, {
      annualRevenue,
      annualCost,
      modelFee,
      annualProfit,
      annualProfitRate,
      paybackMonths,
      roi,
      totalCostRate,
      assessmentTitle
    })
  },

  // 存储测算记录到云数据库（降级：云未就绪则本地缓存）
  _saveCalculation(params, results) {
    const record = { params, results, createTime: new Date().toISOString() }
    if (app.globalData.cloudReady) {
      const db = wx.cloud.database()
      db.collection('calculations').add({
        data: { ...record, createTime: db.serverDate() }
      }).then(res => {
        this.setData({ calculationId: res._id })
      }).catch(() => {
        // 云存储失败，降级到本地
        this._saveLocal('calculations', record)
      })
    } else {
      this._saveLocal('calculations', record)
    }
  },

  // 本地缓存兜底
  _saveLocal(key, data) {
    try {
      const list = wx.getStorageSync(key) || []
      list.unshift({ ...data, _localId: Date.now() })
      wx.setStorageSync(key, list.slice(0, 50)) // 最多保留50条
    } catch (e) { /* 存储失败静默处理 */ }
  },

  onBack() {
    wx.navigateBack()
  },

  // 反馈模块
  onExpandFeedback() {
    this.setData({ feedbackExpanded: true })
  },

  onCollapseFeedback() {
    this.setData({
      feedbackExpanded: false,
      feedbackContent: '',
      feedbackImages: [],
      feedbackContact: '',
      contactError: ''
    })
  },

  onFeedbackInput(e) {
    this.setData({ feedbackContent: e.detail.value })
  },

  onChooseImage() {
    const remaining = 3 - this.data.feedbackImages.length
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({
          feedbackImages: [...this.data.feedbackImages, ...newImages]
        })
      }
    })
  },

  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.feedbackImages]
    images.splice(index, 1)
    this.setData({ feedbackImages: images })
  },

  onPreviewImage(e) {
    const current = e.currentTarget.dataset.src
    wx.previewImage({
      current,
      urls: this.data.feedbackImages
    })
  },

  onContactInput(e) {
    const value = e.detail.value
    let contactError = ''
    if (value.trim()) {
      const phoneReg = /^1[3-9]\d{9}$/
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!phoneReg.test(value.trim()) && !emailReg.test(value.trim())) {
        contactError = '请输入正确的手机号或邮箱'
      }
    }
    this.setData({ feedbackContact: value, contactError })
  },

  // 上传图片到云存储（失败返回null，不阻断提交）
  _uploadImage(filePath) {
    if (!app.globalData.cloudReady) return Promise.resolve(null)
    const ext = filePath.split('.').pop()
    const cloudPath = `feedback/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    return wx.cloud.uploadFile({ cloudPath, filePath })
      .then(res => res.fileID)
      .catch(() => null)
  },

  onSubmitFeedback() {
    const { feedbackContent, feedbackImages, feedbackContact, contactError, calculationId } = this.data
    if (!feedbackContent.trim()) return

    // 校验联系方式格式
    if (feedbackContact.trim()) {
      const phoneReg = /^1[3-9]\d{9}$/
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!phoneReg.test(feedbackContact.trim()) && !emailReg.test(feedbackContact.trim())) {
        this.setData({ contactError: '请输入正确的手机号或邮箱' })
        return
      }
    }
    if (contactError) return

    wx.showLoading({ title: '提交中…' })

    // 上传图片（失败的返回null，过滤掉）
    const uploadTasks = feedbackImages.map(path => this._uploadImage(path))

    Promise.all(uploadTasks).then(results => {
      const fileIDs = results.filter(id => id !== null)
      const feedbackData = {
        calculationId,
        content: feedbackContent.trim(),
        images: fileIDs,
        contact: feedbackContact.trim(),
        city: this.data.city,
        businessType: this.data.businessType,
        createTime: new Date().toISOString()
      }

      if (app.globalData.cloudReady) {
        const db = wx.cloud.database()
        return db.collection('feedbacks').add({
          data: { ...feedbackData, createTime: db.serverDate() }
        })
      } else {
        // 云未就绪，本地缓存
        this._saveLocal('feedbacks', feedbackData)
        return Promise.resolve()
      }
    }).then(() => {
      wx.hideLoading()
      this.setData({
        feedbackSubmitted: true,
        feedbackExpanded: false,
        feedbackContent: '',
        feedbackImages: [],
        feedbackContact: '',
        contactError: ''
      })
      wx.showToast({ title: '提交成功', icon: 'success' })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '提交失败，请重试', icon: 'none' })
    })
  }
})
