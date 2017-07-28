<template>
  <div id="app">
    <img src="./assets/image/logo.png">
    <h1>{{ msg }}</h1>
    <p>
      <router-link :to="{ name: 'first', params: {} }">First</router-link>
    </p>
    <p>
      <router-link :to="{ name: 'second', params: {} }">Second</router-link>
    </p>
    <p>
      <router-view></router-view>
    </p>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
}
</style>
