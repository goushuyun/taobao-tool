import axios from "../../../config/http.js"

export default({

	methods: {
        download_demo() {
            this.visible = true
        },


        handleSizeChange(size){
            this.size = size
            this.getData()
        },
        handleCurrentChange(page){
            this.page = page
            this.getData()
        },
		getData() {
            let params = {
                page: this.page,
                size: this.size
            }

            axios.post('/v1/stock/get_goods_batch_upload_records', params).then(res=>{
                res = res.data

                this.total = res.total_count

                this.record_list = res.data.map(record=>{

                    record.create_at_format = moment.unix(record.create_at).format('YYYY-MM-DD HH:mm:ss')


                    return record
                })


            })



        }
	}

})
