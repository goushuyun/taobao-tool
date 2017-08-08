import {
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            search_type: '0', //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            status: '0', //0:所有状态的申请 1:待审核   2:审核通过  3:审核失败的
            audit_list: [],
            local_book_list: [],
            modify_dialog: {
                visible: false,
                apply_list: [],
                total_count: 0,
                newest: []
            },
            user_id: '',
            page: 1,
            size: 10,
            total_count: 0
        }
    },
    mounted() {
        this.user_id = localStorage.getItem('user_id')
        this.getAuditList()
    },
    methods: {
        /**
         * 查询申请修改信息
         * @param  {[type]} type ['list'-获取列表  'detail'-获取某本图书的详情]
         */
        getAuditList() {
            var request = {
                "page": this.page,
                "size": this.size,
                "status": this.status,
                "apply_user_id": this.user_id,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            var self = this
            axios.post('/v1/book/get_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        if (self.search_type == '1') {
                            el.isbn_no = el.isbn
                        }
                        el.price = priceFloat(el.price)
                        el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.audit_list = data
                    if (this.search_type == '0') {
                        this.getLocalBookInfoList()
                    }
                }
            })
        },
        getLocalBookInfoList() {
            var self = this
            var audit_list = self.audit_list
            for (var i = 0; i < audit_list.length; i++) {
                (function(index) {
                    axios.post('/v1/book/get_local_book_info', {
                        id: audit_list[index].book_id
                    }).then(resp => {
                        if (resp.data.message == 'ok') {
                            var data = resp.data.data.map(el => {
                                el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                                el.price = priceFloat(el.price)
                                return el
                            })
                            self.audit_list[index].isbn = data[0].isbn
                            self.audit_list[index].book_no = data[0].book_no
                            self.audit_list[index].isbn_no = data[0].isbn_no
                            self.local_book_list[index] = data[0]
                        }
                    })
                })(i)
            }
        },
        showDetail(index) {
            var self = this
            var audit = this.audit_list[index]
            self.modify_dialog.apply_list = [self.audit_list[index]]
            if (self.search_type === '0') {
                self.modify_dialog.newest = [self.local_book_list[index]]
            } else {
                axios.post('/v1/book/get_local_book_info', {
                    isbn: audit.isbn
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        var data = resp.data.data.map(el => {
                            el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                            el.price = priceFloat(el.price)
                            return el
                        })
                        this.modify_dialog.newest = data
                    }
                })
            }
            self.modify_dialog.visible = true
        },
        handleSizeChange(size) {
            this.size = size
            this.getAuditList()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getAuditList()
        }
    }
}
