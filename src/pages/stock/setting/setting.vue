<template lang="html">
  <div class="container">
    <div class="content_top_bar">仓库设置</div>
    <div class="content_inner">
      <el-row class="hearder">
        <el-col>
          <span>仓库位置：</span>
          <el-input size="small" placeholder="库位" v-model="stock"></el-input> -
          <el-input size="small" placeholder="架位" v-model="shelf"></el-input> -
          <el-input size="small" placeholder="层数" v-model="floor"></el-input>
          <el-button size="small" type="primary">搜索</el-button>
          <el-button size="small" type="primary">新增货架</el-button>
          <el-button size="small" type="primary">生成货架条码</el-button>
        </el-col>
      </el-row>
      <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="库位 - 架位 - 层数"></el-table-column>
          <el-table-column prop="moment" label="库存量" width="80"></el-table-column>
          <el-table-column label="操作" width="260">
            <template scope="scope">
              <el-button type="primary" size="small">查看此货架书籍</el-button>
              <el-button type="primary" size="small">修改</el-button>
              <el-button type="primary" size="small">删除</el-button>
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
import mixin from "./setting.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./setting.scss"
</style>
