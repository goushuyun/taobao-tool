<style lang="scss" scoped>

@import "./index.scss";

</style>

<template lang="html">

<div class="page">
    <div class="left_bar">
        <div class="left_top">
            <img :src="'http://image1.goushuyun.cn/goushuyun_logo.png'" class="shop_logo">
        </div>
        <div class="left_middle">
            <el-menu theme="dark" :router="true" :default-active="menu_active" class="el-menu-vertical-demo" @select="menuSelect">
                <el-menu-item index="stock" :route="{name:'out'}"><i class="fa fa-book" aria-hidden="true"></i>库存</el-menu-item>
                <el-menu-item index="book" :route="{name:'maintain'}"><i class="fa fa-cogs" aria-hidden="true"></i>图书</el-menu-item>
            </el-menu>
        </div>
        <transition name="el-zoom-in-center">
            <div v-show="show_btns" class="left_bottom" @mouseleave="show_btns = false">
                <div class="btn_area" title="官网" @click="goToGoushuyun">
                    <img src="http://okxy9gsls.bkt.clouddn.com/gsy_btn.png">
                </div>
                <div class="btn_area" title="退出系统" @click="signOut">
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
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</div>

</template>

<script>

import mixin from "./index.js"
export default {
    mixins: [mixin]
}

</script>
