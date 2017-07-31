<template lang="html">
  <div class="container">
    <div class="content_top_bar">书籍维护</div>
    <div class="content_inner">
      一二三四五，上山打老虎
    </div>
  </div>
</template>

<script>
import mixin from "./book.js"
export default {
  mixins: [mixin]
}
</script>

<style lang="scss">
@import "./book.scss"
</style>
