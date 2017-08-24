<template lang="html">
  <div class="container">
    <div class="content_top_bar">库存查看</div>
    <div class="content_inner">
      <div class="gsy-card">
        <el-row class="gsy-header">
          <el-col :span="24">
            <el-input size="small" placeholder="请输入内容" v-model="input" @keyup.enter.native="searchGoods">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="ISBN" value="isbn"></el-option>
                <el-option label="书名" value="title"></el-option>
                <el-option label="作者" value="author"></el-option>
                <el-option label="出版社" value="publisher"></el-option>
                <el-option label="库存量大于等于" value="greater"></el-option>
                <el-option label="库存量小于" value="less"></el-option>
              </el-select>
            </el-input>
            <el-button size="small" type="primary" @click="searchGoods">筛选</el-button>
            <el-button size="small" type="primary" @click="reset">重置</el-button>
            <span style="float: right;">
              <el-button v-if="pending_gatherd_total" type="text">当前有 <span style="color: #FF4949">{{pending_gatherd_total}}</span> 条数据正在采集中</el-button>
              <el-button size="small" @click="exportExcel">导出库存EXCEL</el-button>
              <el-dropdown split-button size="small" style="margin-left: 10px;" @click="exportCSV">导出淘宝CSV
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>设置导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </el-col>
        </el-row>
        <div class="gsy-body" v-loading="loading" element-loading-text="拼命加载中">
          <el-table :data="goods" border style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column label="封面" width="100">
              <template scope="scope">
                <div class="image_wrap">
                  <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="170"></el-table-column>
            <el-table-column prop="title" label="书名"></el-table-column>
            <el-table-column prop="stock" label="库存量"></el-table-column>
            <el-table-column prop="remark" label="备注">
              <template scope="scope">
                <el-row type="flex">
                  <el-tooltip v-if="scope.row.remark" placement="top" effect="dark" :enterable="false">
                    <div slot="content">{{scope.row.remark}}</div>
                    <div class="ellipsis">{{scope.row.remark}}</div>
                  </el-tooltip>
                  <el-button style="margin-left:10px" type="text" size="mini" icon="edit" @click="openRemarkDialog(scope.$index)"></el-button>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
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
      <el-dialog title="编辑备注信息" :visible.sync="remark_dialog.visible" size="tiny" :close-on-click-modal="false">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15 }" placeholder="请输入内容" v-model="remark_dialog.update_remark"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="remark_dialog.visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="comfirmUpdateRemark">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="exprot_excel_loading" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <div class="gsy-card">
          <div class="gsy-hearder time">
              <span>预计用时：{{forecast_time}}</span>，<span>实际用时：{{actual_time}}</span>
          </div>
        </div>
        <div style="height: 120px; width: 100%;" v-loading="exprot_excel_loading" element-loading-text="正在执行导出操作，请您不要离开当前页面！"></div>
      </el-dialog>
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
