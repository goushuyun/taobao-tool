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
            exprot_excel_loading: false,
            forecast_time: '',
            actual_time: '0 分 0 秒',

            page: 1,
            size: 10,
            total_count: 0,
            pending_gatherd_total: 0
        }
    },
    mounted() {
        this.$store.commit('setMenuActive', 'stock')
        localStorage.setItem('menu_active', 'stock')
        this.$store.commit('setSubMenuActive', 'list')
        localStorage.setItem('sub_menu_active', 'list')
        this.searchGoods()
        this.getPendingGatherdGoods()
    },
    methods: {
        handleCommand(command) {
            if (command === 'exoprt_csv') {
                this.$router.push({
                    name: 'export'
                })
            }
        },
        exportExcel() {
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

                    var seconds = parseInt(this.total_count / 280)
                    this.forecast_time = parseInt(seconds / 60) + ' 分 ' + parseInt(seconds % 60) + ' 秒 '

                    this.goods = data
                    this.$confirm('即将导出当前筛选条件下的 ' + this.total_count + ' 条数据，预计要需 ' + this.forecast_time + ' ，请耐心等待，点击导出继续！', '提示', {
                        confirmButtonText: '导出',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.exprot_excel_loading = true
                        var actual_time = 0
                        var self = this
                        var nIntervId = setInterval(function() {
                            if (self.exprot_excel_loading) {
                                actual_time += 1
                                self.actual_time = parseInt(actual_time / 60) + ' 分 ' + parseInt(actual_time % 60) + ' 秒 '
                            } else {
                                clearInterval(nIntervId);
                            }
                        }, 1000);
                        request.size_limit = "none"
                        axios.post('/v1/stock/search_goods', request).then(resp => {
                            if (resp.data.message == 'ok') {
                                var data = resp.data.data
                                data.unshift({
                                    isbn: 'ISBN',
                                    book_no: '',
                                    title: '书名',
                                    publisher: '出版社',
                                    author: '作者',
                                    price: '原价',
                                    stock: '库存'
                                })
                                alasql.fn.handleISBN = function(isbn, book_no) {
                                    return (book_no != '' && book_no != '00') ? (isbn + '_' + book_no) : isbn
                                }
                                alasql.fn.handlePrice = priceFloat
                                var filename = '库存导出_' + moment().format('YYYYMMDDHHmmss') + '.xlsx'
                                try {
                                    alasql("SELECT handleISBN(isbn, book_no) as isbn, title, publisher, author, handlePrice(price) as price, stock INTO XLSX('" + filename + "', {headers:false}) FROM ? ", [data]);
                                } catch (e) {
                                    console.log(e);
                                    this.$message.error('导出失败，请稍后重试！')
                                } finally {
                                    this.exprot_excel_loading = false
                                }
                            }
                        })
                    }).catch(() => {
                        this.exprot_excel_loading = false
                    });
                } else {
                    this.exprot_excel_loading = false
                }
            })

        },
        // 获取带采集商品详情的商品数量
        getPendingGatherdGoods() {
            axios.post('/v1/stock/get_pending_gatherd_goods', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    this.pending_gatherd_total = resp.data.total
                }
            })
        },
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
        },
        exportCSV() {
            this.$message({
                type: 'info',
                message: '该功能即将上线!'
            });
        }
    }
}
