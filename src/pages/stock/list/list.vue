<template lang="html">
  <div class="container">
    <div class="content_top_bar">库存查看</div>
    <div class="content_inner">
      <el-row class="hearder">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入内容" v-model="input">
            <el-select v-model="select" slot="prepend" placeholder="请选择">
              <el-option label="ISBN" value="1"></el-option>
              <el-option label="书名" value="2"></el-option>
              <el-option label="作者" value="3"></el-option>
              <el-option label="出版社" value="4"></el-option>
              <el-option label="库存量大于等于" value="5"></el-option>
              <el-option label="库存量小于" value="6"></el-option>
            </el-select>
          </el-input>
          <el-button size="small" type="primary">筛选</el-button>
          <el-button size="small" type="primary">重置</el-button>
        </el-col>
        <el-col :span="8">
          <el-button size="small" type="primary" style="float: right;">导出CSV</el-button>
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
          <el-table-column prop="title" label="书名"></el-table-column>
          <el-table-column prop="moment" label="库存量" width="80"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-button type="text">查看详情</el-button>
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
import mixin from "./list.js"
export default {
  mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./list.scss"
</style>
