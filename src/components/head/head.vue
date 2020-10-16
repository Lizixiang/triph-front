<template>
  <div style="display: flex">
    <el-menu :default-active="activeIndex"
             class="el-menu-demo"
             style="width: 95%"
             mode="horizontal"
             @select="handleSelect"
             background-color="#409EFF"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item v-for="item in menu"
                    :key="item.id"
                    :index="item.id.toString()">
        {{item.authName}}
      </el-menu-item>
    </el-menu>
    <div style="display: flex;align-items: center;">
      <el-dropdown placement="top"  @command="handleCommand">
        <el-avatar style="cursor: pointer"> {{username}} </el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="editPass">修改密码</el-dropdown-item>
          <el-dropdown-item command="logOut" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" v-loading="formVis" ref="form">
        <el-form-item label="原始密码" prop="orgPass" :label-width="formLabelWidth">
          <el-input v-model="form.orgPass" show-password clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass" :label-width="formLabelWidth">
          <el-input v-model="form.newPass" show-password autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePass" :label-width="formLabelWidth">
          <el-input v-model="form.rePass" show-password autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPass('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'

  export default {
    name: "shead",
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.form.newPass) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        activeIndex: '0',
        menu: [],
        username: '',
        dialogFormVisible: false,
        form: {
          orgPass: '',
          newPass: '',
          rePass: ''
        },
        formVis: false,
        formLabelWidth: '100px',
        rules: {
          orgPass: [
            { required: true, message: '请输入原始密码', trigger: 'blur' },
          ],
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
          ],
          rePass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        var tmp = this.menu.find(value => value.id.toString() === key)
        this.$emit('switchNav', tmp.subMenu);
        // this.$store.commit('updateLeftMenu', JSON.stringify(tmp.subMenu));
      },
      initMenu() {
        this.username = localStorage.getItem('userName');
        this.menu = JSON.parse(localStorage.getItem('menu'));
        this.$store.commit('updateLeftMenu', JSON.stringify(this.menu[0].subMenu));
        const route = this.$route;
        this.menu.forEach(value => {
          if (value.subMenu.some(item => {
            if (item.subMenu.some(x => {
              if (x.authUrl === route.path) {
                return true;
              }
            })) {
              return true;
            }
          })) {
            this.activeIndex = value.id.toString();
          }
        })
        if (this.activeIndex === '0') {
          this.activeIndex = this.menu[0].id.toString();
        }
      },
      handleCommand(command) {
        switch (command) {
          case 'logOut': this.logOut(); break;
          case 'editPass': this.showditPass(); break;
        }
      },
      logOut() {
        var that = this;
        this.$confirm('您确定要退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (localStorage.getItem('Authorization')) {
            axios.get('/auth/auth/logOut/' + localStorage.getItem('Authorization').substr(7))
              .then(response => {
                if (response.data.success) {
                  this.removeStorage();
                  that.$router.push('/login');
                } else {
                  this.$message.error(response.data.message);
                }
              })
            this.$message({
              type: 'success',
              message: '退出成功!'
            });
          } else {
            this.removeStorage();
            that.$router.push('/login');
          }
        })
      },
      removeStorage() {
        localStorage.removeItem('Authorization');
        localStorage.removeItem('menu');
        localStorage.removeItem('leftMenu');
        localStorage.removeItem('userName');
      },
      showditPass() {
        this.dialogFormVisible = true;
        if (this.$refs['form']) {
          this.$refs['form'].resetFields();
        }
      },
      editPass(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formVis = true;
            axios.post('/auth/user/editPass', {
              orgPass: this.form.orgPass,
              newPass: this.form.newPass
            }).then(response => {
              this.formVis = false;
              if (response.data.success) {
                this.dialogFormVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              } else {
                this.$message.error(response.data.message);
              }
            })
          }
        })
      }
    },
    mounted() {
      // 相当于jquery中的$.ready()  当dom元素全部渲染完成再执行
      this.$nextTick(function () {
        this.initMenu();
      })
    }
  }
</script>

<style scoped>

</style>
