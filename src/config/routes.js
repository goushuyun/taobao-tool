const login = r => require(['../pages/login/login.vue'], r)
const index = r => require(['../pages/index/index.vue'], r)
const stock = r => require(['../pages/stock/index.vue'], r)
const batch = r => require(['../pages/stock/batch/batch.vue'], r)
const single = r => require(['../pages/stock/single/single.vue'], r)
const list = r => require(['../pages/stock/list/list.vue'], r)
const out = r => require(['../pages/stock/out/out.vue'], r)
const book = r => require(['../pages/stock/book/book.vue'], r)
const setting = r => require(['../pages/stock/setting/setting.vue'], r)
const choo_book_dialog = r => require(['../component/choose_book/choose_book.vue'], r)

export default[
    {
        path: '/choo_book_dialog',
        name: 'choo_book_dialog',
        component: choo_book_dialog
    },
	{
		path : '/login',
		name : 'login',
		component : login
	}, {
		path : '/',
		name : 'index',
		component : index,
		children : [
			{
				path: '/stock',
				name: 'stock',
				component: stock,
				children: [
					{
						path: '/stock/batch',
						name: 'batch',
						component: batch
					}, {
						path: '/stock/single',
						name: 'single',
						component: single
					}, {
						path: '/stock/list',
						name: 'list',
						component: list
					}, {
						path: '/stock/out',
						name: 'out',
						component: out
					}, {
						path: '/stock/book',
						name: 'book',
						component: book
					}, {
						path: '/stock/setting',
						name: 'setting',
						component: setting
					}
				]
			}
		]
	}
]
