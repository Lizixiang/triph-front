<template>
  <div>
    <el-tag
      :key="value.id"
      v-for="(value, name, index) in cateTags"
      closable
      effect="dark"
      :disable-transitions="false"
      @close="handleClose(value)">
      {{value.techniqueName}}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="mini"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputBlur"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
  </div>
</template>

<script>

  import axios from 'axios'

  export default {
    name: "cate",
    data() {
      return {
        cateTags: [],
        inputVisible: false,
        inputValue: ''
      };
    },
    methods: {
      getJson() {
        axios.post('/api/tech/cate/get')
          .then(response => {
            console.log(response);
            if(response.data.success) {
              this.cateTags = response.data.data;
            }
          });
      },
      handleClose(tag) {
        this.$confirm('确定删除该分类吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/tech/cate/del/'+tag.id)
            .then(response => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                })
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        })
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          axios.post('/api/tech/cate/add?techniqueName=' + inputValue)
            .then(response => {
              console.log(response);
              if (response.data.success) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                })
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      handleInputBlur() {
        this.inputVisible = false;
        this.inputValue = '';
      }
    },
    created: function () {
      this.$nextTick(function () {
        this.getJson();
      })
    }
  }
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
