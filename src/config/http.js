// create axios instance
import Axios from 'axios'
import Vue from 'vue'
import conf from './basis.js'
const axios = Axios.create({
  baseURL: conf.base_url,
  headers: {
    'Content-Type': 'application/json'
  }
})

var app = new Vue()

axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token != null) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
  //update JWT
  var jwt_token = response.headers['x-jwt-token']
  if (jwt_token != undefined) {
    localStorage.setItem('token', jwt_token)
  }
  // relogin
  if (response.data.code == '11011' || response.data.code == '11012' || response.data.code == '11013' || response.data.code == '11014') {
    app.$alert('您的登录已超时，请重新登录！', '提示', {
      confirmButtonText: '确定',
      type: 'warning',
      callback: action => {
        localStorage.removeItem('token')
        window.location.href = conf.home_href
      }
    });
  }
  //handler error
  if (response.data.code != '00000') {
    app.$message.error(response.data.message)
    // return new Error(response.data.message)
  }
  return response;
}, function(error) {
  // Do something with response error
  return Promise.reject(error);
});

export default axios
