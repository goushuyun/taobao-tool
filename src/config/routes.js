const login = r => require(['../pages/login/login.vue'], r)
const index = r => require(['../pages/index/index.vue'], r)

// 库存
const stock = r => require(['../pages/stock/index.vue'], r)
const batch = r => require(['../pages/stock/batch/batch.vue'], r)
const single = r => require(['../pages/stock/single/single.vue'], r)
const list = r => require(['../pages/stock/list/list.vue'], r)
const out = r => require(['../pages/stock/out/out.vue'], r)
const setting = r => require(['../pages/stock/setting/setting.vue'], r)
const choo_book_dialog = r => require(['../component/choose_book/choose_book.vue'], r)

// 图书
const book = r => require(['../pages/book/index.vue'], r)
const apply = r => require(['../pages/book/apply/apply.vue'], r)
const review = r => require(['../pages/book/review/review.vue'], r)
const maintain = r => require(['../pages/book/maintain/maintain.vue'], r)
const detail = r => require(['../pages/common/detail/detail.vue'], r)

export default[
	{
		path : '/choo_book_dialog',
		name : 'choo_book_dialog',
		component : choo_book_dialog
	}, {
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
					}, {
						path: '/stock/detail',
						name: 'detail',
						component: detail
					}
				]
			}, {
				path: '/book',
				name: 'book',
				component: book,
				children: [
					{
						path: '/book/maintain',
						name: 'maintain',
						component: maintain
					}, {
						path: '/book/apply',
						name: 'apply',
						component: apply
					}, {
						path: '/book/review',
						name: 'review',
						component: review
					}, {
						path: '/book/detail',
						name: 'detail',
						component: detail
					}
				]
			}
		]
	}
]
