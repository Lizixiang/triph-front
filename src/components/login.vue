<template>
  <el-container>
    <el-header></el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="9" :offset="6">
          <el-form :model="ruleForm" style="padding: 30px 40px 20px 10px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
                   status-icon :rules="rules" ref="ruleForm" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input clearable size="small" type="text" v-model="ruleForm.username"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input clearable size="small" type="password" v-model="ruleForm.pass"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'HelloWorld',
    data() {
      var validateUsernmae = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          pass: ''
        },
        rules: {
          username: [
            {validator: validateUsernmae, trigger: 'blur'}
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
    },
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var that = this;
            axios.post('/api/login?username='+ this.ruleForm.username +'&password=' + this.ruleForm.pass)
              .then(response => {
                console.log(response);
                if (response.data.success) {
                  that.$store.commit('changeLogin', 'Bearer ' + response.data.data);
                  that.$router.push('/index/index');
                } else {
                  that.$message.error(response.data.message);
                }
              })
              .catch(error => console.log(error))
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
