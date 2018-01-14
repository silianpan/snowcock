import * as types from './mutation_type'

export default {
  [types.SUCCESS_GET_MENULIST](state, menuList) {
    state.menuList = menuList
  }
}
