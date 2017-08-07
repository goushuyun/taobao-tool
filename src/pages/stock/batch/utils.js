import axios from "../../../config/http.js"
import {getToken, s2ab} from '../../../assets/script/utils.js'

var wopts = {
	bookType: 'xlsx',
	bookSST: false,
	type: 'binary'
};

export default {
	methods : {
		json_key_replace(json_str) {
			return JSON.parse(json_str.replace(/ISBN/g, 'isbn').replace(/库位/g, 'warehouse').replace(/架位/g, 'shelf').replace(/层数/g, 'floor').replace(/数量/g, 'num'))
		},

		json_key_replace_reverse(json_str) {
			return JSON.parse(json_str.replace(/isbn/g, 'ISBN').replace(/warehouse/g, '库位').replace(/shelf/g, '架位').replace(/floor/g, '层数').replace(/num/g, '数量').replace(/error_reason/g, '错误原因'))
		},

		download_demo() {
			this.visible = true
		},

		upload_data(data, filename) {
			axios.post('/v1/stock/upload_goods_batch_data', {data}).then(res => {
				console.log(res.data);

				// save upload_data to qiniu
				this.save_json_data_to_qiniu(this.json_data, filename + '_全部数据')
				// save error data to qiniu
				this.save_json_data_to_qiniu(this.error_json, filename + '_失败数据')

			})
		},
		save_json_data_to_qiniu(json_data, filename) {
			json_data = this.json_key_replace_reverse(JSON.stringify(json_data))

			// json to excel
			let ws = XLSX.utils.json_to_sheet(json_data),
				wb = new Workbook(),
				sheet_name = 'sheet1'
			wb.SheetNames.push(sheet_name)
			wb.Sheets[sheet_name] = ws

			var wbout = XLSX.write(wb, {
				bookType: 'xlsx',
				bookSST: true,
				type: 'binary'
			});
			var blob = new Blob([s2ab(wbout)], {type: "application/vnd.ms-excel"})

			// 获取 qiniu token 准备上传
			let key = filename + moment().unix() + '.xlsx'
			getToken(key).then(res => {
				var f = new FormData()
				f.append('token', res.data.token)
				f.append('file', blob)
				f.append('key', key)

				$.ajax({type: "POST", url: 'https://upload.qbox.me/', data: f, processData: false, contentType: false}).done(res => {
					console.log(res);
				})
			})

		}

	}
}
