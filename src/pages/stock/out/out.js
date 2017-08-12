import axios from "../../../config/http.js"

export default {
    mounted() {
        //do something after creating vue instance
        $('#isbn_input input').focus()
        this.$store.commit('setMenuActive', 'stock')
        localStorage.setItem('menu_active', 'stock')
        this.$store.commit('setSubMenuActive', 'out')
        localStorage.setItem('sub_menu_active', 'out')
    },
    methods: {
        handleChecked(book){
            console.log(book);
            this.book_info = book
            this.goods_id = book.goods_id
            this.total_stock = book.stock

            if(this.total_stock>0){
                this.getLocationList()
            }else{
                this.$message({
                  message: '库存已告罄',
                  type: 'warning'
                });
            }
        },
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
        handle_check_change(index){
            let row = this.location_list[index]

            if(!row.check){
                row.out_number = 0
            }

            this.total_out_number = this.actual_total_out_number
            $('#out_input input').focus()   //focus on out input
        },
        handleSelectionChange(val){

            console.log(val);

        },
        modify_out_number(index){
            let row = this.location_list[index]

            row.out_number = parseInt(row.out_number)

            // 判断是否是合法的整数
            if(row.out_number <= 0 || isNaN(row.out_number)){
                row.out_number = 0
            }

            // 判断出货量是否多于库存
            if(row.out_number > row.stock) {
                row.out_number = row.stock
            }

            if(row.out_number > 0) row.check = true
            this.total_out_number = this.actual_total_out_number
        },
        handle_click_input(index){
            console.log(index);f
            this.location_list[index].out_number = ''
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

                // 提示出库成功
                this.$message('出库成功')
                this.isbn = ''
            })
        },
        operate_book_dialog(){
            this.choose_book_visible = true

            console.log(this.choose_book_visible);
        },
        isbn_search() {
            // split isbn and book_no
            var real_isbn = this.isbn.split('_')[0]
            var book_no = this.isbn.split('_')[1]

            console.log(real_isbn);
            console.log(book_no);

            // check isbn is corret or not
            let isbn = ISBN.parse(real_isbn)
            if(!isbn){
                this.$message({
                    message: 'ISBN 格式错误！',
                    type: 'warning'
                })
                return
            }

            this.isbn = isbn.asIsbn13()
            axios.post('/v1/stock/search_goods', {isbn: real_isbn}).then(res => {

                // not found this book
                if(res.data.total_count === 0){
                    this.$message({
                        message: "未找到该图书",
                        type: 'warning'
                    })
                    return
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
                }else{
                    if(book_no){
                        for (var i = 0; i < res.data.data.length; i++) {
                            if(res.data.data[i].book_no == book_no){
                                this.handleChecked(res.data.data[i])
                                return
                            }
                        }
                    }

                    this.wait_choose_books = res.data.data
                    this.choose_book_visible = true
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
                this.total_out_number = ''
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
