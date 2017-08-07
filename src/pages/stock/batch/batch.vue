<style lang="scss" scoped>

@import "./batch.scss";

</style>

<template lang="html">

<div class="container">
    <div class="content_top_bar">批量上架</div>
    <div class="content_inner">
       <div class="gsy-card">
           <div class="gsy-header">
              <header>
                  <div class="download_demo">
                    <el-button @click="download_demo" type="text"><i class="fa fa-file-excel-o" aria-hidden="true"></i> 下载模版Excel</el-button>
                  </div>
                  <!-- <a href=""></a> -->
                  <input type="file" @change="onchange">
                  <p @click="view_blur_data">你有 <span class="emphasis"> 3 条模糊数据 </span>需要处理</p>
              </header>
           </div>
           <div class="gsy-body">
               <el-table>
                   <el-table-column label="导入时间">

                   </el-table-column>
                   <el-table-column label="文件">

                   </el-table-column>
                   <el-table-column label="进度">

                   </el-table-column>
                   <el-table-column label="导入结果">

                   </el-table-column>
               </el-table>
           </div>
           <div class="gsy-footer">
               <el-pagination :current-page="page" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
               </el-pagination>
           </div>
       </div>
    </div>

    <!-- upload feedback dialog -->
    <el-dialog title="数据导入" :visible.sync="visible" :close-on-click-modal="false">

        <div class="progress">
            <el-progress type="circle" :percentage="100" status="success"></el-progress>
        </div>

        <!-- feedback info -->
        <div class="feedback_info">
            <p><span class="key_number">7条</span> 数据导入成功</p>
            <p><span class="key_number">17条</span> 模糊数据待处理</p>
        </div>

    </el-dialog>


</div>

</template>

<script>

import mixin from "./batch.js"
import utils from './utils.js'

export default {
    mixins: [mixin, utils],

    data() {
        return {
            // dialog params
            visible: false,

            // pagination data
            page: 0,
            size: 0,
            total: 0,

            // upload data
            excel_json: [],
            correct_json: [],
            error_json: []
        }
    }
}

</script>
