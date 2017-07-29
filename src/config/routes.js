const index = r => require(['../pages/index.vue'], r)
const first = r => require(['../pages/first/index.vue'], r)
const f_first = r => require(['../pages/first/f_first.vue'], r)
const f_second = r => require(['../pages/first/f_second.vue'], r)

const second = r => require(['../pages/second/index.vue'], r)
const s_first = r => require(['../pages/second/s_first.vue'], r)
const s_second = r => require(['../pages/second/s_second.vue'], r)

export default [{
  path: '/',
  name: 'index',
  component: index,
  children: [{
    path: '/first',
    name: 'first',
    component: first,
    children: [{
      path: '/first/f_first',
      name: 'f_first',
      component: f_first
    }, {
      path: '/first/f_second',
      name: 'f_second',
      component: f_second
    }]
  }, {
    path: '/second',
    name: 'second',
    component: second,
    children: [{
      path: '/second/s_first',
      name: 's_first',
      component: s_first
    }, {
      path: '/second/s_second',
      name: 's_second',
      component: s_second
    }]
  }]
}]
