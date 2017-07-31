<template lang="html">
  <div class="container">
    <div class="content_top_bar">单本上架</div>
    <div class="content_inner">
      <el-form ref="form" :model="form" label-width="60px" style="width:500px;">
        <el-form-item label="数 量">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="折 扣">
          <el-input v-model="form.name"><template slot="append">折</template></el-input>
        </el-form-item>
        <el-form-item label="新 旧">
          <el-radio-group v-model="form.resource">
            <el-radio label="二手书"></el-radio>
            <el-radio label="新书"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="库 位">
          <el-form :inline="true">
            <el-form-item>
              <el-input style="width: 80px;" size="small" v-model.trim="isbn"></el-input>
            </el-form-item>
            <el-form-item label="架位">
              <el-input style="width: 80px;" size="small" v-model.trim="isbn"></el-input>
            </el-form-item>
            <el-form-item label="层数">
              <el-input style="width: 80px;" size="small" v-model.trim="out"></el-input>
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="form.name" icon="search"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style lang="css">
</style>
