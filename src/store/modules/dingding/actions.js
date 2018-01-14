import api from '@/api/dingding'
import * as types from './mutation_type'
import { COMPANY } from 'common/dingdingEnum'

export default {
  getAccessToken({ commit }) {
    api
      .getAccessToken(COMPANY.CorpId, COMPANY.CorpSecret)
      .then(response => {
        if (response.status === 200 && response.data != null) {
          if (response.data.errcode === 0) {
            commit(types.SUCCESS_GET_ACCESS_TOKEN, response.data.access_token)
          }
        }
      })
      .catch(err => {
        console.log('err', err)
      })
  }
}
