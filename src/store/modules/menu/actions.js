import menuApi from '@/api/menu'
import * as types from './mutation_type'

export default {
  getMenuList({ commit }) {
    menuApi
      .getMenuTreeByCurrentUser()
      .then(response => {
        if (response.status === 200) {
          commit(types.SUCCESS_GET_MENULIST, response.data)
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }
}
