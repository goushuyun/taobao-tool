import {
    copyObject,
    isObjectValueEqual,
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
            }
        };
        return {
            input: '',
            select: 'isbn',
            goods: [],
            remark_dialog: {
                index: 0,
                visible: false,
                update_remark: ''
            },
            book_info: {},
            book_info_bak: {},
            book_dialog: {
                index: 0,
                visible: false,
                modify: false,
                tatal_stock: 0,
                goods_id: '',
                locations: [],
                page: 1,
                size: 10,
                total_count: 0
            },
            other_dialog: {
                visible: false,
                books: []
            },
            add_dialog_visible: false,
            add_dialog_book_info: {
              isbn: '',
              title: '',
              author: '',
              publisher: '',
              edition: '',
              image: '',
              price: ''
            },
            imagesFormData: {
                key: '',
                token: ''
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
            } else {
                request[this.select] = this.input
            }
            axios.post('/v1/stock/search_goods', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
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
            this.book_dialog.goods_id = book.goods_id
            this.getGoodsAlocations()
            this.book_dialog.modify = false
            this.book_dialog.index = index
            this.book_dialog.tatal_stock = book.stock
            this.book_info = copyObject(book)
            this.book_info_bak = copyObject(book)
            this.book_dialog.visible = true
        },
        preAudit() {
            this.book_dialog.modify = true
            $('#isbn input').focus()
        },
        submitModify(formName) {

        },
        submitModify(formName) {
            if (isObjectValueEqual(this.book_info, this.book_info_bak)) {
                this.$message.warning('尚未做任何修改！')
                return
            }
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
                            this.book_dialog.modify = false
                            this.$message.success('申请已提交！')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleSizeChange(size) {
            this.size = size
            this.searchGoods()
        },
        handleCurrentChange(page) {
            this.page = page
            this.searchGoods()
        },
        handleBookSizeChange(size) {
            this.book_dialog.size = size
            this.getGoodsAlocations()
        },
        handleBookCurrentChange(page) {
            this.book_dialog.page = page
            this.getGoodsAlocations()
        },
        openOtherDialog() {
            var index = this.book_dialog.index
            var book = this.goods[index]
            axios.post('/v1/book/get_book_info', {
                "isbn": book.isbn,
                "upload_mode": 1
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    let data = resp.data.data
                    this.other_dialog.books = data.map(el => {
                        el.price = priceFloat(el.price)
                        el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                        return el
                    })
                    this.other_dialog.visible = true
                }
            })
        },
        getGoodsAlocations() {
            axios.post('/v1/stock/list_goods_all_locations', {
                "goods_id": this.book_dialog.goods_id, //required
                "page": 1, //required
                "size": 10 //required
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.book_dialog.total_count = resp.data.total
                    this.book_dialog.locations = data
                }
            })
        },
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
