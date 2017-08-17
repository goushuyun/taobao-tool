import {
    priceFloat,
    priceInt,
    unique
} from '../../../assets/script/utils.js'
import config from '../../../config/basis.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            start_at: '',
            end_at: '',
            operate_type: 'unload',
            isbn: '',
            page: 1,
            size: 15,
            total_count: 0,
            records: [],

            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        var today = moment().format('YYYY-MM-DD')
                        const end = moment(today + ' 23:59:59');
                        const start = moment(today + ' 00:00:00').subtract(1, 'weeks');
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        var today = moment().format('YYYY-MM-DD')
                        const end = moment(today + ' 23:59:59');
                        const start = moment(today + ' 00:00:00').subtract(1, 'months');
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        var today = moment().format('YYYY-MM-DD')
                        const end = moment(today + ' 23:59:59');
                        const start = moment(today + ' 00:00:00').subtract(3, 'months');
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            time_range: '',

            user_id: ''
        }
    },
    mounted() {
        this.setDefaultTimeRange()
        this.searchRecords()
        this.user_id = localStorage.getItem('user_id')
    },
    methods: {
        setDefaultTimeRange() {
            var today = moment().format('YYYY-MM-DD')
            var start = today + ' 00:00:00'
            var end = today + ' 23:59:59'
            this.time_range = [moment(start, "YYYY-MM-DD hh:mm:ss"), moment(end, "YYYY-MM-DD hh:mm:ss")]
        },
        searchRecords() {
            var param = {
                "start_at": this.time_range ? moment(this.time_range[0], "YYYY-MM-DD hh:mm:ss").unix() : 0,
                "end_at": this.time_range ? moment(this.time_range[1], "YYYY-MM-DD hh:mm:ss").unix() : 0,
                "operate_type": this.operate_type, // load 和 unload  （不填代表全部）
                "isbn": this.isbn,
                "page": this.page,
                "size": this.size
            }
            axios.post('/v1/stock/get_goods_shift_record', param).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD hh:mm:ss')
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.records = data
                }
            })
        },
        reset() {
            this.size = 15
            this.page = 1
            this.isbn = ''
            var flag = false
            // 当operate_type 和 time_range 都没有变化时，需要重新请求记录列表
            if (this.operate_type === 'unload' && this.time_range === '') {
                flag = true
            }
            this.operate_type = 'unload'
            this.time_range = ''
            if (flag) {
                this.searchRecords()
            }
        },
        exportRecord() {
            var param = {
                "user_id": this.user_id,
                "start_at": this.time_range ? moment(this.time_range[0], "YYYY-MM-DD hh:mm:ss").unix() : 0,
                "end_at": this.time_range ? moment(this.time_range[1], "YYYY-MM-DD hh:mm:ss").unix() : 0,
                "operate_type": this.operate_type, // load 和 unload  （不填代表全部）
                "isbn": this.isbn,
                "page": this.page,
                "size": this.size
            }
            axios.post('/v1/stock/get_goods_shift_record', param).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        el.isbn_no = (el.book_no != '' && el.book_no != '00') ? (el.isbn + '_' + el.book_no) : el.isbn
                        el.create_at = moment(el.create_at * 1000).format('YYYY-MM-DD hh:mm:ss')
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.records = data
                    if (this.records.length == 0) {
                        this.$message.warning('要导出的数据为空！')
                        return
                    } else {
                        window.location.assign(config.base_url + '/v1/stock/export_goods_shift_record?params=' + JSON.stringify(param))
                    }
                }
            })
        },
        handleSizeChange(size) {
            this.size = size
            this.searchRecords()
        },
        handleCurrentChange(page) {
            this.page = page
            this.searchRecords()
        }
    }
}
