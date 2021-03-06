import {
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            isbn: '',
            info_is_complete: '0',
            //0-所有图书;
            //1-搜索图书信息不完整的图书;
            //2-搜索图书信息完整的图书（检测字段：title，publisher，author，edition，price）
            //3-无书名及没价格
            //4-无图片
            goods: [], // 信息不完整的图书列表

            loading: false,
            page: 1,
            size: 10,
            total_count: 0, // 信息不完整的图书总数
            pending_gatherd_total: 0
        }
    },
    mounted() {
        this.$store.commit('setMenuActive', 'book')
        localStorage.setItem('menu_active', 'book')
        this.$store.commit('setSubMenuActive', 'maintain')
        localStorage.setItem('sub_menu_active', 'maintain')
        this.searchGoods()
        this.getPendingGatherdGoods()
    },
    methods: {
        // 获取带采集商品详情的商品数量
        getPendingGatherdGoods() {
            axios.post('/v1/stock/get_pending_gatherd_goods', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.pending_gatherd_total = resp.data.total
                }
            })
        },
        // 获取库存中信息不完整的图书列表
        searchGoods() {
            this.loading = true
            var request = {
                "page": this.page,
                "size": this.size,
                "order_by": "stock", // stock
                "sequence": "asc" // desc: 数量从大到小  asc：数量从小到大
            }
            if (this.isbn == '') {
                request.info_is_complete = this.info_is_complete
            } else if (/^978\d{10}_\d{2}$/.test(this.isbn)) {
                // 如果isbn是带有购书云编号的将其拆分成isbn和book_no两个字段
                var isbn_no = this.isbn.split('_')
                request.isbn = isbn_no[0]
                request.book_no = isbn_no[1]
                request.book_cate = 'poker'
            } else {
                request.isbn = this.isbn
            }
            axios.post('/v1/stock/search_goods', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.goods = data
                    this.loading = false
                }
            })
        },
        // 重置申请条件后重新获取
        reset() {
            this.isbn = ''
            this.page = 1
            this.size = 10
            this.searchGoods()
        },
        // 跳转到图书详情页，查看详情
        openBookDialog(index) {
            var book = this.goods[index]
            this.$router.push({
                name: 'book_detail',
                params: {
                    book
                }
            })
        },
        // 更改图书列表size后重新请求
        handleSizeChange(size) {
            this.size = size
            this.searchGoods()
        },
        // 更改图书列表page后重新请求
        handleCurrentChange(page) {
            this.page = page
            this.searchGoods()
        }
    }
}
