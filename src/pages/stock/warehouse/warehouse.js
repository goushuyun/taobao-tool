import {
    priceFloat,
    priceInt,
    unique,
    numberFormat
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
            modify_dialog: {
                visible: false,
                warehouse: '',
                shelf: '',
                floor: '',
                location_id: '',
                index: 0
            },
            rules: {
                warehouse: [{
                    required: true,
                    message: '请填写仓库名',
                    trigger: 'blur'
                }],
                shelf: [{
                    required: true,
                    message: '请填写货架名',
                    trigger: 'blur'
                }],
                floor: [{
                    required: true,
                    message: '请填写层数',
                    trigger: 'blur'
                }]
            },
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
            this.shelf_disabled = !value
            this.shelf = ''
            this.getLocationStock()
        },
        shelf(value) {
            this.floor_disabled = !value
            this.floor = ''
            this.getLocationStock()
        },
        floor(value) {
            this.getLocationStock()
        }
    },
    methods: {
        focusWarehouse() {
            this.$nextTick(_ => {
                $('#warehouse input').select()
            })
        },
        selectWarehouse() {
            this.$nextTick(_ => {
                $('#shelf input').select()
            })
        },
        selectShelf() {
            this.$nextTick(_ => {
                $('#floor input').select()
            })
        },
        selectFloor() {
            this.$nextTick(_ => {
                $('#isbn input').focus()
            })
        },
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
                    this.total = numberFormat(resp.data.total)
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
        },
        preModifyLocation(index) {
            var location = this.locations[index]
            this.modify_dialog = {
                visible: true,
                warehouse: location.warehouse,
                shelf: location.shelf,
                floor: location.floor,
                location_id: location.location_id,
                index: index
            }
        },
        comfirmModifyLocation(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/v1/stock/update_location', {
                        "warehouse": this.modify_dialog.warehouse, // 所有字段都不能为空
                        "shelf": this.modify_dialog.shelf,
                        "floor": this.modify_dialog.floor,
                        "location_id": this.modify_dialog.location_id
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.locations[this.modify_dialog.index].warehouse = this.modify_dialog.warehouse
                            this.locations[this.modify_dialog.index].shelf = this.modify_dialog.shelf
                            this.locations[this.modify_dialog.index].floor = this.modify_dialog.floor
                            this.$message.success('修改成功！')
                            this.modify_dialog.visible = false
                        }
                        if (resp.data.message == 'exists') {
                            this.$message.warning('不可修改为已存在的库存！')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        preDeleteLocation(index) {
            this.$message({
                type: 'info',
                message: '该功能即将上线!'
            });
            return
            this.$confirm('货架信息删除后，此货架中的书籍也将全部删除，且不可恢复，确定删除？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                });
                this.locations[index].splice(index, 1)
            }).catch();
        }
    }
}