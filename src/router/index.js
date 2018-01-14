import Vue from 'vue'
import iView from 'iview'
import Util from './util'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import { routers } from './router'

Vue.use(VueRouter)

// 路由配置
const RouterConfig = {
  // mode: 'history',
  base: 'pms',
  routes: routers
}

const router = new VueRouter(RouterConfig)
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  Util.title(to.meta.title)
  if (!Cookies.get('user') && to.name !== 'login') {
    next({ name: 'login' })
  } else if (Cookies.get('user') && to.name === 'login') {
    // next({ name: 'home' })
    next()
  } else {
    next()
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
