<template lang="html">
  <div class="container">
    <div class="content_top_bar">图书详情</div>
    <div class="content_inner">
      <div class="gsy-card">
        <div class="gsy-header" style="position: relative;">
          <el-form ref="book_info" :model="book_info" :rules="rules" label-width="80px" style="width: auto;">
            <el-form-item label="ISBN" prop="isbn_no">
              <el-input disabled size="small" v-model.trim="book_info.isbn_no" :title="book_info.isbn_no"></el-input>
            </el-form-item>
            <el-form-item id="title" label="书 名" prop="title">
              <el-input :disabled="!modify" size="small" v-model.trim="book_info.title" :title="book_info.title" @input.native.capture="inputTitle"></el-input>
            </el-form-item>
            <el-form-item label="定 价" prop="price">
              <el-input :disabled="!modify" size="small" min="0" type="number" v-model="book_info.price" :title="book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
              <el-input :disabled="!modify" size="small" v-model.trim="book_info.author" :title="book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input :disabled="!modify" size="small" v-model.trim="book_info.publisher" :title="book_info.publisher"></el-input>
              <span v-if="!modify" class="btn_modify">
                <el-button :disabled="cannot_modify" size="small" type="primary" style="width: 200px;" @click="preModify">{{cannot_modify ? '您已经提交了修改图书信息的申请' : '修改此书的标准图书信息'}}</el-button>
              </span>
              <span v-else class="btn_modify">
                <el-button size="small" type="primary" style="width: 93px;" @click="cancelModify">取 消</el-button>
                <el-button size="small" type="primary" style="width: 93px;" @click="submitModify('book_info')">提交审核</el-button>
              </span>
            </el-form-item>
            <el-form-item label="版 次" prop="edition">
              <el-input :disabled="!modify" size="small" v-model.trim="book_info.edition" :title="book_info.edition"></el-input>
              <span class="btn_show">
                <el-button size="small" type="primary" style="width: 200px;" @click="openOtherDialog">查看此ISBN对应的其他书籍</el-button>
              </span>
            </el-form-item>
            <el-form-item>
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
            <img v-if="book_info.image" :src="book_info.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + book_info.image)"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <div class="btn-back">
            <el-button type="text" icon="caret-left" @click="goBack">返回</el-button>
          </div>
        </div>
        <div class="gsy-body">
          <div style="margin-bottom: 15px;">总库存量：{{book_info.stock}} 本</div>
          <el-table :data="locations">
            <el-table-column property="warehouse" label="库位"></el-table-column>
            <el-table-column property="shelf" label="架位"></el-table-column>
            <el-table-column property="floor" label="层数"></el-table-column>
            <el-table-column property="stock" label="库存量"></el-table-column>
          </el-table>
        </div>
        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleBookSizeChange" @current-change="handleBookCurrentChange">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="此 isbn 对应的其他书籍" :visible.sync="other_dialog.visible">
        <el-table :data="other_dialog.books">
          <el-table-column property="isbn_no" label="ISBN" width="160"></el-table-column>
          <el-table-column property="title" label="书名"></el-table-column>
          <el-table-column property="price" label="定价" width="100"></el-table-column>
        </el-table>
        <el-button type="text" @click="preAddBook">【新增图书】</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="other_dialog.visible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增图书" :visible.sync="add_dialog.visible">
        <div class="gsy-card">
          <div class="gsy-header">已经提交的新增图书申请：</div>
          <div class="gsy-body">
            <el-table :data="add_dialog.audit_list">
              <el-table-column property="isbn" label="ISBN" width="160"></el-table-column>
              <el-table-column property="title" label="书名"></el-table-column>
              <el-table-column property="price" label="定价" width="100"></el-table-column>
            </el-table>
          </div>
          <div class="gsy-footer" style="margin-bottom: 15px;">
            <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="add_dialog.size" layout="total, sizes, prev, pager, next, jumper" :total="add_dialog.total_count" @size-change="handleAddSizeChange" @current-change="handleAddCurrentChange">
            </el-pagination>
          </div>
        </div>
        <div class="gsy-card">
          <div class="gsy-header">填写信息：</div>
          <div class="gsy-body">
            <el-form ref="add_book_info" :model="add_book_info" :rules="rules" label-width="80px" style="width: 300px;">
              <el-form-item label="ISBN" prop="isbn">
                <el-input disabled size="small" v-model.trim="add_book_info.isbn"></el-input>
              </el-form-item>
              <el-form-item label="书 名" prop="title">
                <el-input id="title" size="small" :maxlength="30" v-model.trim="add_book_info.title"></el-input>
              </el-form-item>
              <el-form-item label="定 价" prop="price">
                <el-input size="small" min="0" type="number" v-model="add_book_info.price"></el-input>
              </el-form-item>
              <el-form-item label="作 者" prop="author">
                <el-input size="small" v-model.trim="add_book_info.author"></el-input>
              </el-form-item>
              <el-form-item label="出版社" prop="publisher">
                <el-input size="small" v-model.trim="add_book_info.publisher"></el-input>
              </el-form-item>
              <el-form-item label="版 次" prop="edition">
                <el-input size="small" v-model.trim="add_book_info.edition"></el-input>
              </el-form-item>
            </el-form>
            <el-upload
              class="avatar-uploader"
              action="https://upload.qbox.me/"
              :data="imagesFormData"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAddAvatarSuccess"
              :on-error="handleAddAvatarError">
              <img v-if="add_book_info.image" :src="'http://taoimage.goushuyun.cn/' + add_book_info.image"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="add_dialog.visible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitAudit('add_book_info')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from "./detail.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./detail.scss"
</style>
