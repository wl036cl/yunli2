/**
 * Author:ll36
 * Create Time:2018/03/20 18:51
 * Descripttion:
 */

const sideBar = {
  state: {
    opened:false
  },

  mutations: {
    TOGGLE_SIDEBAR: (state) => {
      state.opened = !state.opened
    }
  },

  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    }
  }
}

export default sideBar