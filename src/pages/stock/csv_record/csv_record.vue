<template lang="html">
  <div class="container">
    <div class="content_top_bar">导出记录</div>
    <div class="content_inner">
      <div class="gsy-card">
        <div class="gsy-header">
          <div class="gsy-tag">我们会在云端服务器帮您完成导出工作，<span style="font-weight: bold;">在此期间您可以随意关闭此页面</span>。过段时间后您回到此页面即可下载我们帮您导出的 csv 文件。
          </div>
          <span style="float: right; margin-right: 2px;">
            <el-button size="small" @click="getRecords"><i class="fa fa-refresh" style="margin-right: 8px;" aria-hidden="true"></i>刷新本页</el-button>
            <el-button size="small" icon="caret-left" @click="goBack">返回</el-button>
          </span>
        </div>
        <div class="gsy-body" v-loading="loading" element-loading-text="拼命加载中">
          <el-table :data="records" border style="width: 100%">
            <el-table-column prop="create_at_str" label="导出时间" width="200"></el-table-column>
            <el-table-column prop="condition" label="导出条件"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template scope="scope">
                <span style="color: #20A0FF;" v-if="scope.row.status == 1"><i class="el-icon-caret-right" style="margin-right: 5px;"></i>正在导出，您可以离开此页面</span>
                <el-button v-if="scope.row.status == 2" type="text" style="color: #13CE66;" @click="download(qiniu_url + scope.row.file_url)"><i class="fa fa-download" aria-hidden="true" style="margin-right: 7px;"></i>导出成功，点击下载</el-button>
                <span style="color: #FF4949;" v-if="scope.row.status == 3"><i class="el-icon-circle-cross" style="margin-right: 5px;"></i>导出失败，原因：{{scope.row.summary}}</span>
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
