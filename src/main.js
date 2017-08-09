import './assets/style/main.css'
import App from './App.vue'
import routes from './config/routes'
import vuexObj from './config/store'

const router = new VueRouter({
    routes
})

var store = new Vuex.Store(vuexObj)

const app = new Vue({
    router: router,
    store: store,
    render: h => h(App)
}).$mount('#app')
