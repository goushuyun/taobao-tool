import axios from "../../../config/http.js"
export default {
    data() {
        var checkIsbn = ( rule, value, callback ) => {
            var isbn = value.match( /\d/g ).join( '' )
            let isbnReg = /^978\d{10}$/
            if ( !isbnReg.test( isbn ) ) {
                callback( new Error( '请输正确的ISBN' ) );
            } else {
                this.book_info.isbn = isbn
            }
        };
        return {
            stock: 1,
            warehouse: '',
            shelf: '',
            floor: '',
            shelf_disabled: true,
            floor_disabled: true,
            location_id: '',
            isbn: '',
            records: [ {
                isbn: '9787123456789',
                location: 'A-0-1',
                moment: 10,
                status: 1
            }, {
                isbn: '9787123456789',
                location: 'C-2-1',
                moment: 10,
                status: 0
            } ],
            dialogFormVisible: false,
            dialogTableVisible: false,
            radio: 0,
            tableData: [ {
                image: '170411000001/9787121177408.jpg',
                isbn: '9787123456789',
                title: '数据结构',
                author: '谭浩强',
                publisher: '人民教育出版社',
                price: '15.00'
            }, {
                image: '170411000001/9787121177408.jpg',
                isbn: '9787123456789',
                title: '数据结构',
                author: '谭浩强',
                publisher: '人民教育出版社',
                price: '15.00'
            } ],
            book_info: {
                isbn: '',
                title: '',
                author: '',
                publisher: '',
                edition: '',
                image: '',
                price: ''
            },
            rules: {
                isbn: [ {
                    required: true,
                    message: '请填写ISBN',
                    trigger: 'blur'
                }, {
                    validator: checkIsbn,
                    trigger: 'blur'
                } ],
                title: [ {
                    required: true,
                    message: '请填写书名',
                    trigger: 'blur'
                } ],
                price: [ {
                    required: true,
                    message: '请填写图书原价',
                    trigger: 'blur'
                } ]
            },
            /* 上传logo的数据 */
            imagesFormData: {
                key: '',
                token: ''
            }
        }
    },
    watch: {
        warehouse( value ) {
            if ( value ) {
                this.shelf_disabled = false
            } else {
                this.shelf = ''
                this.shelf_disabled = true
            }
            // this.warehouse = value.replace(/![0-9a-zA-Z]/g, '')
        },
        shelf( value ) {
            if ( value ) {
                this.floor_disabled = false
            } else {
                this.floor = ''
                this.floor_disabled = true
            }
            // this.shelf = value.replace(/[\w]/g, '')
        },
        floor( value ) {
            // this.floor = value.replace(/[\w]/g, '')
        }
    },
    methods: {
        getLocationId() {
            axios.post( '/v1/stock/get_location_id', {
                "warehouse": this.warehouse, //仓库名称 required
                "shelf": this.shelf, //货架名称 required
                "floor": this.floor //层 required
            } ).then( resp => {
                if ( resp.data.message == 'ok' ) {
                    let data = resp.data.data
                    this.location_id = data.location_id
                }
            } )
        },
        /**
         * 获取本地图书信息
         */
        getLocalBookInfo() {
            axios.post( '/v1/book/get_local_book_info', {
                isbn: this.isbn
            } ).then( resp => {
                if ( resp.data.message == 'ok' ) {
                    let data = resp.data.data
                    if ( data.length == 1 ) {

                    }
                }
            } )
        },
        /**
         * 库存位置模糊查询
         */
        locationFazzyQuery( data, type ) {
            axios.post( '/v1/stock/location_fazzy_query', data ).then( resp => {
                if ( resp.data.message == 'ok' ) {
                    let data = resp.data.data
                }
            } )
        },
        /**
         * 商品入库
         */
        saveMapRow() {
            axios.post( '/v1/stock/save_map_row', {
                "goods_id": "23452345sfgsdfg", //required
                "location_id": "a2823b4a-c574-4fed-9695-8adf82231844", //required
                "stock": 1 //required not 0
            } ).then( resp => {
                if ( resp.data.message == 'ok' ) {
                    let data = resp.data.data
                }
            } )
        },
        search() {},
        queryWarehouse( query, cb ) {
            cb( [] )
        },
        queryShelf( query, cb ) {
            cb( [] )
        },
        queryFloor( query, cb ) {
            cb( [] )
        },
        handleSelect() {},
        beforeAvatarUpload() {},
        handleAvatarSuccess() {},
        handleAvatarError() {}
    }
}
