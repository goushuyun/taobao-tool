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
            size: 10
        }
    },
    mounted() {
        this.getRecords()
    },
    computed: {
        qiniu_url(){
            return config.image_url
        }
    },
    methods: {
        getRecords() {
            axios.post('/v1/stock/get_exported_taobao_csv_record', {
                "page": this.page,
                "size": this.size
            }).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data.map(el => {
                        // el.create_at_str = moment(el.create_at * 1000).format('yyyy-mm-dd HH:mm:ss')
                        el.create_at_str = moment(el.create_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        return el
                    })
                    this.total_count = resp.data.total_count
                    this.records = data
                }
            })
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
            this.$router.go(-1)
        }
    }
}
