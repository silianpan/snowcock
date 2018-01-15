import Ajax from '@/api/tools/customajax'

export default {
  /**
   * 待办任务
   */
  findTodoTask() {
    const url = '/pms/workflow/workflow/todotask/find'
    return Ajax.query(url)
  },

  /**
   * 签收任务
   * @param taskId 任务ID
   */
  claimTask(taskId) {
    const url = '/pms/workflow/workflow/task/claim/' + taskId
    return Ajax.query(url)
  },

  /**
   * 完成任务
   * @param taskId 任务ID
   */
  completeTask(taskId) {
    const url = '/pms/workflow/workflow/task/complete/' + taskId
    return Ajax.save(url)
  },

  /**
   * 驳回流程
   * @param {any} taskId
   * @param {any} activityId
   * @returns
   */
  backProcess(taskId, activityId) {
    const url =
      '/pms/workflow/workflow/process/back/' + taskId + '/' + activityId
    return Ajax.save(url)
  },

  /**
   * 获取流程图
   *
   * @param {any} processInstanceId 流程实例ID
   * @returns
   */
  getDiagramByProcessInstanceId(processInstanceId) {
    const url =
      '/pms/workflow/process-instance/' + processInstanceId + '/diagram-layout'
    return Ajax.query(url)
  },
  /**
   * 根据流程定义ID获取流程图
   *
   * @param {any} processDefinitionId 流程定义ID
   * @returns
   */
  getDiagramByProcessDefineId(processDefinitionId) {
    const url =
      '/pms/workflow/process-definition/' +
      processDefinitionId +
      '/diagram-layout'
    return Ajax.query(url)
  },

  /**
   * 获取流程图高亮
   *
   * @param {any} processInstanceId 流程实例ID
   * @returns
   */
  getHighlighted(processInstanceId) {
    const url =
      '/pms/workflow/process-instance/' + processInstanceId + '/highlights'
    return Ajax.query(url)
  },

  /**
   * 获取流程图
   *
   * @param {any} processInstanceId 流程实例ID
   * @returns
   */
  getProcessDiagram(processInstanceId) {
    const url = '/pms/workflow/workflow/process/diagram/' + processInstanceId
    return Ajax.save(url)
  },

  /**
   * 获取历史活动列表
   *
   * @param {any} processInstanceId 流程实例ID
   * @returns
   */
  getHistoryActivity(processInstanceId) {
    const url =
      '/pms/workflow/workflow/history/activity/find/' + processInstanceId
    return Ajax.save(url)
  },

  /**
   * 获取流程实例
   *
   * @param {any} taskId 任务ID
   * @returns
   */
  getProcessInstanceByTaskId(taskId) {
    const url = '/pms/workflow/workflow/find/process/' + taskId
    return Ajax.save(url)
  },

  /**
   * 获取当前用户的发起流程情况，流程跟踪
   * @param {int} pageIndex
   * @param {int} pageSize
   */
  findProcessStartedByUser(pageIndex, pageSize) {
    const url =
      '/pms/workflow/workflow/process/started/' + pageIndex + '/' + pageSize
    return Ajax.query(url)
  },

  /**
   * 删除流程
   * @param {String} processInstanceId 流程实例ID
   */
  processDelete(processInstanceId) {
    const url = '/pms/workflow/workflow/process/delete/' + processInstanceId
    return Ajax.save(url)
  }
}
