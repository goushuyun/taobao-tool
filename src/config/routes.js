const login = r => require(['../pages/login/login.vue'], r)
const index = r => require(['../pages/index/index.vue'], r)

// 库存
const stock = r => require(['../pages/stock/index.vue'], r)
const batch = r => require(['../pages/stock/batch/batch.vue'], r)
const single = r => require(['../pages/stock/single/single.vue'], r)
const list = r => require(['../pages/stock/list/list.vue'], r)
const out = r => require(['../pages/stock/out/out.vue'], r)
const handle_blur_data = r => require(['../pages/stock/handle_blur_data/handle_blur_data.vue'], r)
const warehouse = r => require(['../pages/stock/warehouse/warehouse.vue'], r)
const record = r => require(['../pages/stock/record/record.vue'], r)

// 图书
const book = r => require(['../pages/book/index.vue'], r)
const apply = r => require(['../pages/book/apply/apply.vue'], r)
const review = r => require(['../pages/book/review/review.vue'], r)
const maintain = r => require(['../pages/book/maintain/maintain.vue'], r)
const detail = r => require(['../pages/book/detail/detail.vue'], r)

// 设置
const setting = r => require(['../pages/setting/index.vue'], r)
const export_csv = r => require(['../pages/setting/export/export.vue'], r)

export default[
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
						path: '/stock/handle_blur_data',
						name: 'handle_blur_data',
						component: handle_blur_data
					}, {
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
						path: '/stock/warehouse',
						name: 'warehouse',
						component: warehouse,
						meta: { keepAlive: true }
					}, {
						path: '/stock/record',
						name: 'record',
						component: record
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
						name: 'book_detail',
						component: detail
					}
				]
			}, {
				path: '/setting',
				name: 'setting',
				component: setting,
				children: [
					{
						path: '/setting/export',
						name: 'export',
						component: export_csv
					}
				]
			}
		]
	}
]
