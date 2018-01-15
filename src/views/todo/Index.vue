<template>
<div>
    <tableComp
        :options="todoTaskDatas"
        @keywordSearchHandle="keywordSearchHandle"
        @handleFormSearch="handleFormSearch"
        @handleDisplayColumnCustomComand="handleDisplayColumnCustomComand"
        @detailHandle="detailHandle"
        @todoHandle="todoHandle">
    </tableComp>

    <!-- 待办详细 -->
    <div id="todo-detail-dialog" style="display:none">
        <todoDetailComp
            :taskVariables="taskVariables"
            :taskComments="taskComments">
        </todoDetailComp>
    </div>

    <!-- 待办任务修改重新提交 -->
    <div id="todo-modify-dialog" style="display:none">
        <todoModifyComp
            :taskVariables="taskVariables"
            ref="todoModifyComp"
            @refreshTodoTask="findTodoTask">
        </todoModifyComp>
    </div>

    <!-- 待办审批 -->
    <div id="todo-audit-or-handle-dialog" style="display:none">
        <el-tabs v-model="tabActiveName" @tab-click="tabsHandleClick">
            <el-tab-pane label="流程图" name="processDiagramTabs">
                <busProcessDiagramComp :processInstanceId="currentProcessInstanceId"></busProcessDiagramComp>
            </el-tab-pane>
            <el-tab-pane label="审批意见" name="auditCommentTabs">
                <el-form label-width="40px">
                    <el-form-item label="审批意见">
                        <el-input type="textarea" v-model="taskAuditComment" :rows="5"></el-input>
                    </el-form-item>
                </el-form>
                <span style="color:red">{{taskAuditMatters}}</span>
            </el-tab-pane>
        </el-tabs>
    </div>

    <!-- 项目经理任命 -->
    <div id="pmappoint-dialog" style="display:none">
        <ProjectMemberInfoComp
            :projectId="busProjectId"
            :isEditAble="true">
        </ProjectMemberInfoComp>
        <!-- <StaffTableComp @staffSelectHandle="staffSelectHandle"></StaffTableComp> -->
        <component :is="currentViewComp2" transition="fade" transition-mode="out-in"
            ref="deptStaffsIndexComp" :options="deptStaffsCompOptions"></component>
        <attachmentFormComp ref="pmappointAttachmentFormComp"></attachmentFormComp>
    </div>

    <!-- 项目人员划分 -->
    <div id="projectMemberAssign-dialog" style="display:none">
        <ProjectMemberInfoComp
            :projectId="busProjectId"
            :isEditAble="true">
        </ProjectMemberInfoComp>
        <component :is="currentViewComp" transition="fade" transition-mode="out-in"
            ref="pmAssignIndexComp"></component>
        <!-- <ProjectMemberAssignComp ref="pmAssignIndexComp" @refresh="findTodoTask"></ProjectMemberAssignComp> -->
        <div style="margin:10px 0 10px 0;color:red">
            此处上传项目准备阶段所要求提请审批文档，如：实施方案、进度计划、预算明细、采购计划等
        </div>
        <attachmentFormComp ref="pmAssignAttachmentFormComp"></attachmentFormComp>
    </div>
</div>
</template>

<script>
import workflowApi from 'api/workflow'
import projectApi from 'api/project'
import contractApi from 'api/contract'
import budgetApi from 'api/budget'
import loanApi from 'api/loan.js'
import workflowEnum from 'common/workflowEnum'
import {
  PROCESS_DEFINE_KEY,
  PROJECT_VAR,
  CONTRACT_VAR,
  BUDGET_VAR,
  PROCESS_STATUS,
  LOAN_VAR,
  BUDGET_TYPE_CODE,
  PROJECT_MEMBER_ROLES_CODE
} from 'common/workflowEnum'
import tableComp from 'components/Table'
import todoDetailComp from './detail.vue'
import todoModifyComp from './modify.vue'
import busProcessDiagramComp from './busProcessDiagram.vue'
// import StaffTableComp from 'components/security/staffTable.vue'
import attachmentFormComp from 'views/attachment/attachmentForm.vue'
import DeptStaffsComp from 'views/security/deptStaffs.vue'
import ProjectMemberAssignComp from 'views/project/projectMemberAssign.vue'
import ProjectMemberInfoComp from 'views/project/projectMemberInfo.vue'
import filter from 'utils/filters'
import art from 'utils/artdialog'
export default {
  data() {
    return {
      // active tabs
      tabActiveName: 'processDiagramTabs',
      currentProcessInstanceId: '',
      // 项目ID
      busProjectId: '',
      // 当前动态组件
      currentViewComp: null,
      currentViewComp2: null,
      deptStaffsCompOptions: {
        checkType: 'radio',
        nodes: [],
        setting: {}
      },
      imgBase64Src: '',
      taskVariables: {},
      taskComments: [],
      // 审批批注
      taskAuditComment: '',
      // 注意事项
      taskAuditMatters: '',
      // 选择的员工
      selectedStaff: null,
      // 当前编辑的待办任务
      // currentTodoTask: {},
      matter: {
        matter1: '注意：一旦审批将进入下一流程',
        matter2: '注意：是否确认申请已经修改'
      },

      // 表格数据
      todoTaskDatas: {
        // 表格显示数据
        data: [],
        // 高级搜索表单数据项
        formItemData: [
          [
            {
              type: 'input',
              label: '任务ID',
              prop: 'taskId'
            },
            {
              type: 'input',
              label: '任务名称',
              prop: 'taskName'
            },
            {
              type: 'datetime',
              label: '任务创建时间',
              prop: 'taskCreateTime'
            }
          ],
          [
            {
              type: 'input',
              label: '流程发起人',
              prop: 'processInitiator'
            }
          ]
        ],
        // 高级搜索表单数据
        formData: {
          taskId: '',
          taskName: '',
          processInstanceId: null,
          processInitiator: '',
          taskCreateTime: '',
          taskAssignee: '',
          variables: {}
        },
        // 表格显示列
        columns: [
          {
            prop: 'taskId',
            label: '任务ID',
            width: '100'
          },
          {
            prop: 'taskName',
            label: '任务名称',
            formatter(row, column, cellValue) {
              if (row.variables.BUS_NAME) {
                return row.taskName + '(' + row.variables.BUS_NAME + ')'
              } else {
                return row.taskName
              }
            }
          },
          // {
          //     prop: 'processInstanceId',
          //     label: '流程实例ID',
          // },
          {
            prop: 'taskCreateTime',
            label: '任务创建时间',
            width: '150',
            formatter(row, column, cellValue) {
              return filter.formatDate(row.taskCreateTime)
            }
          },
          // {
          //     prop: 'taskAssignee',
          //     label: '办理人',
          //     formatter(row, column, cellValue) {
          //         if (row.variables && row.variables.handler) {
          //             return row.variables.handler
          //         } else {
          //             return row.taskAssignee
          //         }
          //     }
          // },
          {
            prop: 'processInitiator',
            label: '流程发起人',
            width: '120',
            formatter(row, column, cellValue) {
              if (row.variables && row.variables.userName) {
                return row.variables.userName
              } else {
                return row.processInitiator
              }
            }
          },
          {
            label: 'Operate',
            operates: [
              {
                name: '详细',
                type: 'success',
                icon: '',
                actionName: 'detailHandle'
              },
              {
                name: '办理',
                type: 'primary',
                icon: '',
                actionName: 'todoHandle'
              }
            ]
          }
        ],
        hasPagination: false
      }
    }
  },
  components: {
    tableComp,
    todoDetailComp,
    todoModifyComp,
    DeptStaffsComp,
    ProjectMemberAssignComp,
    ProjectMemberInfoComp,
    busProcessDiagramComp,
    attachmentFormComp
  },
  mounted() {
    this.findTodoTask()
  },
  methods: {
    tabsHandleClick() {},
    findTodoTask() {
      const self = this
      workflowApi
        .findTodoTask()
        .then(response => {
          const tasks = response.data
          self.todoTaskDatas.data = tasks
          console.log('todolist', tasks)
        })
        .catch(err => {
          console.log('err', err)
        })
    },
    // 关键词搜索
    keywordSearchHandle(keyword) {},
    // 高级搜索
    handleFormSearch(searchFormData) {},
    // 显示指定列
    handleDisplayColumnCustomComand() {},
    // 详细按钮处理
    detailHandle(index, row) {
      this.taskVariables = row.variables
      console.log('variables:', row.variables)
      this.taskVariables.taskId = row.taskId
      this.taskComments = row.commentList
      console.log('comment list :', row.commentList)
      art.artdialog(
        '详细信息',
        $('#todo-detail-dialog'),
        900,
        500,
        'todo-detail-dialog'
      )
    },
    // 办理按钮处理
    todoHandle(index, row) {
      const self = this
      // 流程定义，如：ProjectApplicationTask
      const processObj = workflowEnum.getProcessAndTask(row)

      switch (processObj.process) {
        // 项目申请
        case PROCESS_DEFINE_KEY.PROJECT_APPLICATION_TASK:
          switch (processObj.task) {
            case PROJECT_VAR.APPROVE:
              // 项目申请审批
              self.projectApplyAuditDialog(row, {
                pass: PROCESS_STATUS.PROJECT_SECRETARY_AUDIT_PASS,
                unpass: PROCESS_STATUS.PROJECT_SECRETARY_AUDIT_UNPASS
              })
              break
            case PROJECT_VAR.PROJECT_APPLY:
              // 重新提交申请
              self.recommitProjectApplyDialog(row)
              break
            case PROJECT_VAR.PM_APPOINT:
              // 项目经理任命
              self.pmAppointDialog(row)
              break
            case PROJECT_VAR.PM_APPOINT_AUDIT1:
              // 项目经理任命副主任委员审批
              self.pmAppointAuditDialog(row, {
                pass: PROCESS_STATUS.PROJECT_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.PROJECT_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case PROJECT_VAR.PM_APPOINT_AUDIT2:
              // 项目经理任命主任委员审批
              self.pmAppointAuditDialog(row, {
                pass: PROCESS_STATUS.PROJECT_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.PROJECT_DIRECTOR_AUDIT_UNPASS
              })
              break
            case PROJECT_VAR.PROJECT_MEMBER_ASSIGN:
              // 项目成员分配
              self.projectMemberAssignDialog(row)
              break
            case PROJECT_VAR.PROJECT_MEMBER_ASSIGN_AUDIT:
              // 项目人员分配审批
              self.pmAssignAuditDialog(row, {
                pass: PROCESS_STATUS.PROJECT_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.PROJECT_DIRECTOR_AUDIT_UNPASS
              })
              break
          }
          break
        // 运营类项目申请
        case PROCESS_DEFINE_KEY.PROJECT_OPERATION_TASK:
          switch (processObj.task) {
            case PROJECT_VAR.APPROVE:
              // PMO秘书确认
              self.projectApplyAuditDialog(row, {
                pass: PROCESS_STATUS.PROJECT_SECRETARY_AUDIT_PASS,
                unpass: PROCESS_STATUS.PROJECT_SECRETARY_AUDIT_UNPASS
              })
              break
            case PROJECT_VAR.PROJECT_APPLY:
              // 重新提交申请
              self.recommitProjectApplyDialog(row)
              break
            case PROJECT_VAR.PROJECT_MEMBER_ASSIGN:
              // 项目成员划分
              self.projectMemberAssignDialog(row)
              break
          }
          break
        // 合同审批
        case PROCESS_DEFINE_KEY.CONTRACT_APPLICATION_TASK:
          switch (processObj.task) {
            // 合同审批
            case CONTRACT_VAR.LEGALCOMMITTEE_AUDIT:
              // 法务委员
              self.contractApplyAuditDialog(row, {
                pass: PROCESS_STATUS.CONTRACT_LEGALCOMMITTEE_AUDIT_PASS,
                unpass: PROCESS_STATUS.CONTRACT_LEGALCOMMITTEE_AUDIT_UNPASS
              })
              break
            case CONTRACT_VAR.FINANCECOMMITTEE_AUDIT:
              // 财务委员
              self.contractApplyAuditDialog(row, {
                pass: PROCESS_STATUS.CONTRACT_FINANCECOMMITTEE_AUDIT_PASS,
                unpass: PROCESS_STATUS.CONTRACT_FINANCECOMMITTEE_AUDIT_UNPASS
              })
              break
            case CONTRACT_VAR.VICEDIRECTOR_AUDIT:
              // 副主任委员
              self.contractApplyAuditDialog(row, {
                pass: PROCESS_STATUS.CONTRACT_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.CONTRACT_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case CONTRACT_VAR.DIRECTOR_AUDIT:
              // 主任委员
              self.contractApplyAuditDialog(row, {
                pass: PROCESS_STATUS.CONTRACT_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.CONTRACT_DIRECTOR_AUDIT_UNPASS
              })
              break
            // 重新提交
            case CONTRACT_VAR.CONTRACT_APPLY:
              self.recommitContractApplyDialog(row)
              break
          }
          break
        // 销售预算审批
        case PROCESS_DEFINE_KEY.BUDGET_SALE_TASK:
          switch (processObj.task) {
            // 审批
            case BUDGET_VAR.BUDGET_VICEDIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_SALE, {
                pass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_DIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_SALE, {
                pass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_UNPASS
              })
              break
            // 重新提交
            case BUDGET_VAR.BUDGET_SALE:
              self.recommitBudgetApplyDialog(row, BUDGET_TYPE_CODE.BUDGET_SALE)
              break
          }
          break
        // 管理预算审批
        case PROCESS_DEFINE_KEY.BUDGET_MANAGE_TASK:
          switch (processObj.task) {
            // 审批
            case BUDGET_VAR.BUDGET_VICEDIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_MANAGE, {
                pass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_DIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_MANAGE, {
                pass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_UNPASS
              })
              break
            // 重新提交
            case BUDGET_VAR.BUDGET_MANAGE:
              self.recommitBudgetApplyDialog(
                row,
                BUDGET_TYPE_CODE.BUDGET_MANAGE
              )
              break
          }
          break
        // 生产预算审批
        case PROCESS_DEFINE_KEY.BUDGET_PROD_TASK:
          switch (processObj.task) {
            // 审批
            case BUDGET_VAR.BUDGET_SALE_COMMITTEE_AUDIT:
              // 销售委员
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_PRODUCE, {
                pass: PROCESS_STATUS.BUDGET_SALECOMMITTEE_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_SALECOMMITTEE_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_BUS_COMMITTEE_AUDIT:
              // 业务委员
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_PRODUCE, {
                pass: PROCESS_STATUS.BUDGET_BUSCOMMITTEE_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_BUSCOMMITTEE_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_VICEDIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_PRODUCE, {
                pass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_DIRECTOR_AUDIT:
              self.budgetAuditDialog(row, BUDGET_TYPE_CODE.BUDGET_PRODUCE, {
                pass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_DIRECTOR_AUDIT_UNPASS
              })
              break
            // 重新提交
            case BUDGET_VAR.BUDGET_PROD:
              self.recommitBudgetApplyDialog(
                row,
                BUDGET_TYPE_CODE.BUDGET_PRODUCE
              )
              break
          }
          break
        // 报销审批
        case PROCESS_DEFINE_KEY.BUDGET_IMPLEMENT_TASK:
        // 运营类项目报销审批
        case PROCESS_DEFINE_KEY.BUDGET_IMPLEMENT_OPERATION_TASK:
          console.log('processObj.task', processObj.task)
          switch (processObj.task) {
            // 审批
            case BUDGET_VAR.BUDGET_MANAGER_AUDIT:
              // 经理
              self.budgetImplAuditDialog(row, {
                pass: PROCESS_STATUS.BUDGET_IMPL_MANAGER_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_IMPL_MANAGER_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_BUS_COMMITTEE_AUDIT:
              // 业务委员
              self.budgetImplAuditDialog(row, {
                pass: PROCESS_STATUS.BUDGET_IMPL_BUSCOMMITTEE_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_IMPL_BUSCOMMITTEE_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_ACCOUNTANT_AUDIT:
              // 财务会计
              self.budgetImplAuditDialog(row, {
                pass: PROCESS_STATUS.BUDGET_IMPL_ACCOUNTANT_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_IMPL_ACCOUNTANT_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_CASHIER_AUDIT:
              // 财务出纳确认
              self.budgetImplAuditDialog(row)
              break
            case BUDGET_VAR.BUDGET_VICEDIRECTOR_AUDIT:
              self.budgetImplAuditDialog(row, {
                pass: PROCESS_STATUS.BUDGET_IMPL_VICEDIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_IMPL_VICEDIRECTOR_AUDIT_UNPASS
              })
              break
            case BUDGET_VAR.BUDGET_DIRECTOR_AUDIT:
              self.budgetImplAuditDialog(row, {
                pass: PROCESS_STATUS.BUDGET_IMPL_DIRECTOR_AUDIT_PASS,
                unpass: PROCESS_STATUS.BUDGET_IMPL_DIRECTOR_AUDIT_UNPASS
              })
              break
            // 重新提交
            case BUDGET_VAR.BUDGET_IMPLEMENT:
              self.recommitBudgetImplApplyDialog(row)
              break
          }
          break
        // 借款审批
        case PROCESS_DEFINE_KEY.LOAN_TASK:
          console.log('loan task', processObj.task)
          // 审批
          switch (processObj.task) {
            case LOAN_VAR.LOAN_SALECOMMITTEE_AUDIT:
            case LOAN_VAR.LOAN_BUSCOMMITTEE_AUDIT:
            case LOAN_VAR.LOAN_LEGALCOMMITTEE_AUDIT:
            case LOAN_VAR.LOAN_FINANCECOMMITTEE_AUDIT:
            case LOAN_VAR.LOAN_VICEDIRECTOR_AUDIT:
            case LOAN_VAR.LOAN_DIRECTOR_AUDIT:
            case LOAN_VAR.LOAN_CASHIER_AUDIT:
              self.loanAuditDialog(row)
              break
          }
          break
      }
    },

    /**
     * 项目申请审批
     *
     * @param {any} row 审批对象
     */
    projectApplyAuditDialog(row, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.PASS_APPLY
            }
            self.projectAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.UNPASS_APPLY
            }
            self.projectAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '项目申请审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    /**
     *合同申请审批
     *
     * @param {any} row 审批对象
     */
    contractApplyAuditDialog(row, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.CONTRACT_PASS_APPLY
            }
            self.contractAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.CONTRACT_UNPASS_APPLY
            }
            self.contractAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '合同申请审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    /**
     * 合同录入申请重新提交
     *
     * @param {any} row 审批对象
     */
    recommitContractApplyDialog(row) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter2 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '确认提交',
          callback: function() {
            auditItem.comment = self.taskAuditComment
            self.recommitContractApply(auditItem)
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '合同录入审批重新提交',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    /**
     * 预算审批重新提交
     *
     * @param {any} row 审批对象
     */
    recommitBudgetApplyDialog(row, budgetType) {
      const self = this
      this.taskVariables = row.variables
      this.taskVariables.taskId = row.taskId

      // this.taskAuditComment = '' // 刚打开初始化为空
      // this.taskAuditMatters = this.matter.matter2 // 注意提示
      // const budgetProcessObj = this.getBudgetProcessByType(budgetType)

      // let auditItem = {}
      // auditItem.processInstanceId = row.processInstanceId
      // auditItem.taskId = row.taskId
      // auditItem.type = budgetType
      let dialogButtons = [
        {
          value: '呈报',
          callback: function() {
            // auditItem.comment = self.taskAuditComment
            // auditItem.processStatus = budgetProcessObj.commit
            // self.recommitBudgetApply(auditItem)
            self.$refs.todoModifyComp.submitProcess()
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '预算审批重新提交',
        $('#todo-modify-dialog'),
        800,
        440,
        'todo-modify-dialog',
        dialogButtons
      )
    },
    /**
     * 报销审批重新提交
     *
     * @param {any} row 审批对象
     */
    recommitBudgetImplApplyDialog(row) {
      const self = this
      this.taskVariables = row.variables
      this.taskVariables.taskId = row.taskId

      // this.taskAuditComment = '' // 刚打开初始化为空
      // this.taskAuditMatters = this.matter.matter2 // 注意提示

      // let auditItem = {}
      // auditItem.processInstanceId = row.processInstanceId
      // auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '呈报',
          callback: function() {
            // auditItem.comment = self.taskAuditComment
            // auditItem.processStatus = PROCESS_STATUS.BUDGET_IMPL_COMMIT
            // self.recommitBudgetImplApply(auditItem)
            self.$refs.todoModifyComp.submitProcess()
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '报销审批重新提交',
        $('#todo-modify-dialog'),
        800,
        440,
        'todo-modify-dialog',
        dialogButtons
      )
    },
    /**
     * 项目申请重新提交
     *
     * @param {any} row 审批对象
     */
    recommitProjectApplyDialog(row) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter2 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '确认提交',
          callback: function() {
            auditItem.comment = self.taskAuditComment
            self.recommitProjectApply(auditItem)
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '项目申请重新提交',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },

    /**
     * 项目经理任命对话框
     * @param {any} row 行对象
     */
    pmAppointDialog(row) {
      this.currentViewComp2 = DeptStaffsComp
      this.busProjectId = row.variables.BUS_ID
      const self = this
      let dialogButtons = [
        {
          value: '确认提交',
          callback: function() {
            // 获取选择的成员
            const selectStaff = self.staffSelectHandle()
            if (
              selectStaff.length == 1 &&
              selectStaff[0].check_Child_State == -1
            ) {
              const staff = selectStaff[0]
              let projectMember = {}
              projectMember.memberid = staff.unionid
              projectMember.projectid = row.variables.BUS_ID
              projectMember.roleid = PROJECT_MEMBER_ROLES_CODE.PM_MANAGER
              projectMember.remark = self.$refs.pmappointAttachmentFormComp.getAttachments()
              if (row.taskId) {
                self.pmAppointComplete(row.taskId, projectMember)
              }
            } else {
              self.$message({ type: 'warning', message: '请选择一位项目经理' })
              return false
            }
            // 保存
            // if (self.selectedStaff == null) {
            //     self.$message({type: 'warning', message: '请选择一位项目经理'})
            //     return false
            // } else {
            //     // 保存项目经理
            //     const staff = self.selectedStaff
            //     let projectMember = {}
            //     projectMember.memberid = staff.unionid
            //     projectMember.projectid = row.variables.BUS_ID
            //     projectMember.roleid = PROJECT_MEMBER_ROLES_CODE.PM_MANAGER
            //     self.pmAppointComplete(row.taskId, projectMember)
            // }
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      let artDialog = art.artdialog(
        '请任命一名项目经理(最后一个选择作为选择项)',
        $('#pmappoint-dialog'),
        600,
        440,
        'pmappoint-dialog',
        dialogButtons
      )
      artDialog.addEventListener('beforeremove', function() {
        self.currentViewComp2 = null
      })
    },
    /**
     * 项目经理任命审批对话框
     * @param {any} row 行对象
     */
    pmAppointAuditDialog(row, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.PASS_PM_APPOINT
            }
            self.projectAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.UNPASS_PM_APPOINT
            }
            self.projectAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '项目经理任命审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    /**
     * 项目人员分配对话框
     */
    projectMemberAssignDialog(row) {
      this.busProjectId = row.variables.BUS_ID
      // this.currentTodoTask = row
      this.currentViewComp = ProjectMemberAssignComp
      const self = this
      let dialogButtons = [
        {
          value: '确认提交',
          callback: function() {
            // 保存
            row.attachment = self.$refs.pmAssignAttachmentFormComp.getAttachments()
            self.$refs.pmAssignIndexComp.saveProjectMember(row, function() {
              self.findTodoTask()
            })
          },
          autofocus: true
        },
        {
          value: '取消'
        }
      ]
      let artDialog = art.artdialog(
        '项目人员划分',
        $('#projectMemberAssign-dialog'),
        600,
        460,
        'projectMemberAssign-dialog',
        dialogButtons
      )
      artDialog.addEventListener('beforeremove', function() {
        self.currentViewComp = null
      })
    },
    /**
     * 项目成员分配审批对话框
     * @param {any} row 行对象
     */
    pmAssignAuditDialog(row, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.PASS_PM_ASSIGN
            }
            self.projectAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              // 后面去掉
              auditItem.processStatus = PROCESS_STATUS.UNPASS_PM_ASSIGN
            }
            self.projectAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '项目人员分配审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    // 预算审批对话框
    budgetAuditDialog(row, budgetType, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示
      const budgetProcessObj = this.getBudgetProcessByType(budgetType)

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      auditItem.taskDefinitionKey = row.taskDefinitionKey
      auditItem.type = budgetType
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              // 后面去掉
              auditItem.processStatus = budgetProcessObj.pass
            }
            self.budgetAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              // 后面去掉
              auditItem.processStatus = budgetProcessObj.unpass
            }
            self.budgetAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '预算审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    // 借款审批对话框
    loanAuditDialog(row) {
      const self = this
      console.log('loanAuditDialog', row)
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            auditItem.processStatus = PROCESS_STATUS.LOAN_MANAGE_PASS
            self.loanAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            auditItem.processStatus = PROCESS_STATUS.LOAN_MANAGE_UNPASS
            self.loanAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '借款审批',
        $('#todo-audit-or-handle-dialog'),
        1100,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    // 报销审批对话框
    budgetImplAuditDialog(row, ps) {
      const self = this
      this.taskAuditComment = '' // 刚打开初始化为空
      this.taskAuditMatters = this.matter.matter1 // 注意提示

      let auditItem = {}
      auditItem.processInstanceId = row.processInstanceId
      this.currentProcessInstanceId = row.processInstanceId
      auditItem.taskId = row.taskId
      let dialogButtons = [
        {
          value: '审批通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '1'
            if (ps) {
              auditItem.processStatus = ps.pass
            } else {
              auditItem.processStatus = PROCESS_STATUS.BUDGET_IMPL_PASS
            }
            self.budgetImplAudit(auditItem)
          },
          autofocus: true
        },
        {
          value: '审批不通过',
          callback: function() {
            if (self.taskAuditComment == '') {
              self.taskAuditComment = '不通过'
            }
            auditItem.comment = self.taskAuditComment
            auditItem.isPass = '0'
            if (ps) {
              auditItem.processStatus = ps.unpass
            } else {
              auditItem.processStatus = PROCESS_STATUS.BUDGET_IMPL_UNPASS
            }
            self.budgetImplAudit(auditItem)
          }
        },
        {
          value: '取消'
        }
      ]
      art.artdialog(
        '报销审批',
        $('#todo-audit-or-handle-dialog'),
        800,
        440,
        'todo-audit-or-handle-dialog',
        dialogButtons
      )
    },
    /**
     * 通过类型获取流程状态
     */
    getBudgetProcessByType(budgetType) {
      switch (budgetType) {
        case BUDGET_TYPE_CODE.BUDGET_SALE:
          return {
            pass: PROCESS_STATUS.BUDGET_SALE_PASS,
            unpass: PROCESS_STATUS.BUDGET_SALE_UNPASS,
            commit: PROCESS_STATUS.BUDGET_SALE_COMMIT
          }
        case BUDGET_TYPE_CODE.BUDGET_PRODUCE:
          return {
            pass: PROCESS_STATUS.BUDGET_PROD_PASS,
            unpass: PROCESS_STATUS.BUDGET_PROD_UNPASS,
            commit: PROCESS_STATUS.BUDGET_PROD_COMMIT
          }
        case BUDGET_TYPE_CODE.BUDGET_MANAGE:
          return {
            pass: PROCESS_STATUS.BUDGET_MANAGE_PASS,
            unpass: PROCESS_STATUS.BUDGET_MANAGE_UNPASS,
            commit: PROCESS_STATUS.BUDGET_MANAGE_COMMIT
          }
        default:
          break
      }
    },
    /**
     * 项目审批流程处理：立项申请、项目经理任命
     * @param {any} auditItem 审批对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过，流程变量
     */
    projectAudit(auditItem) {
      const self = this
      projectApi
        .projectAudit(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '办理成功' })
          }
        })
        .catch(err => {})
    },

    /**
     * 合同审批
     */
    contractAudit(auditItem) {
      const self = this
      contractApi
        .contractAudit(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '办理成功' })
          }
        })
        .catch(err => {})
    },
    /**
     * 预算审批
     */
    budgetAudit(auditItem) {
      const self = this
      budgetApi
        .budgetAudit(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '办理成功' })
          }
        })
        .catch(err => {})
    },
    /**
     * 报销审批
     */
    budgetImplAudit(auditItem) {
      const self = this
      budgetApi
        .budgetImplAudit(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '办理成功' })
          }
        })
        .catch(err => {})
    },

    loanAudit(auditItem) {
      const self = this
      loanApi
        .loanAudit(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '办理成功' })
          }
        })
        .catch(err => {})
    },
    /**
     * 合同录入重新提交流程
     *
     * @param {any} auditItem 审批对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过
     */
    recommitContractApply(auditItem) {
      const self = this
      contractApi
        .recommitContractApply(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '重新提交成功' })
          }
        })
        .catch(err => {})
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
            self.findTodoTask()
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
            self.findTodoTask()
            self.$message({ type: 'success', message: '重新提交成功' })
          }
        })
        .catch(err => {})
    },
    /**
     * 项目重新提交流程
     *
     * @param {any} auditItem 审批对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过
     */
    recommitProjectApply(auditItem) {
      const self = this
      projectApi
        .recommitProjectApply(auditItem)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            self.$message({ type: 'success', message: '重新提交成功' })
          }
        })
        .catch(err => {})
    },
    // 项目经理员工选择
    // staffSelectHandle(selection, row) {
    //     this.selectedStaff = row
    // },
    staffSelectHandle() {
      return this.$refs.deptStaffsIndexComp.getCheckedNodes()
    },
    // 完成项目经理的任命流程
    pmAppointComplete(taskId, projectMember) {
      const self = this
      projectApi
        .pmAppointComplete(taskId, projectMember)
        .then(response => {
          if (response.status == 200) {
            self.findTodoTask()
            // 刷新列表
            self.$message({ type: 'success', message: '保存提交成功' })
          }
        })
        .catch(err => {})
    }
  }
}
</script>
