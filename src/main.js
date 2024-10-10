import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMask from 'v-mask'
import Toast from "vue-toastification";
import Loader from "@pderas/vue2-loader";
import InputDefault from './components/InputDefault.vue'
import ButtonDefault from './components/ButtonDefault.vue'
import { Icon } from '@iconify/vue2';
import "vue-toastification/dist/index.css";
import './assets/scss/main.scss'

Vue.config.productionTip = false
Vue.component('v-input', InputDefault)
Vue.component('v-btn', ButtonDefault)
Vue.component('v-icon', Icon)
Vue.use(VueMask)
Vue.use(Toast);
Vue.use(Loader, {
  color:  '#50B053',
  type:   'spinning-dot'
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

