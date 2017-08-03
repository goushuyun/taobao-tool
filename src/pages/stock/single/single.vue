<template lang="html">
  <div class="container">
    <div class="content_top_bar">单本上架</div>
    <div class="content_inner">
      <el-form :inline="true">
        <el-form-item label="数 量">
          <el-input size="small" type="number" :min="1" style="width: 100px;" v-model="stock"></el-input>
        </el-form-item>
        <el-form-item label="库存位置">
          <el-autocomplete size="small" class="inline-input" style="width: 100px;" v-model="warehouse" :fetch-suggestions="queryWarehouse" placeholder="库位" @select="handleSelect"></el-autocomplete> -
          <el-autocomplete size="small" class="inline-input" style="width: 100px;" v-model="shelf" :disabled="shelf_disabled" :fetch-suggestions="queryShelf" placeholder="架位" @select="handleSelect"></el-autocomplete> -
          <el-autocomplete size="small" class="inline-input" style="width: 100px;" v-model="floor" :disabled="floor_disabled" :fetch-suggestions="queryFloor" placeholder="层数" @select="handleSelect"></el-autocomplete>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="ISBN">
          <el-input size="small" v-model.trim="isbn" style="width: 280px;" @keyup.enter.native="saveMapRow">
            <el-button slot="append" @click="saveMapRow">入库</el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="card">
        <div class="header">入库情况（只展示最近10本书的入库情况）</div>
        <div class="body">
          <el-table :data="records" border style="width: 100%">
            <el-table-column prop="isbn" label="ISBN" width="200"></el-table-column>
            <el-table-column prop="location" label="库位-架位-层数"></el-table-column>
            <el-table-column prop="moment" label="入库量" width="80"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template scope="scope">
                <el-tag v-if="scope.row.status == 1" type="success">入库成功</el-tag>
                <el-tag v-else type="danger">入库失败</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog title="选择图书" :visible.sync="dialogTableVisible">
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
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogTableVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="dialogTableVisible = false">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="选择图书" :visible.sync="dialogFormVisible">
        <div class="body">
          <el-form ref="book_info" :model="book_info" :rules="rules" label-width="80px" style="width: 300px;">
            <el-form-item label="ISBN" prop="isbn">
              <el-input id="isbn" size="small" :autofocus="true" icon="search" :on-icon-click="search" v-model.trim="book_info.isbn" v-on:keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="书 名" prop="title">
              <el-input size="small" :maxlength="30" v-model.trim="book_info.title"></el-input>
            </el-form-item>
            <el-form-item label="定 价" prop="price">
              <el-input size="small" min="0" type="number" v-model="book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
              <el-input size="small" v-model.trim="book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input size="small" v-model.trim="book_info.publisher"></el-input>
            </el-form-item>
            <el-form-item label="版 次" prop="edition">
              <el-input size="small" v-model.trim="book_info.edition"></el-input>
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
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
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
