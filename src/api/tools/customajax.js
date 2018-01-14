import axios from '@/api/tools/http'
import { API_BASEURL, API_TIMEOUT } from '@/config'

export default {
  axiosOptions(url, method = 'get', params = {}, tag = true) {
    params._ = Math.random()
    const self = this
    self.loadInstance = null
    var options = {
      url: url,
      method: method,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
        // 'credentials': 'include'
      },
      // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
      responseType: 'json',
      baseURL: API_BASEURL,
      timeout: API_TIMEOUT,
      // 将upload事件注释掉，防止跨域状态下发起option请求
      // onUploadProgress(progressEvent) {
      // Do whatever you want with the native progress event
      // },

      // onDownloadProgress(progressEvent) {
      // Do whatever you want with the native progress event
      // },
      withCredentials: true
    }

    // `xsrfCookieName` 是用作 xsrf token 的值的cookie的名称
    // options.xsrfCookieName = '_csrf'  // default
    // `xsrfHeaderName` 是承载 xsrf token 的值的 HTTP 头的名称
    // options.xsrfHeaderName = 'X-CSRF-TOKEN'
    // 在传递给 then/catch 前，允许修改响应数据
    // options.transformResponse = data => {
    //   if ((typeof data.exception) === 'undefined' || data.exception == null) {
    //     console.log("########transformResponse  right:")
    //   } else {
    //     console.log("########transformResponse exception :" + data.errorMsg)
    //   }
    //   return data
    // }
    //
    if (tag) {
      options.params = params
    }
    if (method === 'post') {
      // 可能这里要问为什么要params 和data 是一样的
      // 解答:
      //    params :是即将与请求一起发送的 URL 参数
      //    data :`data` 是作为请求主体被发送的数据
      // 我这里不太清楚 后台接受 post 数据的形式
      // 可能是 @RequestBody 也可能是@RequestParam
      options.data = params
    }
    return options
  },

  /**
   * get 方法
   *@param url 用户输入的url
   *@returns axios
   */
  query(url, params = {}) {
    var options = this.axiosOptions(url, 'get', params)
    return axios(options)
  },

  /**
   * 分页查询
   *@param url 用户输入的url
   *@returns axios
   */
  pageQuery(url, params = {}, pageNo = 1, pageSize = 10) {
    // 后台是以 easyui 的page rows 来接收分页信息的
    params.page = pageNo
    params.rows = pageSize
    var options = this.axiosOptions(url, 'get', params)
    return axios(options)
  },
  /**
   * post 方法
   *@param url 用户输入的url
   *@returns axios
   */
  post(url, params = {}, tag = true) {
    var options = this.axiosOptions(url, 'post', params, tag)
    return axios(options)
  },
  /**
   * delete 方法
   *@param url 用户输入的url
   *@returns axios
   */
  delete(url, params = {}) {
    var options = this.axiosOptions(url, 'delete', params)
    return axios(options)
  },
  /**
   * 源生调用
   * @param  {Object} [option={}] [description]
   * @return {[type]}             [description]
   */
  call(option = {}) {
    option.baseURL = API_BASEURL
    option.timeout = API_TIMEOUT
    option.withCredentials = true
    option.headers = {
      'X-Requested-With': 'XMLHttpRequest',
      credentials: 'include',
      'content-type': 'application/json charset=utf-8'
    }
    return axios(option)
  }
}
