/**
 * Created by superman on 17/2/16.
 * http配置
 */
import axios from 'axios'
// import store from '@/store/modules/login'
import iView from 'iview'
// axios 配置
axios.defaults.withCredentials = true
axios.defaults.timeout = 3600000
// axios.defaults.headers.common['Authorization'] = 'token'
// axios.defaults.headers.post['Content-Type']  = "application/json"
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
// var csrftoken = window.document.cookie.get('csrftoken')
// axios.defaults.headers.common['HTTP_X_CSRFTOKEN'] = csrftoken

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (store.state.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    //   config.headers.token = `${store.state.token}`
    // }
    iView.LoadingBar.start()
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    iView.LoadingBar.finish()
    return response
  },
  error => {
    if (error.response) {
      iView.LoadingBar.finish()
      console.log(error.response)
      switch (error.response.status) {
        case 401:
        // 返回 401 清除token信息并跳转到登录页面
      }
    }
    return Promise.reject(error.response) // 返回接口返回的错误信息
  }
)

export default axios
