import {
    priceInt,
    priceFloat,
    copyObject
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
export default {
    data() {
        return {
            input: '',
            select: 'isbn',
            total_count: 0,
            setting_info: {}
        }
    },
    mounted() {
        this.getSetting()
    },
    methods: {
        getSetting() {
            axios.post('/v1/stock/get_taobao_setting', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    var setting_info = {
                        id: data.id,
                        product_title: data.product_title,
                        province: data.province,
                        city: data.city,
                        discount: data.discount,
                        supplemental_fee: data.supplemental_fee,
                        reduce_stock_style: data.reduce_stock_style,
                        product_describe: data.product_describe
                    }
                    if (data.pingyou_fee || data.express_fee || data.ems_fee) {
                        setting_info.pingyou_fee = data.pingyou_fee
                        setting_info.express_fee = data.express_fee
                        setting_info.ems_fee = data.ems_fee
                        setting_info.express_type = '0'
                    } else if (data.express_template) {
                        setting_info.express_template = data.express_template
                        setting_info.express_type = '1'
                    } else {
                        setting_info.express_type = '2'
                    }
                    this.setting_info = setting_info
                }
            })
        },
        exportCSV() {
            var request = {
                "discount": this.setting_info.discount, //required   45=4.5折
                "supplemental_fee": this.setting_info.supplemental_fee, //required
                "province": this.setting_info.province, //required
                "city": this.setting_info.city, //required
                "product_title": this.setting_info.product_title,
                "product_describe": this.setting_info.product_describe,
                "reduce_stock_style": this.setting_info.reduce_stock_style //required 1拍下减库存   2 付款减库存
            }

            if (this.setting_info.pingyou_fee || this.setting_info.express_fee || this.setting_info.ems_fee) {
                request.pingyou_fee = this.setting_info.pingyou_fee
                request.express_fee = this.setting_info.express_fee
                request.ems_fee = this.setting_info.ems_fee
            } else if (this.setting_info.express_template) {
                request.express_template = this.setting_info.express_template
            }

            // 检索条件
            if (this.select === 'greater' || this.select === 'less') {
                request['compare'] = this.select
                request['stock'] = this.input
            } else if (this.select === 'isbn') {
                var reg = /^978\d{10}_\d{2}$/
                if (reg.test(this.input)) {
                    var isbn_no = this.input.split('_')
                    request.isbn = isbn_no[0]
                    request.book_no = isbn_no[1]
                    request.book_cate = 'poker'
                } else {
                    request.isbn = this.input
                }
            } else {
                request[this.select] = this.input
            }

            console.log(request);
            // axios.post('/v1/stock/export_taobao_csv', request).then(resp => {
            //     if (resp.data.message == 'ok') {
            //         this.$message.success('导出CSV请求乙提交')
            //     }
            // })
        },
        searchGoods() {

        },
        exportSetting() {
            this.$router.push({
                name: 'export'
            })
        },
        goBack() {
            this.$router.go(-1)
        }
    }
}
