<template lang="html">
  <div class="container">
    <div class="content_top_bar">我的申请</div>
    <div class="content_inner">
      <div class="gsy-card">
        <el-row class="gsy-header">
          <el-col>
            <el-radio-group v-model="search_type" size="small" @change="getAuditList">
              <el-radio-button label="0">图书信息修改</el-radio-button>
              <el-radio-button label="1">新增图书（一号多书）</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="status" style="margin-left: 50px;" @change="getAuditList">
              <el-radio label="0">全部</el-radio>
              <el-radio label="1">审核中</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核未通过</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <div class="gsy-body">
          <el-table :data="audit_list" border>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="create_at" label="申请时间" width="120"></el-table-column>
            <el-table-column prop="image" label="图片" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                    <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="180"></el-table-column>
            <el-table-column prop="title" label="书名" width="180"></el-table-column>
            <el-table-column prop="price" label="定价" width="100"></el-table-column>
            <el-table-column prop="publisher" label="出版社" width="180"></el-table-column>
            <el-table-column prop="author" label="作者" width="180"></el-table-column>
            <el-table-column prop="edition" label="版次" width="100"></el-table-column>
            <el-table-column prop="status" label="状态" fixed="right" width="100">
              <template scope="scope">
                <span v-if="scope.row.status == 1" style="color: #20A0FF;">待审核</span>
                <span v-else-if="scope.row.status == 2" style="color: #13CE66">审核通过</span>
                <span v-else style="color: #FF4949">审核失败<span v-if="scope.row.feedback">：{{scope.row.feedback}}</span></span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="操作" fixed="right" width="100">
              <template scope="scope">
                <el-button type="text" @click="showDetail(scope.$index)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="申请详情" :visible.sync="detail_dialog.visible" size="large" :close-on-click-modal="false">
        <div class="gsy-card">
          <div class="gsy-header">{{search_type === '0' ? '我提交的修改申请' : '我提交的新增图书申请'}}</div>
          <div class="gsy-body">
            <el-table :data="detail_dialog.apply_list" border>
              <el-table-column prop="image" label="图片" width="100">
                <template scope="scope" >
                  <div class="image_wrap">
                      <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="isbn" label="isbn" width="180"></el-table-column>
              <el-table-column prop="title" label="书名" width="180"></el-table-column>
              <el-table-column prop="price" label="定价" width="100"></el-table-column>
              <el-table-column prop="publisher" label="出版社" width="180"></el-table-column>
              <el-table-column prop="author" label="作者" width="180"></el-table-column>
              <el-table-column prop="edition" label="版次" width="100"></el-table-column>
              <el-table-column prop="check_user_name" label="审核人" width="100"></el-table-column>
              <el-table-column v-if="search_type === '0'" prop="create_at" label="申请时间" width="200"></el-table-column>
              <el-table-column prop="status" label="审核结果" fixed="right" width="100">
                <template scope="scope">
                  <span v-if="scope.row.status == 1" style="color: #20A0FF;">待审核</span>
                  <span v-else-if="scope.row.status == 2" style="color: #13CE66">审核通过</span>
                  <span v-else style="color: #FF4949">审核失败<span v-if="scope.row.feedback">：{{scope.row.feedback}}</span></span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="gsy-footer"></div>
        </div>
        <div class="gsy-card">
          <div class="gsy-header">最新标准图书信息</div>
          <div class="gsy-body">
            <el-table :data="detail_dialog.newest" border>
              <el-table-column prop="image" label="图片" width="100">
                <template scope="scope" >
                  <div class="image_wrap">
                      <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="isbn_no" label="isbn" width="180"></el-table-column>
              <el-table-column prop="title" label="书名"></el-table-column>
              <el-table-column prop="price" label="定价" width="100"></el-table-column>
              <el-table-column prop="publisher" label="出版社"></el-table-column>
              <el-table-column prop="author" label="作者"></el-table-column>
              <el-table-column prop="edition" label="版次" width="100"></el-table-column>
            </el-table>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="detail_dialog.visible = false">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import mixin from "./apply.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./apply.scss"
</style>
