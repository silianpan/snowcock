import Vue from 'vue'
import Vuex from 'vuex'
import login from './modules/login'
import menu from './modules/menu/index'
import home from './modules/home'
import app from './modules/app'
// import dingding from './modules/dingding'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    menu,
    login,
    home,
    app
    // dingding
  }
})
