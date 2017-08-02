<template lang="html">
  <div class="container">
    <div class="content_top_bar">书籍维护</div>
    <div class="content_inner">
      <el-row class="hearder">
        <el-col>
          <el-input size="small" placeholder="请输入内容" v-model="input">
            <template slot="prepend">ISBN</template>
          </el-input>
          <el-button size="small" type="primary">搜索</el-button>
          <el-button size="small" type="primary">重置</el-button>
        </el-col>
      </el-row>
      <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="封面" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                    <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://images.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="160"></el-table-column>
          <el-table-column prop="title" label="书名" min-width="200"></el-table-column>
          <el-table-column prop="price" label="定价" width="80"></el-table-column>
          <el-table-column prop="publisher" label="出版社" width="200"></el-table-column>
          <el-table-column prop="author" label="作者" width="80"></el-table-column>
          <el-table-column prop="edition" label="版次" width="80"></el-table-column>
          <el-table-column label="操作" width="140">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑书籍信息" placement="top">
                <el-button type="primary" size="small">编辑</el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加此isbn对应的其他书籍" placement="top">
                <el-button type="primary" size="small">添加</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./book.js"
export default {
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./book.scss"
</style>
