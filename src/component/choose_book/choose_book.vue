<style lang="scss" scoped>
@import "./choose_book.scss";
</style>

<template>

<div id="dialog">

    <el-dialog title="选择图书" :visible="visible" size="large">
        <p class="alert">如果未找到对应的图书，点击 <el-button type="text">新增图书</el-button> 完善图书信息后添加</p>

        <ul id="book_list">
            <li class="item">
                <el-row type="flex" justify="start">
                    <el-col :span="2" class="check_box">
                        <el-radio class="radio"></el-radio>
                    </el-col>
                    <el-col :span="6">
                        <div class="image_box">
                            <img src="https://img13.360buyimg.com/n3/g13/M06/0D/1D/rBEhUlK5HUQIAAAAAAKBHjJHlKkAAHLsgEvJncAAoE2290.jpg" alt="">
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <p class="isbn_code">9787115383440</p>
                        <p class="base_info">SQL学习指南（第2版 修订版） [美] 博利厄（Alan Beaulieu） 著；张伟超，林青松 译</p>
                    </el-col>
                </el-row>
            </li>
            <li class="item">
                <el-row type="flex" justify="start">
                    <el-col :span="2" class="check_box">
                        <el-radio class="radio"></el-radio>
                    </el-col>
                    <el-col :span="6">
                        <div class="image_box">
                            <img src="https://img13.360buyimg.com/n3/g13/M06/0D/1D/rBEhUlK5HUQIAAAAAAKBHjJHlKkAAHLsgEvJncAAoE2290.jpg" alt="">
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <p class="isbn_code">9787115383440</p>
                        <p class="base_info">SQL学习指南（第2版 修订版） [美] 博利厄（Alan Beaulieu） 著；张伟超，林青松 译</p>
                    </el-col>
                </el-row>
            </li>
        </ul>
    </el-dialog>

</div>

</template>

<script>

export default {

    name: "",
    data: () => ({
        visible: true
    })
}

</script>
