import Ajax from '@/api/tools/customajax'

export default {
  /**
   * 登陆
   * @param {Object} params
   */
  userLogin(params) {
    const url = '/pms/security/author/login'
    return Ajax.post(url, params)
  },

  /**
   * 注销登陆
   */
  userLoginout() {
    var url = '/pms/security/author/loginOut'
    return Ajax.post(url)
  }
}
