<template lang="html">
  <div class="gsy-edit">
    <div class="header">新增图书</div>
    <div class="body">
      <el-form ref="book_info" :model="book_info" :rules="rules" label-width="80px" style="width: 300px;">
        <el-form-item label="ISBN" prop="isbn">
          <el-input id="isbn" size="small" :autofocus="true" icon="search" :on-icon-click="search" v-model.trim="book_info.isbn" v-on:keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="书 名" prop="title">
          <el-input size="small" :maxlength="30" v-model.trim="book_info.title"></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input size="small" v-model.trim="book_info.publisher"></el-input>
        </el-form-item>
        <el-form-item label="作 者" prop="author">
          <el-input size="small" v-model.trim="book_info.author"></el-input>
        </el-form-item>
        <el-form-item label="版 次" prop="edition">
          <el-input size="small" v-model.trim="book_info.edition"></el-input>
        </el-form-item>
        <el-form-item label="定 价" prop="price">
          <el-input size="small" min="0" type="number" v-model="book_info.price"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="default" style="width: 60px;">确定</el-button>
        </el-form-item>
      </el-form>
      <el-upload
        class="avatar-uploader"
        action="https://upload.qbox.me/"
        :data="imagesFormData"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError">
        <img v-if="book_info.image" :src="'http://images.goushuyun.cn/' + book_info.image"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GsyEdit',
  props: {

  },
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
</script>

<style lang="scss" scoprd>
.avatar-uploader,
.el-upload {
  border: 1px dashed #bfcbd9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 330px;
  width: 230px;
  height: 230px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-height: 230px;
    max-width: 230px;
  }

  &:hover {
    border-color: #20a0ff;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 230px;
  height: 230px;
  line-height: 230px;
  text-align: center;
}
</style>
