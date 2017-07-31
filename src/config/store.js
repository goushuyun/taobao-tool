export default {
  state: {
    menu_active: '', //菜单的默认选中项（页面未通过菜单跳转则，跳转后菜单项未“高亮”）
    sub_menu_active: ''
  },
  mutations: {
    setMenuActive(state, menu_active) {
      state.menu_active = menu_active
    },
    setSubMenuActive(state, sub_menu_active) {
      state.sub_menu_active = sub_menu_active
    }
  }
}
