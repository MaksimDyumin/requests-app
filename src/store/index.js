import Vue from 'vue'
import Vuex from 'vuex'
import * as requests from './requests'
import * as user from './user'
import * as modal from './modal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    requests,
    user,
    modal
  }
})
