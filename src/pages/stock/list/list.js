import {
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            input: '',
            select: 'isbn',
            goods: [],
            remark_dialog: {
                index: 0,
                visible: false,
                update_remark: ''
            },
            loading: false,
            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.searchGoods()
    },
    methods: {
        searchGoods() {
            this.loading = true
            var request = {
                "page": this.page,
                "size": this.size,
                "order_by": "stock", // stock
                "sequence": "asc" // desc: 数量从大到小  asc：数量从小到大
            }
            if (this.select === 'greater' || this.select === 'less') {
                request['compare'] = this.select
                request['stock'] = this.input
            } else if (this.select === 'isbn') {
                var reg = /^978\d{10}_\d{2}$/
                if (reg.test(this.input)) {
                    var isbn_no = this.input.split('_')
                    request.isbn = isbn_no[0]
                    request.book_no = isbn_no[1]
                    request.book_cate = 'poker'
                } else {
                    request.isbn = this.input
                }
            } else {
                request[this.select] = this.input
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
        reset() {
            this.input = ''
            this.select = 'isbn'
            this.page = 1
            this.size = 10
            this.searchGoods()
        },
        openRemarkDialog(index) {
            this.remark_dialog.index = index
            this.remark_dialog.update_remark = this.goods[index].remark
            this.remark_dialog.visible = true
        },
        comfirmUpdateRemark() {
            var index = this.remark_dialog.index
            var good = this.goods[index]
            if (this.remark_dialog.update_remark == good.remark) {
                this.$message.warning('您没有做任何改动')
                return
            }
            axios.post('/v1/stock/update_goods_info', {
                "goods_id": good.goods_id, //required
                "remark": this.remark_dialog.update_remark //required
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('修改成功')
                    this.goods[index].remark = this.remark_dialog.update_remark
                    this.remark_dialog.visible = false
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
            this.searchGoods()
        },
        handleCurrentChange(page) {
            this.page = page
            this.searchGoods()
        }
    }
}
