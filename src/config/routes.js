const first = r => require(['../pages/first.vue'], r)
const second = r => require(['../pages/second.vue'], r)

export default [{
  name: 'first',
  path: 'first',
  component: first
}, {
  name: 'second',
  path: 'second',
  component: second
}]
