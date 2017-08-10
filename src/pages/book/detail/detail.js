import {
    copyObject,
    isObjectValueEqual,
    priceFloat,
    priceInt
} from '../../../assets/script/utils.js'
import config from '../../../config/basis.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            user_id: '', // 用户的id
            book_info: {}, // 图书信息
            book_info_bak: {}, // 图书备份信息

            cannot_modify: false, // 修改图书按钮是否不可点击：false-可以点击，true-不可点击
            modify: false, // 是否正在修改图书的状态
            goods_id: '', //
            locations: [], // 货架信息列表
            page: 1,
            size: 10,
            total_count: 0, // 货架列表总数
            other_dialog: { // 此isbn对应的其他图书dialog
                visible: false,
                books: [], // 此isbn对应的其他图书
                page: 1,
                size: 10,
                total_count: 0 // 其他图书总数
            },
            add_dialog: { // 新增图书dialog
                visible: false,
                audit_list: [], // 我对此isbn新增申请的列表
                page: 1,
                size: 10,
                total_count: 0 // 申请总数
            },
            add_book_info: { // 要添加图书的信息
                isbn: '',
                title: '',
                author: '',
                publisher: '',
                edition: '',
                image: '',
                price: ''
            },
            imagesFormData: { // 封面上传的中间信息
                key: '',
                token: ''
            },
            rules: { // 新增图书信息表单校验规则
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
            }
        }
    },
    mounted() {
        this.user_id = localStorage.getItem('user_id')
        this.getParams()
    },
    methods: {
        inputTitle() {
            var str = this.book_info.title,
                blen = 0
            for (var i = 0, l = str.length; i < l; i++) {
                if ((str.charCodeAt(i) & 0xff00) != 0) {
                    blen++;
                }
                blen++;
                if (blen > 60) {
                    this.book_info.title = this.book_info.title.substring(0, i)
                    return false
                }
            }
        },
        // 返回上一页
        goBack() {
            this.$router.go(-1)
        },
        // 获取来自 库存查看 和 信息维护 两个页面传来的book信息
        getParams() {
            var book = this.$route.params.book
            this.goods_id = book.goods_id
            // 获取图书的全部货架信息
            this.getGoodsAlocations()
            this.modify = false
            // 复制并备份book信息
            this.book_info = copyObject(book)
            this.book_info_bak = copyObject(book)
            this.checkCanModify()
        },
        checkCanModify() {
            axios.post('/v1/book/get_audit_list', {
                "apply_user_id": this.user_id,
                "book_id": this.book_info.book_id,
                "search_type": 0,
                "status": 1, //0:所有状态的申请 1:待审核   2:审核通过  3:审核失败的
                "page": this.add_dialog.page,
                "size": this.add_dialog.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    if (resp.data.data.length > 0) {
                        this.cannot_modify = true
                    } else {
                        this.cannot_modify = false
                    }
                }
            })
        },
        // 准备修改图书基本信息
        preModify() {
            this.modify = true
            // 获取token，准备上传封面
            this.getToken(this.book_info.isbn_no)
            this.$nextTick(() => {
                $('#title input').focus()
            })
        },
        // 取消修改图书基本信息
        cancelModify() {
            this.modify = false
            this.book_info = copyObject(this.book_info_bak)
        },
        // 提交修改图书基本信息的申请
        submitModify(formName) {
            // 检查图书是否未作修改，未修改则不提交申请
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
                            this.cannot_modify = true
                            this.$message.success('申请已提交！')
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 提交新增图书的申请
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
        // 准备新增图书
        preAddBook() {
            // 获取我对这本书已提交的申请列表
            this.getAuditList()
            this.add_book_info.isbn = this.book_info.isbn
            this.add_dialog.visible = true
            // 获取taken，准备上传封面
            this.getToken(this.add_book_info.isbn)
            this.$nextTick(() => {
                $('#title input').focus()
            })
        },
        // 获取我对这本书已提交的申请列表
        getAuditList() {
            axios.post('/v1/book/get_audit_list', {
                "apply_user_id": this.user_id,
                "isbn": this.book_info.isbn,
                "search_type": 1,
                "book_no": "poker",
                "status": 0, //0:所有状态的申请 1:待审核   2:审核通过  3:审核失败的
                "page": this.add_dialog.page,
                "size": this.add_dialog.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.add_dialog.total_count = resp.data.total_count
                    this.add_dialog.audit_list = data
                }
            })
        },
        // 更改图书货架信息列表size后重新请求
        handleBookSizeChange(size) {
            this.size = size
            this.getGoodsAlocations()
        },
        // 更改图书货架信息列表page后重新请求
        handleBookCurrentChange(page) {
            this.page = page
            this.getGoodsAlocations()
        },
        // 更改新增图书dialog顶部申请列表的size后重新请求
        handleAddSizeChange(size) {
            this.add_dialog.size = size
            this.getAuditList()
        },
        // 更改新增图书dialog顶部申请列表的size后重新请求
        handleAddCurrentChange(page) {
            this.add_dialog.page = page
            this.getAuditList()
        },
        // 打开此isbn对应的其他书籍的dialog，并获取其他书籍列表
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
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                        return el
                    })
                    this.other_dialog.visible = true
                }
            })
        },
        // 获取图书货架信息列表
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
        // 上传封面前执行的钩子函数
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
        // 更改图书时上传封面，成功后条用的钩子函数
        handleAvatarSuccess(res, file, fileList) {
            this.book_info.image = this.imagesFormData.key
            this.getToken(this.book_info.isbn)
        },
        // 更改图书时上传封面，失败后条用的钩子函数
        handleAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken(this.book_info.isbn)
        },
        // 新增图书时上传封面，成功后条用的钩子函数
        handleAddAvatarSuccess(res, file, fileList) {
            this.add_book_info.image = this.imagesFormData.key
            this.getToken(this.add_book_info.isbn)
        },
        // 新增图书时上传封面，失败后条用的钩子函数
        handleAddAvatarError(err, file, fileList) {
            this.$message.error('上传失败，请重试');
            this.getToken(this.add_book_info.isbn)
        },
        // 获取token的方法，通过时间字符串和isbn拼接key
        getToken(isbn) {
            var time = moment().format('YYYYMMDDHHmmss')
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
