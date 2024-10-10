import { privatClient } from "../axiosInstances/privatClient";

export const namespaced = true;

export const state = {
  requests: null,
  modalRequest: null,
  homes: null,
  apartments: null,
  error: null
}

export const getters = {
  requests(state) {
    return state.requests;
  },
  homes(state) {
    return state.homes;
  },
  modalRequest(state) {
    return state.modalRequest;
  },
  apartments(state) {
    return state.apartments;
  },
  error(state) {
    return state.error;
  },
  
}

export const mutations = {
  SET_REQUESTS(state, requests) {
    state.requests = requests;
  },
  SET_HOMES(state, homes) {
    state.homes = homes;
  },
  SET_MODAL_REQUEST(state, modalRequest) {
    state.modalRequest = modalRequest;
  },
  SET_APARTMENTS(state, apartments) {
    state.apartments = apartments;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
}

export const actions = {
  async getRequests({ commit }, params) {
    try {
      let queryString = `?page_size=${params.pageSize}&page=${params.pageNumber}`
      queryString += params.search ? `&search=${params.search}` : ''
      queryString += params.premise_id ? `&premise_id=${params.premise_id}` : ''

      const response = await privatClient.get(`appeals/v1.0/appeals/` + queryString)
      commit('SET_REQUESTS', response.data)
      return true
    } catch (error) {
      console.error(error)
      this._vm.$toast.error(error?.response?.data?.detail);
      return false
    }
  },
  async getRequest({ commit }, params) {
    try {
      const response = await privatClient.get(`appeals/v1.0/appeals/${params.appeaId}`)
      commit('SET_MODAL_REQUEST', response.data)
      
    } catch (error) {
      console.error(error)
      this._vm.$toast.error(error?.response?.data?.detail);
    }
  },
  async getHomesFilter({commit}, params) {
    try {
      let queryString = params?.search ? '?search=' + params?.search : ''
      const response = await privatClient.get(`geo/v2.0/user-premises/${queryString}`)
      commit('SET_HOMES', response.data)
    } catch (error) {
      console.error(error)
      this._vm.$toast.error(error?.response?.data?.detail);
    }
  },
  async getApartments({commit}, params) {
    try {
      let queryString = params.premiseId ? `?premise_id=${params.premiseId}` : ''
      queryString += params.search ? `&search=${params?.search}` : ''

      const response = await privatClient.get(`geo/v1.0/apartments/${queryString}`)
      commit('SET_APARTMENTS', response.data)
    } catch (error) {
      console.error(error)
      this._vm.$toast.error(error?.response?.data?.detail);
    }
  },
  async createRequest({state}, params) {
    try {
      await privatClient.post(`/appeals/v1.0/appeals/`, params.requestBody)
      console.log(state)
    } catch (error) {
      console.error(error)
      state
      this._vm.$toast.error(error?.response?.data?.detail);
    }
  },
  async setRequest({state},params) {
    try {
      await privatClient.patch(`/appeals/v1.0/appeals/${params.appealId}/`, params.requestBody)
      state
    } catch (error) {
      console.error(error)
      state
      this._vm.$toast.error(error?.response?.data?.detail);
    }
  }
}