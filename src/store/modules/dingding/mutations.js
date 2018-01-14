import * as types from './mutation_type'

export default {
  [types.SUCCESS_GET_ACCESS_TOKEN](state, accessToken) {
    state.ACCESS_TOKEN = accessToken
  }
}
