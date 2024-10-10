export const namespaced = true;

export const state = {
  isShow: false,
  data: null
}

export const getters = {
  isShow(state) {
    return state.isShow;
  },
  data(state) {
    return state.data;
  },
}

export const mutations = {
  SET_IS_SHOW(state, isShow) {
    state.isShow = isShow;
  },
  SET_DATA(state, data) {
    state.data = data;
  },
}

export const actions = {
  async showModal({ commit }, data) {
    commit('SET_DATA', data)
    commit('SET_IS_SHOW', true)
    
  },
  async closeModal({commit}) {
    commit('SET_DATA', null)
    commit('SET_IS_SHOW', false)
  }
}