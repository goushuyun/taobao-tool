import axios from "../../../config/http.js"

export default {
    methods: {
        output() {
            console.log('kai');
        },

        isbn_search() {
            let params = {
                isbn: this.isbn,
                upload_mode: 1
            }
            axios.post('/v1/book/get_book_info', params).then(res => {
                console.log(res.data);
            })
						
            console.log(this.isbn);
        }
    }
}
