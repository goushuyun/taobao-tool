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
    mounted() {},
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
            var self = this
            var request = {
                "page": self.page,
                "size": self.size,
                "status": this.status,
                "apply_user_id": self.user_id,
                "search_type": self.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            this.getAudits(result => {
                self.total_count = result.total_count
                self.audit_list = result.data
            }, request)
        },
        showDetail(index) {
            var self = this
            var audit = this.audit_list[index]
            var request = {
                "page": this.page,
                "size": this.size,
                "apply_user_id": this.user_id,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            if (self.search_type === '0') {
                self.getLocalBookInfo({id: audit.book_id})
                request.book_id = audit.book_id
            } else {
                self.getLocalBookInfo({isbn: audit.isbn})
                request.isbn = audit.isbn
                request.book_cate = 'poker'
            }
            this.getAudits(result => {
                self.modify_dialog.total_count = result.total_count
                self.modify_dialog.apply_list = result.data
                self.modify_dialog.visible = true
            }, request)
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
                        el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
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
        getLocalBookInfo(request) {
            axios.post('/v1/book/get_local_book_info', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = el.book_no ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.price = priceFloat(el.price)
                        return el
                    })
                    this.modify_dialog.newest = data
                }
            })
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
