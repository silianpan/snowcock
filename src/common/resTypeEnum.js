// 图形分类
const GRAPH_CLASSIFY_NORMAL = '0'
const GRAPH_CLASSIFY_ZABBIX = '1'
const GRAPH_CLASSIFY_REPORT = '2'

// 数据的分类
const DATA_CLASSIFY_NORMAL = '0' // 通用
const DATA_CLASSIFY_ZABBIX = '1' // 监控
const DATA_CLASSIFY_REPORT = '2' // 报表

// 信誉
const CREDIBILITY_EXCELLENT = '1'

const CREDIBILITY_FINE = '2'
const CREDIBILITY_NONE = '0'

// 客商种类
const NATURECOMPANY_STATE_OWNED = '1'
const NATURECOMPANY_PRIVATELY_OPERATED = '2'
const NATURECOMPANY_INSTITUTION = '3'
const NATURECOMPANY_LISTED_CUSTOMERS = '4'
const NATURECOMPANY_FOREIGN_CAPITAL = '5'
const NATURECOMPANY_PRIVATE = '6'
const NATURECOMPANY_OTHER = '7'

// 合同种类
// const CONTRACT_INCOME = '1'
// const CONTRACT_PAY = '2'

// 纳税人类别
const TAXPAYER_COMMON = '1'
const TAXPAYER_SMALL_SCALE = '2'

// 资金类型
// const FUND_TYPE_INCOME = '1'
// const FUND_TYPE_OUTCOME = '2'

export default {
  /**
   * 获取所有图形分类
   *
   * @returns
   */
  getAllGrapshClassify() {
    return [
      {
        label: '所有',
        value: ''
      },
      {
        label: '通用',
        value: GRAPH_CLASSIFY_NORMAL
      },
      {
        label: '监控',
        value: GRAPH_CLASSIFY_ZABBIX
      },
      {
        label: '报表',
        value: GRAPH_CLASSIFY_REPORT
      }
    ]
  },

  getAllMerchantCredibility() {
    return [
      {
        name: '优',
        id: CREDIBILITY_EXCELLENT
      },
      {
        name: '良好',
        id: CREDIBILITY_FINE
      },
      {
        name: '其他',
        id: CREDIBILITY_NONE
      }
    ]
  },

  // 纳税人类别
  getTaxpayers() {
    return [
      {
        id: TAXPAYER_COMMON,
        name: '一般纳税人'
      },
      {
        id: TAXPAYER_SMALL_SCALE,
        name: '小规模纳税人'
      }
    ]
  },

  getTaxpayerNameByTaxpayerType(type) {
    var arr = this.getTaxpayers()
    var name = '未知'

    arr.forEach(function(el) {
      if (el.id === type) {
        name = el.name
      }
    }, this)
    return name
  },
  /**
   * 信誉id
   * @param {*信誉id} id
   */
  getMerchantCredibilityById(id) {
    var arr = this.getAllMerchantCredibility()
    var cred = '暂无'
    arr.forEach(function(element) {
      if (element.id === id) {
        cred = element.name
      }
    }, this)

    return cred
  },

  /**
   * 获取到预算类型的大类
   */
  getAllBudgetParentType() {
    return [
      { id: 1, name: '销售预算' },
      { id: 2, name: '生产预算' },
      { id: 3, name: '管理预算' }
    ]
  },
  /**
   * 获取到预算类型的成本或费用
   */
  getAllBudgetTypeCorE() {
    return [{ id: 1, name: '成本' }, { id: 2, name: '费用' }]
  },
  getBudgetTypeCorEById(id) {
    switch (id) {
      case '1':
        return '成本'
      case '2':
        return '费用'
      default:
        return '未知'
    }
  },
  getAllIsOrNot() {
    return [{ id: 0, name: '否' }, { id: 1, name: '是' }]
  },
  // 是否对应合同
  getBudgetTypeHasContractById(id) {
    switch (id) {
      case '0':
        return '否'
      case '1':
        return '是'
      default:
        return '未知'
    }
  },

  getAllMerchantClassify() {
    return [
      {
        id: NATURECOMPANY_STATE_OWNED,
        name: '国企'
      },
      {
        id: NATURECOMPANY_PRIVATELY_OPERATED,
        name: '民营'
      },
      {
        id: NATURECOMPANY_INSTITUTION,
        name: '经营部及个体户'
      },
      {
        id: NATURECOMPANY_LISTED_CUSTOMERS,
        name: '党政机构及事业单位'
      },
      {
        id: NATURECOMPANY_FOREIGN_CAPITAL,
        name: '上市公司'
      },
      {
        id: NATURECOMPANY_PRIVATE,
        name: '外企'
      },
      {
        id: NATURECOMPANY_OTHER,
        name: '其它'
      }
    ]
  },

  getMerchantCredibilityTextColor(type) {
    var obj = this.getMerchantCredibilityColorMap()

    for (let [k, v] of Object.entries(obj)) {
      if (v === type) {
        return k
      }
    }
    return 'text-gray'
  },

  getMerchantCredibilityColorMap() {
    return {
      'text-blue': CREDIBILITY_EXCELLENT,
      'text-green': CREDIBILITY_FINE,
      'text-gray': CREDIBILITY_NONE
    }
  },

  getMerchantClassifyById(id) {
    var arr = this.getAllMerchantClassify()
    var classify = '暂无'
    arr.forEach(function(element) {
      if (element.id === id) {
        classify = element.name
      }
    }, this)

    return classify
  },

  /**
   * 获取所有数据源分类
   *
   * @returns
   */
  getAllDataClassify() {
    return [
      {
        label: '所有',
        value: '-1'
      },
      {
        label: '通用',
        value: DATA_CLASSIFY_NORMAL
      },
      {
        label: '监控',
        value: DATA_CLASSIFY_ZABBIX
      },
      {
        label: '报表',
        value: DATA_CLASSIFY_REPORT
      }
    ]
  },

  /**
   * 获取所有项目类型
   *
   * @returns
   */
  getAllProjectClassify() {
    return [
      { name: '综合', id: 1 },
      { name: '工程施工', id: 2 },
      { name: '系统集成', id: 3 },
      { name: '技术服务', id: 4 },
      { name: '软件研发', id: 5 },
      { name: '产品销售', id: 6 },
      { name: '运营（销售、生产）', id: 7 },
      { name: '运营（综合、财务）', id: 8 },
      { name: '其他', id: 0 }
    ]
  },
  /**
   * 根据编号获取项目分类名称
   *
   * @param {any} id 项目编号
   * @returns
   */
  getProjectClassifyById(id) {
    switch (id) {
      case '1':
        return '综合'
      case '2':
        return '工程施工'
      case '3':
        return '系统集成'
      case '4':
        return '技术服务'
      case '5':
        return '软件研发'
      case '6':
        return '产品销售'
      case '7':
        return '运营（销售、生产）'
      case '8':
        return '运营（综合、财务）'
      case '0':
        return '其他'
      default:
        return '其他'
    }
  },
  /**
   * 根据id获取颜色class
   *
   * @param {any} id 分类编号
   * @returns
   */
  getProjectClassTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
        return 'text-purple'
      case '3':
        return 'text-green'
      default:
        return 'text-gray'
    }
  },

  /**
   * 获取所有区域分类
   *
   * @returns
   */
  getAllAreaClassify() {
    return [
      { name: '省内', id: 1 },
      { name: '省外（一般地区）', id: 2 },
      { name: '省外（特殊地区）', id: 3 },
      { name: '其他', id: 4 }
    ]
  },
  /**
   * 根据编号获取区域分类名称
   *
   * @param {any} id 项目编号
   * @returns
   */
  getAreaClassifyById(id) {
    switch (id) {
      case '1':
        return '省内'
      case '2':
        return '省外（一般地区）'
      case '3':
        return '省外（特殊地区）'
      case '4':
        return '其他'
      default:
        return '其他'
    }
  },

  /**
   * 获取合同类型
   */
  getAllContractClassify() {
    return [{ name: '收入合同', id: 1 }, { name: '支出合同', id: 2 }]
  },
  /**
   * 根据id获取颜色class
   * @param {any} id分类编号
   * @returns
   */
  getContractClassTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
        return 'text-purple'
    }
  },

  /**
   * 获取所有项目状态
   *
   * @returns
   */
  getAllProjectStatus() {
    return [
      { name: '售前', id: 1 },
      { name: '在建', id: 2 },
      { name: '关闭', id: 3 }
    ]
  },

  /**
   * 根据编号获取项目状态
   *
   * @param {any} id 状态编号
   * @returns
   */
  getProjectStatusById(id) {
    switch (id) {
      case '1':
        return '售前'
      case '2':
        return '在建'
      case '3':
        return '关闭'
      default:
        return '未知'
    }
  },

  /**
   * 根据合同类型ID得到合同类型
   */
  getContractTypeById(id) {
    switch (id) {
      case '1':
        return '收入合同'
      case '2':
        return '支出合同'
    }
  },

  /**
   * 根据预算类型ID得到预算类型
   */
  getBudgetTypeById(id) {
    switch (id) {
      case '1':
        return '销售预算'
      case '2':
        return '生产预算'
      case '3':
        return '管理预算'
      default:
        return '未知'
    }
  },

  /**
   * 获取所有项目流程状态
   *
   * @returns
   */
  getAllProjectProcessStatus() {
    return [
      { name: '未知', id: 0 },
      { name: '提交申请(立项)', id: 1 },
      { name: '等待审批(立项)', id: 2 },
      { name: '审批通过(立项)', id: 3 },
      { name: '审批不通过(立项)', id: 4 },
      { name: '等待审批(项目经理任命)', id: 5 },
      { name: '审批通过(项目经理任命)', id: 6 },
      { name: '审批不通过(项目经理任命)', id: 7 },
      { name: '等待审批(项目成员分配)', id: 8 },
      { name: '审批通过(项目成员分配)', id: 9 },
      { name: '审批不通过(项目成员分配)', id: 10 },
      { name: '秘书审批通过（立项）', id: 11 },
      { name: '秘书审批不通过（立项）', id: 12 },
      { name: '副主任委员审批通过（立项）', id: 13 },
      { name: '副主任委员审批不通过（立项）', id: 14 },
      { name: '主任委员审批通过（立项）', id: 15 },
      { name: '主任委员审批不通过（立项）', id: 16 },
      { name: '业务委员审批通过（立项）', id: 17 },
      { name: '业务委员审批不通过（立项）', id: 18 },
      { name: '结束', id: -1 }
    ]
  },
  /**
   * 根据编号获取项目流程状态
   *
   * @param {any} id 流程状态编号
   * @returns
   */
  getProjectProcessStatusById(id) {
    switch (id) {
      case '1':
        return '提交申请(立项)'
      case '2':
        return '等待审批(立项)'
      case '3':
        return '审批通过(立项)'
      case '4':
        return '审批不通过(立项)'
      case '5':
        return '等待审批(项目经理任命)'
      case '6':
        return '审批通过(项目经理任命)'
      case '7':
        return '审批不通过(项目经理任命)'
      case '8':
        return '等待审批(项目成员分配)'
      case '9':
        return '审批通过(项目成员分配)'
      case '10':
        return '审批不通过(项目成员分配)'
      case '11':
        return '秘书审批通过（立项）'
      case '12':
        return '秘书审批不通过（立项）'
      case '13':
        return '副主任委员审批通过（立项）'
      case '14':
        return '副主任委员审批不通过（立项）'
      case '15':
        return '主任委员审批通过（立项）'
      case '16':
        return '主任委员审批不通过（立项）'
      case '17':
        return '业务委员审批通过（立项）'
      case '18':
        return '业务委员审批不通过（立项）'
      case '0':
        return '未知'
      case '-1':
        return '结束'
      default:
        return '未知'
    }
  },

  /**
   * 获取所有合同流程状态
   *
   * @returns
   */
  getAllContractProcessStatus() {
    return [
      { name: '未知', id: 0 },
      { name: '提交申请(合同)', id: 1 },
      { name: '等待审批(合同)', id: 2 },
      { name: '审批通过(合同)', id: 3 },
      { name: '审批不通过(合同)', id: 4 },
      { name: '法务委员审批通过(合同)', id: 5 },
      { name: '法务委员审批不通过(合同)', id: 6 },
      { name: '财务委员审批通过(合同)', id: 7 },
      { name: '财务委员审批不通过(合同)', id: 8 },
      { name: '副主任委员审批通过(合同)', id: 9 },
      { name: '副主任委员审批不通过(合同)', id: 10 },
      { name: '主任委员审批通过(合同)', id: 11 },
      { name: '主任委员审批不通过(合同)', id: 12 }
    ]
  },
  /**
   * 根据编号获取合同流程状态
   *
   * @param {any} id
   * @returns
   */
  getContractProcessStatusById(id) {
    switch (id) {
      case '1':
        return '提交申请（合同）'
      case '2':
        return '等待审批（合同）'
      case '3':
        return '审批通过（合同）'
      case '4':
        return '审批不通过（合同）'
      case '5':
        return '法务委员审批通过（合同）'
      case '6':
        return '法务委员审批不通过（合同）'
      case '7':
        return '财务委员审批通过（合同）'
      case '8':
        return '财务委员审批不通过（合同）'
      case '9':
        return '副主任委员审批通过（合同）'
      case '10':
        return '副主任委员审批不通过（合同）'
      case '11':
        return '主任委员审批通过（合同）'
      case '12':
        return '主任委员审批不通过（合同）'
      case '0':
        return '未知'
      case '-1':
        return '结束'
      default:
        return '未知'
    }
  },

  /**
   * 根据编号获取预算流程状态
   *
   * @param {any} id
   * @returns
   */
  getBudgetProcessStatusById(id) {
    switch (id) {
      case '0':
        return '提交申请'
      case '1':
        return '提交申请(销售预算)'
      case '2':
        return '等待审批(销售预算)'
      case '3':
        return '审批通过(销售预算)'
      case '4':
        return '审批不通过(销售预算)'
      case '5':
        return '提交申请(生产预算)'
      case '6':
        return '等待审批(生产预算)'
      case '7':
        return '审批通过(生产预算)'
      case '8':
        return '审批不通过(生产预算)'
      case '9':
        return '提交申请(管理预算)'
      case '10':
        return '等待审批(管理预算)'
      case '11':
        return '审批通过(管理预算)'
      case '12':
        return '审批不通过(管理预算)'
      case '13':
        return '副主任委员审批通过（预算）'
      case '14':
        return '副主任委员审批不通过（预算）'
      case '15':
        return '主任委员审批通过（预算）'
      case '16':
        return '主任委员审批不通过（预算）'
      case '17':
        return '销售委员审批通过（预算）'
      case '18':
        return '销售委员审批不通过（预算）'
      case '19':
        return '业务委员审批通过（预算）'
      case '20':
        return '业务委员审批不通过（预算）'
      case '-1':
        return '结束'
      default:
        return '未知'
    }
  },

  // 报销
  getExpenseProcessStatusById(id) {
    switch (id) {
      case '0':
        return '提交申请'
      case '1':
        return '提交申请(报销)'
      case '2':
        return '等待审批(报销)'
      case '3':
        return '审批通过(报销)'
      case '4':
        return '审批不通过(报销)'
      case '5':
        return '经理审批通过（报销）'
      case '6':
        return '经理审批不通过（报销）'
      case '7':
        return '业务委员审批通过（报销）'
      case '8':
        return '业务委员审批不通过（报销）'
      case '9':
        return '财务会计审批通过（报销）'
      case '10':
        return '财务会计审批不通过（报销）'
      case '11':
        return '副主任委员审批通过（报销）'
      case '12':
        return '副主任委员审批不通过（报销）'
      case '13':
        return '主任委员审批通过（报销）'
      case '14':
        return '主任委员审批不通过（报销）'
      case '-1':
        return '结束'
      default:
        return '未知'
    }
  },

  /**
   * 根据id获取颜色class
   *
   * @param {any} id 状态编号
   * @returns
   */
  getProjectStatusTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
        return 'text-purple'
      case '0':
        return 'text-green'
      default:
        return 'text-gray'
    }
  },

  /**
   * 根据id获取颜色class，流程状态
   *
   * @param {any} id 流程状态编号
   * @returns
   */
  getProjectProcessStatusTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
      case '5':
      case '8':
        return 'text-purple'
      case '3':
      case '6':
      case '9':
      case '11':
      case '13':
      case '15':
      case '17':
        return 'text-green'
      case '4':
      case '7':
      case '10':
      case '12':
      case '14':
      case '16':
      case '18':
        return 'text-red'
      default:
        return 'text-gray'
    }
  },

  /**
   * 根据id获取颜色class，流程状态
   *
   * @param {any} id 合同流程状态编号
   * @returns
   */
  getContractProcessStatusTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
        return 'text-purple'
      case '3':
      case '5':
      case '7':
      case '9':
      case '11':
        return 'text-green'
      case '4':
      case '6':
      case '8':
      case '10':
      case '12':
        return 'text-red'
      default:
        return 'text-gray'
    }
  },

  /**
   * 根据id获取颜色class，流程状态
   *
   * @param {any} id 报销流程状态编号
   * @returns
   */
  getExpenseAccountClassTextColor(id) {
    switch (id) {
      case '1':
        return 'text-blue'
      case '2':
        return 'text-purple'
      case '3':
      case '5':
      case '7':
      case '9':
      case '11':
      case '13':
        return 'text-green'
      case '4':
      case '6':
      case '8':
      case '10':
      case '12':
      case '14':
        return 'text-red'
      default:
        return 'text-gray'
    }
  },

  /**
   * 根据id获取颜色class，流程状态
   *
   * @param {any} id 预算流程状态编号
   * @returns
   */
  getBudgetProcessStatusTextColor(id) {
    switch (id) {
      case '1':
      case '5':
      case '9':
        return 'text-blue'
      case '2':
      case '6':
      case '10':
        return 'text-purple'
      case '3':
      case '7':
      case '11':
      case '13':
      case '15':
      case '17':
      case '19':
        return 'text-green'
      case '4':
      case '8':
      case '12':
      case '14':
      case '16':
      case '18':
      case '20':
        return 'text-red'
      default:
        return 'text-gray'
    }
  },

  /**
   * 是否报销冲抵借款
   *
   * @returns
   */
  getAllIsRepaymentClassify() {
    return [{ name: '是', id: 1 }, { name: '否', id: 0 }]
  },

  /**
   * 取得所有的资金类型
   */
  getAllFundType() {
    return [{ name: '收入', id: 1 }, { name: '支出', id: 2 }]
  },

  /**
   * 取得所有的还款类型
   */
  getAllRepaymentType() {
    return [{ name: '报销冲抵', id: 0 }, { name: '直接还款', id: 1 }]
  },

  /**
   * 根据id 取得还款枚举数据
   * @param {*} id
   */
  getRepaymentTypeById(id) {
    switch (id) {
      case '0':
        return '报销冲抵'
      case '1':
        return '直接还款'
    }
  },

  getFundTypeById(id) {
    switch (id) {
      case '1':
        return '收入'
      case '2':
        return '支出'
    }
  },

  /**
   * 根据项目流程状态，获取项目表格操作按钮
   *
   * @param {any} processStatus 流程状态
   * @returns
   */
  getProjectTableFuncsByProcessStatus(processStatus) {
    switch (processStatus) {
      case '0': // 提交审核:可以编辑、提交
        return [
          {
            name: '编辑',
            type: 'danger',
            icon: '',
            actionName: 'editHandle'
          },
          {
            name: '提交',
            type: 'primary',
            icon: '',
            actionName: 'commitHandle'
          }
        ]
      case '4':
      case '7': // 审批不通过:可以重新编辑,重新提交
      case '10':
      case '12':
      case '14':
      case '16':
      case '18':
        return [
          {
            name: '重新编辑',
            type: 'danger',
            icon: '',
            actionName: 'editHandle'
          }
          // ,{
          //   name: '重新提交',
          //   type: 'primary',
          //   icon: '',
          //   actionName: 'recommitProjectApplyHandle'
          // }
        ]
      default:
        return null
    }
  },

  /**
   * 根据合同流程状态，获取合同表格操作按钮
   *
   * @param {any} processStatus 流程状态
   * @returns
   */
  getContractTableFuncsByProcessStatus(processStatus) {
    switch (processStatus) {
      case '0': // 提交审核:可以编辑、提交
        return [
          {
            name: '编辑',
            type: 'danger',
            icon: '',
            actionName: 'editHandle'
          },
          {
            name: '提交',
            type: 'primary',
            icon: '',
            actionName: 'commitHandle'
          }
        ]
      case '4':
      case '6':
      case '8':
      case '10':
      case '12':
        return [
          {
            name: '重新编辑',
            type: 'danger',
            icon: '',
            actionName: 'editHandle'
          }
          // ,{
          //   name: '重新提交',
          //   type: 'primary',
          //   icon: '',
          //   actionName: 'recommitProjectApplyHandle'
          // }
        ]
      default:
        return null
    }
  },

  /**
   *
   * 通过判断流程状态，报销表格按钮
   *
   * @param {any} processStatus
   * @returns
   */
  getExpenseTableFuncsByProcessStatus(processStatus) {
    if (processStatus == null) {
      return [
        {
          name: '呈报',
          type: 'primary',
          icon: '',
          actionName: 'commitHandle'
        },
        {
          name: '删除',
          type: 'danger',
          icon: '',
          actionName: 'deleteAndFinishHandle'
        }
      ]
    }
    return null
  }
}
