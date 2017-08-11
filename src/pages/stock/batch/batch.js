export default {
	methods : {
		handle_dialog_close(){
			// 清除内存 excel 数据
			this.error_json = []
			this.excel_json = []
			this.correct_json = []
			this.process = 0
		},
		view_blur_data() {
			console.log(ISBN);

			let isbn = ISBN.parse('9787302289333')

			console.log(isbn.isIsbn10());
		},

		distinguish_data(excel_json) {
			excel_json.forEach((row, index) => {

				// check if has isbn attr
				if(!row.hasOwnProperty('isbn')){
					row.error_reason = 'ISBN为空'
					this.error_json.push(row)
					return
				}

				// check if isbn is correct
				row.isbn = row.isbn.trim().replace('-', '')
				let isbn = ISBN.parse(row.isbn)
				if(!isbn){
					row.error_reason = 'ISBN格式错误'
					this.error_json.push(row)
					return
				}

				// check if has num attr
				if(row.hasOwnProperty('num')){
					row.error_reason = '数量为空'
					this.error_json.push(row)
					return
				}

				// check if num is correct
				row.num = parseInt(row.num)
				if (row.num <= 0) {
					row.error_reason = '数量格式错误'
					this.error_json.push(row)
				} else {

					if (isbn.isValid()) {
						// is correct isbn
						if (isbn.isIsbn10) {
							row.isbn = isbn.asIsbn13()
						}
						this.correct_json.push(row)
					} else {
						// is wrong format isbn
						row.error_reason = 'ISBN格式错误'
						this.error_json.push(row)
					}

				}
			})

			console.log('----------correct_json-------------');
			console.log(JSON.stringify(this.correct_json));
			console.log('----------error_json-------------');
			console.log(JSON.stringify(this.error_json));

			// 写入前端检测到的错误数量
			this.fail_data_num += this.error_json.length
			console.log('------------------------------------');
		},

		onchange(evt) {
			var file;
			var files = evt.target.files;

			if (!files || files.length == 0)
				return;

			// start to handle upload data
			this.visible = true
			this.process += 10

			file = files[0];
			$('#upload_excel_input').val('')
			console.log('The file: ' + file.name + ' will upload ...');

			var reader = new FileReader()

			reader.onload = e => {
				// pre-process data
				var binary = "";
				var bytes = new Uint8Array(e.target.result);
				var length = bytes.byteLength;
				for (var i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}

				/* read workbook */
				var wb = XLSX.read(binary, {type: 'binary'});

				// map all sheet, and collect to on json obj
				for (let i = 0; i < wb.SheetNames.length; i++) {
					let ws = wb.Sheets[wb.SheetNames[i]]

					let tmp = XLSX.utils.sheet_to_json(ws)

					let demo_row = tmp[0]
					if(Object.keys(demo_row).length > 5){
						this.visible = false

						this.$message({
							message: '数据格式不正确，请下载示例模版查看',
							type: 'warning'
						})
						return
					}


					let tmp_json = this.json_key_replace(JSON.stringify(tmp))
					this.excel_json = this.excel_json.concat(tmp_json)
				}

				// 校验数据
				this.distinguish_data(this.excel_json)

				// 上传数据
				this.upload_data(this.correct_json, file.name)
			}

			reader.readAsArrayBuffer(file)
		}

	}
}
