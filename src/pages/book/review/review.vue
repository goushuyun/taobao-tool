<template lang="html">
  <div class="container">
    <div class="content_top_bar">需要审核</div>
    <div class="content_inner">
      一二三四五，上山打老虎
    </div>
  </div>
</template>

<script>
import mixin from "./review.js"
export default {
    mixins: [mixin]
}
</script>

<style lang="scss">
@import "./review.scss"
</style>
