<template>
  <el-form :label-position="labelPosition" ref="tecForm" label-width="50px" :model="tecForm">
    <el-form-item label="标题" prop="title">
      <el-input type="text" placeholder="请输入标题" v-model="tecForm.title" maxlength="200" show-word-limit/>
    </el-form-item>
    <span style="color: #999aaa;">{{createTimme}}</span>
    <el-form-item label="分类" prop="cateId">
      <el-select style="float: left;" v-model="tecForm.cateId" filterable placeholder="请选择">
        <el-option
          v-for="item in option.cateOption"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-select style="float: left;" v-model="tecForm.status" filterable placeholder="请选择">
        <el-option
          v-for="item in option.statusOption"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <quill-editor ref="myTextEditor" v-model="tecForm.content" :options="editorOption"
                  @change="onEditorChange($event)"
                  style="height:500px;margin-bottom: 100px"></quill-editor>
    <el-form-item>
      <el-button type="primary" @click="submitForm('tecForm')">修改</el-button>
      <el-button @click="resetForm('tecForm')">重置</el-button>
<!--      <el-button type="danger">删除</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>

  import axios from 'axios'
  export default {
    name: "addTechinique",
    props: {
      row: {
        type: Object,
        default: null
      },
      opt: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        labelPosition: 'left',
        tecForm: {
          title: '',
          cateId: '',
          desc: '',
          content: '',
          status: ''
        },
        options: [],
        editorOption: {
          placeholder: '编辑文章内容'
        },
        createTimme: '',
        option: {
          cateOption: [],
          statusOption: []
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/api/tech/data/addOrUpdate', {
              id: this.row.id,
              title: this.tecForm.title,
              cate: this.tecForm.cateId,
              status: this.tecForm.status,
              content: this.tecForm.content
            }).then(response => {
              if (response.data.success) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                });
                this.$emit('removeTab', 'editTechinique');
                this.$emit('getJson');
              } else {
                this.$message.error(response.data.message);
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.tecForm.content = '';
      },
      onEditorChange({ quill, html, text }) {
        this.tecForm.content = html
      },
      showData() {
        this.tecForm.title = this.row.questionDescription;
        this.tecForm.cateId = this.row.techniqueId;
        this.tecForm.content = this.row.answer;
        this.tecForm.status = this.row.status;
        this.createTimme = this.row.createTime;
        this.option = this.opt;
      }
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      }
    },
    mounted() {
      this.showData();
    }
  }
</script>

<style scoped>

</style>
