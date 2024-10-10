import { privatClient } from "@/axiosInstances/privatClient";
import { publickClient } from "@/axiosInstances/publickClient";
import Cookies from 'js-cookie'


export const namespaced = true;

export const state = {
  user: null,
  isAuthorized: false,
  authError: null
}

export const getters = {
  user(state) {
    return state.user;
  },
  isAuthorized(state) {
    return state.isAuthorized;
  },
  authError(state) {
    return state.authError;
  },
}

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_AUTHORIZE(state, isAuthorized) {
    state.isAuthorized = isAuthorized;
  },
  SET_AUTHERROR(state, authError) {
    state.authError = authError;
  },
}

export const actions = {
  async auth({ commit, state }, requestBody) {
    try {
      const response = await publickClient.post('auth/login/', requestBody)
      state.isAuthorized = true
      Cookies.set('Token', response.data.key)
      commit('SET_USER', response.data.employee_id)
      
      return {data: response.data, status: true} 
    } catch (error) {
      console.error(error)
      commit('SET_AUTHERROR', error)
    }
  },
  async checkAuth({commit}) {
    try {
      await privatClient.get('appeals/v1.0/appeals/?page_size=1')
      commit('SET_AUTHORIZE', true)
      return true
    } catch (error) {
      commit('SET_AUTHORIZE', false)
      commit('SET_AUTHERROR', error)
      return false
    }
    
  }
}