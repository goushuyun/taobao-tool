<template lang="html">
  <div class="container">
    <div class="content_top_bar">导出设置</div>
    <div class="content_inner" v-loading="loading" element-loading-text="正在保存设置">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col style="width: 500px;">
            <el-form-item prop="product_title" label="宝贝名称：">
              <el-input v-model="form.product_title" size="small" style="width: 370px;" @input="inputTitle"></el-input><br/>
              <label style="margin-right: 10px;">包含：</label>
              <el-checkbox v-model="isbn" label="isbn">ISBN</el-checkbox>
              <el-checkbox v-model="title" label="title">书名</el-checkbox>
              <el-checkbox v-model="publisher" label="publisher">出版社</el-checkbox>
              <el-checkbox v-model="author" label="author">作者</el-checkbox>
            </el-form-item>
            <el-form-item label="卖家地址：" required>
              <el-col :span="12">
                <el-form-item prop="province">
                  <el-input v-model="form.province" id="ipt_province" size="small" style="width: 140px;"></el-input>
                  <label for="ipt_province" style="margin-left: 10px;">省</label>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="city">
                  <el-input v-model="form.city" id="ipt_city" size="small" style="width: 140px;"></el-input>
                  <label for="ipt_city" style="margin-left: 10px;">市</label>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="图书售价：" required>
              <el-col :span="12">
                <el-form-item prop="discount">
                  <el-input v-model="form.discount" @blur="blurDiscount" min="0" max="10" id="ipt_price" size="small" type="number" style="width: 140px;" placeholder="9 折填 9"></el-input>
                  <label for="ipt_price" style="margin-left: 10px;">折</label>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="supplemental_fee">
                  <el-input v-model="form.supplemental_fee" @blur="blurSupplemental" id="ipt_extra" size="small" type="number" style="width: 140px;">
                    <template slot="prepend">另加</template>
                  </el-input>
                  <label for="ipt_extra" style="margin-left: 10px;">元</label>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-radio-group v-model="form.express_type">
              <el-form-item label="运费模式：" required>
                <el-col style="width: 114px;">
                  <el-radio label="0">自定义邮费</el-radio>
                </el-col>
                <el-col style="width: 90px;">
                  <el-form-item prop="pingyou_fee">
                    <el-input v-model="form.pingyou_fee" min="0" size="small" type="number" style="width: 75px;" placeholder="平邮" title="平邮（单位：元）"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="width: 90px;">
                  <el-form-item prop="express_fee">
                    <el-input v-model="form.express_fee" min="0" size="small" type="number" style="width: 75px;" placeholder="快递" title="快递（单位：元）"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="width: 90px;">
                  <el-form-item prop="ems_fee">
                    <el-input v-model="form.ems_fee" min="0" size="small" type="number" style="width: 75px;" placeholder="EMS" title="EMS（单位：元）"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-col style="width: 114px;">
                  <el-radio label="1">运费模板</el-radio>
                </el-col>
                <el-col style="width: 180px;">
                  <el-form-item prop="express_template">
                    <el-input v-model="form.express_template" size="small" style="width: 254px;" placeholder="运费模板ID" title="运费模板ID"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-radio label="2">卖家包邮</el-radio>
              </el-form-item>
            </el-radio-group>
            <el-form-item label="库存计数：" required>
              <el-radio-group v-model="form.reduce_stock_style">
                <el-radio label="1">拍下减库存</el-radio>
                <el-radio label="2">付款减库存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col style="width: 460px;">
            <el-form-item label="宝贝描述："></el-form-item>
            <el-form-item label="前缀：">
              <el-input v-model="form.prepend" type="textarea" :rows="6" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="后缀：">
              <el-input v-model="form.append" type="textarea" :rows="6" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit('form')">保存设置</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import mixin from "./csv_setting.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss" scoped>
@import "./csv_setting.scss"
</style>
