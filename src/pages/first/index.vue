<template lang="html">
  <div class="container">
    <div class="sec_left_bar">
      <div class="title">
        测试页一
      </div>
      <div class="menu">
        <el-menu :router="true" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-menu-item index="1" :route="{name:'f_first'}">子菜单一</el-menu-item>
          <el-menu-item index="2" :route="{name:'f_second'}">子菜单二</el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="sec_content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {    
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="css">
</style>
