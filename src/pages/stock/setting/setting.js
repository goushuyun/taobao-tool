export default {
  data() {
    return {
      stock: '',
      shelf: '',
      floor: '',
      select: '1',
      tableData: [{
        image: '',
        isbn: '9787123456789',
        title: '数据结构',
        moment: 10,
        remark: ''
      }, {
        image: '',
        isbn: '9787123456789',
        title: '数据结构',
        moment: 10,
        remark: ''
      }, {
        image: '',
        isbn: '9787123456789',
        title: '数据结构',
        moment: 10,
        remark: ''
      }],

      loading: false,
      size: 10,
      total_count: 100
    }
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
