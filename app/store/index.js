/**
 * Author:ll36
 * Create Time:2018/03/20 13:36
 * Descripttion:
 * */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import LOGGER_CONFIG from '../config/logger.config'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    sideBar
  },
  getters: {
    userId: state => state.user.uid,
    userToken: state => state.user.token,
    userName: state => state.user.name,
    userHead: state => state.user.head
  },
  strict: debug,
  plugins: debug ? [createLogger(LOGGER_CONFIG)] : []
})