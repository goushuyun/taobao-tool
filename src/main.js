import './assets/style/main.css'
import App from './App.vue'

import Element from 'element-ui'
Vue.use(Element)

// vue-router
import routes from './config/routes'
const router = new VueRouter({
    routes
})

// vuex
import vuexObj from './config/store'
var store = new Vuex.Store(vuexObj)


const app = new Vue({
    router: router,
    store: store,
    render: h => h(App)
}).$mount('#app')
