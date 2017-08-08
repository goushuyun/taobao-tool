import axios from "../../../config/http.js"
import config from '../../../config/basis.js'
import {getToken, s2ab} from '../../../assets/script/utils.js'

function batch_upload_data(data) {
	return new Promise((resolve, reject) => {

		axios.post('/v1/stock/upload_goods_batch_data', data).then(resp => {

			if (resp.data.code == '00000') {
				resolve(resp.data)
			} else {
				reject(resp.data)
			}

		})

	})
}

function Workbook() {
	if (!(this instanceof Workbook))
		return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

function json_key_replace_reverse(json_str) {
	return JSON.parse(json_str.replace(/isbn/g, 'ISBN').replace(/warehouse/g, '库位').replace(/shelf/g, '架位').replace(/floor/g, '层数').replace(/num/g, '数量').replace(/error_reason/g, '错误原因'))
}

// save json to qiniu by excel format
function save_json_data_to_qiniu(json_data, filename){

	return new Promise((resolve, reject)=>{

		json_data = json_key_replace_reverse(JSON.stringify(json_data))

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
		let key = 'upload_excel/' + filename + moment().unix() + '.xlsx'
		getToken(config.bucket_zone, key).then(res => {
			var f = new FormData()
			f.append('token', res.data.token)
			f.append('file', blob)
			f.append('key', key)

			$.ajax({type: "POST", url: 'https://upload.qbox.me/', data: f, processData: false, contentType: false}).done(res => {

				if(res.key && res.key == key){
					resolve(res)
				}else{
					reject(res)
				}
			})
		})

	})

}


export {batch_upload_data, save_json_data_to_qiniu}
