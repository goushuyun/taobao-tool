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
                var index = localStorage.getItem('menu_active')
                var name = 'batch'
                if (index === '1') {
                    name = 'batch'
                } else if (index === '2') {
                    name = 'maintain'
                }
                this.$router.replace({
                    name: name
                })
            }
        },
        menuSelect(index) {
            this.$store.commit('setMenuActive', index)
            localStorage.setItem('menu_active', index)
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
