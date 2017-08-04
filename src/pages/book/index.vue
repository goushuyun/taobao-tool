<template lang="html">
  <div class="container">
    <div class="sec_left_bar">
      <div class="title">图书维护</div>
      <div class="menu">
        <el-menu :router="true" :default-active="sub_menu_active" class="el-menu-vertical-demo" @select="subMenuSelect">
          <el-menu-item index="2-1" :route="{name:'maintain'}">信息维护</el-menu-item>
          <el-menu-item index="2-2" :route="{name:'review'}">等待审核</el-menu-item>
          <el-menu-item index="2-3" :route="{name:'apply'}">申请列表</el-menu-item>
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
    computed: {
        sub_menu_active() {
            let vuex_active = this.$store.state.sub_menu_active
            let local_active = localStorage.getItem('sub_menu_active')
            if (vuex_active) {
                return vuex_active
            } else if (local_active) {
                return local_active
            } else {
                return '2-1'
            }
        }
    },
    methods: {
        subMenuSelect(index) {
            this.$store.commit('setSubMenuActive', index)
            localStorage.setItem('sub_menu_active', index)
        }
    }
}
</script>

<style lang="css">
</style>
