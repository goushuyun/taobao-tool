<template lang="html">
  <div class="page">
    <div class="left_bar">
      <div class="left_top">
        <img :src="'http://image1.goushuyun.cn/goushuyun_logo.png'" class="shop_logo">
      </div>
      <div class="left_middle">
        <el-menu theme="dark" :router="true" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
          <el-menu-item index="1" :route="{name:'f_first'}"><i class="el-icon-menu"></i>一页</el-menu-item>
          <el-menu-item index="2" :route="{name:'s_first'}"><i class="el-icon-menu"></i>二页</el-menu-item>
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
        padding-right: 10px;
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
