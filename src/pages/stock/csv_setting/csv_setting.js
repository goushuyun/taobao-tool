import {
    priceInt,
    priceFloat
} from '../../../assets/script/utils.js'
import axios from "../../../config/http.js"
var product_describe = '<div style="font-size: 14px; color: #666;">\
<div style="padding: 15px; line-height: 24px;"><prepend>{{prepend}}</prepend></div>\
<div style="width: 100%;font-size: 18px; line-height: 36px; color: #e4393c; padding-left: 5px; border-bottom: 2px solid #e4393c; box-sizing: border-box;">基本信息</div>\
<div style="padding: 15px; line-height: 24px; display: flex; flex-wrap: wrap;">\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">ISBN：{{isbn}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">出版社：{{publisher}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">作者：{{author}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">版次：{{edition}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">出版时间：{{pubdate}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">页数：{{page}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">包装：{{packing}}</div>\
<div style="min-width: 220px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">开本：{{format}}</div></div>\
<div style="width: 100%;font-size: 18px; line-height: 36px; color: #e4393c; padding-left: 5px; border-bottom: 2px solid #e4393c; box-sizing: border-box;">图书详细</div>\
<div style="padding: 0 15px 18px 15px;width: 100%; border-bottom: 1.5px dashed #e4393c;box-sizing: border-box;">{{catalog}}</div>\
<div style="padding: 0 15px 18px 15px; width: 100%; border-bottom: 1.5px dashed #e4393c; box-sizing: border-box;">{{abstract}}</div>\
<div style="padding: 0 15px 18px 15px;box-sizing: border-box;">{{author_intro}}</div>\
<div style="padding: 15px; line-height: 24px;"><append>{{append}}</append></div></div>'
export default {
    data() {
        var checkDiscount = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('折扣不能为空'));
            }
            if (value < 0 || value > 10) {
                callback(new Error('折扣应在 0-10 之间'));
            } else {
                callback();
            }
        };
        return {
            form: {
                id: '',

                product_title: '',

                province: '', // 省份
                city: '', // 城市

                discount: '', //折扣
                supplemental_fee: '0', // 额外费用

                express_type: '2',

                pingyou_fee: '', // 平邮费用
                express_fee: '', // 快递费用
                ems_fee: '', // EMS费用

                express_template: '', // 运费模板

                reduce_stock_style: '1', // --1 拍下减库存 2 付款减库存

                product_describe: '',
                prepend: '',
                append: ''
            },

            isbn: false,
            title: false,
            publisher: false,
            author: false,

            rules: {
                product_title: [{
                    required: true,
                    message: '请输入宝贝名称',
                    trigger: 'change'
                }],
                province: [{
                    required: true,
                    message: '请输入卖家所在省份',
                    trigger: 'change'
                }],
                city: [{
                    required: true,
                    message: '请输入卖家所在城市',
                    trigger: 'change'
                }],
                discount: [{
                    validator: checkDiscount,
                    trigger: 'change'
                }],
                supplemental_fee: [{
                    required: true,
                    message: '请输入额外费用',
                    trigger: 'change'
                }]
            },

            loading: false,

            edit: false // 防止获取设置信息时checkbox的值改变影响project_title
        }
    },
    mounted() {
        this.getSetting()
    },
    watch: {
        isbn(value) {
            if (this.edit === true) {
                if (value === true) {
                    this.form.product_title += '{{isbn}}'
                } else {
                    this.form.product_title = this.form.product_title.replace(/{{isbn}}/g, '')
                }
            }
        },
        title(value) {
            if (this.edit === true) {
                if (value === true) {
                    this.form.product_title += '{{title}}'
                } else {
                    this.form.product_title = this.form.product_title.replace(/{{title}}/g, '')
                }
            }
        },
        publisher(value) {
            if (this.edit === true) {
                if (value === true) {
                    this.form.product_title += '{{publisher}}'
                } else {
                    this.form.product_title = this.form.product_title.replace(/{{publisher}}/g, '')
                }
            }
        },
        author(value) {
            if (this.edit === true) {
                if (value === true) {
                    this.form.product_title += '{{author}}'
                } else {
                    this.form.product_title = this.form.product_title.replace(/{{author}}/g, '')
                }
            }
        }
    },
    methods: {
        blurDiscount() {
            this.form.discount = parseFloat(this.form.discount).toFixed(1)
        },
        blurSupplemental() {
            this.form.supplemental_fee = parseFloat(this.form.supplemental_fee).toFixed(2)
        },
        inputTitle() {
            this.edit = false
            this.isbn = this.form.product_title.search(/{{isbn}}/g) > 0
            this.title = this.form.product_title.search(/{{title}}/g) > 0
            this.publisher = this.form.product_title.search(/{{publisher}}/g) > 0
            this.author = this.form.product_title.search(/{{author}}/g) > 0
            this.$nextTick(() => {
                this.edit = true
            })
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.discount == 0) {
                        this.$confirm('您当前设置的折扣为 0 折, 是否继续?', '提示', {
                            confirmButtonText: '继续',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.updateSetting()
                        }).catch(() => {});
                    } else {
                        this.updateSetting()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getSetting() {
            this.edit = false
            axios.post('/v1/stock/get_taobao_setting', {}).then(resp => {
                if (resp.data.message == 'ok') {
                    var data = resp.data.data
                    var setting_info = {
                        id: data.id,
                        product_title: data.product_title,
                        province: data.province, // 省份
                        city: data.city, // 城市
                        discount: parseFloat(data.discount / 10).toFixed(1), //折扣
                        supplemental_fee: data.supplemental_fee ? priceFloat(data.supplemental_fee) : '0.00', // 额外费用
                        reduce_stock_style: data.reduce_stock_style, // --1 拍下减库存 2 付款减库存
                        product_describe: data.product_describe
                    }

                    if (data.pingyou_fee || data.express_fee || data.ems_fee) {
                        setting_info.pingyou_fee = data.pingyou_fee ? priceFloat(data.pingyou_fee) : data.pingyou_fee + ''
                        setting_info.express_fee = data.express_fee ? priceFloat(data.express_fee) : data.express_fee + ''
                        setting_info.ems_fee = data.ems_fee ? priceFloat(data.ems_fee) : data.ems_fee + ''
                        setting_info.express_type = '0'
                    } else if (data.express_template) {
                        setting_info.express_template = data.express_template
                        setting_info.express_type = '1'
                    } else {
                        setting_info.express_type = '2'
                    }

                    setting_info.prepend = /<prepend>.*<\/prepend>/.exec(data.product_describe)
                    if (setting_info.prepend != null) {
                        setting_info.prepend = setting_info.prepend.toString().replace(/<prepend>|<\/prepend>/g, '')
                    } else {
                        setting_info.prepend = ''
                    }

                    setting_info.append = /<append>.*?<\/append>/.exec(data.product_describe)
                    if (setting_info.append != null) {
                        setting_info.append = setting_info.append.toString().replace(/<append>|<\/append>/g, '')
                    } else {
                        setting_info.append = ''
                    }

                    this.form = setting_info

                    this.isbn = data.product_title.indexOf('{{isbn}}') > 0
                    this.title = data.product_title.indexOf('{{title}}') > 0
                    this.publisher = data.product_title.indexOf('{{publisher}}') > 0
                    this.author = data.product_title.indexOf('{{author}}') > 0

                    this.$nextTick(() => {
                        this.edit = true
                    })
                }
            })
        },
        updateSetting() {
            var request = {
                "id": this.form.id,
                "product_title": this.form.product_title,
                "province": this.form.province,
                "city": this.form.city,
                "discount": this.form.discount == 0 ? 0 : parseInt(this.form.discount * 10), //45=4.5折
                "supplemental_fee": this.form.supplemental_fee == 0 ? 0 : priceInt(this.form.supplemental_fee), //400 = 4元
                "reduce_stock_style": this.form.reduce_stock_style, //required 1拍下减库存   2 付款减库存
                "product_describe": product_describe.replace(/{{prepend}}/g, this.form.prepend).replace(/{{append}}/g, this.form.append)
            }
            console.log(request);
            switch (this.form.express_type) {
                case '0': // 自定义模板
                    if (this.form.pingyou_fee && this.form.express_fee && this.form.ems_fee) {
                        request.pingyou_fee = priceInt(this.form.pingyou_fee)
                        request.express_fee = priceInt(this.form.express_fee)
                        request.ems_fee = priceInt(this.form.ems_fee)
                    } else {
                        this.$message.warning('请输入全部自定义邮费')
                        return
                    }
                    break;
                case '1': // 运费模板id
                    if (this.form.express_template) {
                        request.express_template = this.form.express_template
                    } else {
                        this.$message.warning('请输入运费模板的 ID')
                        return
                    }
                    break;
                case '2': // 包邮
                    break;
                default:
                    break;
            }
            this.loading = true
            axios.post('/v1/stock/update_taobao_setting', request).then(resp => {
                if (resp.data.message == 'ok') {
                    this.$message.success('设置已经保存成功！')
                }
                this.loading = false
                this.goBack()
            })
        },
        goBack() {
            this.$router.go(-1)
        }
    }
}
