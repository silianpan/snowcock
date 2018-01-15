import Ajax from '@/api/tools/customajax'

export default {
  /**
   * 根据ID查询项目
   *
   * @param {any} id 项目ID
   * @returns
   */
  queryProjectById(id) {
    const url = '/pms/project/project/find/id/' + id
    return Ajax.query(url)
  },
  queryProjectExtendById(id, budgetType) {
    const url = '/pms/project/project/find/extend/id/' + id + '/' + budgetType
    return Ajax.query(url)
  },

  /**
   *
   * 根据ID查询项目列表
   *
   * @param {any} idList 项目ID列表
   * @returns
   */
  queryProjectByIdList(idList) {
    const url = '/pms/project/project/find/ids'
    return Ajax.save(url, idList, false)
  },

  /**
   * 查询所有项目
   *
   * @returns
   */
  queryAllProject(callback) {
    const url = '/pms/project/project/query/all'
    return Ajax.syncQuery(url, {}, callback)
  },

  /**
   * 查询所有项目(基本id,name 数据)
   *
   * @returns
   */
  queryProject() {
    const url = '/pms/project/project/base/all'
    return Ajax.query(url)
  },

  /**
   * 分页查询个人项目
   *
   * @param {any} pageIndex
   * @param {any} pageSize
   * @param {any} params 查询参数，如userId
   * @returns
   */
  pageQueryProjectByUserId(params, pageIndex, pageSize) {
    const url =
      '/pms/project/project/pageQueryProjectByUserId/' +
      pageIndex +
      '/' +
      pageSize
    return Ajax.query(url, params)
  },
  queryProjectByUserId(params) {
    const url = '/pms/project/project/queryProjectByUserId'
    return Ajax.query(url, params)
  },
  pageQueryProjectForBudgetPlan(params, pageIndex, pageSize) {
    const url =
      '/pms/project/project/pageQueryProjectForBudgetPlan/' +
      pageIndex +
      '/' +
      pageSize
    return Ajax.query(url, params)
  },

  /**
   * 立项申请流程
   *
   * @param {any} project 项目对象
   * @returns
   */
  projectApply(project) {
    const url = '/pms/workflow/project/projectApply'
    return Ajax.save(url, project, false)
  },
  /**
   * 运营类立项申请流程
   *
   * @param {any} project 项目对象
   * @returns
   */
  projectOperationApply(project) {
    const url = '/pms/workflow/projectOperation/projectApply'
    return Ajax.save(url, project, false)
  },

  /**
   * 项目审核：立项申请、项目经理任命等审核
   *
   * @param {any} auditItem 审核对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过，流程状态
   * @returns
   */
  projectAudit(auditItem) {
    const url = '/pms/workflow/project/project/audit'
    return Ajax.save(url, auditItem, false)
  },

  /**
   * 重新提交项目申请流程
   *
   * @param {any} auditItem 审核对象：流程实例ID，任务ID，是否通过：'1'通过，'0'不通过
   * @returns
   */
  recommitProjectApply(auditItem) {
    const url = '/pms/workflow/project/project/apply/recommit'
    return Ajax.save(url, auditItem, false)
  },

  /**
   * 重新提交项目申请流程
   *
   * @param projectCommit 项目提交对象：项目对象+批注
   * @returns
   */
  recommitProjectApply2(projectCommit) {
    const url = '/pms/workflow/project/project/apply/recommit2'
    return Ajax.save(url, projectCommit, false)
  },

  /**
   * 项目经理任命待办任务
   *
   * @returns
   */
  pmAppointTodoTask() {
    const url = '/pms/workflow/project/pm/appoint/todo/task'
    return Ajax.query(url)
  },

  /**
   * 项目成员分配待办任务
   *
   * @returns
   */
  pmAssignTodoTask() {
    const url = '/pms/workflow/project/pm/assign/todo/task'
    return Ajax.query(url)
  },

  /**
   * 保存工程，添加当前用户到此项目
   *
   * @param {any} project 工程对象
   * @returns
   */
  saveProjectAndMember(project) {
    const url = '/pms/project/project/save/project/memeber'
    return Ajax.save(url, project, false)
  },
  /**
   * 保存项目和负责人角色
   *
   * @param {any} project
   * @returns
   */
  saveProjectAndMemberManager(project) {
    const url = '/pms/project/project/save/project/memeber/manager'
    return Ajax.save(url, project, false)
  },

  /**
   * 保存工程
   *
   * @param {any} project 工程对象
   * @returns
   */
  saveProject(project) {
    const url = '/pms/project/project/save'
    return Ajax.save(url, project, false)
  },

  /**
   * 更新工程
   *
   * @param {any} project 工程对象
   * @returns
   */
  updateProject(project) {
    const url = '/pms/project/project/update'
    return Ajax.save(url, project, false)
  },

  /**
   * 项目经理任命完成流程
   *
   * @param {any} taskId 任务ID
   * @param {any} projectMember 项目成员
   * @returns
   */
  pmAppointComplete(taskId, projectMember) {
    const url = '/pms/workflow/project/pm/appoint/complete/' + taskId
    return Ajax.save(url, projectMember, false)
  },

  /**
   * 项目成员分配完成流程
   *
   * @param {any} taskId 任务ID
   * @param {any} projectMemberList 项目成员列表
   * @returns
   */
  pmAssignComplete(taskId, projectMemberList) {
    const url = '/pms/workflow/project/pm/assign/complete/' + taskId
    return Ajax.save(url, projectMemberList, false)
  },

  /**
   * 根据项目ID查找项目成员信息
   *
   * @param {any} projectId
   * @param {any} pageIndex
   * @param {any} pageSize
   * @returns
   */
  pageQueryProjectMember(params, pageIndex, pageSize) {
    const url =
      '/pms/project/projectMembers/page/member/' + pageIndex + '/' + pageSize
    return Ajax.query(url, params)
  },

  /**
   * 根据项目ID和成员ID删除数据
   *
   * @param {any} projectMember 删除对象
   * @returns
   */
  deleteProjectMembers(projectMember) {
    const url = '/pms/project/projectMembers/delete'
    return Ajax.save(url, projectMember, false)
  },

  /**
   * 查询项目成员角色
   *
   * @param {any} params
   * @returns
   */
  queryRolesByProjectId(params) {
    const url = '/pms/project/projectMembers/query/roles/projectid'
    return Ajax.query(url, params)
  },
  querySyncRolesByProjectId(params, callback) {
    const url = '/pms/project/projectMembers/query/roles/projectid'
    return Ajax.syncQuery(url, params, callback)
  },

  /**
   * 根据项目状态统计
   *
   * @returns
   */
  statisticProjectStatus() {
    const url = '/pms/project/project/statistic/status'
    return Ajax.query(url)
  },

  /**
   * 根据项目流程状态统计
   *
   * @returns
   */
  statisticProjectProcessStatus() {
    const url = '/pms/project/project/statistic/process/status'
    return Ajax.query(url)
  },

  /**
   * 根据项目类型统计
   *
   * @returns
   */
  statisticProjectType() {
    const url = '/pms/project/project/statistic/type'
    return Ajax.query(url)
  },

  /**
   * 获取本月项目数量
   *
   * @returns
   */
  getCountCurrentMonth() {
    const url = '/pms/project/project/count/current/month'
    return Ajax.query(url)
  },

  /**
   * 关键字查询和高级查询项目
   *
   * @param {any} pageIndex
   * @param {any} pageSize
   * @param {any} project 查询对象
   * @returns
   */
  search(pageIndex, pageSize, project) {
    const url = '/pms/project/project/search/' + pageIndex + '/' + pageSize
    return Ajax.save(url, project, false)
  },

  /**
   * 关键字查询和高级查询项目
   * @param {*} pageIndex
   * @param {*} pageSize
   * @param {*} ProjectExpenseAccountExtend
   */
  searchprojectExpenseAccountExtend(
    pageIndex,
    pageSize,
    userid,
    ProjectExpenseAccountExtend
  ) {
    const url =
      '/pms/budget/budgetImplementation/search/extend/' +
      pageIndex +
      '/' +
      pageSize +
      '/' +
      userid
    return Ajax.save(url, ProjectExpenseAccountExtend, false)
  },

  /**
   * 关键字分页查询
   * @param {*} pageIndex
   * @param {*} pageSize
   */
  pageprojectExpenseAccount(pageIndex, pageSize, userid) {
    const url =
      '/pms/budget/budgetImplementation/pageexpenseaccount/extend/' +
      pageIndex +
      '/' +
      pageSize +
      '/' +
      userid
    return Ajax.save(url)
  },

  /**
   * 查询项目进度
   */
  getprojectrate() {
    const url = '/pms/project/project/projectrate/current/fund'
    return Ajax.query(url)
  },

  getprojectmonthrate() {
    const url = '/pms/project/project/projectrate/month/fundincoming'
    return Ajax.query(url)
  }
}
