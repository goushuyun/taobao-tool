import axios from "../../../config/http.js"

export default {
    methods: {
        total_out_number_change(){
            if(this.total_out_number > book_info.stock){
                this.total_out_number = book_info.stock
                return
            }


            console.log(this.total_out_number);
        },
        handleSelectionChange(val){

            console.log(val);

        },
        output() {
            // handle every map_row's output
            let data = []
            this.location_list.forEach(item=>{
                if(item.check){
                    data.push({
                        stock: item.out_number * (-1),
                        map_row_id: item.map_row_id
                    })
                }
            })

            axios.post('/v1/stock/update_map_row', {data}).then(res=>{
                console.log(res.data);
            })

        },

        isbn_search() {
            axios.post('/v1/stock/search_goods', {isbn: this.isbn}).then(res => {
                if(res.data.total_count === 1){
                    this.book_info = res.data.data[0]
                    this.goods_id = res.data.data[0].goods_id
                    this.total_stock = res.data.data[0].stock
                    this.total_count = res.data.total_count
                }

                this.getLocationList()
                console.log(res.data);
            })

            console.log(this.isbn);
        },

        getLocationList(){
            // list locations
            let params = {
                page: this.page,
                size: this.size,
                goods_id: this.goods_id
            }

            axios.post('/v1/stock/list_goods_all_locations', params).then(res=>{
                console.log(res.data);

                this.location_list = res.data.data.map(map_row=>{
                    map_row.check = false
                    map_row.out_number = 0
                    return map_row
                })
            })

        },

        handleSizeChange(){
            console.log('size');
        },

        handleCurrentChange(){
            console.log('page');
        }

    }
}
