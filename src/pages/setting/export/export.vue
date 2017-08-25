<template lang="html">
  <div class="container">
    <div class="content_top_bar">导出设置</div>
    <div class="content_inner">
      <el-row>
        <el-col style="width: 500px;">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="宝贝名称：">
              <el-input v-model="form.title" size="small" style="width: 360px;" placeholder="长度不能超过30个汉字或者60个英文字母"></el-input><br/>
              <el-checkbox-group v-model="form.title_range" id="cbx_title">
                <label for="cbx_title" style="margin-right: 10px;">包含：</label>
                <el-checkbox label="isbn">ISBN</el-checkbox>
                <el-checkbox label="title">书名</el-checkbox>
                <el-checkbox label="publisher">出版社</el-checkbox>
                <el-checkbox label="author">作者</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="卖家地址：">
              <el-input v-model="form.province" id="ipt_province" size="small" style="width: 140px;"></el-input>
              <label for="ipt_province" style="margin: 0 20px 0 10px;">省</label>
              <el-input v-model="form.city" id="ipt_city" size="small" style="width: 140px;"></el-input>
              <label for="ipt_city" style="margin: 0 10px;">市</label>
            </el-form-item>
            <el-form-item label="图书售价：">
              <el-input v-model="form.discount" id="ipt_price" size="small" type="number" style="width: 140px;" placeholder="9 折填 9"></el-input>
              <label for="ipt_price" style="margin: 0 20px 0 10px;">折</label>
              <el-input v-model="form.supplemental_fee" id="ipt_extra" size="small" type="number" style="width: 140px;">
                <template slot="prepend">另加</template>
              </el-input>
              <label for="ipt_extra" style="margin: 0 10px;">元</label>
            </el-form-item>
            <el-radio-group v-model="form.express_type">
              <el-form-item label="运费模式：">
                <el-radio label="0">自定义邮费</el-radio>
                <el-input v-model="form.pingyou_fee" size="small" type="number" style="width: 75px; margin-left: 10px;" placeholder="平邮" title="平邮（单位：元）"></el-input>
                <el-input v-model="form.express_fee" size="small" type="number" style="width: 75px; margin-left: 10px;" placeholder="快递" title="快递（单位：元）"></el-input>
                <el-input v-model="form.ems_fee" size="small" type="number" style="width: 75px; margin-left: 10px;" placeholder="EMS" title="EMS（单位：元）"></el-input>
              </el-form-item>
              <el-form-item>
                <el-radio label="1">运费模板</el-radio>
                <el-input v-model="form.express_template" size="small" style="width: 253.5px; margin-left: 24px;" placeholder="运费模板ID" title="运费模板ID"></el-input>
              </el-form-item>
              <el-form-item>
                <el-radio label="2">卖家包邮</el-radio>
              </el-form-item>
            </el-radio-group>
            <el-form-item label="库存计数：">
              <el-radio-group v-model="form.reduce_stock_style">
                <el-radio label="1">拍下减库存</el-radio>
                <el-radio label="2">付款减库存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="width: 460px;">
          <el-form ref="form" :model="form2" label-width="100px">
            <el-form-item label="宝贝描述："></el-form-item>
            <el-form-item label="前缀：">
              <el-input v-model="form2.prepend" type="textarea" :rows="6" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="后缀：">
              <el-input v-model="form2.append" type="textarea" :rows="6" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div style="width: 600px; padding-left: 100px;">
        <el-button size="small" type="primary" @click="onSubmit">保存设置</el-button>
        <el-button size="small" @click="goTOStockList">去导出</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "./export.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./export.scss"
</style>
