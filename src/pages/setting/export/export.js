import axios from "../../../config/http.js"
export default {
    data() {
        return {
            form: {
                title: '',
                title_range: ['title'],
                discount: '', //折扣
                supplemental_fee: '', // 额外费用
                province: '', // 省份
                city: '', // 城市
                express_type: '2',
                express_template: '', // 运费模板
                pingyou_fee: '', // 平邮费用
                express_fee: '', // 快递费用
                ems_fee: '', // EMS费用
                reduce_stock_style: '1' // --1 拍下减库存 2 付款减库存
            },
            form2: {
                prepend: '',
                append: ''
            }
        }
    },
    mounted() {
        this.$store.commit('setMenuActive', 'setting')
        localStorage.setItem('menu_active', 'setting')
        this.$store.commit('setSubMenuActive', 'export')
        localStorage.setItem('sub_menu_active', 'export')
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        goTOStockList() {
            this.$router.push({
                name: 'list'
            })
        }
    }
}
