<style lang="scss" scoped>

@import './handle_blur_data.scss';

</style>

<template>

<div class="container">
    <div class="content_top_bar">处理模糊数据</div>

    <div class="content_inner">
        <header>
            <span>
                <span class="back" @click="back"><< 返回 </span>
                <span>
                    <span class="isbn">ISBN: {{book.isbn}}</span>
                </span>
            </span>
            <!-- <el-button id="export" icon="document" type="text">导出模糊数据</el-button> -->
        </header>

        <ul class="books_list">
            <li class="book" v-for="(item, index) in poker_list" @click="choose_this(index)">
                <el-radio v-model="book_no" class="radio" :label="item.book_no"></el-radio>
                <div class="image_box">
                    <img :src="image_url + item.image">
                </div>
                <span class="book_info">
                    {{item.title}}
                    <span v-if="item.author">| {{item.author}}</span>
                    <span v-if="item.publisher">| {{item.publisher}}</span>
                    <span v-if="item.price > 0">| ¥ {{(item.price/100).toFixed(2)}}</span>
                </span>
            </li>
        </ul>

        <p class="input_boxs">
            <span class="time">入库时间: {{book.create_at_format}}</span>
            <span class="location">
                库存位置：
                <el-input style="width: 68px;" size="small" placeholder="仓库名" v-model.trim="book.warehouse"></el-input>
                <span class="separator">-</span>
                <el-input style="width: 68px;" size="small" placeholder="货架名" v-model.trim="book.shelf"></el-input>
                <span class="separator">-</span>
                <el-input style="width: 68px;" size="small" placeholder="层数" v-model.trim="book.floor"></el-input>
            </span>
            <span>
                入库量：
                <el-input type="number" style="width: 78px;" size="small" placeholder="入库数量" v-model.trim.number="book.num"></el-input>
            </span>
        </p>

        <p class="btns">
            <el-pagination @current-change="handle_page_change" :current-page="page" :page-size="size" layout="total, prev, pager, next" :total="total">
            </el-pagination>

            <span>
                <el-button size="small" type="danger" @click="del_pending_goods">删除</el-button>
                <el-button size="small" type="primary" @click="input_warehouse">入库</el-button>
            </span>
        </p>
    </div>
</div>

</template>

<script>

import mix from './handle_blur_data.js'
import config from '../../../config/basis.js'


export default {
    mixins: [mix],
    name: "",
    data: () => ({
        // pagination
        page: 1,
        size: 1,
        total: 0,

        // upload book info
        book: {
            isbn: '',
            id: '',
            warehouse: '',
            shelf: '',
            floor: '',
            create_at: '',
            num: 0,
            create_at_format: ''
        },
        book_no: '00',

        poker_list: [],
        pending_goods_id: ''
    }),

    created() {
        //do something after creating vue instance
        this.getData()
    },

    computed: {
        image_url() {
            return config.image_url
        }
    }
}

</script>
