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
        localStorage.removeItem('token')
        window.location.href = (conf.environment == 'dev' ? 'http://localhost:8080/' : conf.base_url) + '#/relogin'
    }
    //handler error
    if (conf.environment == 'dev' && response.data.code != '00000') {
        app.$message.error(response.data.message)
    }
    return response;
}, function(error) {
    return Promise.reject(error);
});

export default axios
