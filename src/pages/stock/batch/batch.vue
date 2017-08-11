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
                    <el-button @click="download_file('http://image1.goushuyun.cn/DemoExcel.xlsx')" type="text"><i class="fa fa-file-excel-o" aria-hidden="true"></i> 下载模版Excel</el-button>
                  </div>
                  <!-- <a href=""></a> -->
                  <input type="file" @change="onchange" id="upload_excel_input" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                  <p @click="view_blur_data">你有 <span class="emphasis"> 3 条模糊数据 </span>需要处理</p>
              </header>
           </div>
           <div class="gsy-body">
               <el-table :data="record_list">
                   <el-table-column label="导入时间">
                       <template scope="scope">
                           <span class="time">{{scope.row.create_at_format}}</span>
                       </template>
                   </el-table-column>
                   <el-table-column label="文件">
                       <template scope="scope">
                           <el-button type="text" @click="download_file(image_base_url + scope.row.origin_file)">
                               {{scope.row.origin_filename}}
                           </el-button>
                       </template>
                   </el-table-column>
                   <el-table-column label="导入结果">
                       <template scope="scope">
                           <span class="has_error" v-if="scope.row.failed_num > 0">
                               <el-button @click="download_file(image_base_url + scope.row.error_file)" type="text" style="color: #F7BA2A;"><i class="fa fa-download" aria-hidden="true"></i> {{scope.row.failed_num}} 条数据导入失败</el-button>
                           </span>
                           <span v-else class="all_success">
                               全部数据导入成功
                           </span>

                       </template>
                   </el-table-column>
               </el-table>
           </div>
           <div class="gsy-footer">
               <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]"
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total">
               </el-pagination>
           </div>
       </div>
    </div>

    <!-- upload feedback dialog -->
    <el-dialog :title="dialog_title" :visible.sync="visible" :close-on-click-modal="false" @close="handle_dialog_close">

        <div class="progress">
            <el-progress type="circle" :percentage="process" status="success"></el-progress>
        </div>
        <!-- feedback info -->
        <div class="feedback_info">
            <p><span class="key_number">{{success_data_num}}条</span> 数据导入成功</p>
            <p><span class="key_number">{{blur_data_num}}条</span> 模糊数据待处理</p>
            <p><span class="key_number">{{fail_data_num}}条</span> 格式错误数据</p>
        </div>

    </el-dialog>


</div>

</template>

<script>

import mixin from "./batch.js"
import utils from './utils.js'
import table from './table.js'
import config from '../../../config/basis.js'

export default {
    mixins: [mixin, utils, table],
    created() {
        //do something after creating vue instance
        this.getData()
    },
    computed: {
        image_base_url(){
            return config.image_url
        }
    },

    data() {
        return {
            // dialog params
            visible: false,
            process: 0,
            dialog_title: '正在导入数据...',

            // pagination data
            page: 0,
            size: 10,
            total: 0,
            record_list: [],

            // upload data
            excel_json: [],
            correct_json: [],
            error_json: [],

            // upload feedback
            success_data_num: 0,
            fail_data_num: 0,
            blur_data_num: 0
        }
    }
}

</script>
