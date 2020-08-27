<template>
  <el-form :label-position="labelPosition" ref="tecForm" label-width="50px" :model="tecForm">
    <el-form-item label="标题" prop="title">
      <el-input :disabled="true" type="text" placeholder="请输入标题" v-model="tecForm.title" maxlength="200" show-word-limit/>
    </el-form-item>
    <span style="color: #999aaa;">{{createTimme}}</span>
    <el-form-item label="状态" prop="status">
      <el-select :disabled="true" style="float: left;" v-model="tecForm.status" filterable placeholder="请选择">
        <el-option
          v-for="item in option.statusOption"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <quill-editor ref="myTextEditor" v-model="tecForm.content" :options="editorOption"
                  style="height:500px;margin-bottom: 100px"></quill-editor>
    <el-form-item>
      <el-button v-show="optDisable" type="primary" @click="gain">捞取</el-button>
      <el-button type="danger" @click="del">删除</el-button>
<!--      <el-button type="danger">删除</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>

  import axios from 'axios'
  export default {
    name: "reptileEdit",
    props: {
      row: {
        type: Object,
        default: null
      },
      opt: {
        type: Object,
        default: {}
      },
      optDisable: null
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
      showData() {
        this.tecForm.title = this.row.title;
        this.tecForm.content = this.row.content;
        this.tecForm.status = this.row.status;
        this.createTimme = this.row.createTime;
        this.option = this.opt;
      },
      gain() {
        axios.get('/api/reptile/data/gain/' + this.row.id)
          .then(response => {
            console.log(response);
            if (response.data.success) {
              this.$message({
                message: response.data.message,
                type: 'success'
              });
              this.$emit('removeTab', 'reptileEdit');
              this.$emit('getJson');
            } else {
              this.$message.error(response.data.message);
            }
          });
      },
      del() {
        axios.get('/api/reptile/data/del/' + this.row.id)
          .then(response => {
            console.log(response);
            if (response.data.success) {
              this.$message({
                message: response.data.message,
                type: 'success'
              });
              this.$emit('removeTab', 'reptileEdit');
              this.$emit('getJson');
            } else {
              this.$message.error(response.data.message);
            }
          });
      }
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      },
      optDisable() {
        return this.row.status === '0' ? true : false;
      }
    },
    mounted() {
      this.showData();
    }
  }
</script>

<style scoped>

</style>
