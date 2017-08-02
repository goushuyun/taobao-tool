<template lang="html">
  <div class="page">
    <div class="left_bar">
      <div class="left_top">
        <img :src="'http://image1.goushuyun.cn/goushuyun_logo.png'" class="shop_logo">
      </div>
      <div class="left_middle">
        <el-menu theme="dark" :router="true" :default-active="menu_active" class="el-menu-vertical-demo" @select="menuSelect">
          <el-menu-item index="1" :route="{name:'batch'}"><i class="fa fa-book" aria-hidden="true"></i>库存</el-menu-item>
        </el-menu>
      </div>
      <transition name="el-zoom-in-center">
        <div v-show="show_btns" class="left_bottom" @mouseleave="show_btns = false">
          <div class="btn_area" @click="">
            <img src="http://okxy9gsls.bkt.clouddn.com/gsy_btn.png">
          </div>
          <div class="btn_area" @click="">
            <i class="fa fa-arrow-left icon" aria-hidden="true"></i>
          </div>
          <div class="btn_area" @click="">
            <i class="fa fa-power-off icon" aria-hidden="true"></i>
          </div>
        </div>
      </transition>
      <transition name="el-zoom-in-center">
        <div v-show="!show_btns" class="left_bottom" @mouseover="show_btns = true">
          <div class="username">
            {{user_name}}
          </div>
        </div>
      </transition>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_btns: false,
      user_name: '冯忠森'
    }
  },
  computed: {
    menu_active() {
      let vuex_active = this.$store.state.menu_active
      let local_active = localStorage.getItem('menu_active')
      if (vuex_active) {
        return vuex_active
      } else if (local_active) {
        return local_active
      } else {
        return '1'
      }
    }
  },
  methods: {
    menuSelect(index) {
      this.$store.commit('setMenuActive', index)
      localStorage.setItem('menu_active', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
    height: 100%;
    font-size: 14px;
    .left_bar {
        .left_top {
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;

            .shop_logo {
                width: 34px;
                height: 34px;
                border-radius: 50%;
            }
        }

        .left_middle {
            i.icon {
                color: white;
                font-size: 13px;
                padding: 0 8px;
            }

            i.fa {
                width: 14px;
                padding-right: 6px;
            }
        }

        .left_bottom {
            position: absolute;
            bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: #FFFFFF;

            .btn_area {
                height: 22px;
                width: 22px;
                line-height: 22px;
                border-radius: 50px;
                border: 1px solid #FFFFFF;
                text-align: center;

                img {
                    height: 22px;
                    width: 22px;
                }
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
