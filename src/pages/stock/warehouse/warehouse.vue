<template lang="html">
  <div class="container">
    <div class="content_top_bar">仓库查看</div>
    <div class="content_inner">
      <div v-show="!show_detail" class="gsy-card">
        <div class="gsy-header">
          <div class="location">
            <label style="margin-right: 7px;">库存位置</label>
            <el-autocomplete id="warehouse" size="small" class="inline-input" style="width: 100px;" v-model.trim="warehouse" :fetch-suggestions="queryWarehouse" placeholder="库位" @select="selectWarehouse" @focus.native.capture="focusWarehouse"></el-autocomplete> -
            <el-autocomplete id="shelf" size="small" class="inline-input" style="width: 100px;" v-model.trim="shelf" :disabled="shelf_disabled" :fetch-suggestions="queryShelf" placeholder="架位" @select="selectShelf" @focus.native.capture="selectWarehouse"></el-autocomplete> -
            <el-autocomplete id="floor" size="small" class="inline-input" style="width: 100px;" v-model.trim="floor" :disabled="floor_disabled" :fetch-suggestions="queryFloor" placeholder="层数" @select="selectFloor" @focus.native.capture="selectShelf"></el-autocomplete>
            <el-button size="small" style="margin-left: 15px;" type="primary" @click="warehouse = ''">重置</el-button>
            <span class="total">总库存量：{{total}} 本</span>
          </div>
        </div>
        <div class="gsy-body" v-loading="loading" element-loading-text="拼命加载中">
          <el-table :data="locations" border style="width: 100%">
            <el-table-column label="库位 - 架位 - 层数">
              <template scope="scope">
                {{scope.row.warehouse}} - {{scope.row.shelf}} - {{scope.row.floor}}
              </template>
            </el-table-column>
            <el-table-column prop="total_stock" label="库存量" width="150"></el-table-column>
            <el-table-column label="操作" width="260">
              <template scope="scope">
                <el-button type="primary" size="small" @click="showDetail(scope.$index)">查看此层书籍</el-button>
                <el-button type="primary" size="small" @click="preModifyLocation(scope.$index)">修改</el-button>
                <el-button type="" size="small" @click="preDeleteLocation(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total_count" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </div>
      <el-dialog title="修改货架位" size="tiny" :visible.sync="modify_dialog.visible">
        <el-form ref="modify_dialog" :rules="rules" label-width="120px" :model="modify_dialog" class="modify">
          <el-form-item label="仓库名" prop="warehouse">
            <el-input v-model.trim="modify_dialog.warehouse"></el-input>
          </el-form-item>
          <el-form-item label="货架名" prop="shelf">
            <el-input v-model.trim="modify_dialog.shelf"></el-input>
          </el-form-item>
          <el-form-item label="层数" prop="floor">
            <el-input v-model.trim="modify_dialog.floor"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modify_dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="comfirmModifyLocation('modify_dialog')">确 定</el-button>
        </div>
      </el-dialog>
      <div v-show="show_detail" class="gsy-card">
        <el-row class="gsy-header">
          <el-col :span="24" class="goods">
            <el-input size="small" placeholder="请输入内容" v-model="input" @blur="blurInput" @keyup.enter.native="searchGoods">
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="ISBN" value="isbn"></el-option>
                <el-option label="书名" value="title"></el-option>
                <el-option label="作者" value="author"></el-option>
                <el-option label="出版社" value="publisher"></el-option>
                <el-option label="库存量大于等于" value="greater"></el-option>
                <!-- <el-option label="库存量小于" value="less"></el-option> -->
              </el-select>
            </el-input>
            <el-button size="small" type="primary" @click="searchGoods()">筛选</el-button>
            <el-button size="small" type="primary" @click="reset">重置</el-button>
            <el-button style="float: right;" type="text" size="small" icon="close" @click="show_detail = false"></el-button>
          </el-col>
        </el-row>
        <div class="gsy-body" v-loading="loading" element-loading-text="拼命加载中">
          <el-table :data="goods" border style="width: 100%">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column label="封面" width="100">
              <template scope="scope" >
                <div class="image_wrap">
                  <img :src="scope.row.image == '' ? 'http://image.goushuyun.cn/book.png' : ('http://taoimage.goushuyun.cn/' + scope.row.image)" class="image"></img>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isbn_no" label="ISBN" width="170"></el-table-column>
            <el-table-column prop="title" label="书名"></el-table-column>
            <el-table-column prop="this_stock" label="此库存量" sortable width="120"></el-table-column>
            <el-table-column prop="stock" label="总库存量" width="120"></el-table-column>
            <el-table-column label="操作" width="100">
              <template scope="scope">
                <el-button type="text" @click="openBookDialog(scope.$index)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="gsy-footer">
          <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="goods_size" layout="total, sizes, prev, pager, next, jumper" :total="goods_total_count" @size-change="handleGoodsSizeChange" @current-change="handleGoodsCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./warehouse.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./warehouse.scss"
</style>
