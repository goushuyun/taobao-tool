import './assets/style/main.css'
import App from './App.vue'
import routes from './config/routes'
import vuexObj from './config/store'

const router = new VueRouter({routes})

// add google analytics
router.afterEach(function(to) {
	if (window.ga) {
		window.ga('set', 'page', to.fullPath) // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
		window.ga('send', 'pageview')
	}
})

var store = new Vuex.Store(vuexObj)

const app = new Vue({
	router: router,
	store: store,
	render: h => h(App)
}).$mount('#app')
