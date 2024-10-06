import { privatClient } from "../axiosInstances/privatClient";

export const namespaced = true;

export const state = {
  requests: '1dfsd',
}

export const getters = {
  requests(state) {
    return state.requests;
  },
}

export const mutations = {
  SET_REQUESTS(state, reqs) {
    state.reqs = reqs;
  },
}

export const actions = {
  async getRequests({ commit }) {
    try {
      const response = await privatClient.get('appeals/v1.0/appeals/')
      commit('SET_REQUESTS', response.data)
    } catch (error) {
      console.error(error)
    }
  },
}