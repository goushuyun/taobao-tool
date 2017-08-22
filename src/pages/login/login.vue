<template lang="html">
  <div class="container">
      <div class="top_part">
          <div id="login_box">
              <img class="logo" src="../../assets/image/tb_gsy_login.png" alt="logo">
              <div class="tabs">
                  <el-tabs v-model="activeName" @tab-click="handleClick"  style="width:120px;">
                      <el-tab-pane label="登录" name="sign_in"></el-tab-pane>
                      <el-tab-pane label="注册" name="sign_up"></el-tab-pane>
                  </el-tabs>
              </div>
              <el-row type="flex" justify="center">
                  <el-col :span="24">
                      <el-form :model="sign" :rules="rules" ref="sign">
                          <div v-if="activeName=='sign_up'">
                              <el-form-item prop="mobile">
                                  <el-input class="mobile" size="small" placeholder="手机号码" v-model="sign.mobile" @blur="checkSignUp"></el-input>
                              </el-form-item>
                              <el-form-item prop="message_code">
                                  <el-input placeholder="短信验证码" size="small" v-model="sign.message_code">
                                      <el-button slot="append" style="width:100px" @click="getMessageCode('register')" :disabled="registe_timer_disabled">
                                          <span v-show="!registe_timer_disabled">获取验证码</span>
                                          <span v-show="registe_timer_disabled">（{{register_timer_second}}s）</span>
                                      </el-button>
                                  </el-input>
                              </el-form-item>
                              <el-form-item prop="username">
                                  <el-input placeholder="姓名" size="small" v-model="sign.username"></el-input>
                              </el-form-item>
                              <el-form-item prop="password">
                                  <el-input placeholder="设置密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signUp('sign')"></el-input>
                              </el-form-item>
                              <el-form-item>
                                  <el-button style="width: 100%;" size="small" type="primary" :loading="btn_loading" @click="signUp('sign')">立即注册</el-button>
                              </el-form-item>
                          </div>
                          <div v-if="activeName=='sign_in'">
                              <el-form-item prop="mobile">
                                  <el-input class="mobile" size="small" placeholder="手机号码" v-model="sign.mobile" @blur="checkSignUp"></el-input>
                              </el-form-item>
                              <el-form-item prop="password" v-show="!forgetPwd">
                                  <el-input placeholder="登录密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signIn('sign')"></el-input>
                              </el-form-item>
                              <!-- <el-form-item prop="message_code" v-if="forgetPwd">
                                  <el-input placeholder="短信验证码" size="small" v-model="sign.message_code">
                                      <el-button slot="append" style="width:100px" @click="getMessageCode('update_pwd')" :disabled="update_pwd_timer_disabled">
                                          <span v-show="!update_pwd_timer_disabled">获取验证码</span>
                                          <span v-show="update_pwd_timer_disabled">（{{update_pwd_timer_second}}s）</span>
                                      </el-button>
                                  </el-input>
                              </el-form-item>
                              <el-form-item prop="password" v-if="forgetPwd">
                                  <el-input placeholder="新密码" size="small" type="password" v-model="sign.password" @keyup.enter.native="signIn('sign')"></el-input>
                              </el-form-item> -->
                              <el-form-item style="text-align:left">
                                  <el-button style="width: 100%;" size="small" type="primary" :loading="btn_loading" @click="signIn('sign')">立即登录</el-button>
                                  <!-- <el-button v-show="!forgetPwd" size="small" type="text" @click="forgetPwd=true;sign.password=''">忘记密码？</el-button>
                                  <el-button v-show="forgetPwd" size="small" type="text" @click="forgetPwd=false">密码登录</el-button> -->
                              </el-form-item>
                          </div>
                      </el-form>
                  </el-col>
              </el-row>
          </div>
      </div>
      <!-- 底部信息条 -->
      <el-row class="bottom_bar">
          <el-col :span="24">© 2017 购书云 版权所有 沪ICP备15022838号-2 </el-col>
      </el-row>
  </div>
</template>

<script>
import mixin from "./login.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./login.scss"
</style>
