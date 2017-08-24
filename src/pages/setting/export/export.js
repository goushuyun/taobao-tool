import axios from "../../../config/http.js"
export default {
    mounted() {
        this.$store.commit('setMenuActive', 'setting')
        localStorage.setItem('menu_active', 'setting')
        this.$store.commit('setSubMenuActive', 'export')
        localStorage.setItem('sub_menu_active', 'export')
    }
}
