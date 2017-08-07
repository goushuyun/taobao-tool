import {
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            isbn: '',
            goods: [],

            loading: false,
            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.$store.commit('setSubMenuActive', '2-1')
        this.searchGoods()
    },
    methods: {
        searchGoods() {
            this.loading = true
            var request = {
                "isbn": this.isbn,
                "page": this.page,
                "size": this.size,
                "order_by": "stock", // stock
                "sequence": "asc", // desc: 数量从大到小  asc：数量从小到大
                "info_is_complete": 1
            }
            axios.post('/v1/stock/search_goods', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.goods = data
                    this.loading = false
                }
            })
        },
        openBookDialog(index) {
            var book = this.goods[index]
            this.$router.push({
                name: 'detail',
                params: {
                    book
                }
            })
        },
        handleSizeChange(size) {
            this.size = size
        },
        handleCurrentChange(page) {
            this.page = page
        }
    }
}
