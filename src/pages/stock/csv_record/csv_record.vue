<template lang="html">
  <div class="container">
    <div class="content_top_bar">导出记录</div>
    <div class="content_inner">
      <div class="gsy-card">
        <div class="gsy-header">
          <el-tag type="primary">我们会在云端服务器帮您完成导出工作，在此期间您可以随意关闭此页面。过段时间后您回到此页面即可下载我们帮您导出的csv文件。</el-tag>
          <el-button type="text" style="float: right;" icon="caret-left" @click="goBack">返回</el-button>
        </div>
        <div class="gsy-body">
          <el-table :data="records" border style="width: 100%">
            <el-table-column prop="create_at_str" label="导出时间" width="200"></el-table-column>
            <el-table-column prop="summary" label="导出条件"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template scope="scope">
                <span style="color: #20A0FF;" v-if="scope.row.status == 1"><i class="el-icon-caret-right" style="margin-right: 5px;"></i>导出中 ···</span>
                <el-button v-if="scope.row.status == 2" type="text" style="color: #13CE66;" @click="download(qiniu_url + scope.row.file_url)"><i class="fa fa-download" aria-hidden="true" style="margin-right: 7px;"></i>导出成功</el-button>
                <span style="color: #FF4949;" v-if="scope.row.status == 3"><i class="el-icon-circle-cross" style="margin-right: 5px;"></i>导出失败</span>
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
import mixin from "./csv_record.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./csv_record.scss"
</style>
