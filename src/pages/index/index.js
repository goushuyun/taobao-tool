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
    mounted() {
        this.checkToken()
    },
    methods: {
        checkToken() {
            var token = localStorage.getItem('token')
            if (token == null) {
                this.$message.info('请先登录！')
                this.$router.replace({
                    name: 'login'
                })
            } else {
                this.$router.replace({
                    name: 'batch'
                })
            }
        },
        menuSelect(index) {
            this.$store.commit('setMenuActive', index)
            localStorage.setItem('menu_active', index)
        }
    }
}
