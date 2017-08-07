<style lang="scss" scoped>
@import "./out.scss";
</style>

<template lang="html">

<div class="container">
    <div class="content_top_bar">图书出库</div>
    <div class="content_inner">
      <div class="gsy-card">
        <div class="gsy-header">
          <label for="isbn_input" style="margin-right: 7px;">ISBN</label>
          <el-input id="isbn_input" style="width: auto;" size="small" icon="search" autofocus :on-icon-click="isbn_search" v-model.trim="isbn" @keyup.enter.native="isbn_search"></el-input>
          <label for="isbn_input" style="margin: 0 7px 0 50px;">库存总量：</label>
          <span>{{total_stock}}</span>
          <label for="isbn_input" style="margin: 0 7px 0 30px;">出库量：</label>
          <el-input id="out_input" @input.native="total_out_number_change(total_out_number)" style="width: 80px;" size="small" v-model.number="total_out_number"></el-input>
          <el-button :disabled="total_stock == 0" style="margin-left: 15px;" size="small" type="primary" @click="output">出库</el-button>
        </div>
        <el-row class="gsy-body" :gutter="10">
          <el-col :span="17">
            <el-table ref="multipleTable" @selection-change="handleSelectionChange" stripe border style="width: 100%" :data="location_list">
              <el-table-column width="55">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.check"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column label="库位-货架-层数">
                <template scope="scope">
                  {{scope.row.warehouse}} - {{scope.row.shelf}} - {{scope.row.floor}}
                </template>
              </el-table-column>
              <el-table-column label="库存量" width="80" prop="stock"></el-table-column>
              <el-table-column label="出货量">
                <template scope="scope">
                  <el-input size="mini" style="max-width: 100px;" v-model.number="scope.row.out_number">
                    <template slot="append">本</template>
                  </el-input>
                </template>
              </el-table-column>
            </el-table>

            <footer style="margin-top: 22px;" v-show="map_row_count > 0">
              <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="page"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="map_row_count">
            </el-pagination>
          </footer>
        </el-col>

        <el-col :span="7" v-show="book_info.stock > 0">
          <div class="book_info">

            <div class="image_box">
              <img class="book_image" :src="'http://otxkmhj3k.bkt.clouddn.com/' + book_info.image" alt="">
            </div>

            <ul class="info_detail">
              <li>
                <span class="key">书名</span>
                <span class="val">{{book_info.title}}</span>
              </li>
              <li>
                <span class="key">作者</span>
                <span class="val">{{book_info.author}}</span>
              </li>
              <li v-show="book_info.publisher != ''">
                <span class="key">出版社</span>
                <span class="val">{{book_info.publisher}}</span>
              </li>
              <li>
                <span class="key">定价</span>
                <span class="val">{{(book_info.price/100).toFixed(2)}}</span>
              </li>
              <li>
                <span class="key">isbn</span>
                <span class="val">{{book_info.isbn}}</span>
              </li>
            </ul>

          </div>
        </el-col>

      </el-row>
      </div>
    </div>
</div>

</template>

<script>
import mixin from "./out.js"
export default {
    mixins: [mixin],
    data() {
        return {
            // 图书信息
            book_info: {
                title: '',
                author: '',
                publisher: '',
                price: 0,
                isbn: '',
                image: '',
                stock: 0
            },

            isbn: '9787115383440', //current goods isbn
            size: 10,
            page: 1,

            map_row_count: 0, // 归属位置数量
            goods_id: '', // current goods id
            total_stock: 0, // 总库存量

            total_out_number: '', // 总出库量

            // 库位罗列
            location_list: [],

        }
    }
}
</script>
