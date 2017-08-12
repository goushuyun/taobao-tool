<style lang="scss" scoped>
@import "./choose_book.scss";
</style>

<template>

<div id="dialog">

    <el-dialog title="选择图书" :visible.sync="visible" size="large">
        <!-- <p class="alert">
            如果未找到对应的图书，点击 <el-button type="text">新增图书</el-button> 完善图书信息后添加
        </p> -->

        <ul id="book_list">
            <li class="item" v-for="(item, index) in books_list" @click="choose_this_book(index)">
                <el-row type="flex" justify="start">
                    <el-col :span="2" class="check_box">
                        <el-radio v-model="checked_book_no" :label="item.book_no" class="radio"></el-radio>
                    </el-col>
                    <el-col :span="6">
                        <div class="image_box">
                            <img :src="qiniu_url + item.image" :alt="item.title">
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <p class="isbn_code">{{item.isbn}}</p>
                        <p class="base_info">{{item.title}} | {{item.author}} | {{item.publisher}}</p>
                    </el-col>
                </el-row>
            </li>
        </ul>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>

</div>

</template>

<script>

import config from '../../config/basis.js'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        books: {
            type: Array,
            required: true
        }
    },

    computed: {
        books_list() {
            return this.books.map((val, index) => {
                if (index === 0) {
                    val.check = true
                    this.checked_book_no = val.book_no
                } else {
                    val.check = false
                }

                return val
            })
        }
    },

    watch: {
        visible(val) {
            this.$emit('update:visible', val);
        }
    },

    data() {
        return {
            qiniu_url: config.image_url,
            checked_book_no: ''
        }
    },

    methods: {
        choose_this_book(index) {
            this.checked_book_no = this.books_list[index].book_no
        },
        confirm() {
            // set checked book
            for (var i = 0; i < this.books_list.length; i++) {
                if(this.books_list[i].book_no == this.checked_book_no){
                    this.$emit('checked', this.books_list[i])
                    this.$emit('update:visible', false);
                    break
                }
            }

        }
    }


}

</script>
