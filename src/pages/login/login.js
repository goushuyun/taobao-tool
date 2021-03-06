import {
    testMobile,
    testPassword,
    testMsgCode
} from '../../assets/script/utils.js'
import axios from "../../config/http.js"

export default {
    data() {
        var checkMobile = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号码不能为空'));
            }
            if (!testMobile(value)) {
                callback(new Error('请输正确的手机号码'));
            } else {
                callback();
            }
        };

        var checkPassword = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('密码不能为空'));
            }
            if (!testPassword(value)) {
                callback(new Error('请输入6-20英文字母或数字组合'));
            } else {
                callback();
            }
        };

        var checkMessageCode = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('验证码不能为空'));
            }
            if (!testMsgCode(value)) {
                callback(new Error('验证码格式不正确'));
            } else {
                callback();
            }
        };
        return {
            activeName: 'sign_in',
            forgetPwd: false,
            btn_loading: false,

            /* 倒计时 */
            register_timer_second: 60,
            registe_timer_disabled: false,
            // update_pwd_timer_second: 60,
            // update_pwd_timer_disabled: false,

            sign: {
                mobile: '',
                password: '',
                message_code: '',
                username: ''
            },

            rules: {
                mobile: [{
                    validator: checkMobile,
                    trigger: 'blur'
                }],
                password: [{
                    validator: checkPassword,
                    trigger: 'blur'
                }],
                message_code: [{
                    validator: checkMessageCode,
                    trigger: 'blur'
                }],
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 20,
                        message: '长度在 1 到 20 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    mounted() {
        if (this.$route.name == 'relogin') {
            this.$notify({
                title: '提示',
                message: '您的登录已超时，请重新登录！',
                type: 'warning'
            });
        }
        if (this.checkToken() === false) {
            $('.mobile input').focus()
        }
    },
    methods: {
        checkToken() {
            var token = localStorage.getItem('token')
            if (token == null) {
                return false
            } else {
                this.$message.info('已经登录了！')
                this.$router.replace({
                    name: 'index'
                })
            }
        },
        handleClick(tab, e) {
            this.activeName = tab.name
            this.sign.password = ''
            this.sign.message_code = ''
            this.forgetPwd = false
        },
        signIn(formName) {
            // if (this.forgetPwd) {
            //   axios.post('/v1/seller/update_password', {
            //     mobile: this.sign.mobile,
            //     password: this.sign.password,
            //     message_code: this.sign.message_code
            //   }).then(resp => {
            //     if (resp.data.message == 'ok') {
            //       this.$message.success("密码已更改")
            //       this.forgetPwd = false
            //       this.login(formName)
            //     } else {
            //       this.$message.error("密码更改失败")
            //       return
            //     }
            //   })
            // }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btn_loading = true
                    axios.post('/v1/users/login', {
                        mobile: this.sign.mobile,
                        password: this.sign.password
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            //login success
                            //put token into localStorage
                            localStorage.setItem("token", resp.data.token)
                            localStorage.setItem("user_id", resp.data.data.id)
                            localStorage.setItem("user_name", resp.data.data.name)
                            localStorage.setItem("create_at", resp.data.data.create_at)
                            if (resp.data.data.role == '256') {
                                localStorage.setItem("role", '256')
                            }
                            //put adminInfo into admin
                            // localStorage.setItem('adminInfo', JSON.stringify(resp.data.data))
                            this.$router.push({
                                name: 'out'
                            })
                        } else if (resp.data.message == 'not_found') {
                            this.$message.error("用户名或密码错误")
                            $('.mobile input').focus()
                        }
                        this.btn_loading = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        checkSignUp() {
            if (testMobile(this.sign.mobile)) {
                axios.post('/v1/users/check_user_exist', {
                    "mobile": this.sign.mobile
                }).then(resp => {
                    if (resp.data.message == 'not_exist' && this.activeName == 'sign_in') {
                        this.$message.info("用户名不存在，请注册！")
                        this.activeName = 'sign_up'
                    }
                    if (resp.data.message == 'exist' && this.activeName == 'sign_up') {
                        this.$message.info("用户名已存在，请登录！")
                        this.activeName = 'sign_in'
                        this.forgetPwd = false
                    }
                })
            }
        },
        signUp(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btn_loading = true
                    axios.post('/v1/users/register', {
                        mobile: this.sign.mobile,
                        password: this.sign.password,
                        checkcode: this.sign.message_code,
                        name: this.sign.username
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.signIn(formName)
                        } else if (resp.data.message == 'checkcode_expired') {
                            this.$message.info("验证码过期！")
                        } else if (resp.data.message == 'checkcode_error') {
                            this.$message.warning("验证码错误！")
                        }
                        this.btn_loading = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getMessageCode(type) {
            if (!testMobile(this.sign.mobile)) {
                console.log(this.sign.mobile);
                this.$message.error('手机号码格式不正确！')
                return
            }
            console.log(type);
            if (type == 'register') {
                axios.post('/v1/sms/send_identifying_code', {
                    mobile: this.sign.mobile
                }).then(resp => {
                    if (resp.data.code != '00000') {
                        this.$message.error("获取验证码失败，请重试！")
                    }
                    // if (resp.data.message == 'exist') {
                    //   this.$message.info("该用户已被注册！")
                    // }
                    if (resp.data.message == 'ok') {
                        this.$message.info("已发送，请查收短信！")
                        this.registe_timer_disabled = true
                        this.timer(type)
                    }
                })
            }

            // if (type == 'update_pwd') {
            //     axios.post('/v1/sms/send_identifying_code', {
            //         mobile: this.sign.mobile
            //     }).then(resp => {
            //         if (resp.data.code != '00000') {
            //             this.$message.error("获取验证码失败，请重试！")
            //         }
            //         if (resp.data.message == 'needRegister') {
            //           this.$message.info("用户名不存在，请注册！")
            //           this.activeName = 'sign_up'
            //         }
            //         if (resp.data.message == 'ok') {
            //             this.$message.info("已发送，请查收短信！")
            //             this.update_pwd_timer_disabled = true
            //             this.timer(type)
            //         }
            //     })
            // }
        },
        timer(type) {
            var self = this
            if (type == 'register') {
                if (self.register_timer_second > 0) {
                    self.register_timer_second--;
                    setTimeout(function() {
                        self.timer(type)
                    }, 1000);
                } else {
                    self.registe_timer_disabled = false
                }
            }
            // if (type == 'update_pwd') {
            //     if (self.update_pwd_timer_second > 0) {
            //         self.update_pwd_timer_second--;
            //         setTimeout(function() {
            //             self.timer(type)
            //         }, 1000);
            //     } else {
            //         self.update_pwd_timer_disabled = false
            //     }
            // }
        }
    }
}
