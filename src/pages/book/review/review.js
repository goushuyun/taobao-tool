import {
    priceInt,
    priceFloat,
    copyObject,
    isObjectValueEqual
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
            add_dialog_bak: {},
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
        // 获取申请列表
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
         * @param  {Number} index 申请记录索引
         * @param  {Boolean} book 是否请求图书信息？true-否 false-是
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

            // 获取申请列表，修改图书详情页只有一本，新增图书详情页可能有 多本
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
                    this.detail_dialog.total_count = resp.data.total_count
                    if (this.search_type === '1') {
                        data = data.map(el => {
                            el.isbn_no = el.isbn
                            return el
                        })
                        this.detail_dialog.apply_list = data
                    }
                    if (this.search_type === '0') {
                        this.detail_dialog.apply_list = []
                        var self = this
                        var count = 0
                        for (var i = 0; i < data.length; i++) {
                            (function(index) {
                                axios.post('/v1/book/get_local_book_info', {
                                    id: data[index].book_id
                                }).then(resp => {
                                    if (resp.data.message == 'ok') {
                                        var data1 = resp.data.data.map(el => {
                                            el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                                            return el
                                        })
                                        data[index].isbn = data1[0].isbn
                                        data[index].book_no = data1[0].book_no
                                        data[index].isbn_no = data1[0].isbn_no

                                        count++
                                        // 判断是否所有isbn请求完毕
                                        if (count == data.length) {
                                            self.detail_dialog.apply_list = data
                                        }
                                    }
                                })
                            })(i)
                        }
                    }
                    this.detail_dialog.visible = true
                }
            })
        },
        /**
         * 处理申请
         * @param  {Object}   request 请求数据
         * @param  {Function} cb      回调函数
         */
        handleAudit(request, cb) {
            axios.post('/v1/book/handle_book_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    if (cb != null) {
                        cb()
                    }
                }
            })
        },
        // 更新图书
        updateBookInfo(request) {
            axios.post('/v1/book/update_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('图书信息已更新！')
                }
            })
        },
        // 添加图书
        saveBookInfo(request) {
            axios.post('/v1/book/save_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('已新增图书！')
                    this.add_dialog.visible = false
                }
            })
        },
        // 通过申请
        adopt(index) {
            var tip = this.search_type == '0' ? '此申请通过，其余申请将会自动驳回。' : '新增图书的申请通过后，购书云会自动分配给此书一个isbn+后缀的编号。'
            this.$confirm(tip, '申请通过', {
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 即将通过审核的申请id
                var adopt_ids = [this.detail_dialog.apply_list[index].id]
                var adopt_request = {
                    "status": 2, //2:接受申请 //3:拒绝申请
                    "feedback": "", //反馈结果
                    "ids": adopt_ids
                }
                var self = this
                var callback = function() {
                    self.$message.success('已通过该申请！')

                    // 如果是修改申请直接关闭对话框
                    if (self.search_type == '0') {
                        self.detail_dialog.visible = false
                    } else {
                        // 如果当前处理的是最后一条申请，关闭对话框
                        if (self.detail_dialog.apply_list == 1) {
                            self.detail_dialog.visible = false
                        } else {
                            // 否则删除处理后的记录
                            self.detail_dialog.apply_list.splice(index, 1)
                        }
                    }
                }
                // 通过申请
                this.handleAudit(adopt_request, callback)

                // 多个商家申请修改，则需要同时驳回其他商家的申请
                // 多个商家申请新增，不需要驳回其他商家的申请
                if (this.search_type == '0') {
                    // 被自动拒绝的其他申请id数组
                    var refuse_ids = []
                    this.detail_dialog.apply_list.forEach(el => {
                        refuse_ids.push(el.id)
                    })
                    refuse_ids.splice(index, 1)
                    var refuse_request = {
                        "status": 3,
                        "feedback": "我们使用了其他商家提供的数据", //反馈结果
                        "ids": refuse_ids
                    }
                    if (refuse_ids.length > 0) {
                        this.handleAudit(refuse_request, null)
                    }
                }

                // 申请通过后对图书进行处理：修改或新增
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
            }).catch();
        },
        // 拒绝申请
        refuse(index) {
            var tip = this.search_type == '0' ? '默认为：我们使用了其他商家提供的数据' : '默认为：图书基本信息不准确'
            this.$prompt('请填写驳回理由：', '申请驳回', {
                confirmButtonText: '驳回',
                cancelButtonText: '取消',
                inputPlaceholder: tip
            }).then(({
                value
            }) => {
                var request = {
                    "status": 3, //2:接受申请 //3:拒绝申请
                    "feedback": value ? value : tip, //反馈结果
                    "ids": [
                        this.detail_dialog.apply_list[index].id
                    ]
                }
                var self = this
                var callback = function() {
                    self.$message.success('已拒绝该申请！')
                    // 如果当前处理的是最后一条申请，关闭对话框
                    if (self.detail_dialog.apply_list == 1) {
                        self.detail_dialog.visible = false
                    } else {
                        // 否则删除处理后的记录
                        self.detail_dialog.apply_list.splice(index, 1)
                    }
                }
                this.handleAudit(request, callback)
            }).catch();
        },
        // 管理员权限的商家自行修改申请
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
            this.add_dialog_bak = copyObject(this.add_dialog)
            this.getToken()
        },
        // 提交修改，会默认拒绝其他商家的申请
        submit() {
            if (isObjectValueEqual(this.add_dialog_bak, this.add_dialog)) {
                this.$message.warning('尚未做任何修改！')
                return
            }
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
            // 如果是修改申请则驳回其他所有申请
            if (this.search_type == '0') {
                var refuse_ids = []
                this.detail_dialog.apply_list.forEach(el => {
                    refuse_ids.push(el.id)
                })
                var refuse_request = {
                    "status": 3,
                    "feedback": "我们使用了其他商家提供的数据", //反馈结果
                    "ids": refuse_ids
                }
                this.handleAudit(refuse_request, null)
                this.add_dialog.visible = false
                this.detail_dialog.visible = false
            } else {
                // 如果是新增申请则驳回当前申请
                var index = this.add_dialog.index
                console.log();
                var refuse_request = {
                    "status": 3,
                    "feedback": "我们使用了其他商家提供的数据", //反馈结果
                    "ids": [this.detail_dialog.apply_list[index].id]
                }
                var self = this
                var callback = function() {
                    // 如果当前处理的是最后一条申请，关闭对话框
                    if (self.detail_dialog.apply_list == 1) {
                        self.detail_dialog.visible = false
                    } else {
                        // 否则删除处理后的记录
                        self.detail_dialog.apply_list.splice(index, 1)
                    }
                }
                this.handleAudit(refuse_request, callback)
            }
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
