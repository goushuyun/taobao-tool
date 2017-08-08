import {
    priceFloat,
    priceInt,
    unique
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            stock: 1,
            warehouse: '',
            shelf: '',
            floor: '',
            shelf_disabled: true,
            floor_disabled: true,
            location_id: '',
            isbn: '',
            records: [], // 入库记录
            select_dialog: false,
            add_dialog: false,
            radio: 0,
            candidate_books: [], // 候选图书
            book_info: {
                isbn: '',
                title: '',
                author: '',
                publisher: '',
                edition: '',
                image: '',
                price: ''
            },
            rules: {
                isbn: [{
                    required: true,
                    message: '请填写ISBN',
                    trigger: 'blur'
                }],
                title: [{
                    required: true,
                    message: '请填写书名',
                    trigger: 'blur'
                }],
                price: [{
                    required: true,
                    message: '请填写图书原价',
                    trigger: 'blur'
                }]
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            },

            // 检测位置是否变化，变了就去获取get_location_id，不变就不获取
            to_get_location_id: false
        }
    },
    watch: {
        warehouse(value) {
            if (value) {
                this.shelf_disabled = false
                this.to_get_location_id = true
            } else {
                this.shelf = ''
                this.shelf_disabled = true
                this.to_get_location_id = false
            }
            // this.warehouse = value.replace(/![0-9a-zA-Z]/g, '')
        },
        shelf(value) {
            if (value) {
                this.floor_disabled = false
                this.to_get_location_id = true
            } else {
                this.floor = ''
                this.floor_disabled = true
                this.to_get_location_id = false
            }
            // this.shelf = value.replace(/[\w]/g, '')
        },
        floor(value) {
            if (value) {
                this.to_get_location_id = true
            }
            this.to_get_location_id = true
            // this.floor = value.replace(/[\w]/g, '')
        },
        records(value) {
            if (value.length > 10) {
                this.records.splice(10, this.records.length)
            }
        }
    },
    methods: {
        /**
         * 获取 to_get_location_id
         * @return {[type]} [description]
         */
        getLocationId() {
            if (this.to_get_location_id) {
                if (!(this.warehouse && this.shelf && this.floor)) {
                    this.$message.warning('请先完善货架位置信息！')
                    return
                }
                axios.post('/v1/stock/get_location_id', {
                    "warehouse": this.warehouse, //仓库名称 required
                    "shelf": this.shelf, //货架名称 required
                    "floor": this.floor //层 required
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        let data = resp.data.data
                        this.location_id = data.location_id
                        this.to_get_location_id = false
                        this.getBookInfo()
                    }
                })
            } else {
                this.getBookInfo()
            }
        },
        /**
         * 获取图书信息（本地 + 远程）
         */
        getBookInfo() {
            if (!(this.warehouse && this.shelf && this.floor)) {
                this.$message.warning('请先完善货架位置信息！')
                return
            }
            if (!this.isbn) {
                this.$message.warning('请输入ISBN！')
                return
            }
            var request = {
                "isbn": this.isbn,
                "upload_mode": 1
            }
            var reg = /^978\d{10}_\d{2}$/
            if (reg.test(this.isbn)) {
                var isbn_no = this.isbn.split('_')
                request.isbn = isbn_no[0]
                request.book_no = isbn_no[1]
            }
            axios.post('/v1/book/get_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data.map(el => {
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                        return el
                    })
                    if (data.length == 1) {
                        this.saveGoods(data[0].id, data[0].isbn_no)
                    } else {
                        this.preSelectBook(data)
                    }
                }
            })
        },
        /**
         * 准备选择书籍
         * @param  {[type]} data [description
         */
        preSelectBook(data) {
            this.candidate_books = data.map(book => {
                book.price = priceFloat(book.price)
                return book
            })
            this.select_dialog = true
        },
        /**
         * 取消选择书籍
         * @return {[type]} [description]
         */
        cancelSelect() {
            this.select_dialog = false
            this.addRecords(this.isbn, 0)
        },
        /**
         * 确认选择书籍
         * @return {[type]} [description]
         */
        confirmSelect() {
            var book = this.candidate_books[this.radio]
            this.saveGoods(book.id, book.isbn_no)
            this.select_dialog = false
        },
        /**
         * 获取 goods_id
         * @param  {[type]} book_id [description]
         */
        saveGoods(book_id, records) {
            axios.post('/v1/stock/save_goods', {
                book_id: book_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    this.saveMapRow(data[0].goods_id, records)
                }
            })
        },
        /**
         * 商品入库
         * @param  {[type]} goods_id [description]
         */
        saveMapRow(goods_id, records) {
            axios.post('/v1/stock/save_map_row', {
                "goods_id": goods_id, //required
                "location_id": this.location_id, //required
                "stock": this.stock //required not 0
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    // let data = resp.data.data
                    this.addRecords(records, 1)
                    this.$message.success('入库成功！')
                }
            })
        },
        /**
         * 添加入库纪录
         * @param {[type]} isbn   [description]
         * @param {[number]} status [1-成功  0-失败]
         */
        addRecords(records, status) {
            this.records.unshift({
                isbn: records,
                location: this.warehouse + ' - ' + this.shelf + ' - ' + this.floor,
                stock: this.stock,
                status: status
            })
        },
        /**
         * 准备新增图书
         */
        preAddBook() {
            this.book_info.isbn = this.isbn
            this.cancelSelect()
            this.add_dialog = true
        },
        /**
         * 确定提交新增图书申请
         */
        submitAudit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/v1/book/submit_audit', {
                        "isbn": this.book_info.isbn,
                        "book_cate": "poker",
                        "title": this.book_info.title,
                        "publisher": this.book_info.publisher,
                        "author": this.book_info.author,
                        "edition": this.book_info.edition,
                        "image": this.book_info.image,
                        "price": priceInt(this.book_info.price)
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.$message.success('申请已提交！')
                            this.add_dialog = false
                            this.select_dialog = false
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        /**
         * 库存位置模糊查询
         */
        locationFazzyQuery(cb, data) {
            axios.post('/v1/stock/location_fazzy_query', data).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    cb(data)
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
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
