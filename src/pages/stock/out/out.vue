<style lang="scss" scoped>
@import "./out.scss";
</style>

<template lang="html">

<div class="container">
    <div class="content_top_bar">图书出库</div>
    <div class="content_inner">
        <el-form :inline="true">
            <el-form-item label="ISBN">
                <el-input id="isbn" size="small" icon="search" autofocus :on-icon-click="isbn_search" v-model.trim="isbn" @keyup.enter.native="isbn_search"></el-input>
            </el-form-item>
            <el-form-item label="库存总量：" label-width="200px">
                <span>11</span>
            </el-form-item>
            <el-form-item label="出库量：" label-width="100px">
                <el-input style="width: 80px;" size="small"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="output">出库</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10">
            <el-col :span="17">
                <el-table  border style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column label="库位-货架-层数"></el-table-column>
                    <el-table-column label="库存量" width="80"></el-table-column>
                    <el-table-column label="出货量"></el-table-column>
                </el-table>
            </el-col>

            <el-col :span="7">
                <div class="book_info">

                    <div class="image_box">
                        <img class="book_image" src="https://img11.360buyimg.com/n1/s200x200_jfs/t5185/254/1456634708/110457/1e877299/59106ff8N763037e0.jpg" alt="">
                    </div>

                    <ul class="info_detail">
                        <li>
                            <span class="key">书名</span>
                            <span class="val">SQL必知必会 第4版</span>
                        </li>
                        <li>
                            <span class="key">作者</span>
                            <span class="val">[美] Ben Forta 著；钟鸣，刘晓霞 译</span>
                        </li>
                        <li>
                            <span class="key">出版社</span>
                            <span class="val">人民邮电出版社</span>
                        </li>
                        <li>
                            <span class="key">定价</span>
                            <span class="val">29.00</span>
                        </li>
                        <li>
                            <span class="key">isbn</span>
                            <span class="val">9787115313980</span>
                        </li>
                    </ul>

                </div>
            </el-col>

        </el-row>

    </div>
</div>

</template>

<script>
import mixin from "./out.js"
export default {
    mixins: [mixin],
    data() {
        return {
            isbn: ''
        }
    }
}
</script>
