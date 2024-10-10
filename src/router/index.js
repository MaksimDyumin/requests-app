import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { protected: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/AuthView.vue'),
    meta: { protected: false },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) =>{
  await store.dispatch('user/checkAuth')
  if (to.meta.protected && !store.getters['user/isAuthorized']) {
    next({ name: 'login' });
  }
  else next()
})

export default router
