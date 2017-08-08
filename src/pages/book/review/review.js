import {
    priceInt,
    priceFloat
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
            search_type: '0', //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            audit_list: [],
            detail_dialog: {
                index: 0,
                visible: false,
                apply_list: [],
                total_count: 0,
                page: 1,
                size: 10,
                originals: []
            },
            add_dialog: {
                visible: false,
                index: 0,
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
            imagesFormData: {
                key: '',
                token: ''
            },
            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.getOrganizedAuditList()
    },
    methods: {
        getOrganizedAuditList() {
            axios.post('/v1/book/get_organized_audit_list', {
                "page": this.page,
                "size": this.size,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.audit_list = data
                }
            })
        },
        /**
         * 查看申请详情
         * @param  {[type]} index [申请记录索引]
         * @param  {[type]} book  [是否请求图书信息？true-否 false-是]
         * @return {[type]}       [description]
         */
        showDetail(index, book) {
            this.detail_dialog.index = index
            var audit = this.audit_list[index]
            // 获取图书信息
            if (!book) {
                axios.post('/v1/book/get_local_book_info', {
                    isbn: audit.isbn
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        var data = resp.data.data.map(el => {
                            el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                            el.price = priceFloat(el.price)
                            return el
                        })
                        this.detail_dialog.originals = data
                    }
                })
            }

            // 获取申请列表
            var request = {
                "page": this.detail_dialog.page,
                "size": this.detail_dialog.size,
                "status": 1,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            if (this.search_type === '0') {
                request.book_id = audit.book_id
            } else {
                request.isbn = audit.isbn
                request.book_cate = 'poker'
            }
            axios.post('/v1/book/get_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.price = priceFloat(el.price)
                        // el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        return el
                    })
                    var result = {
                        data: data,
                        total_count: resp.data.total_count
                    }
                    this.detail_dialog.total_count = result.total_count
                    this.detail_dialog.apply_list = result.data
                    this.detail_dialog.visible = true
                }
            })
        },
        handleAudit(request, cb) {
            axios.post('/v1/book/handle_book_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    if (cd != undefined) {
                        cb()
                    }
                }
            })
        },
        saveBookInfo(request) {
            axios.post('/v1/book/update_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('图书信息已更新！')
                }
            })
        },
        adopt(index) {
            this.$confirm('此申请通过，其余申请将会自动驳回。', '申请通过', {
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var adopt_ids = [this.detail_dialog.apply_list[index].id]
                var adopt_request = {
                    "status": 2, //2:接受申请 //3:拒绝申请
                    "feedback": "", //反馈结果
                    "ids": adopt_ids
                }
                var callback = function() {
                    this.$message.success('已通过该申请！')
                    this.detail_dialog.apply_list.splice(index, 1)
                    this.detail_dialog.visible = false
                }

                var refuse_ids = []
                this.detail_dialog.apply_list.forEach(el => {
                    refuse_ids.push(el.id)
                })
                refuse_ids.splice(index, 1)
                // 自动拒绝其他申请
                var refuse_request = {
                    "status": 3,
                    "feedback": "我们使用了其他商家提供的数据", //反馈结果
                    "ids": refuse_ids
                }

                var book = this.detail_dialog.apply_list[index]
                var modify_request = {
                    "id": book.book_id, //required
                    "title": book.title,
                    "publisher": book.publisher,
                    "author": book.author,
                    "edition": book.edition,
                    "pubdate": book.pubdate,
                    "image": book.image,
                    "price": priceInt(book.price)
                }
                this.handleAudit(adopt_request, callback)
                if (refuse_ids.length > 0) {
                    this.handleAudit(refuse_request)
                }
                this.saveBookInfo(modify_request)
            }).catch();
        },
        refuse(index) {
            this.$prompt('请填写驳回理由：', '申请驳回', {
                confirmButtonText: '驳回',
                cancelButtonText: '取消',
                inputErrorMessage: '邮箱格式不正确'
            }).then(({
                value
            }) => {
                var request = {
                    "status": 3, //2:接受申请 //3:拒绝申请
                    "feedback": value, //反馈结果
                    "ids": [
                        this.detail_dialog.apply_list[index].id
                    ]
                }
                var callback = function() {
                    this.$message.success('已拒绝该申请！')
                    this.detail_dialog.apply_list.splice(index, 1)
                    this.detail_dialog.visible = false
                }
                this.handleAudit(request, callback)
            }).catch();
        },
        modify(index) {
            var book = this.detail_dialog.apply_list[index]
            this.add_dialog = {
                visible: true,
                index: index,
                book_id: book.book_id,
                isbn: book.book_no ? (book.isbn + '_' + book.book_no) : book.isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                edition: book.edition,
                image: book.image,
                price: book.price
            }
        },
        submit() {
            var request = {
                "id": this.add_dialog.book_id, //required
                "title": this.add_dialog.title,
                "publisher": this.add_dialog.publisher,
                "author": this.add_dialog.author,
                "edition": this.add_dialog.edition,
                "pubdate": this.add_dialog.pubdate,
                "image": this.add_dialog.image,
                "price": priceInt(this.add_dialog.price)
            }
            var refuse_ids = []
            this.detail_dialog.apply_list.forEach(el => {
                refuse_ids.push(el.id)
            })
            var refuse_request = {
                "status": 3,
                "feedback": "我们使用了其他商家提供的数据", //反馈结果
                "ids": refuse_ids
            }
            this.saveBookInfo(request)
            this.handleAudit(refuse_request)
            this.add_dialog.visible = false
            this.detail_dialog.visible = false
        },
        handleSizeChange(size) {
            this.size = size
            this.getAuditList()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getAuditList()
        },
        handleDetailSizeChange(size) {
            this.detail_dialog.size = size
            this.showDetail(this.detail_dialog.index, true)
        },
        handleDetailCurrentChange(page) {
            this.detail_dialog.page = page
            this.showDetail(this.detail_dialog.index, true)
        },
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
