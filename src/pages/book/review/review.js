import {
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
                visible: false,
                apply_list: [],
                total_count: 0,
                page: 1,
                size: 10,
                originals: []
            },
            add_dialog: {
                visible: false,
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
        showDetail(index) {
            var self = this
            var audit = this.audit_list[index]
            self.getLocalBookInfo({
                isbn: audit.isbn
            })
            var request = {
                "page": this.detail_dialog.page,
                "size": this.detail_dialog.size,
                "status": 1,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            if (self.search_type === '0') {
                request.book_id = audit.book_id
            } else {
                request.isbn = audit.isbn
                request.book_cate = 'poker'
            }
            this.getAudits(result => {
                self.detail_dialog.total_count = result.total_count
                self.detail_dialog.apply_list = result.data
                self.detail_dialog.visible = true
            }, request)
        },
        getLocalBookInfo(request) {
            axios.post('/v1/book/get_local_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.detail_dialog.originals = data
                }
            })
        },
        /**
         * 查询申请修改信息接口调用
         * @param  {[type]} index [description]
         * @return {[type]}       [description]
         */
        getAudits(cb, request) {
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
                    cb(result)
                }
            })
        },
        handleAudit(request, cb) {
            axios.post('/v1/book/handle_book_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    cb()
                }
            })
        },
        adopt(index) {
            this.$confirm('此申请通过，其余申请将会自动驳回。', '申请通过', {
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var request = {
                    "status": 2, //2:接受申请 //3:拒绝申请
                    "feedback": "", //反馈结果
                    "ids": [
                        this.detail_dialog.apply_list[index].id
                    ]
                }
                var callback = function() {
                    this.$message.success('已通过该申请！')
                    this.detail_dialog.apply_list.splice(index, 1)
                }
                this.handleAudit(request, callback)
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
                }
                this.handleAudit(request, callback)
            }).catch();
        },
        modify(index) {
            var book = this.detail_dialog.apply_list[index]
            this.add_dialog = {
                visible: true,
                isbn: book.isbn_no = book.book_no ? (book.isbn + '_' + book.book_no) : book.isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                edition: book.edition,
                image: book.image,
                price: book.price
            }
        },
        submit() {
            this.add_dialog.visible = false
        },
        handleSizeChange(size) {
            this.size = size
            this.getAuditList()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getAuditList()
        },
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
