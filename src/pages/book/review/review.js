import {
    priceInt,
    priceFloat
} from '../../../assets/script/utils.js'
import config from '../../../config/basis.js'
import axios from "../../../config/http.js"
export default {
    data() {
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
                isbn_no: '',
                isbn: '',
                title: '',
                author: '',
                publisher: '',
                edition: '',
                image: '',
                price: ''
            },
            rules: {
                isbn_no: [{
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
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
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
                            el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
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
                        el.book_no = ''
                        el.isbn_no = ''
                        el.price = priceFloat(el.price)
                        return el
                    })
                    var result = {
                        data: data,
                        total_count: resp.data.total_count
                    }
                    this.detail_dialog.total_count = result.total_count
                    this.detail_dialog.apply_list = result.data.map(el => {
                        el.isbn_no = el.isbn
                        return el
                    })
                    console.log(this.detail_dialog.apply_list);
                    if (this.search_type === '0') {
                        this.getLocalBookInfoList()
                    }
                    this.detail_dialog.visible = true
                }
            })
        },
        getLocalBookInfoList() {
            var self = this
            var apply_list = self.detail_dialog.apply_list
            for (var i = 0; i < apply_list.length; i++) {
                (function(index) {
                    axios.post('/v1/book/get_local_book_info', {
                        id: apply_list[index].book_id
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            var data = resp.data.data.map(el => {
                                el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                                return el
                            })
                            self.detail_dialog.apply_list[index].isbn = data[0].isbn
                            self.detail_dialog.apply_list[index].book_no = data[0].book_no
                            self.detail_dialog.apply_list[index].isbn_no = data[0].isbn_no
                        }
                    })
                })(i)
            }
        },
        handleAudit(request, cb) {
            axios.post('/v1/book/handle_book_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    if (cb != null) {
                        cb()
                    }
                }
            })
        },
        updateBookInfo(request) {
            axios.post('/v1/book/update_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('图书信息已更新！')
                }
            })
        },
        saveBookInfo(request) {
            axios.post('/v1/book/save_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('已新增图书！')
                }
            })
        },
        adopt(index) {
            var tip = this.search_type == '0' ? '此申请通过，其余申请将会自动驳回。' : '新增图书的申请通过后，购书云会自动分配给此书一个isbn+后缀的编号。'
            this.$confirm(tip, '申请通过', {
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
                var self = this
                var callback = function() {
                    self.$message.success('已通过该申请！')
                    self.detail_dialog.apply_list.splice(index, 1)
                    self.detail_dialog.visible = false
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
                var request = {
                    "title": book.title,
                    "publisher": book.publisher,
                    "author": book.author,
                    "edition": book.edition,
                    "pubdate": book.pubdate,
                    "image": book.image,
                    "price": priceInt(book.price)
                }
                if (this.search_type == '0') {
                    request.id = book.book_id
                    this.updateBookInfo(request)
                } else {
                    request.isbn = book.isbn
                    request.book_cate = 'poker'
                    this.saveBookInfo(request)
                }

                this.handleAudit(adopt_request, callback)
                if (refuse_ids.length > 0) {
                    this.handleAudit(refuse_request, null)
                }

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
                var self = this
                var callback = function() {
                    self.$message.success('已拒绝该申请！')
                    self.detail_dialog.apply_list.splice(index, 1)
                    self.detail_dialog.visible = false
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
                isbn_no: book.book_no ? (book.isbn + '_' + book.book_no) : book.isbn,
                isbn: book.isbn,
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                edition: book.edition,
                image: book.image,
                price: book.price
            }
            this.getToken()
        },
        submit() {
            var request = {
                "title": this.add_dialog.title,
                "publisher": this.add_dialog.publisher,
                "author": this.add_dialog.author,
                "edition": this.add_dialog.edition,
                "pubdate": this.add_dialog.pubdate,
                "image": this.add_dialog.image,
                "price": priceInt(this.add_dialog.price)
            }
            if (this.search_type == '0') {
                request.id = this.add_dialog.book_id
                this.updateBookInfo(request)
            } else {
                request.isbn = this.add_dialog.isbn // required
                request.book_cate = 'poker' // ''或者poker
                this.saveBookInfo(request)
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
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG、JPEG、PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file, fileList) {
            this.add_dialog.image = this.imagesFormData.key
            this.getToken()
        },
        handleAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken()
        },
        getToken() {
            var time = moment().format('YYYYMMDDHHmmss')
            var isbn = this.add_dialog.isbn
            let key = time + isbn + '.png'
            axios.post('/v1/mediastore/get_up_token', {
                zone: config.bucket_zone,
                key
            }).then(resp => {
                this.imagesFormData.key = key
                this.imagesFormData.token = resp.data.data.token
                return true
            }).catch(() => {
                return false
            });
        }
    }
}
