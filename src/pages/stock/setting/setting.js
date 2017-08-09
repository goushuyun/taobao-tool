import {
    priceFloat,
    priceInt,
    unique
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            warehouse: '',
            shelf: '',
            floor: '',
            shelf_disabled: true,
            floor_disabled: true,
            location_id: '',
            locations: [],
            // 检测位置是否变化，变了就去获取get_location_id，不变就不获取
            to_get_location_id: false,

            loading: false,
            page: 1,
            size: 10,
            total: 0, //总库存量
            total_count: 0,

            input: '',
            select: 'isbn',
            goods: [],
            goods_page: 1,
            goods_size: 10,
            goods_total_count: 0,

            show_detail: false
        }
    },
    mounted() {
        this.getLocationStock()
    },
    watch: {
        warehouse(value) {
            if (value) {
                this.shelf_disabled = false
                this.to_get_location_id = true
            } else {
                this.shelf_disabled = true
                this.to_get_location_id = false
            }
            this.shelf = ''
            this.getLocationStock()
        },
        shelf(value) {
            if (value) {
                this.floor_disabled = false
                this.to_get_location_id = true
            } else {
                this.floor_disabled = true
                this.to_get_location_id = false
            }
            this.floor = ''
            this.getLocationStock()
        },
        floor(value) {
            if (value) {
                this.to_get_location_id = true
            }
            this.to_get_location_id = true
            this.getLocationStock()
        }
    },
    methods: {
        getLocationStock() {
            axios.post('/v1/stock/get_location_stock', {
                "warehouse": this.warehouse, //仓库名称 optional
                "shelf": this.shelf, //货架名称 optional
                "floor": this.floor, //层数 optional
                "page": this.page,
                "size": this.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.total = resp.data.total
                    this.total_count = resp.data.total_count
                    this.locations = data
                }
            })
        },
        queryWarehouse(query, cb) {
            axios.post('/v1/stock/location_fazzy_query', {
                "warehouse": ""
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    var list = []
                    data.forEach(el => {
                        list.push(el.warehouse)
                    })
                    list = unique(list)
                    var result = []
                    list.forEach(warehouse => {
                        result.push({
                            value: warehouse
                        })
                    })
                    cb(result)
                }
            })
        },
        queryShelf(query, cb) {
            axios.post('/v1/stock/location_fazzy_query', {
                "warehouse": this.warehouse
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    var list = []
                    data.forEach(el => {
                        list.push(el.shelf)
                    })
                    list = unique(list)
                    var result = []
                    list.forEach(shelf => {
                        result.push({
                            value: shelf
                        })
                    })
                    cb(result)
                }
            })
        },
        queryFloor(query, cb) {
            axios.post('/v1/stock/location_fazzy_query', {
                "warehouse": this.warehouse,
                "shelf": this.shelf
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    var list = []
                    data.forEach(el => {
                        list.push(el.floor)
                    })
                    list = unique(list)
                    var result = []
                    list.forEach(floor => {
                        result.push({
                            value: floor
                        })
                    })
                    cb(result)
                }
            })
        },
        handleSizeChange(size) {
            this.size = size
            this.getLocationStock()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getLocationStock()
        },
        // 查看此货架书籍
        showDetail(index) {
            this.location_id = this.locations[index].location_id
            this.reset()
            this.show_detail = true
        },
        searchGoods(index) {
            this.loading = true
            var request = {
                "page": this.goods_page,
                "size": this.goods_size,
                "order_by": "stock", // stock
                "sequence": "asc", // desc: 数量从大到小  asc：数量从小到大
                "location_id": this.location_id
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
                        el.this_stock = 0
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.goods_total_count = resp.data.total_count
                    if (data.length == 0) {
                        this.goods = data
                        this.loading = false
                        return
                    }
                    var self = this
                    var count = 0
                    for (var i = 0; i < data.length; i++) {
                        (function(index) {
                            axios.post('/v1/stock/list_goods_all_locations', {
                                "goods_id": data[index].goods_id, //required
                                "location_id": self.location_id,
                                "page": 1,
                                "size": 10
                            }).then(resp => {
                                if (resp.data.message == 'ok') {
                                    data[index].this_stock = resp.data.data[0].stock
                                    count++
                                    if (count == data.length) {
                                        self.goods = data
                                        self.loading = false
                                    }
                                }
                            })
                        })(i)
                    }
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
        reset() {
            this.input = ''
            this.select = 'isbn'
            this.goods_page = 1
            this.goods_size = 10
            this.searchGoods()
        },
        handleGoodsSizeChange(size) {
            this.goods_size = size
            this.searchGoods()
        },
        handleGoodsCurrentChange(page) {
            this.goods_page = page
            this.searchGoods()
        }
    }
}
