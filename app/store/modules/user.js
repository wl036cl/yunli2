/**
 * Author:ll36
 * Create Time:2018/03/20 13:45
 * Descripttion:
 */
import {signInByPhone, signInByToken, signOut, getUser} from '../../api/user';
import cookies from 'js-cookie'

const userIdKey = 'yunli_uid'
const tokenKey = 'yunli_token'
const expiresDay = 15

const user = {
  state: {
    uid: '',
    token: '',
    name: '',
    head: ''
  },

  mutations: {
    SET_USERID: (state, uid) => {
      state.uid = uid
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_HEAD: (state, head) => {
      state.head = head
    }
  },

  actions: {
    // 用户名登录
    signInByPhone({commit}, userInfo) {
      const [phone, password] = [userInfo.phone.trim(), userInfo.password.trim()]

      return new Promise((resolve, reject) => {
        if (!phone || !password) {
          reject('请输入帐号和密码！')
        } else if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)) {
          reject('帐号不正确！')
        } else if (password.length < 6) {
          reject('密码不正确！')
        }
        else {
          signInByPhone(phone, password).then(res => {
            if (res.result === '1') {
              commit('SET_USERID', res.uid)
              commit('SET_TOKEN', res.token)
              commit('SET_NAME', res.uname)
              commit('SET_HEAD', res.uhead)

              cookies.set(userIdKey, res.uid, {expires: expiresDay})
              cookies.set(tokenKey, token, {expires: expiresDay})

              resolve('登录成功')
            }
            else {
              reject(res.msg)
            }
          }).catch(err => {
            console.log(err)
            reject('服务器返回错误！')
          })
        }

      })
    },

    // Token登录
    signInByToken({commit}) {
      const [uid, token] = [cookies.get(userIdKey), cookies.get(tokenKey)]

      return new Promise((resolve, reject) => {
        if (!uid || !token) {
          reject('登录信息错误！')
        }
        else {
          signInByToken(uid, token).then(res => {
            if (res.result === '1') {
              commit('SET_USERID', res.uid)
              commit('SET_TOKEN', res.token)
              commit('SET_NAME', res.uname)
              commit('SET_HEAD', res.uhead)

              cookies.set(userIdKey, res.uid, {expires: expiresDay})
              cookies.set(tokenKey, token, {expires: expiresDay})

              resolve('登录成功')
            }
            else {
              reject(res.msg)
            }
          }).catch(err => {
            console.log(err)
            reject('服务器返回错误！')
          })
        }

      })
    },

    //退出登录
    signOut({commit, state}) {
      return new Promise((resolve, reject) => {
        signOut(state.uid, state.token).then(() => {
          commit('SET_USERID', '')
          commit('SET_TOKEN', '')

          cookies.set(userIdKey, '')
          cookies.set(tokenKey, '')
        }).catch(err => {
          console.log(err)
          reject('服务器返回错误！')
        })
      })
    },

    // 获取用户信息
    getUserInfo({commit, state}) {
      const [uid, token] = [state.uid, state.token]

      return new Promise((resolve, reject) => {
        if (!uid || !token) {
          reject('获取失败！')
        }
        getUser(uid.token).then(res => {
          if (res === '1') {
            commit('SET_USERID', res.uid)
            commit('SET_TOKEN', res.token)
            commit('SET_NAME', res.uname)
            commit('SET_HEAD', res.uhead)
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
