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
                    text: '今天',
                    onClick(picker) {
                        var today = moment().format('YYYY-MM-DD');
                        const end = moment(today + ' 23:59:59');
                        const start = moment(today + ' 00:00:00');
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        var tomorrow = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        const end = moment(tomorrow + ' 23:59:59');
                        const start = moment(tomorrow + ' 00:00:00');
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            time_range: '',

            user_id: '',

            record_dialog: {
                visiable: false,
                total_count: 0,
                time_range: ''
            }
        }
    },
    mounted() {
        this.searchRecords()
        this.user_id = localStorage.getItem('user_id')
    },
    methods: {
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
        preExport() {
            var flag
            if (typeof this.record_dialog.time_range === 'string' && this.record_dialog.time_range === '') {
                flag = false
            } else if (typeof this.record_dialog.time_range != 'string' && this.record_dialog.time_range[0] == null) {
                flag = false
            } else {
                flag = true
            }
            if (flag) {
                var param = {
                    "user_id": this.user_id,
                    "start_at": moment(this.record_dialog.time_range[0], "YYYY-MM-DD hh:mm:ss").unix(),
                    "end_at": moment(this.record_dialog.time_range[1], "YYYY-MM-DD hh:mm:ss").unix(),
                    "operate_type": 'unload',
                    "page": 1,
                    "size": 1
                }
                axios.post('/v1/stock/get_goods_shift_record', param).then(resp => {
                    if (resp.data.message == 'ok') {
                        this.record_dialog.visiable = true
                        this.record_dialog.total_count = resp.data.total_count
                    }
                })
            } else {
                this.record_dialog = {
                    visiable: true,
                    total_count: 0,
                    time_range: ''
                }
            }
        },
        confirmExport() {
            var param = {
                "user_id": this.user_id,
                "start_at": moment(this.record_dialog.time_range[0], "YYYY-MM-DD hh:mm:ss").unix(),
                "end_at": moment(this.record_dialog.time_range[1], "YYYY-MM-DD hh:mm:ss").unix(),
                "operate_type": 'unload'
            }
            window.location.assign(config.base_url + '/v1/stock/export_goods_shift_record?params=' + JSON.stringify(param))
            this.record_dialog.visiable = false
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
