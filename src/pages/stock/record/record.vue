<template lang="html">
  <div class="container">
    <div class="content_top_bar">出入库记录</div>
    <div class="content_inner">
      <div class="gsy-card">
        <div class="gsy-header">
          <div>
            <el-date-picker format="yyyy-MM-dd HH:00" v-model="time_range" style="width: 320px;" size="small" type="datetimerange" :picker-options="pickerOptions" placeholder="选择时间范围" align="right" @change="searchRecords"></el-date-picker>
            <el-input size="small" placeholder="请输入内容" v-model="isbn" @keyup.enter.native="searchRecords">
              <template slot="prepend">ISBN</template>
            </el-input>
            <el-button size="small" type="primary" @click="searchRecords">搜索</el-button>
            <el-button size="small" type="primary" @click="reset">重置</el-button>
          </div>
          <div style="margin-top: 15px;">
            <el-radio-group v-model="operate_type" size="small" @change="searchRecords">
              <el-radio-button label="unload">出库记录</el-radio-button>
              <el-radio-button label="load">入库记录</el-radio-button>
              <el-radio-button label="">全部记录</el-radio-button>
            </el-radio-group>
            <el-button style="float: right;" size="small" type="primary" @click="preExport">导出配货单</el-button>
          </div>
        </div>
        <div class="gsy-body">
          <el-table :data="records" border>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="180"></el-table-column>
            <el-table-column prop="book_title" label="书名" min-width="180"></el-table-column>
            <el-table-column label="库位 - 架位 - 层数" width="180">
              <template scope="scope">
                {{scope.row.warehouse}} - {{scope.row.shelf}} - {{scope.row.floor}}
              </template>
            </el-table-column>
            <el-table-column prop="stock" label="数量" width="120">
              <template scope="scope">
                <span v-if="scope.row.stock < 0" style="color: #FF4949;">{{scope.row.stock}}</span>
                <span v-else style="color: #13CE66;">+{{scope.row.stock}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="create_at" label="日期" width="200"></el-table-column>
            <el-table-column prop="user_name" label="操作人" width="120"></el-table-column>
          </el-table>
        </div>
        <el-dialog title="导出配货单" :visible.sync="record_dialog.visiable">
          <div class="gsy-card">
            <div class="gsy-body">
              <label style="margin-right: 7px;">出库时间：</label>
              <el-date-picker v-model="record_dialog.time_range" style="width: 320px;" size="small" type="datetimerange" :picker-options="pickerOptions" placeholder="选择时间范围" align="right" @change="preExport"></el-date-picker>
              <span style="color: #20A0FF;">共<span style="color: #FF4949;"> {{record_dialog.total_count}} </span>条出库记录</span>
            </div>
            <!-- <div class="gsy-footer" style="color: #888;">
              您上一次导出了 2017-06-02 12：00 至 2017-06-03 12：00 的数据
            </div> -->
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="record_dialog.visiable = false">取 消</el-button>
            <el-button size="small" type="primary" :disabled="record_dialog.total_count == 0" @click="confirmExport">导 出</el-button>
          </div>
        </el-dialog>

        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./record.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./record.scss"
</style>
