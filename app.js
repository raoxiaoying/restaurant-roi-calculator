App({
  onLaunch() {
    // 初始化云开发（开通云开发后填入环境ID）
    if (wx.cloud) {
      try {
        wx.cloud.init({
          env: 'cloud1-d0g5364da118781cb',
          traceUser: true
        })
        this.globalData.cloudReady = true
      } catch (e) {
        this.globalData.cloudReady = false
      }
    } else {
      this.globalData.cloudReady = false
    }
  },
  globalData: {
    // 跨页面参数传递（避免 URL 长度限制）
    pendingParams: null,
    // 商圈成本调整系数
    districtAdjustments: {
      'A': { foodCost: 0, laborCost: 0.01, rentCost: 0.03, utilityCost: 0, marketingCost: 0.02, suppliesCost: 0, otherCost: 0 },
      'B': { foodCost: 0, laborCost: 0, rentCost: 0, utilityCost: 0, marketingCost: 0, suppliesCost: 0, otherCost: 0 },
      'C': { foodCost: 0, laborCost: 0, rentCost: -0.02, utilityCost: 0, marketingCost: -0.01, suppliesCost: 0, otherCost: 0 },
      'D': { foodCost: 0, laborCost: -0.02, rentCost: -0.04, utilityCost: 0, marketingCost: 0, suppliesCost: 0, otherCost: 0 },
      'N': { foodCost: 0, laborCost: 0, rentCost: 0, utilityCost: 0, marketingCost: 0, suppliesCost: 0, otherCost: 0 }
    },
    // 业态成本数据（按美团美食分类）
    // default: 系统推荐值；min/max: 行业参考区间（均为占营收百分比的小数形式）
    businessTypes: {
      '中餐': {
        subCategories: '川菜、湘菜、粤菜、鲁菜、苏菜、浙菜、闽菜、徽菜、东北菜、西北菜、云贵菜、京菜、私房菜、家常菜',
        foodCost:      { default: 0.32,   min: 0.28,   max: 0.38   },
        laborCost:     { default: 0.20,   min: 0.15,   max: 0.25   },
        rentCost:      { default: 0.12,   min: 0.08,   max: 0.18   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.01,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.033,  min: 0.0106, max: 0.033  }
      },
      '火锅': {
        subCategories: '川渝火锅、老北京火锅、潮汕牛肉火锅、鱼火锅、串串香、打边炉、羊肉火锅',
        foodCost:      { default: 0.38,   min: 0.33,   max: 0.45   },
        laborCost:     { default: 0.16,   min: 0.12,   max: 0.20   },
        rentCost:      { default: 0.10,   min: 0.07,   max: 0.15   },
        utilityCost:   { default: 0.05,   min: 0.04,   max: 0.08   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.03   },
        taxCost:       { default: 0.035,  min: 0.0106, max: 0.035  }
      },
      '烧烤': {
        subCategories: '烤串、烤肉、韩式烤肉、日式烧肉、东北烧烤、烤鱼、铁板烧',
        foodCost:      { default: 0.33,   min: 0.28,   max: 0.40   },
        laborCost:     { default: 0.16,   min: 0.12,   max: 0.20   },
        rentCost:      { default: 0.10,   min: 0.06,   max: 0.15   },
        utilityCost:   { default: 0.05,   min: 0.04,   max: 0.08   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.03   },
        taxCost:       { default: 0.036,  min: 0.0106, max: 0.036  }
      },
      '小吃快餐': {
        subCategories: '面食、饺子、馄饨、包子、粥、麻辣烫、黄焖鸡、兰州拉面、沙县小吃、煎饼果子、汉堡、炸鸡',
        foodCost:      { default: 0.28,   min: 0.22,   max: 0.35   },
        laborCost:     { default: 0.18,   min: 0.12,   max: 0.22   },
        rentCost:      { default: 0.12,   min: 0.08,   max: 0.18   },
        utilityCost:   { default: 0.04,   min: 0.02,   max: 0.06   },
        marketingCost: { default: 0.02,   min: 0.01,   max: 0.04   },
        suppliesCost:  { default: 0.03,   min: 0.01,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.03   },
        taxCost:       { default: 0.030,  min: 0.0106, max: 0.030  }
      },
      '西餐': {
        subCategories: '牛排、意面、披萨、法餐、俄餐、西式简餐、美式餐吧',
        foodCost:      { default: 0.32,   min: 0.28,   max: 0.38   },
        laborCost:     { default: 0.22,   min: 0.16,   max: 0.28   },
        rentCost:      { default: 0.14,   min: 0.10,   max: 0.20   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.03,   min: 0.02,   max: 0.06   },
        suppliesCost:  { default: 0.04,   min: 0.02,   max: 0.06   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.031,  min: 0.0106, max: 0.031  }
      },
      '日料': {
        subCategories: '寿司、刺身、居酒屋、日式拉面、日式烤肉、鳗鱼饭、天妇罗',
        foodCost:      { default: 0.38,   min: 0.32,   max: 0.45   },
        laborCost:     { default: 0.18,   min: 0.14,   max: 0.24   },
        rentCost:      { default: 0.12,   min: 0.08,   max: 0.18   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.04,   min: 0.02,   max: 0.06   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.032,  min: 0.0106, max: 0.032  }
      },
      '韩餐': {
        subCategories: '韩式拌饭、韩式烤肉、部队锅、韩式炸鸡、石锅拌饭、参鸡汤',
        foodCost:      { default: 0.32,   min: 0.27,   max: 0.38   },
        laborCost:     { default: 0.17,   min: 0.12,   max: 0.22   },
        rentCost:      { default: 0.11,   min: 0.07,   max: 0.16   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.03   },
        taxCost:       { default: 0.031,  min: 0.0106, max: 0.031  }
      },
      '东南亚菜': {
        subCategories: '泰餐、越南菜、新加坡菜、马来菜、印度菜、咖喱',
        foodCost:      { default: 0.33,   min: 0.28,   max: 0.40   },
        laborCost:     { default: 0.19,   min: 0.14,   max: 0.24   },
        rentCost:      { default: 0.11,   min: 0.07,   max: 0.16   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.03   },
        taxCost:       { default: 0.032,  min: 0.0106, max: 0.032  }
      },
      '咖啡茶饮': {
        subCategories: '咖啡、奶茶、果茶、茶馆、鲜榨果汁、新式茶饮',
        foodCost:      { default: 0.25,   min: 0.20,   max: 0.32   },
        laborCost:     { default: 0.18,   min: 0.14,   max: 0.24   },
        rentCost:      { default: 0.18,   min: 0.12,   max: 0.25   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.06   },
        marketingCost: { default: 0.04,   min: 0.02,   max: 0.08   },
        suppliesCost:  { default: 0.04,   min: 0.02,   max: 0.06   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.028,  min: 0.0106, max: 0.028  }
      },
      '甜品烘焙': {
        subCategories: '蛋糕、面包、冰淇淋、甜品店、手工巧克力、法式甜点',
        foodCost:      { default: 0.28,   min: 0.22,   max: 0.35   },
        laborCost:     { default: 0.19,   min: 0.14,   max: 0.25   },
        rentCost:      { default: 0.14,   min: 0.10,   max: 0.20   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.07   },
        marketingCost: { default: 0.04,   min: 0.02,   max: 0.07   },
        suppliesCost:  { default: 0.04,   min: 0.02,   max: 0.06   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.029,  min: 0.0106, max: 0.029  }
      },
      '海鲜': {
        subCategories: '海鲜自助、海鲜烧烤、海鲜蒸锅、大排档、渔家菜',
        foodCost:      { default: 0.42,   min: 0.36,   max: 0.50   },
        laborCost:     { default: 0.16,   min: 0.12,   max: 0.20   },
        rentCost:      { default: 0.10,   min: 0.06,   max: 0.15   },
        utilityCost:   { default: 0.04,   min: 0.03,   max: 0.07   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.037,  min: 0.0106, max: 0.037  }
      },
      '自助餐': {
        subCategories: '国际自助、烤肉自助、海鲜自助、酒店自助、火锅自助',
        foodCost:      { default: 0.38,   min: 0.32,   max: 0.46   },
        laborCost:     { default: 0.17,   min: 0.12,   max: 0.22   },
        rentCost:      { default: 0.10,   min: 0.06,   max: 0.15   },
        utilityCost:   { default: 0.05,   min: 0.03,   max: 0.08   },
        marketingCost: { default: 0.03,   min: 0.01,   max: 0.05   },
        suppliesCost:  { default: 0.03,   min: 0.02,   max: 0.05   },
        otherCost:     { default: 0.02,   min: 0.01,   max: 0.04   },
        taxCost:       { default: 0.034,  min: 0.0106, max: 0.034  }
      }
    }
  }
})
