import axios from "../../../config/http.js"

export default {
    methods: {
        total_out_number_change(total_out_number){
            // 处理 <= 0
            if(this.total_out_number <= 0){
                this.total_out_number = 0
                this.clearCheckAndStock()
                return
            }

            // 处理大于总库存量情况
            if(this.total_out_number > this.total_stock){
                this.total_out_number = this.total_stock
            }

            // 为商户选择合适的库位
            for(let i = 0; i < this.location_list.length; i++){

                let remain_out_number = total_out_number, row = this.location_list[i]

                total_out_number -= row.stock

                if(total_out_number>0){
                    // 该库位被出库完, 去往下一个库位出库
                    row.check = true
                    row.out_number = row.stock
                }else{
                    // 该库位未被出库完，停止寻找下一个位置
                    row.check = true
                    row.out_number = remain_out_number
                    break
                }
            }

        },
        handleSelectionChange(val){

            console.log(val);

        },
        modify_out_number(row){
            console.log('------------');
            console.log('------------');
            console.log(row);
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

                this.location_list = []
                this.total_stock = 0
                this.goods_id = ''
                this.map_row_count = 0
                this.total_out_number = ''

                $('#isbn_input input').focus()
            })
        },

        isbn_search() {
            axios.post('/v1/stock/search_goods', {isbn: this.isbn}).then(res => {
                if(res.data.total_count === 0){
                    this.$message({
                        message: "未找到该图书",
                        type: 'warning'
                    })
                }

                if(res.data.total_count === 1){
                    this.book_info = res.data.data[0]
                    this.goods_id = res.data.data[0].goods_id
                    this.total_stock = res.data.data[0].stock

                    if(this.total_stock>0){
                        this.getLocationList()
                    }else{
                        this.$message({
                          message: '库存已告罄',
                          type: 'warning'
                        });
                    }
                }

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
                this.map_row_count = res.data.total

                $('#out_input input').focus()   //focus on out input
            })

        },

        handleSizeChange(){
            console.log('size');
        },

        handleCurrentChange(){
            console.log('page');
        },

        clearCheckAndStock(){
            this.location_list.forEach(row=>{
                row.check = false
                row.out_number = ''
            })
        }

    }
}
