<template>
<div>
    <!-- <TaskCardComp :processInstanceId="processInstanceId"
        :taskResourceData="taskResourceData"
        :taskComments = "taskComments"
    ></TaskCardComp> -->
    <ProjectCardComp v-if="getBusClassifyCode(taskVariables)==1"
        :projectBaseInfoData="projectFormData"
        :hasContract="false"
        :hasBudget="false"
        :hasPayment="false"
        :hasSchedulePerformance="false"
        @handleFileClick="handleFileClick">
    </ProjectCardComp>

    <ContractCardComp v-if="getBusClassifyCode(taskVariables)==2"
    :contractBaseInfoData="contractFormData"
    @handleFileClick="handleFileClick">
    </ContractCardComp>

    <BudgetCardComp v-if="getBusClassifyCode(taskVariables)==3"
        :projectBaseInfoData="projectFormData"
        :processInstanceId="currentProcessInstance.id"
        @handleFileClick="handleFileClick">
    </BudgetCardComp>

    <ExpenseCardComp v-if="getBusClassifyCode(taskVariables)==4"
        :expenseAccountBaseInfoData="expenseFormData"
        @handleFileClick="handleFileClick">
    </ExpenseCardComp>
    <LoanCardComp v-if="getBusClassifyCode(taskVariables)==5"
        :loanBaseInfoData="loanFormData"
        :processInstanceId="loanFormData.processInstanceId"
        :currentuserunionid ="loanFormData.borrower"
        @handleFileClick="handleFileClick">
    </LoanCardComp>
</div>
</template>

<script>
import projectApi from 'api/project'
import loanApi from 'api/loan.js'
import contractApi from 'api/contract'
import budgetApi from 'api/budget'
import attachmentApi from 'api/attachment'
import workflowApi from 'api/workflow'
import TaskCardComp from 'views/workflow/taskCard.vue'
import ProjectCardComp from 'views/project/projectCard.vue'
import ContractCardComp from 'views/contract/contractCard.vue'
import LoanCardComp from 'views/loan/loanCard.vue'
import BudgetCardComp from 'views/budget/budgetCard.vue'
import ExpenseCardComp from 'views/budget/expenseCard.vue'
import workflowEnum from 'common/workflowEnum'
import { BUS_CLASSIFY } from 'common/workflowEnum'
import { BUS_PROJECT_FORM_DATA } from 'common/busProjectEnum'
import { BUS_CONTRACT_FROM_DATA } from 'common/busContractEnum'
import { EXPENSE_ACCOUNT_FORM_DATA } from 'common/busExpenseAccount'
import { BUS_LOAN_FORM_DATA } from 'common/busLoanEnum'
export default {
  props: {
    taskVariables: {
      type: Object,
      default: function() {
        return {}
      }
    },
    taskComments: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      taskResourceData: {
        formItemData: [],
        formData: {},
        formRules: {},
        cardLabel: ''
      },
      currentProcessInstance: {},
      projectFormData: BUS_PROJECT_FORM_DATA,
      contractFormData: BUS_CONTRACT_FROM_DATA,
      expenseFormData: EXPENSE_ACCOUNT_FORM_DATA,
      loanFormData: BUS_LOAN_FORM_DATA
    }
  },
  components: {
    TaskCardComp,
    ProjectCardComp,
    ContractCardComp,
    ExpenseCardComp,
    BudgetCardComp,
    LoanCardComp
  },
  mounted() {
    this.initData(this.taskVariables)
    this.initBusData(this.taskVariables)
    this.getProcessInstanceByTaskId(this.taskVariables.taskId)
  },
  methods: {
    // 初始化表单数据
    initData(taskData) {
      const formClassifyData = workflowEnum.getFormClassifyData(taskData)
      console.log('formClassifyData', formClassifyData)
      this.taskResourceData.formItemData = formClassifyData.data
      this.taskResourceData.cardLabel = formClassifyData.label
    },
    // 根据业务类型初始化业务数据
    initBusData(taskData) {
      const busType = taskData[BUS_CLASSIFY.busType]
      console.log('busType', busType)
      switch (busType) {
        case BUS_CLASSIFY.busProject:
        case BUS_CLASSIFY.busBudgetSale:
        case BUS_CLASSIFY.busBudgetProduce:
        case BUS_CLASSIFY.busBudgetManage:
          this.queryProjectById(taskData[BUS_CLASSIFY.busId])
          break
        case BUS_CLASSIFY.busBudgetImplement:
          this.queryExpenseById(taskData[BUS_CLASSIFY.busId])
          break
        case BUS_CLASSIFY.busContract:
          this.queryContractById(taskData[BUS_CLASSIFY.busId])
          break
        case BUS_CLASSIFY.busLoan:
          console.log(
            'taskData[BUS_CLASSIFY.busId]',
            taskData[BUS_CLASSIFY.busId]
          )
          this.queryLoanById(taskData[BUS_CLASSIFY.busId])
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
            console.log('processinstance data :', response.data)
            self.currentProcessInstance = response.data
          })
          .catch(err => {})
      }
    },
    // 查询项目数据
    queryProjectById(id) {
      const self = this
      projectApi
        .queryProjectById(id)
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
    // 查询借款数据
    queryLoanById(id) {
      console.log('queryLoanById')
      const self = this
      let params = { id: id }
      loanApi
        .queryLoanById(id)
        .then(response => {
          self.loanFormData = response.data
          console.log('loanFormData', self.loanFormData)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 查询还款数据
    queryrepaymentById(id) {},
    // 业务分类编码
    getBusClassifyCode(taskData) {
      console.log('getBusClassifyCode', taskData)
      switch (taskData[BUS_CLASSIFY.busType]) {
        case BUS_CLASSIFY.busProject:
          return 1
        case BUS_CLASSIFY.busContract:
          return 2
        case BUS_CLASSIFY.busBudgetSale:
        case BUS_CLASSIFY.busBudgetProduce:
        case BUS_CLASSIFY.busBudgetManage:
          return 3
        case BUS_CLASSIFY.busBudgetImplement:
          return 4
        case BUS_CLASSIFY.busLoan:
          return 5
        default:
          return 0
      }
    },
    // 表单下载文件
    handleFileClick(file) {
      attachmentApi.downLoadAttachment(file.url, file.name)
    }
  },
  watch: {
    taskVariables: function(newValue, oldValue) {
      this.initData(newValue)
      this.initBusData(newValue)
      this.getProcessInstanceByTaskId(newValue.taskId)
    }
  }
}
</script>
