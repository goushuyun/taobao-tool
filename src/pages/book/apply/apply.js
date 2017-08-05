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
                visible: true,
                apply_list: [],
                total_count: 0,
                newest: []
            },
            add_dialog: {
                visible: true,
                other_books: [],
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
            var request = {
                "page": this.page,
                "size": this.size,
                "apply_user_id": this.user_id,
                "status": this.status,
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
                    this.audit_list = data
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
