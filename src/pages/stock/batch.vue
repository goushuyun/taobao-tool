<template lang="html">
  <div class="container">
    <div class="content_top_bar">批量上架</div>
    <div class="content_inner">
      一二三四五，上山打老虎
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('setSubMenuActive', '1')
  }
}
</script>

<style lang="css">
</style>
