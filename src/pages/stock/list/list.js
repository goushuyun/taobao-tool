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
            pending_gatherd_total: 0,

            setting_info: {}
        }
    },
    mounted() {
        this.$store.commit('setMenuActive', 'stock')
        localStorage.setItem('menu_active', 'stock')
        this.$store.commit('setSubMenuActive', 'list')
        localStorage.setItem('sub_menu_active', 'list')
        this.searchGoods()
        this.getPendingGatherdGoods()
        this.getSetting()
    },
    methods: {
        handleCommand(command) {
            switch (command) {
                case 'export':
                    this.exportCSV()
                    break;
                case 'setting':
                    this.$router.push({
                        name: 'csv_setting'
                    })
                    break;
                case 'record':
                    this.$router.push({
                        name: 'csv_record'
                    })
                    break;
                default:
                    break;
            }
        },
        getSetting() {
            axios.post('/v1/stock/get_taobao_setting', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    var setting_info = {
                        id: data.id,
                        product_title: data.product_title,
                        province: data.province,
                        city: data.city,
                        discount: data.discount,
                        supplemental_fee: data.supplemental_fee,
                        reduce_stock_style: data.reduce_stock_style,
                        product_describe: data.product_describe
                    }
                    if (data.pingyou_fee || data.express_fee || data.ems_fee) {
                        setting_info.pingyou_fee = data.pingyou_fee
                        setting_info.express_fee = data.express_fee
                        setting_info.ems_fee = data.ems_fee
                        setting_info.express_type = '0'
                    } else if (data.express_template) {
                        setting_info.express_template = data.express_template
                        setting_info.express_type = '1'
                    } else {
                        setting_info.express_type = '2'
                    }
                    this.setting_info = setting_info
                }
            })
        },
        exportCSV() {
            if (this.setting_info.product_title == '') {
                this.$confirm('首次导出 CSV 之前需要进行导出设置！', '提示', {
                    confirmButtonText: '去设置',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.handleCommand('setting')
                }).catch(() => {});
            } else {
                var request = {
                    "page": this.page,
                    "size": this.size,
                    "order_by": "stock", // stock
                    "sequence": "asc" // desc: 数量从大到小  asc：数量从小到大
                }
                if (this.select === 'greater' || this.select === 'less') {
                    if (this.input == '') {
                        this.$message.warning('请输入库存量！')
                        return
                    }
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
                        var exportCondition = this.getExportCondition(request)
                        this.$confirm('您将导出' + exportCondition + '库存数据，共 ' + this.total_count + ' 条！' + (this.total_count == 0 ? '请重新输入筛选条件！' : ''), '提示', {
                            confirmButtonText: this.total_count == 0 ? '确定' : '导出',
                            cancelButtonText: '取消',
                            showCancelButton: this.total_count != 0,
                            type: 'info'
                        }).then(() => {
                            if (this.total_count == 0) {
                                return
                            }
                            var request1 = {
                                "discount": this.setting_info.discount, //required   45=4.5折
                                "supplemental_fee": this.setting_info.supplemental_fee, //required
                                "province": this.setting_info.province, //required
                                "city": this.setting_info.city, //required
                                "product_title": this.setting_info.product_title,
                                "product_describe": this.setting_info.product_describe,
                                "reduce_stock_style": this.setting_info.reduce_stock_style //required 1拍下减库存   2 付款减库存
                            }

                            if (this.setting_info.pingyou_fee || this.setting_info.express_fee || this.setting_info.ems_fee) {
                                request1.pingyou_fee = this.setting_info.pingyou_fee
                                request1.express_fee = this.setting_info.express_fee
                                request1.ems_fee = this.setting_info.ems_fee
                            } else if (this.setting_info.express_template) {
                                request1.express_template = this.setting_info.express_template
                            }

                            // 检索条件
                            if (this.select === 'greater' || this.select === 'less') {
                                request1['compare'] = this.select
                                request1['stock'] = this.input
                            } else if (this.select === 'isbn') {
                                var reg = /^978\d{10}_\d{2}$/
                                if (reg.test(this.input)) {
                                    var isbn_no = this.input.split('_')
                                    request1.isbn = isbn_no[0]
                                    request1.book_no = isbn_no[1]
                                    request1.book_cate = 'poker'
                                } else {
                                    request1.isbn = this.input
                                }
                            } else {
                                request1[this.select] = this.input
                            }

                            axios.post('/v1/stock/export_taobao_csv', request1).then(resp => {
                                if (resp.data.message == 'ok') {
                                    this.$message.success('导出CSV请求已提交！')
                                    this.handleCommand('record')
                                }
                            })
                        }).catch(() => {});
                    }
                })
            }
        },
        getExportCondition(data) {
            var condition = ''
            if (data.isbn) {
                condition = '“ISBN为 ' + data.isbn
                if (data.book_no) {
                    condition += '_' + data.book_no
                }
                condition += '”的'
            } else if (data.title) {
                condition = '“书名为 ' + data.title + '”的'
            } else if (data.author) {
                condition = '“作者为 ' + data.author + '”的'
            } else if (data.publisher) {
                condition = '“出版社为 ' + data.publisher + '”的'
            } else if (data.compare && data.stock) {
                if (data.compare === 'greater') {
                    condition = '“库存量大于等于 ' + data.stock + '”的'
                } else if (data.compare === 'less') {
                    condition = '“库存量小于 ' + data.stock + '”的'
                }
            } else {
                condition = '全部'
            }
            return condition
        },
        exportExcel() {
            var request = {
                "page": this.page,
                "size": this.size,
                "order_by": "stock", // stock
                "sequence": "asc" // desc: 数量从大到小  asc：数量从小到大
            }
            if (this.select === 'greater' || this.select === 'less') {
                if (this.input == '') {
                    this.$message.warning('请输入库存量！')
                    return
                }
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
                    var exportCondition = this.getExportCondition(request)
                    this.$confirm('您将导出' + exportCondition + '库存数据，共 ' + this.total_count + ' 条！' + (this.total_count == 0 ? '请重新输入筛选条件！' : ''), '提示', {
                        confirmButtonText: this.total_count == 0 ? '确定' : '导出',
                        cancelButtonText: '取消',
                        showCancelButton: this.total_count != 0,
                        type: 'info'
                    }).then(() => {
                        if (this.total_count == 0) {
                            return
                        }
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
            var request = {
                "page": this.page,
                "size": this.size,
                "order_by": "stock", // stock
                "sequence": "asc" // desc: 数量从大到小  asc：数量从小到大
            }
            if (this.select === 'greater' || this.select === 'less') {
                if (this.input == '') {
                    this.$message.warning('请输入库存量！')
                    return
                }
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
            this.loading = true
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
