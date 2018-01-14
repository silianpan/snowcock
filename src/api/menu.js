import Ajax from '@/api/tools/customajax'

export default {
  /**
   * 获取当前用户的菜单列表
   */
  getMenuTreeByCurrentUser() {
    var url = '/pms/security/menu/tree/by/user'
    return Ajax.query(url)
  }
}
