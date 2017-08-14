export default {
    data() {
        return {
            show_btns: false,
            user_name: ''
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
                return 'stock'
            }
        }
    },
    mounted() {
        this.checkToken()
        this.user_name = localStorage.getItem('user_name')
    },
    methods: {
        checkToken() {
            var token = localStorage.getItem('token')
            if (token == null) {
                this.$message.info('请先登录！')
                this.$router.push({
                    name: 'login'
                })
            } else {
                var index = localStorage.getItem('menu_active')
                var name = localStorage.getItem('sub_menu_active')
                this.$router.push({
                    name: name
                })
            }
        },
        menuSelect(index) {
            this.$store.commit('setMenuActive', index)
            localStorage.setItem('menu_active', index)
        },
        goToGoushuyun() {
            window.open('http://www.goushuyun.com')
        },
        signOut() {
            this.$confirm('确定要退出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'info'
            }).then(() => {
                localStorage.clear()
                this.$router.replace({
                    name: 'login'
                })
            }).catch(() => {

            });
        }
    }
}
