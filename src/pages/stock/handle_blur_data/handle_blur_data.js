import axios from "../../../config/http.js"

export default {
	methods : {
		// input warehouse
		input_warehouse(){
			// check warehouse info and input number

			console.log(this.book.warehouse || this.book.shelf);

			if(this.book.warehouse == '' || this.book.shelf == '' || this.book.floor == '' || this.book.num <= 0) {
				this.$message({
					type: 'warning',
					message: '库位信息 和 入库数量 必须填写完整！'
				})

				return
			}

			let book_id = ''

			for (var i = 0; i < this.poker_list.length; i++) {
				if(this.book_no == this.poker_list[i].book_no){
					book_id = this.poker_list[i].id
					break
				}
			}

			// get goods id
			axios.post('/v1/stock/save_goods', {book_id}).then(res=>{
				let goods_id = res.data.data[0].goods_id
				let location_id = ''

				// get location id
				let params = {
					warehouse: this.book.warehouse,
					shelf: this.book.shelf,
					floor: this.book.floor
				}
				axios.post('/v1/stock/get_location_id', params).then(res=>{
					location_id = res.data.data.location_id
					// input map_row
					params = {
						goods_id,
						location_id,
						stock: this.book.num
					}
					axios.post('/v1/stock/save_map_row', params).then(res=>{
						console.log(res.data);

						// handle over
						this.handle_over_pending_goods(this.pending_goods_id)
					})
				})
			})

		},

		del_pending_goods(){
			this.handle_over_pending_goods(this.pending_goods_id)
		},

		handle_over_pending_goods(goods_id){
			axios.post('/v1/stock/deal_goods_pending_check', {id: goods_id}).then(res=>{
				console.log(res.data);
				this.getData()

				this.$message('处理成功！')
			})
		},

		back() {
			this.$router.go(-1)
		},

		handle_page_change(page){
			this.page = page
			this.getData()
		},

		choose_this(index){
			this.book_no = this.poker_list[index].book_no

		},

        getData(){
            let param = {
                page: this.page,
                size: this.size
            }

            axios.post('/v1/stock/get_goods_pending_check_list', param).then(res=>{
                console.log(res);

				if(res.data.data.length > 0){
					this.total = res.data.total_count
					this.book = res.data.data[0]
					this.pending_goods_id = res.data.data[0].id
					this.book.create_at_format = moment.unix(res.data.data[0].create_at).format('YYYY/MM/DD HH:mm:ss')

					// to get poker list
					axios.post('/v1/book/get_local_book_info', {isbn: this.book.isbn}).then(res=>{
						console.log(res.data);
						this.poker_list = res.data.data
					})
				}else{
					this.$router.replace({name: 'batch'})
				}

            })
        }
	}
}
