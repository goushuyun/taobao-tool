export default {
    data() {
        return {
            input: '',
            select: '1',
            tableData: [{
                image: '',
                isbn: '9787123456789',
                title: '数据结构',
                price: '15.00',
                publisher: '电子工业出版社',
                author: '谭浩强',
                edition: '第四版'
            }],

            loading: false,
            size: 10,
            total_count: 100
        }
    },
    mounted() {
        this.$store.commit('setSubMenuActive', '2-1')
    },
    methods: {
        handleSizeChange(size) {
            this.size = size
        },
        handleCurrentChange(page) {
            this.page = page
        }
    }
}
