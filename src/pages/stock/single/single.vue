<template lang="html">
  <div class="container">
    <div class="content_top_bar">单本上架</div>
    <div class="content_inner">
      <el-form :inline="true" ref="form" :model="form" label-width="60px">
        <el-form-item label="数 量">
          <el-input size="small" type="number" :min="1" style="width: 80px;" v-model="form.moment"></el-input>
        </el-form-item>
        <el-form-item label="库 位">
          <el-select size="small" filterable v-model="form.stock"></el-select>
        </el-form-item>
        <el-form-item label="架 位">
          <el-select size="small" filterable v-model="form.shelf"></el-select>
        </el-form-item>
        <el-form-item label="层 数">
          <el-select size="small" filterable v-model="form.floor"></el-select>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input size="small" v-model.trim="form.isbn" icon="search"></el-input>
        </el-form-item>
      </el-form>
      <div class="card" v-if="true">
        <div class="header">选择图书</div>
        <div class="body">
          <el-radio-group v-model="radio" style="width: 100%;">
            <div v-for="(book,index) in tableData" class="radio_item">
              <el-radio :label="index" class="radio">
                <div class="label">
                  <div class="image_wrap">
                    <img :src="book.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://images.goushuyun.cn/' + book.image)" class="image"></img>
                  </div>
                  <div>
                    <span>{{book.isbn}}</span> |
                    <span>{{book.title}}</span> |
                    <span>{{book.author}}</span> |
                    <span>{{book.publisher}}</span> | ￥
                    <span>{{book.price}}</span>
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
        </div>
        <div class="footer">
          <el-button size="small" type="default" style="width: 60px;">确定</el-button>
        </div>
      </div>
      <div class="card">
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
    </div>
  </div>
</template>

<script>
import mixin from "./single.js"
export default {
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./single.scss"
</style>
