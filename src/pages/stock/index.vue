<template lang="html">
  <div class="container">

    <div class="sec_left_bar">
      <div class="title">库存管理</div>
      <div class="menu">
        <el-menu :router="true" :default-active="sub_menu_active" class="el-menu-vertical-demo" @select="subMenuSelect">
          <el-menu-item index="out" :route="{name:'out'}">图书出库</el-menu-item>
          <el-menu-item index="batch" :route="{name:'batch'}">批量上架</el-menu-item>
          <el-menu-item index="single" :route="{name:'single'}">单本上架</el-menu-item>
          <el-menu-item index="list" :route="{name:'list'}">库存查看</el-menu-item>
          <el-menu-item index="setting" :route="{name:'setting'}">仓库查看</el-menu-item>
          <el-menu-item index="record" :route="{name:'record'}">操作记录</el-menu-item>
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
                return 'out'
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
