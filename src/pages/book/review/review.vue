<template lang="html">
  <div class="container">
    <div class="content_top_bar">待审核</div>
    <div class="content_inner">
      <div class="gsy-card">
        <el-row class="gsy-header">
          <el-col>
            <el-radio-group v-model="search_type" size="small" @change="getOrganizedAuditList">
              <el-radio-button label="0">图书信息修改</el-radio-button>
              <el-radio-button label="1">新增图书（一号多书）</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
        <div class="gsy-body">
          <el-table :data="audit_list" border>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="image" label="原封面" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                    <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="180"></el-table-column>
            <el-table-column prop="title" label="原书名" width="180"></el-table-column>
            <el-table-column prop="price" label="原定价" width="100"></el-table-column>
            <el-table-column prop="publisher" label="原出版社" width="180"></el-table-column>
            <el-table-column prop="author" label="原作者" width="180"></el-table-column>
            <el-table-column prop="edition" label="原版次" width="100"></el-table-column>
            <el-table-column prop="participate_num" :label="search_type == '0' ? '申请人数（人）' : '添加图书（本）'" width="150"></el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
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

      <el-dialog title="待审核" :visible.sync="detail_dialog.visible" size="large" :close-on-click-modal="false" @close="getOrganizedAuditList">
        <div class="gsy-card">
          <div class="gsy-header">原标准图书信息</div>
          <div class="gsy-body">
            <el-table :data="detail_dialog.originals" border>
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
              <el-table-column prop="edition" label="版次"></el-table-column>
            </el-table>
          </div>
          <div class="gsy-footer"></div>
        </div>
        <div class="gsy-card">
          <div class="gsy-header">{{search_type === '0' ? '修改标准图书信息申请' : '新增图书申请（一号多书）'}}</div>
          <div class="gsy-body">
            <el-table :data="detail_dialog.apply_list" border>
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
              <el-table-column prop="apply_user_name" label="申请人" width="100"></el-table-column>
              <el-table-column prop="status" label="操作" fixed="right" width="200">
                <template scope="scope">
                  <el-button-group>
                    <el-button size="small" type="success" @click="adopt(scope.$index)">通过</el-button>
                    <el-button size="small" type="primary" @click="modify(scope.$index)">修改</el-button>
                    <el-button size="small" type="danger" @click="refuse(scope.$index)">驳回</el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="gsy-footer">
            <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="detail_dialog.size" layout="total, sizes, prev, pager, next, jumper" :total="detail_dialog.total_count" @size-change="handleDetailSizeChange" @current-change="handleDetailCurrentChange">
            </el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="detail_dialog.visible = false">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="再次修改" :visible.sync="add_dialog.visible">
        <div class="gsy-card">
          <div class="gsy-body" style="position: relative;">
            <el-form ref="add_book_info" :model="add_dialog" :rules="rules" label-width="80px" style="width: 300px;">
              <el-form-item label="ISBN" prop="isbn_no">
                <el-input disabled size="small" v-model.trim="add_dialog.isbn_no"></el-input>
              </el-form-item>
              <el-form-item label="书 名" prop="title">
                <el-input id="title" size="small" :maxlength="30" v-model.trim="add_dialog.title"></el-input>
              </el-form-item>
              <el-form-item label="定 价" prop="price">
                <el-input size="small" min="0" type="number" v-model="add_dialog.price"></el-input>
              </el-form-item>
              <el-form-item label="作 者" prop="author">
                <el-input size="small" v-model.trim="add_dialog.author"></el-input>
              </el-form-item>
              <el-form-item label="出版社" prop="publisher">
                <el-input size="small" v-model.trim="add_dialog.publisher"></el-input>
              </el-form-item>
              <el-form-item label="版 次" prop="edition">
                <el-input size="small" v-model.trim="add_dialog.edition"></el-input>
              </el-form-item>
            </el-form>
            <el-upload
              class="avatar-uploader"
              action="https://upload.qbox.me/"
              :data="imagesFormData"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError">
              <img v-if="add_dialog.image" :src="'http://taoimage.goushuyun.cn/' + add_dialog.image"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="add_dialog.visible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "./review.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./review.scss"
</style>
