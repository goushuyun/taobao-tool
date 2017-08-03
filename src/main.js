import Vue from 'vue'
import App from './App.vue'

import './assets/style/main.css'
import ElementUI from 'element-ui'
// import {
//     Menu,
//     MenuItem,
//     Button,
//     Input,
//     Select,
//     Option,
//     Radio,
//     RadioGroup,
//     Table,
//     TableColumn,
//     Row,
//     Col,
//     Pagination,
//     Form,
//     FormItem,
//     Tabs,
//     TabPane,
//     Upload,
//     Tooltip,
//     Alert,
//     Message,
//     Loading
// } from 'element-ui'
// Vue.use(Menu)
// Vue.use(MenuItem)
// Vue.use(Button)
// Vue.use(Input)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Radio)
// Vue.use(RadioGroup)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(Row)
// Vue.use(Col)
// Vue.use(Pagination)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Tabs)
// Vue.use(TabPane)
// Vue.use(Upload)
// Vue.use(Tooltip)
// Vue.use(Alert)
// Vue.use(Message)
// Vue.use(Loading)
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
