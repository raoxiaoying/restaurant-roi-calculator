const app = getApp()

// 常用城市数据（覆盖全国地级市）
const CITY_LIST = [
  // 直辖市
  '北京', '上海', '天津', '重庆',
  // 河北
  '石家庄', '唐山', '保定', '邯郸', '秦皇岛', '邢台', '张家口', '承德', '沧州', '廊坊', '衡水',
  // 山西
  '太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁',
  // 内蒙古
  '呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布',
  // 辽宁
  '沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛',
  // 吉林
  '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城',
  // 黑龙江
  '哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化',
  // 江苏
  '南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁',
  // 浙江
  '杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水',
  // 安徽
  '合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城',
  // 福建
  '福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德',
  // 江西
  '南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶',
  // 山东
  '济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽',
  // 河南
  '郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店',
  // 湖北
  '武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施',
  // 湖南
  '长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西',
  // 广东
  '广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮',
  // 广西
  '南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左',
  // 海南
  '海口', '三亚', '三沙', '儋州',
  // 四川
  '成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山',
  // 贵州
  '贵阳', '六盘水', '遵义', '安顺', '毕节', '铜仁', '黔西南', '黔东南', '黔南',
  // 云南
  '昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆',
  // 西藏
  '拉萨', '日喀则', '昌都', '林芝', '山南', '那曲',
  // 陕西
  '西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛',
  // 甘肃
  '兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南',
  // 青海
  '西宁', '海东',
  // 宁夏
  '银川', '石嘴山', '吴忠', '固原', '中卫',
  // 新疆
  '乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰'
]

// 业态分类数据（按美团美食分类，含 icon）
const BUSINESS_TYPE_LIST = [
  { name: '中餐',    icon: '🍜' },
  { name: '火锅',    icon: '🫕' },
  { name: '烧烤',    icon: '🍖' },
  { name: '小吃快餐', icon: '🥟' },
  { name: '西餐',    icon: '🥩' },
  { name: '日料',    icon: '🍱' },
  { name: '韩餐',    icon: '🥘' },
  { name: '东南亚菜', icon: '🍛' },
  { name: '咖啡茶饮', icon: '☕' },
  { name: '甜品烘焙', icon: '🧁' },
  { name: '海鲜',    icon: '🦞' },
  { name: '自助餐',  icon: '🍽️' },
]

const COST_ITEMS = [
  { key: 'foodCost',      label: '食材成本' },
  { key: 'laborCost',     label: '人工成本' },
  { key: 'rentCost',      label: '房租物业' },
  { key: 'utilityCost',   label: '水电能耗' },
  { key: 'marketingCost', label: '营销推广' },
  { key: 'suppliesCost',  label: '耗材物料' },
  { key: 'otherCost',     label: '其他杂费' },
  { key: 'taxCost',       label: '增值税及附加' }
]

Page({
  data: {
    // 城市
    city: '',
    showCitySuggestions: false,
    citySuggestions: [],

    // 业态
    businessType: '',
    businessTypeInfo: null,
    businessTypeList: BUSINESS_TYPE_LIST,

    // 商圈
    district: '',
    districtList: [
      { value: 'A', label: 'A级：市级核心商圈', desc: '人流量大、竞争激烈' },
      { value: 'B', label: 'B级：区级/购物中心商圈', desc: '人流稳定、竞争中等' },
      { value: 'C', label: 'C级：大型社区/商住商圈', desc: '刚需稳定、竞争较小' },
      { value: 'D', label: 'D级：乡镇/景区/学校/医院商圈', desc: '人流有限、竞争少' },
      { value: 'N', label: '不考虑商圈', desc: '' }
    ],

    // 成本结构
    costItems: COST_ITEMS,
    costStructure: null,
    costInputDisplay: {},  // 输入框显示字符串（与 costStructure 解耦，避免输入中途被重置）
    costAdjusted: false,

    // 经营模式
    operationMode: '',
    operationModeList: ['直营', '加盟', '联营', '合伙'],

    // 加盟相关
    franchiseTypeIndex: -1,
    franchiseTypeList: [
      '一次性品牌授权费',
      '授权费 + 年度品牌管理费',
      '授权费 + 营收抽成',
      '授权费 + 利润抽成',
      '授权费 + 管理费 + 营收抽成',
      '授权费 + 管理费 + 利润抽成',
      '零加盟费'
    ],
    brandFee: '',
    amortizeYears: '',
    manageFee: '',
    revenueRate: '',
    profitRate: '',

    // 联营相关
    jointTypeIndex: -1,
    jointTypeList: [
      '固定运营服务费',
      '固定运营服务费 + 营收抽成',
      '固定运营服务费 + 利润抽成'
    ],
    operationFee: '',
    jointRevenueRate: '',
    jointProfitRate: '',

    // 投资与营收
    initialInvestment: '',
    monthlyRevenue: ''
  },

  onLoad() {
    // businessTypeList 已在 data 中初始化
  },

  // 城市输入
  onCityInput(e) {
    const value = e.detail.value
    let suggestions = []
    if (value.trim()) {
      suggestions = CITY_LIST.filter(city => city.indexOf(value) !== -1).slice(0, 8)
    }
    this.setData({
      city: value,
      citySuggestions: suggestions,
      showCitySuggestions: suggestions.length > 0
    })
  },

  // 城市输入框聚焦
  onCityFocus() {
    if (this.data.city && this.data.citySuggestions.length > 0) {
      this.setData({ showCitySuggestions: true })
    }
  },

  // 城市输入框失焦（延迟关闭以便点击选项）
  onCityBlur() {
    setTimeout(() => {
      this.setData({ showCitySuggestions: false })
    }, 200)
  },

  // 选择城市建议
  onCitySelect(e) {
    const city = e.currentTarget.dataset.city
    this.setData({
      city: city,
      showCitySuggestions: false,
      citySuggestions: []
    })
  },

  // 业态宫格点击选择
  onBusinessTypeGridTap(e) {
    const value = e.currentTarget.dataset.value
    const info = app.globalData.businessTypes[value]
    this.setData({
      businessType: value,
      businessTypeInfo: info,
      costAdjusted: false
    }, () => {
      this.calculateDefaultCosts()
    })
  },

  // 商圈选择
  onDistrictSelect(e) {
    const district = e.currentTarget.dataset.value
    this.setData({
      district: district,
      costAdjusted: false
    }, () => {
      this.calculateDefaultCosts()
    })
  },

  // 计算默认成本结构（业态基准 + 商圈调整）
  calculateDefaultCosts() {
    const { businessType, district } = this.data
    if (!businessType || !district) return

    const base = app.globalData.businessTypes[businessType]
    const adjustment = app.globalData.districtAdjustments[district] || {}

    const costStructure = {
      foodCost:      this.roundCost(Math.max(base.foodCost.min,      base.foodCost.default      + (adjustment.foodCost      || 0))),
      laborCost:     this.roundCost(Math.max(base.laborCost.min,     base.laborCost.default     + (adjustment.laborCost     || 0))),
      rentCost:      this.roundCost(Math.max(base.rentCost.min,      base.rentCost.default      + (adjustment.rentCost      || 0))),
      utilityCost:   this.roundCost(Math.max(base.utilityCost.min,   base.utilityCost.default   + (adjustment.utilityCost   || 0))),
      marketingCost: this.roundCost(Math.max(base.marketingCost.min, base.marketingCost.default + (adjustment.marketingCost || 0))),
      suppliesCost:  this.roundCost(Math.max(base.suppliesCost.min,  base.suppliesCost.default  + (adjustment.suppliesCost  || 0))),
      otherCost:     this.roundCost(Math.max(base.otherCost.min,     base.otherCost.default     + (adjustment.otherCost     || 0))),
      taxCost:       this.roundCost(Math.max(base.taxCost.min,       base.taxCost.default       + (adjustment.taxCost       || 0))),
      // 参考区间（百分比整数，用于 UI 显示）
      foodCostMin:      Math.round(base.foodCost.min      * 100),
      foodCostMax:      Math.round(base.foodCost.max      * 100),
      laborCostMin:     Math.round(base.laborCost.min     * 100),
      laborCostMax:     Math.round(base.laborCost.max     * 100),
      rentCostMin:      Math.round(base.rentCost.min      * 100),
      rentCostMax:      Math.round(base.rentCost.max      * 100),
      utilityCostMin:   Math.round(base.utilityCost.min   * 100),
      utilityCostMax:   Math.round(base.utilityCost.max   * 100),
      marketingCostMin: Math.round(base.marketingCost.min * 100),
      marketingCostMax: Math.round(base.marketingCost.max * 100),
      suppliesCostMin:  Math.round(base.suppliesCost.min  * 100),
      suppliesCostMax:  Math.round(base.suppliesCost.max  * 100),
      otherCostMin:     Math.round(base.otherCost.min     * 100),
      otherCostMax:     Math.round(base.otherCost.max     * 100),
      taxCostMin:       Math.round(base.taxCost.min       * 100),
      taxCostMax:       Math.round(base.taxCost.max       * 100)
    }

    this.setData({ costStructure })

    // 同步初始化显示字符串（保留最多两位小数）
    const display = {}
    COST_ITEMS.forEach(item => {
      display[item.key] = this.formatDisplay(costStructure[item.key] * 100)
    })
    this.setData({ costInputDisplay: display })
  },

  // 格式化为显示字符串：最多保留两位小数，去掉末尾多余的零
  formatDisplay(pct) {
    const s = parseFloat(pct.toFixed(2))
    return isNaN(s) ? '0' : String(s)
  },

  // 成本值四舍五入到4位小数（对应百分比两位小数）
  roundCost(value) {
    return Math.round(value * 10000) / 10000
  },

  // 输入中：只更新显示字符串，不修改 costStructure（避免重置光标）
  onCostInput(e) {
    const key = e.currentTarget.dataset.key
    const raw = e.detail.value
    // 只允许数字和一个小数点，最多两位小数
    const filtered = raw.replace(/[^\d.]/g, '').replace(/^(\d*\.?\d{0,2}).*$/, '$1')
    this.setData({ [`costInputDisplay.${key}`]: filtered })
  },

  // 失焦时：校验范围、写入 costStructure、格式化显示
  onCostBlur(e) {
    const key = e.currentTarget.dataset.key
    const raw = this.data.costInputDisplay[key]
    let val = parseFloat(raw)
    if (isNaN(val) || val < 0) val = 0
    if (val > 100) val = 100
    const newCostValue = this.roundCost(val / 100)
    const oldCostValue = this.data.costStructure[key]
    const changed = Math.abs(newCostValue - oldCostValue) > 0.000001
    const cs = { ...this.data.costStructure, [key]: newCostValue }
    const display = { ...this.data.costInputDisplay, [key]: this.formatDisplay(val) }
    this.setData({ costStructure: cs, costInputDisplay: display, ...(changed ? { costAdjusted: true } : {}) })
  },

  // 恢复默认成本
  resetCosts() {
    this.setData({ costAdjusted: false }, () => {
      this.calculateDefaultCosts()
    })
  },

  // 经营模式选择
  onOperationModeSelect(e) {
    this.setData({
      operationMode: e.currentTarget.dataset.value,
      // 重置子选项
      brandFee: '',
      manageFee: '',
      revenueRate: '',
      profitRate: '',
      operationFee: '',
      jointRevenueRate: '',
      jointProfitRate: ''
    })
  },

  // 加盟类型选择
  onFranchiseTypeTap(e) {
    this.setData({
      franchiseTypeIndex: e.currentTarget.dataset.index,
      brandFee: '',
      amortizeYears: '',
      manageFee: '',
      revenueRate: '',
      profitRate: ''
    })
  },

  // 联营类型选择
  onJointTypeTap(e) {
    this.setData({
      jointTypeIndex: e.currentTarget.dataset.index,
      operationFee: '',
      jointRevenueRate: '',
      jointProfitRate: ''
    })
  },

  // 输入事件处理
  onBrandFeeInput(e) { this.setData({ brandFee: e.detail.value }) },
  onAmortizeYearsInput(e) { this.setData({ amortizeYears: e.detail.value }) },
  onManageFeeInput(e) { this.setData({ manageFee: e.detail.value }) },
  onRevenueRateInput(e) { this.setData({ revenueRate: e.detail.value }) },
  onProfitRateInput(e) { this.setData({ profitRate: e.detail.value }) },
  onOperationFeeInput(e) { this.setData({ operationFee: e.detail.value }) },
  onJointRevenueRateInput(e) { this.setData({ jointRevenueRate: e.detail.value }) },
  onJointProfitRateInput(e) { this.setData({ jointProfitRate: e.detail.value }) },
  onInvestmentInput(e) { this.setData({ initialInvestment: e.detail.value }) },
  onRevenueInput(e) { this.setData({ monthlyRevenue: e.detail.value }) },

  // 表单验证
  validate() {
    const { city, businessType, district, operationMode, initialInvestment, monthlyRevenue, costStructure } = this.data

    if (!city || !city.trim()) {
      wx.showToast({ title: '请输入城市名称', icon: 'none' })
      return false
    }
    if (!businessType) {
      wx.showToast({ title: '请选择业态类型', icon: 'none' })
      return false
    }
    if (!district) {
      wx.showToast({ title: '请选择商圈等级', icon: 'none' })
      return false
    }
    if (!operationMode) {
      wx.showToast({ title: '请选择经营模式', icon: 'none' })
      return false
    }

    const inv = parseFloat(initialInvestment)
    if (isNaN(inv) || inv <= 0) {
      wx.showToast({ title: '初始投资额须大于0', icon: 'none' })
      return false
    }
    const rev = parseFloat(monthlyRevenue)
    if (isNaN(rev) || rev <= 0) {
      wx.showToast({ title: '预计月营收须大于0', icon: 'none' })
      return false
    }

    // 验证成本结构
    if (!costStructure) {
      wx.showToast({ title: '成本结构未初始化', icon: 'none' })
      return false
    }
    const totalCost = costStructure.foodCost + costStructure.laborCost + costStructure.rentCost +
      costStructure.utilityCost + costStructure.marketingCost + costStructure.suppliesCost + costStructure.otherCost +
      costStructure.taxCost
    if (totalCost > 1) {
      wx.showToast({ title: `各项成本占比合计${(totalCost * 100).toFixed(1)}%，须小于等于100%`, icon: 'none' })
      return false
    }

    // 验证经营模式相关字段
    if (operationMode === '加盟') {
      const idx = this.data.franchiseTypeIndex
      if (idx < 0) {
        wx.showToast({ title: '请选择加盟费用模式', icon: 'none' })
        return false
      }
      if (idx !== 6) {
        const bf = parseFloat(this.data.brandFee)
        if (isNaN(bf) || bf < 0) {
          wx.showToast({ title: '品牌授权费须大于等于0', icon: 'none' })
          return false
        }
        const ay = parseFloat(this.data.amortizeYears)
        if (isNaN(ay) || ay <= 0 || ay > 30) {
          wx.showToast({ title: '分摊年数须在1-30之间', icon: 'none' })
          return false
        }
      }
      if ((idx === 1 || idx === 4 || idx === 5)) {
        const mf = parseFloat(this.data.manageFee)
        if (isNaN(mf) || mf < 0) {
          wx.showToast({ title: '年度品牌管理费须大于等于0', icon: 'none' })
          return false
        }
      }
      if ((idx === 2 || idx === 4)) {
        const rr = parseFloat(this.data.revenueRate)
        if (isNaN(rr) || rr <= 0 || rr > 100) {
          wx.showToast({ title: '营收抽成比率须在0-100%之间', icon: 'none' })
          return false
        }
      }
      if ((idx === 3 || idx === 5)) {
        const pr = parseFloat(this.data.profitRate)
        if (isNaN(pr) || pr <= 0 || pr > 100) {
          wx.showToast({ title: '利润抽成比率须在0-100%之间', icon: 'none' })
          return false
        }
      }
    }

    if (operationMode === '联营') {
      if (this.data.jointTypeIndex < 0) {
        wx.showToast({ title: '请选择联营费用模式', icon: 'none' })
        return false
      }
      const of = parseFloat(this.data.operationFee)
      if (isNaN(of) || of < 0) {
        wx.showToast({ title: '年运营服务费须大于等于0', icon: 'none' })
        return false
      }
      if (this.data.jointTypeIndex === 1) {
        const jrr = parseFloat(this.data.jointRevenueRate)
        if (isNaN(jrr) || jrr <= 0 || jrr > 100) {
          wx.showToast({ title: '营收抽成比率须在0-100%之间', icon: 'none' })
          return false
        }
      }
      if (this.data.jointTypeIndex === 2) {
        const jpr = parseFloat(this.data.jointProfitRate)
        if (isNaN(jpr) || jpr <= 0 || jpr > 100) {
          wx.showToast({ title: '利润抽成比率须在0-100%之间', icon: 'none' })
          return false
        }
      }
    }

    return true
  },

  // 计算按钮点击
  onCalculate() {
    if (!this.validate()) return

    const cs = this.data.costStructure
    const params = {
      city: this.data.city,
      businessType: this.data.businessType,
      district: this.data.district,
      operationMode: this.data.operationMode,
      initialInvestment: parseFloat(this.data.initialInvestment),
      monthlyRevenue: parseFloat(this.data.monthlyRevenue),
      // 成本结构（用户调整后的值）
      foodCost: cs.foodCost,
      laborCost: cs.laborCost,
      rentCost: cs.rentCost,
      utilityCost: cs.utilityCost,
      marketingCost: cs.marketingCost,
      suppliesCost: cs.suppliesCost,
      otherCost: cs.otherCost,
      taxCost: cs.taxCost,
      // 经营模式
      franchiseTypeIndex: this.data.franchiseTypeIndex,
      brandFee: parseFloat(this.data.brandFee) || 0,
      amortizeYears: parseFloat(this.data.amortizeYears),
      manageFee: parseFloat(this.data.manageFee) || 0,
      revenueRate: parseFloat(this.data.revenueRate) || 0,
      profitRate: parseFloat(this.data.profitRate) || 0,
      jointTypeIndex: this.data.jointTypeIndex,
      operationFee: parseFloat(this.data.operationFee) || 0,
      jointRevenueRate: parseFloat(this.data.jointRevenueRate) || 0,
      jointProfitRate: parseFloat(this.data.jointProfitRate) || 0
    }

    app.globalData.pendingParams = params
    wx.navigateTo({ url: '/pages/result/result' })
  }
})
