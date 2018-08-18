import axios from "../../../config/http.js"
import {batch_upload_data, save_json_data_to_qiniu} from './promise_func.js'
export default {
	methods : {
		json_key_replace(json_str) {
			return JSON.parse(json_str.replace(/ISBN/g, 'isbn').replace(/库位/g, 'warehouse').replace(/架位/g, 'shelf').replace(/层数/g, 'floor').replace(/数量/g, 'num'))
		},

		json_key_replace_reverse(json_str) {
			return JSON.parse(json_str.replace(/isbn/g, 'ISBN').replace(/warehouse/g, '库位').replace(/shelf/g, '架位').replace(/floor/g, '层数').replace(/num/g, '数量').replace(/error_reason/g, '错误原因'))
		},

		// save excel_json and error_json to qiniu
		handle_work_after_upload_over(filename){
			var origin_filename = filename , fail_filename = filename + '_失败数据'
			var origin_file_key = ''
			var error_file_key = ''

			// save upload_data to qiniu
			save_json_data_to_qiniu(this.excel_json, filename).then(res=>{
				origin_file_key = res.key

				if(this.error_json.length > 0) {
					// save error data to qiniu
					save_json_data_to_qiniu(this.error_json, filename + '_失败数据').then(res=>{
						error_file_key = res.key

						// 插入上传记录
						let params = {
							success_num: this.success_data_num + this.blur_data_num,
							failed_num: this.fail_data_num,
							origin_file: origin_file_key,
							origin_filename: origin_filename,
							error_file: error_file_key
						}

						this.save_upload_record(params)
					})
				}else{

					// 插入上传记录
					let params = {
						success_num: this.success_data_num + this.blur_data_num,
						failed_num: this.fail_data_num,
						origin_file: origin_file_key,
						origin_filename: origin_filename
					}

					this.save_upload_record(params)
				}

			})
		},

		upload_data(filename) {
			// check if it still need upload
			if(this.need_upload_time === 0) {
				this.handle_work_after_upload_over(filename)
				return
			}

			let will_upload_data = this.excel_json_copy.splice(0, this.upload_num_per)
			let can_upload_data = this.distinguish_data(will_upload_data)

			// check if skip this upload
			if(can_upload_data.length === 0){
				this.need_upload_time--
				this.upload_data(filename)
				return
			}

			batch_upload_data({data: can_upload_data}).then(res=>{
				this.need_upload_time--
				console.log(res);

				this.fail_data_num += res.failed_data.length
				this.success_data_num += res.success_num
				this.blur_data_num += res.pending_check_num
				this.process = parseFloat((this.process + this.per_add_process).toFixed(1))

				// upload it continue
				this.upload_data(filename)
			})
		},

		// save file upload record
		save_upload_record(record_params){
			axios.post('/v1/stock/save_goods_batch_upload_record', record_params).then(res=>{
				console.log(res.data);
				this.process = 100
				this.refresh_table()

				let _this = this
				let timer = 5

				let interval = setInterval(() => {
          this.dialog_title = '数据导入完成(' + timer + '秒后关闭窗口)'
					if (timer === 0) {
						clearInterval(interval)
            _this.visible = false
					}
          timer--
				}, 1000)
			})
		}

	}
}
