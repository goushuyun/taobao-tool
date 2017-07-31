const index = r => require(['../pages/index.vue'], r)
const stock = r => require(['../pages/stock/index.vue'], r)
const batch = r => require(['../pages/stock/batch.vue'], r)
const single = r => require(['../pages/stock/single.vue'], r)
const list = r => require(['../pages/stock/list.vue'], r)
const out = r => require(['../pages/stock/out.vue'], r)

export default [{
  path: '/',
  name: 'index',
  component: index,
  children: [{
    path: '/stock',
    name: 'stock',
    component: stock,
    children: [{
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
    }]
  }]
}]
