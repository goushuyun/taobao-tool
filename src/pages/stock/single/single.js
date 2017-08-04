import {
    priceFloat,
    priceInt
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        var checkIsbn = (rule, value, callback) => {
            var isbn = value.match(/\d/g).join('')
            let isbnReg = /^978\d{10}$/
            if (!isbnReg.test(isbn)) {
                callback(new Error('请输正确的ISBN'));
            } else {
                this.book_info.isbn = isbn
            }
        };
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
            candidate_books: [{
                image: '170411000001/9787121177408.jpg',
                isbn: '9787123456789',
                title: '数据结构',
                author: '谭浩强',
                publisher: '人民教育出版社',
                price: '1500'
            }],
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
                }, {
                    validator: checkIsbn,
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
            axios.post('/v1/book/get_book_info', {
                "isbn": this.isbn,
                "upload_mode": 1
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    if (data.length == 1) {
                        this.saveGoods(data[0].id)
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
            var candidate_books = this.candidate_books
            var index = this.radio
            var book = data[index]
            this.saveGoods(book.id)
            // 记录
            this.addRecords(book.isbn, 1)
            this.select_dialog = false
        },
        /**
         * 获取 goods_id
         * @param  {[type]} book_id [description]
         */
        saveGoods(book_id) {
            axios.post('/v1/stock/save_goods', {
                book_id: book_id
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    this.saveMapRow(data[0].goods_id)
                }
            })
        },
        /**
         * 商品入库
         * @param  {[type]} goods_id [description]
         */
        saveMapRow(goods_id) {
            axios.post('/v1/stock/save_map_row', {
                "goods_id": goods_id, //required
                "location_id": this.location_id, //required
                "stock": this.stock //required not 0
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    // let data = resp.data.data
                    this.addRecords(this.isbn, 1)
                    this.$message.success('入库成功！')
                }
            })
        },
        /**
         * 添加入库纪录
         * @param {[type]} isbn   [description]
         * @param {[number]} status [1-成功  0-失败]
         */
        addRecords(isbn, status) {
            this.records.unshift({
                isbn: isbn,
                location: this.warehouse + ' - ' + this.shelf + ' - ' + this.floor,
                stock: this.stock,
                status: status
            })
        },
        /**
         * 库存位置模糊查询
         */
        locationFazzyQuery(data, type) {
            axios.post('/v1/stock/location_fazzy_query', data).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                }
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
                        "isbn": "9787040193824",
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
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        queryWarehouse(query, cb) {
            cb([])
        },
        queryShelf(query, cb) {
            cb([])
        },
        queryFloor(query, cb) {
            cb([])
        },
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
