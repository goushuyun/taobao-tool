<template lang="html">
  <div class="container">
    <div class="content_top_bar">库存查看</div>
    <div class="content_inner">
      <el-row class="hearder">
        <el-col :span="16">
          <el-input size="small" placeholder="请输入内容" v-model="input">
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
        </el-col>
        <el-col :span="8">
          <el-button size="small" type="primary" style="float: right;">导出CSV</el-button>
        </el-col>
      </el-row>
      <div v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="goods" border style="width: 100%">
          <el-table-column type="index" width="60"></el-table-column>
          <el-table-column label="封面" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                    <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://otxkmhj3k.bkt.clouddn.com/' + scope.row.image)" class="image"></img>
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="160"></el-table-column>
          <el-table-column prop="title" label="书名"></el-table-column>
          <el-table-column prop="stock" label="库存量" width="80"></el-table-column>
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
      <el-dialog title="编辑备注信息" :visible.sync="remark_dialog.visible" size="tiny" :close-on-click-modal="false">
        <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 15 }" placeholder="请输入内容" v-model="remark_dialog.update_remark"></el-input>
        <div style="margin-top:20px">
          <el-button size="small" @click="remark_dialog.visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="comfirmUpdateRemark">确定</el-button>
        </div>
      </el-dialog>
      <div class="pagination">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
      </div>
      <el-dialog title="标准图书信息" :visible.sync="book_dialog.visible">
        <div class="body">
          <el-form ref="book_info" :model="book_info" :rules="rules" label-width="80px" style="width: auto;">
            <el-form-item label="ISBN" prop="isbn">
              <el-input id="isbn" :readonly="!book_dialog.modify" size="small" v-model.trim="book_info.isbn"></el-input>
            </el-form-item>
            <el-form-item label="书 名" prop="title">
              <el-input :readonly="!book_dialog.modify" size="small" :maxlength="30" v-model.trim="book_info.title"></el-input>
            </el-form-item>
            <el-form-item label="定 价" prop="price">
              <el-input :readonly="!book_dialog.modify" size="small" min="0" type="number" v-model="book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
              <el-input :readonly="!book_dialog.modify" size="small" v-model.trim="book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input :readonly="!book_dialog.modify" size="small" v-model.trim="book_info.publisher"></el-input>
              <span v-if="!book_dialog.modify" class="btn_modify">
                <el-button size="small" type="primary" style="width: 200px;" @click="preAudit">修改此书的标准图书信息</el-button>
              </span>
              <span v-else class="btn_modify">
                <el-button size="small" type="primary" style="width: 93px;" @click="book_dialog.modify = false">取 消</el-button>
                <el-button size="small" type="primary" style="width: 93px;" @click="submitModify('book_info')">提交审核</el-button>
              </span>
            </el-form-item>
            <el-form-item label="版 次" prop="edition">
              <el-input :readonly="!book_dialog.modify" size="small" v-model.trim="book_info.edition"></el-input>
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
            <img v-if="book_info.image" :src="book_info.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://otxkmhj3k.bkt.clouddn.com/' + book_info.image)"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="card">
          <div class="header">总库存量：{{book_dialog.tatal_stock}} 本</div>
          <div class="body">
            <el-table :data="book_dialog.locations">
              <el-table-column property="warehouse" label="库位"></el-table-column>
              <el-table-column property="shelf" label="架位"></el-table-column>
              <el-table-column property="floor" label="层数"></el-table-column>
              <el-table-column property="stock" label="库存量"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="book_dialog.total_count" @size-change="handleBookSizeChange" @current-change="handleBookCurrentChange">
                </el-pagination>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="此 isbn 对应的其他书籍" :visible.sync="other_dialog.visible">
        <el-table :data="other_dialog.books">
          <el-table-column property="isbn" label="ISBN"></el-table-column>
          <el-table-column property="title" label="书名"></el-table-column>
          <el-table-column property="price" label="定价"></el-table-column>
        </el-table>
        <el-button type="text" @click="add_dialog_visible = true">【新增图书】</el-button>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="other_dialog.visible = false">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新增图书" :visible.sync="add_dialog_visible">
        <div class="body">
          <el-form ref="book_info" :model="add_dialog_book_info" :rules="rules" label-width="80px" style="width: 300px;">
            <el-form-item label="ISBN" prop="isbn">
              <el-input id="isbn" size="small" v-model.trim="add_dialog_book_info.isbn"></el-input>
            </el-form-item>
            <el-form-item label="书 名" prop="title">
              <el-input size="small" :maxlength="30" v-model.trim="add_dialog_book_info.title"></el-input>
            </el-form-item>
            <el-form-item label="定 价" prop="price">
              <el-input size="small" min="0" type="number" v-model="add_dialog_book_info.price"></el-input>
            </el-form-item>
            <el-form-item label="作 者" prop="author">
              <el-input size="small" v-model.trim="add_dialog_book_info.author"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
              <el-input size="small" v-model.trim="add_dialog_book_info.publisher"></el-input>
            </el-form-item>
            <el-form-item label="版 次" prop="edition">
              <el-input size="small" v-model.trim="add_dialog_book_info.edition"></el-input>
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
            <img v-if="book_info.image" :src="'http://images.goushuyun.cn/' + book_info.image"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="add_dialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submitAudit('book_info')">确 定</el-button>
        </div>
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
