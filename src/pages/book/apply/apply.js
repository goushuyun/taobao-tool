import {
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            search_type: '0', //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            status: '0', //0:所有状态的申请 1:待审核   2:审核通过  3:审核失败的
            audit_list: [], // 申请列表
            local_book_list: [], // 标准图书信息
            detail_dialog: { // 详情
                visible: false,
                apply_list: [], //申请列表（只有一条）
                total_count: 0,
                newest: [] // 最新图书列表
            },
            user_id: '', // 用户id
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
        // 获取我的申请列表
        getAuditList() {
            var request = {
                "page": this.page,
                "size": this.size,
                "status": this.status,
                "apply_user_id": this.user_id,
                "search_type": this.search_type //0:修改图书申请 //1:新增一isbn 多图书信息的申请
            }
            axios.post('/v1/book/get_audit_list', request).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.price = priceFloat(el.price)
                        el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        return el
                    })
                    this.total_count = resp.data.total_count
                    // 新增的申请都没有book_no并且isbn都是原图书的isbn，所以只展示isbn
                    if (this.search_type == '1') {
                        data = data.map(el => {
                            el.isbn_no = el.isbn
                            return el
                        })
                        this.audit_list = data
                    }

                    // 修改图书基本信息的申请中没包含isbn，需要循环请求获取
                    if (this.search_type == '0') {
                        // 此步操作可能耗时较长，所以先清空
                        this.audit_list = []
                        var self = this
                        var audit_list = data
                        var count = 0
                        // 遍历data根据book_id获取标准图书信息
                        for (var i = 0; i < audit_list.length; i++) {
                            (function(index) {
                                axios.post('/v1/book/get_local_book_info', {
                                    id: audit_list[index].book_id
                                }).then(resp => {
                                    if (resp.data.message == 'ok') {
                                        var data1 = resp.data.data.map(el => {
                                            el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                                            el.price = priceFloat(el.price)
                                            return el
                                        })
                                        // 设置audit_list中的isbn、book_no、isbn_no
                                        data[index].isbn = data1[0].isbn
                                        data[index].book_no = data1[0].book_no
                                        data[index].isbn_no = data1[0].isbn_no
                                        // 顺便将标准图书信息表存在本地，便于查看 图书信息修改申请 详情时直接展示，不需要再次请求
                                        self.local_book_list[index] = data1[0]
                                        count++
                                        // 判断是否所有isbn请求完毕
                                        if (count == audit_list.length) {
                                            self.audit_list = data
                                        }
                                    }
                                })
                            })(i)
                        }
                    }
                }
            })
        },
        // 查看申请详情
        showDetail(index) {
            var audit = this.audit_list[index]
            this.detail_dialog.apply_list = [this.audit_list[index]]
            // 查看 修改图书信息的申请 直接拿到上一个环节获取到并保存在本地的local_book_list中对应的数据
            if (this.search_type === '0') {
                this.detail_dialog.newest = [this.local_book_list[index]]
            } else {
                // 查看 新增图书信息的申请 时可能对应多本图书，故需要重新获取一个isbn对应的多本图书
                axios.post('/v1/book/get_local_book_info', {
                    isbn: audit.isbn
                }).then(resp => {
                    if (resp.data.message == 'ok') {
                        var data = resp.data.data.map(el => {
                            el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                            el.price = priceFloat(el.price)
                            return el
                        })
                        this.detail_dialog.newest = data
                    }
                })
            }
            this.detail_dialog.visible = true
        },
        // 更改申请列表size后重新请求
        handleSizeChange(size) {
            this.size = size
            this.getAuditList()
        },
        // 更改申请列表page后重新请求
        handleCurrentChange(page) {
            this.page = page
            this.getAuditList()
        }
    }
}
