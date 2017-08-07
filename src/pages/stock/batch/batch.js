export default {
	mounted() {
		this.$store.commit('setSubMenuActive', '1-1')
	},

	methods : {
		view_blur_data() {
			console.log(ISBN);

			let isbn = ISBN.parse('9787302289333')

			console.log(isbn);

			console.log(isbn.isIsbn10());
		},

		distinguish_data(excel_json) {
			excel_json.forEach(row => {
				let isbn = ISBN.parse(row.isbn.trim().replace('-', ''))
				row.num = parseInt(row.num)

				if (row.num <= 0) {
					row.error_reason = '数量格式错误'
					this.error_json.push(row)
				} else {

					if (isbn) {
						// is correct isbn
						if (isbn.isIsbn10) {
							row.isbn = isbn.asIsbn13()
						}

						this.correct_json.push(row)
					} else {
						row.error_reason = 'ISBN格式错误'
						this.error_json.push(row)
					}

				}
			})

			console.log('----------correct_json-------------');
			console.log(JSON.stringify(this.correct_json));
			console.log('----------error_json-------------');
			console.log(JSON.stringify(this.error_json));
			console.log('------------------------------------');
		},

		onchange(evt) {
			var file;
			var files = evt.target.files;

			if (!files || files.length == 0)
				return;

			file = files[0];

			console.log(file.name);

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

					let tmp_json = this.json_key_replace(JSON.stringify(tmp))
					this.excel_json = this.excel_json.concat(tmp_json)
				}

				// 校验数据
				this.distinguish_data(this.excel_json)
				// 上传数据
				this.upload_data(this.correct_json, file.name)
			}

			reader.readAsArrayBuffer(file)
		},

		upload_file(file) {},

		input_file(newFile, oldFile) {
			console.log('input_file');
			console.log(newFile);
			console.log(oldFile);

			var URL = window.URL || window.webkitURL
			if (URL && URL.createObjectURL) {
				this.$refs.upload.update(newFile, {
					blob: URL.createObjectURL(newFile.file)
				})
			}

			var reader = new FileReader()

			reader.onload = function(e) {
				var data = e.target.result;

				var workbook;
				if (rABS) {
					/* if binary string, read with type 'binary' */
					workbook = XLSX.read(data, {type: 'binary'});
				} else {
					/* if array buffer, convert to base64 */
					var arr = fixdata(data);
					workbook = XLSX.read(btoa(arr), {type: 'base64'});
				}

				/* DO SOMETHING WITH workbook HERE */

				/* grab first sheet */
				var wsname = workbook.SheetNames[0];
				var ws = workbook.Sheets[wsname];

				console.log(wsname);
				console.log(ws);

				/* generate HTML */
				var HTML = XLSX.utils.sheet_to_html(ws);

				console.log(HTML);

			};

			reader.readAsBinaryString(newFile);
		}

	}
}
