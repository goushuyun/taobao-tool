<template lang="html">
  <div class="container">
    <div class="content_top_bar">信息维护</div>
    <div class="content_inner">
      <div class="gsy-card">
        <el-row class="gsy-header">
          <el-col>
            <el-input size="small" placeholder="请输入内容" v-model="isbn" @keyup.enter.native="searchGoods">
              <template slot="prepend">ISBN</template>
            </el-input>
            <el-button size="small" type="primary" @click="searchGoods">搜索</el-button>
            <el-button size="small" type="primary" @click="reset">重置</el-button>
          </el-col>
        </el-row>
        <div class="gsy-body" v-loading="loading" element-loading-text="拼命加载中">
          <el-table :data="goods" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="封面" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                  <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="180"></el-table-column>
            <el-table-column prop="title" label="书名" min-width="180"></el-table-column>
            <el-table-column prop="price" label="定价" width="100"></el-table-column>
            <el-table-column prop="publisher" label="出版社" width="180"></el-table-column>
            <el-table-column prop="author" label="作者" width="100"></el-table-column>
            <el-table-column prop="edition" label="版次" width="100"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
              <template scope="scope">
                <el-button type="text" @click="openBookDialog(scope.$index)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./maintain.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./maintain.scss"
</style>
