import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/style/main.css'
Vue.use(ElementUI)


import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routes from './config/routes'
const router = new VueRouter({
  routes
})

import Vuex from "vuex"
Vue.use(Vuex)
import vuexObj from './config/store'
var store = new Vuex.Store(vuexObj)

const app = new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
