<template>
<div>
    <!-- <el-row type="flex">
        <el-col :span="12">
            <el-steps :space="200" :active="stepActiveCode">
            <el-step title="编辑"></el-step>
            <el-step title="填写审批意见"></el-step>
            </el-steps>
        </el-col>
        <el-col :span="12" style="text-align:right">
            <el-button :disabled="disabledPrevTep" type="primary" size="small" @click="prevStep">上一步</el-button>
            <el-button :disabled="disabledNextTep" type="primary" size="small" @click="nextStep">下一步</el-button>
            <el-button v-if="stepActiveCode==2" type="primary" size="small" @click="submitProcess">呈报</el-button>
        </el-col>
    </el-row> -->
    <el-row>
        <!-- 预算修改 -->
        <BudgetModifyComp v-if="getBusClassifyCode(taskVariables)==3"
            :projectBaseInfoData="projectFormData"
            :processInstanceId="currentProcessInstance.id"
            @handleFileClick="handleFileClick"
            :firstBudgetType="firstBudgetType"
            ref="budgetModifyComp">
        </BudgetModifyComp>

        <!-- 报销修改 -->
        <BudgetImplModifyComp v-if="getBusClassifyCode(taskVariables)==4"
            :expenseAccountBaseInfoData="expenseFormData"
            :processInstanceId="currentProcessInstance.id"
            @handleFileClick="handleFileClick"
            :firstBudgetType="firstBudgetType"
            ref="budgetImplModifyComp">
        </BudgetImplModifyComp>

        <!-- 审批意见 -->
        <el-form label-width="96px">
            <el-form-item label="审批意见">
                <el-input type="textarea" v-model="taskAuditComment" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        <span style="color:red">注意：是否确认申请已经修改</span>
    </el-row>
</div>
</template>

<script>
import projectApi from 'api/project'
import contractApi from 'api/contract'
import budgetApi from 'api/budget'
import attachmentApi from 'api/attachment'
import workflowApi from 'api/workflow'
import BudgetModifyComp from 'views/budget/budgetModify.vue'
import BudgetImplModifyComp from 'views/budget/budgetImplementModify.vue'
import workflowEnum from 'common/workflowEnum'
import {
  BUS_CLASSIFY,
  BUDGET_TYPE_CODE,
  PROCESS_STATUS
} from 'common/workflowEnum'
import { BUS_PROJECT_FORM_DATA } from 'common/busProjectEnum'
import { BUS_CONTRACT_FROM_DATA } from 'common/busContractEnum'
import { EXPENSE_ACCOUNT_FORM_DATA } from 'common/busExpenseAccount'
export default {
  props: {
    taskVariables: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 预算类型
      firstBudgetType: '',
      // 审批意见
      taskAuditComment: '',
      disabledPrevTep: false,
      disabledNextTep: false,
      stepActiveCode: 1,
      taskResourceData: {
        formItemData: [],
        formData: {},
        formRules: {},
        cardLabel: ''
      },
      currentProcessInstance: {},
      projectFormData: BUS_PROJECT_FORM_DATA,
      contractFormData: BUS_CONTRACT_FROM_DATA,
      expenseFormData: EXPENSE_ACCOUNT_FORM_DATA
    }
  },
  components: {
    BudgetModifyComp,
    BudgetImplModifyComp
  },
  mounted() {
    console.log('this.taskVariables', this.taskVariables)
    this.initData(this.taskVariables)
    this.initBusData(this.taskVariables)
    this.getProcessInstanceByTaskId(this.taskVariables.taskId)
  },
  methods: {
    prevStep() {
      this.stepActiveCode--
    },
    nextStep() {
      this.stepActiveCode++
    },
    // 初始化表单数据
    initData(taskData) {
      const formClassifyData = workflowEnum.getFormClassifyData(taskData)
      this.taskResourceData.formItemData = formClassifyData.data
      this.taskResourceData.cardLabel = formClassifyData.label
    },
    // 根据业务类型初始化业务数据
    initBusData(taskData) {
      const busType = taskData[BUS_CLASSIFY.busType]
      switch (busType) {
        case BUS_CLASSIFY.busProject:
        case BUS_CLASSIFY.busBudgetSale:
          this.firstBudgetType = BUDGET_TYPE_CODE.BUDGET_SALE
          this.queryProjectById(
            taskData[BUS_CLASSIFY.busId],
            BUDGET_TYPE_CODE.BUDGET_SALE
          )
          break
        case BUS_CLASSIFY.busBudgetProduce:
          this.firstBudgetType = BUDGET_TYPE_CODE.BUDGET_PRODUCE
          this.queryProjectById(
            taskData[BUS_CLASSIFY.busId],
            BUDGET_TYPE_CODE.BUDGET_PRODUCE
          )
          break
        case BUS_CLASSIFY.busBudgetImplement:
          this.queryExpenseById(taskData[BUS_CLASSIFY.busId])
          break
        case BUS_CLASSIFY.busContract:
          this.queryContractById(taskData[BUS_CLASSIFY.busId])
          break
        default:
          break
      }
    },
    // 查询当前流程实例
    getProcessInstanceByTaskId(taskId) {
      const self = this
      if (taskId) {
        workflowApi
          .getProcessInstanceByTaskId(taskId)
          .then(response => {
            self.currentProcessInstance = response.data
          })
          .catch(err => {})
      }
    },
    // 查询项目数据
    queryProjectById(id, budgetType) {
      const self = this
      projectApi
        .queryProjectExtendById(id, budgetType)
        .then(response => {
          self.projectFormData = response.data
        })
        .catch(err => {})
    },
    // 查询合同数据
    queryContractById(id) {
      const self = this
      contractApi
        .queryContractById(id)
        .then(response => {
          self.contractFormData = response.data
        })
        .catch(err => {})
    },
    // 查询报销数据
    queryExpenseById(id) {
      const self = this
      let params = { id: id }
      budgetApi
        .queryExpenseById(params)
        .then(response => {
          self.expenseFormData = response.data
        })
        .catch(err => {})
    },
    // 业务分类编码
    getBusClassifyCode(taskData) {
      switch (taskData[BUS_CLASSIFY.busType]) {
        case BUS_CLASSIFY.busProject:
          return 1
        case BUS_CLASSIFY.busContract:
          return 2
        case BUS_CLASSIFY.busBudgetSale:
        case BUS_CLASSIFY.busBudgetProduce:
          return 3
        case BUS_CLASSIFY.busBudgetImplement:
          return 4
        default:
          return 0
      }
    },
    // 表单下载文件
    handleFileClick(file) {
      attachmentApi.downLoadAttachment(file.url, file.name)
    },
    // 呈报流程
    submitProcess() {
      const busType = this.taskVariables[BUS_CLASSIFY.busType]
      switch (busType) {
        // 销售预算
        case BUS_CLASSIFY.busBudgetSale:
          this.$refs.budgetModifyComp.saveBudgetToDb()
          this.submitBudgetSaleApply()
          break
        // 生产预算
        case BUS_CLASSIFY.busBudgetProduce:
          this.$refs.budgetModifyComp.saveBudgetToDb()
          this.submitBudgetProduceApply()
          break
        // 报销
        case BUS_CLASSIFY.busBudgetImplement:
          this.$refs.budgetImplModifyComp.saveBudgetImpls()
          this.submitBudgetImpl()
          break
      }
    },
    // 销售预算重新提交
    submitBudgetSaleApply() {
      let auditItem = {}
      auditItem.processInstanceId = this.currentProcessInstance.id
      auditItem.taskId = this.taskVariables.taskId
      auditItem.comment = this.taskAuditComment

      auditItem.type = BUDGET_TYPE_CODE.BUDGET_SALE
      auditItem.processStatus = PROCESS_STATUS.BUDGET_SALE_COMMIT
      console.log('auditItem sale', auditItem)
      this.recommitBudgetApply(auditItem)
    },
    // 生产预算重新提交
    submitBudgetProduceApply() {
      let auditItem = {}
      auditItem.processInstanceId = this.currentProcessInstance.id
      auditItem.taskId = this.taskVariables.taskId
      auditItem.comment = this.taskAuditComment

      auditItem.type = BUDGET_TYPE_CODE.BUDGET_PRODUCE
      auditItem.processStatus = PROCESS_STATUS.BUDGET_PROD_COMMIT
      console.log('auditItem produce', auditItem)
      this.recommitBudgetApply(auditItem)
    },
    // 报销重新提交
    submitBudgetImpl() {
      let auditItem = {}
      auditItem.processInstanceId = this.currentProcessInstance.id
      auditItem.taskId = this.taskVariables.taskId
      auditItem.comment = this.taskAuditComment

      auditItem.processStatus = PROCESS_STATUS.BUDGET_IMPL_COMMIT
      console.log('auditItem baoxiao', auditItem)
      this.recommitBudgetImplApply(auditItem)
    },
    /**
     * 预算审批重新提交流程
     *
     * @param {any} auditItem 审批对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过
     */
    recommitBudgetApply(auditItem) {
      const self = this
      budgetApi
        .recommitBudgetApply(auditItem)
        .then(response => {
          if (response.status == 200) {
            // 通知父组件刷新
            self.$emit('refreshTodoTask')
            self.$message({ type: 'success', message: '重新提交成功' })
          }
        })
        .catch(err => {})
    },
    /**
     * 报销审批重新提交流程
     *
     * @param {any} auditItem 审批对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过
     */
    recommitBudgetImplApply(auditItem) {
      const self = this
      budgetApi
        .recommitBudgetImplApply(auditItem)
        .then(response => {
          if (response.status == 200) {
            // 通知父组件刷新
            self.$emit('refreshTodoTask')
            self.$message({ type: 'success', message: '重新提交成功' })
          }
        })
        .catch(err => {})
    }
  },
  watch: {
    taskVariables: function(newValue, oldValue) {
      this.initData(newValue)
      this.initBusData(newValue)
      this.getProcessInstanceByTaskId(newValue.taskId)
    },
    stepActiveCode: function(newVal, oldVal) {
      if (this.stepActiveCode <= 0) {
        this.disabledPrevTep = true
      } else if (this.stepActiveCode > 1) {
        this.disabledNextTep = true
      } else {
        this.disabledPrevTep = false
        this.disabledNextTep = false
      }
    }
  }
}
</script>
