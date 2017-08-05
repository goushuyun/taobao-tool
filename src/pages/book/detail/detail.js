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
            } else {
                callback()
            }
        };
        return {
            book_info: {},
            book_info_bak: {},

            modify: false,
            goods_id: '',
            locations: [],
            page: 1,
            size: 10,
            total_count: 0,
            other_dialog: {
                visible: false,
                books: []
            },
            add_dialog: {
                visible: false,
                audit_list: []
            },
            add_book_info: {
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
            }
        }
    },
    mounted() {
        this.getParams()
    },
    methods: {
        getParams() {
            var book = this.$route.params.book
            this.goods_id = book.goods_id
            this.getGoodsAlocations()
            this.modify = false
            this.book_info = copyObject(book)
            this.book_info_bak = copyObject(book)
        },
        preModify() {
            this.modify = true
            this.$nextTick(() => {
                $('#title input').focus()
            })
        },
        submitModify(formName) {
            if (isObjectValueEqual(this.book_info, this.book_info_bak)) {
                this.$message.warning('尚未做任何修改！')
                return
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/v1/book/submit_audit', {
                        "book_id": this.book_info.book_id,
                        "title": this.book_info.title,
                        "publisher": this.book_info.publisher,
                        "author": this.book_info.author,
                        "edition": this.book_info.edition,
                        "image": this.book_info.image,
                        "price": priceInt(this.book_info.price)
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.modify = false
                            this.$message.success('申请已提交！')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        submitAudit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post('/v1/book/submit_audit', {
                        "isbn": this.add_book_info.isbn,
                        "book_cate": "poker",
                        "title": this.add_book_info.title,
                        "publisher": this.add_book_info.publisher,
                        "author": this.add_book_info.author,
                        "edition": this.add_book_info.edition,
                        "image": this.add_book_info.image,
                        "price": priceInt(this.add_book_info.price)
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            this.add_dialog.visible = false
                            this.$message.success('申请已提交！')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        preAddBook() {
            this.getAuditList()
            this.add_book_info.isbn = this.book_info.isbn
            this.add_dialog.visible = true
            this.$nextTick(() => {
                $('#title input').focus()
            })
        },
        getAuditList() {
            axios.post('/v1/book/get_audit_list', {
                "isbn": this.book_info.isbn,
                "book_no": "poker",
                "status": 1 //0:所有状态的申请 1:待审核   2:审核通过  3:审核失败的
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.add_dialog.audit_list = data
                }
            })
        },
        handleBookSizeChange(size) {
            this.size = size
            this.getGoodsAlocations()
        },
        handleBookCurrentChange(page) {
            this.page = page
            this.getGoodsAlocations()
        },
        openOtherDialog() {
            var book = this.book_info_bak
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
                "goods_id": this.goods_id, //required
                "page": this.page, //required
                "size": this.size //required
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    this.total_count = resp.data.total
                    this.locations = data
                }
            })
        },
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
