/**
 * Author:ll36
 * Create Time:2018/03/22 14:44
 * Descripttion:
 */
import {getSportsList} from '../../api/sport'
import cookies from 'js-cookie'
import extendList from '../../utils/extendList'

const SPORT_KEY = 'sportId'

const sport = {
  state: {
    list: [],
    finished: false
  },
  mutations: {
    EXTEND_LIST: (state, list) => {
      if (Array.isArray(list)) {
        state.list = extendList(state.list, list, SPORT_KEY)
      }
    },
    DELETE_ITEM: (state, index) => {
      if (index > -1 && state.list.length > index) {
        state.list.splice(index, 1)
      }
    },
    SET_FINISHED: (state, isFinish) => {
      state.finished = isFinish
    }
  },
  actions: {
    getSportsList ({commit, state}, npage) {
      const [uid, token] = [cookies.get(userIdKey), cookies.get(tokenKey)]

      return new Promise((resolve, reject) => {
        if (!uid || !token) {
          reject('登录信息错误！')
        } else if (state.finished) {
          reject('没有更多数据！')
        } else {
          npage = npage || 1

          getSportsList(uid, token, npage).then(res => {
            if (res.result === '1' && res.data && res.data.length) {
              commit('SET_FINISHED', res.isfinish === '1')// 是否最后一页
              commit('EXTEND_LIST', res.data)
              resolve('获取成功')
            } else if (res.result === '0')// 无数据
            {
              commit('SET_FINISHED', true)
            } else {
              reject(res.msg)
            }
          }).catch(err => {
            console.log(err)
            reject('服务器返回错误！')
          })
        }
      })
    },
    deleteItem ({commit, state}, item) {
      if (item && item.hasOwnProperty(SPORT_KEY) && state.list && state.list.length) {
        let index = state.list.findIndex(i => i.hasOwnProperty(SPORT_KEY) && i[SPORT_KEY] === item[SPORT_KEY])

        commit('DELETE_ITEM', index)
      }
    }
  }
}

export default sport
