import {
    priceInt,
    priceFloat,
    copyObject
} from '../../../assets/script/utils.js'
import config from '../../../config/basis.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            input: '',
            select: 'isbn',
            total_count: 0,
            setting_info: {},

            records: [],
            total_count: 0,
            page: 1,
            size: 10,
            loading: false
        }
    },
    mounted() {
        this.getRecords()
    },
    computed: {
        qiniu_url() {
            return config.image_url
        }
    },
    methods: {
        getRecords() {
            this.loading = true
            axios.post('/v1/stock/get_exported_taobao_csv_record', {
                "page": this.page,
                "size": this.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var self = this
                    var data = resp.data.data.map(el => {
                        el.create_at_str = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        el.condition = self.getExportCondition(el)
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.records = data
                }
                this.loading = false
            })
        },
        getExportCondition(data) {
            var condition = ''
            if (data.isbn != '') {
                condition = 'ISBN：' + data.isbn
            } else if (data.title != '') {
                condition = '书名：' + data.title
            } else if (data.author != '') {
                condition = '作者：' + data.author
            } else if (data.publisher != '') {
                condition = '出版社：' + data.publisher
            } else if (data.compare && data.stock) {
                if (data.compare === 'greater') {
                    condition = '库存量大于等于：' + data.stock
                } else if (data.compare === 'less') {
                    condition = '库存量小于：' + data.stock
                }
            } else {
                condition = '全部数据'
            }
            return condition
        },
        download(file_url) {
            window.location.href = file_url
        },
        handleSizeChange(size) {
            this.size = size
            this.getRecords()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getRecords()
        },
        goBack() {
            this.$router.push({
                name: 'list'
            })
        }
    }
}
