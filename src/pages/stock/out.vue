<template lang="html">
  <div class="container">
    <div class="content_top_bar">图书出库</div>
    <div class="content_inner">
      <el-form :inline="true">
        <el-form-item label="ISBN">
          <el-input id="isbn" size="small" v-model.trim="isbn" @keyup.enter.native="getData"></el-input>
        </el-form-item>
        <el-form-item label="库存总量：" label-width="200px">
          <span>11</span>
        </el-form-item>
        <el-form-item label="出库量：" label-width="100px">
          <el-input style="width: 80px;" size="small" v-model.trim="out" @keyup.enter.native="confirmOut"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="confirmOut">出库</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" border style="width: 100%">
         <el-table-column prop="isbn" label="ISBN" width="160"></el-table-column>
         <el-table-column prop="title" label="书名"></el-table-column>
         <el-table-column prop="price" label="售价" width="80"></el-table-column>
         <el-table-column prop="stock" label="库位"></el-table-column>
         <el-table-column prop="shelf" label="架位"></el-table-column>
         <el-table-column prop="floor" label="层数" width="80"></el-table-column>
         <el-table-column prop="moment" label="库存量" width="80"></el-table-column>
         <el-table-column prop="out" label="出库量" width="80"></el-table-column>
       </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isbn: '',
      out: '',
      tableData: [{
        isbn: '9787123456789',
        title: '数据结构',
        price: '15.00',
        stock: '大仓库',
        shelf: 'A货架',
        floor: '1层',
        moment: 10,
        out: 1
      }, {
        isbn: '9787123456789',
        title: '数据结构',
        price: '15.00',
        stock: '大仓库',
        shelf: 'A货架',
        floor: '1层',
        moment: 10,
        out: 1
      }, {
        isbn: '9787123456789',
        title: '数据结构',
        price: '15.00',
        stock: '大仓库',
        shelf: 'A货架',
        floor: '1层',
        moment: 10,
        out: 1
      }]
    }
  },
  mathods: {
    getData() {

    },
    confirmOut() {

    }
  }
}
</script>

<style lang="css">
</style>
