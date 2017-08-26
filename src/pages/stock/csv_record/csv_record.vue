<template lang="html">
  <div class="container">
    <div class="content_top_bar">导出记录</div>
    <div class="content_inner">
      <el-button style="float: right;" size="small" @click="goBack">返回</el-button>
      
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
