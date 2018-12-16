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
                this.table_loading = false
            }
        },
        total_out_number_change(total_out_number){
            // 处理 <= 0
            // Add check if total_out_number is inputed by uncareful double shot
            // For example, the user double shot and input a ISBN number into Input Box
            if (this.total_out_number <= 0 || this.total_out_number > 99999){
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
                let row = this.location_list[i]

                if(total_out_number <= 0){
                    // 出库流程已走完
                    row.check = false
                    row.out_number = 0
                }else{
                    let remain_out_number = total_out_number

                    total_out_number -= row.stock

                    if(total_out_number>0){
                        // 该库位被出库完, 去往下一个库位出库
                        row.check = true
                        row.out_number = row.stock
                    }else{
                        // 该库位未被出库完，停止寻找下一个位置
                        row.check = true
                        row.out_number = remain_out_number
                    }
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
            console.log(index)
            this.location_list[index].out_number = ''
        },
        output() {
            if(this.total_stock == 0 || !this.can_out) return false

            // start handle output
            this.is_outputing = true

            // handle every map_row's output
            let data = [], current_page_out = 0
            this.location_list.forEach(item=>{
                if(item.check){
                    current_page_out += item.out_number

                    data.push({
                        stock: item.out_number * (-1),
                        map_row_id: item.map_row_id,
                        location_id: item.location_id
                    })
                }
            })

            // 当前页面的
            axios.post('/v1/stock/update_map_row', {data}).then(res=>{
                this.location_list = []
                this.total_stock = 0
                this.map_row_count = 0
                this.isbn = ''
                $('#isbn_input input').focus()

                var still_need_out = this.total_out_number - current_page_out
                if(still_need_out === 0){
                    this.total_out_number = ''
                    this.goods_id = ''

                    // 提示出库成功
                    this.$message('出库成功')
                    var audio = document.getElementById('audio')
                    audio.play()
                    this.is_outputing = false
                    return
                }

                if(still_need_out > 0){
                    // 出完当前页面的库存，仍有期望的库存未出库
                    let params = {
                        goods_id: this.goods_id,
                        page: 1,
                        size: still_need_out
                    }

                    axios.post('/v1/stock/list_goods_all_locations', params).then(res=>{
                        let to_out = []

                        for (var i = 0; i < res.data.data.length; i++) {
                            let item = res.data.data[i]
                            let curret_count = still_need_out
                            still_need_out -= item.stock

                            if(still_need_out > 0){
                                to_out.push({
                                    stock: item.stock * -1,
                                    map_row_id: item.map_row_id,
                                    location_id: item.location_id
                                })
                            }else{
                                to_out.push({
                                    stock: curret_count * -1,
                                    map_row_id: item.map_row_id,
                                    location_id: item.location_id
                                })
                                break
                            }

                        }

                        axios.post('/v1/stock/update_map_row', {data: to_out}).then(res=>{
                            this.total_out_number = ''
                            this.goods_id = ''

                            // 提示出库成功
                            this.$message('出库成功')
                            var audio = document.getElementById('audio')
                            audio.play()
                            this.is_outputing = false
                            return
                        })


                    })

                }

            })

        },
        operate_book_dialog(){
            this.choose_book_visible = true

            console.log(this.choose_book_visible);
        },
        isbn_search() {
            this.table_loading = true

            // split isbn and book_no
            var real_isbn = this.isbn.split('_')[0]
            var book_no = this.isbn.split('_')[1]

            // check isbn is corret or not
            let isbn = ISBN.parse(real_isbn)
            if(!isbn){
                this.$message({
                    message: 'ISBN 格式错误！',
                    type: 'warning'
                })
                this.table_loading = false
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
                    this.table_loading = false
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
                        this.table_loading = false
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

                this.table_loading = false
            })

        },

        handleSizeChange(size){
            this.table_loading = true
            this.page = 1
            this.size = size
            this.getLocationList()
        },

        handleCurrentChange(page){
            this.table_loading = true
            this.page = page
            this.getLocationList()
        },

        clearCheckAndStock(){
            this.location_list.forEach(row=>{
                row.check = false
                row.out_number = ''
            })
        }

    }
}
