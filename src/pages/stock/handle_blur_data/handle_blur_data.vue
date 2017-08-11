<style lang="scss" scoped>
@import './handle_blur_data.scss';
</style>

<template>

<div class="container">
    <div class="content_top_bar">处理模糊数据</div>

    <div class="content_inner">
        <header>
            <span>
                <span class="number">1/30</span>
                <span class="isbn">ISBN: 9787115404459</span>
            </span>
            <el-button id="export" icon="document" type="text">导出模糊数据</el-button>
        </header>

        <ul class="books_list">
            <li class="book">
                <el-radio class="radio" label=""></el-radio>
                <div class="image_box">
                    <img src="https://img12.360buyimg.com/n3/jfs/t2053/269/1144929905/288173/77ed381a/5684035eN186e457f.jpg">
                </div>
                <span class="book_info"> 高等数学（第六版）赵泳钧 清华大学出版社 ￥30.00</span>
            </li>
            <li class="book">
                <el-radio class="radio" label=""></el-radio>
                <div class="image_box">
                    <img src="https://img12.360buyimg.com/n3/jfs/t2053/269/1144929905/288173/77ed381a/5684035eN186e457f.jpg">
                </div>
                <span class="book_info"> 高等数学（第六版）赵泳钧 清华大学出版社 ￥30.00</span>
            </li>
            <li class="book">
                <el-radio class="radio" label=""></el-radio>
                <div class="image_box">
                    <img src="https://img12.360buyimg.com/n3/jfs/t2053/269/1144929905/288173/77ed381a/5684035eN186e457f.jpg">
                </div>
                <span class="book_info"> 高等数学（第六版）赵泳钧 清华大学出版社 ￥30.00</span>
            </li>
        </ul>

        <p class="input_boxs">
            <span class="time">入库时间: 2017/7/3 23:16</span>
            <span class="location">
                库存位置：
                <el-input style="width: 68px;" size="small"></el-input>
                <span class="separator">-</span>
                <el-input style="width: 68px;" size="small"></el-input>
                <span class="separator">-</span>
                <el-input style="width: 68px;" size="small"></el-input>
            </span>
            <span>
                入库量：
                <el-input style="width: 78px;" size="small"></el-input>
            </span>
        </p>

        <p class="btns">
            <el-button size="small" type="danger">删除</el-button>
            <el-button size="small" type="success">跳过</el-button>
            <el-button size="small" type="primary">入库</el-button>
        </p>

    </div>
</div>

</template>

<script>

export default {
    name: "",
    data: () => ({

    })
}

</script>
