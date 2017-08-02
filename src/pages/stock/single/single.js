export default {
  data() {
    var checkIsbn = (rule, value, callback) => {
      var isbn = value.match(/\d/g).join('')
      let isbnReg = /^978\d{10}$/
      if (!isbnReg.test(isbn)) {
        callback(new Error('请输正确的ISBN'));
      } else {
        this.book_info.isbn = isbn
      }
    };
    return {
      radio: 0,
      form: {
        moment: 1,
        stock: '',
        shelf: '',
        floor: '',
        isbn: ''
      },
      tableData: [{
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
      }],
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
        isbn: [{
          required: true,
          message: '请填写ISBN',
          trigger: 'blur'
        }, {
          validator: checkIsbn,
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请填写书名',
          trigger: 'blur'
        }],
        author: [{
          required: true,
          message: '请填写作者名称',
          trigger: 'blur'
        }],
        publisher: [{
          required: true,
          message: '请填写出版社名称',
          trigger: 'blur'
        }],
        edition: [{
          required: true,
          message: '请填写图书版次',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请填写图书原价',
          trigger: 'blur'
        }]
      },
      /* 上传logo的数据 */
      imagesFormData: {
        key: '',
        token: ''
      }
    }
  },
  methods: {
    search() {},
    beforeAvatarUpload() {},
    handleAvatarSuccess() {},
    handleAvatarError() {}
  }
}
