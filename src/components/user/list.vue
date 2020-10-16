<template>
  <el-tabs v-model="tabVal" type="card" @tab-remove="removeTab">
    <el-tab-pane
      v-for="(item, index) in tabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.closable"
    >
      <div v-show="item.name === 'list'" class="app-container">
        <el-form inline :model="qForm" size="mini" class="demo-form-inline">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="用户名">
                <el-input v-model="qForm.username" clearable placeholder="用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态">
                <el-select clearable v-model="qForm.status" placeholder="状态">
                  <el-option
                    v-for="item in option.statusOption"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="query">查询</el-button>
            <el-button type="primary" @click="showAdd">新增</el-button>
            <el-button type="danger" @click="del">删除</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="tableVis" ref="table" @row-dblclick="dbClick" :data="tableData" border stripe height="200" style="width: 100%;">
          <el-table-column header-align="center" type="selection" width="35"/>
          <el-table-column header-align="center" prop="username" label="用户名" width="100"/>
          <el-table-column header-align="center" prop="status" label="状态"
                           :formatter="formatStatus"
                           :key=""
                           width="80">
            <template slot-scope="scope">
              <el-tag :type="tagType[scope.row.status]">
                {{option.statusOption.find(value => value.value === scope.row.status).text}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column header-align="center" prop="createTime" label="创建时间" width="140"/>
<!--          <el-table-column header-align="center" prop="updateTime" label="修改时间" width="140"/>-->
          <!--      <el-table-column prop="oper" label="操作" width="180"/>-->
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 50, 100, 150, 200]"
          :page-size="size"
          :hide-on-single-page="show"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <div v-show="item.name === 'editUser'" class="app-container">
        <editUser ref="child" :row="editRow" @getJson="getJson" @removeTab="removeTab"></editUser>
      </div>
    </el-tab-pane>
    <el-dialog title="添加用户" style="" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" v-loading="formVis" ref="form">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="form.password" show-password autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rePass" :label-width="formLabelWidth">
          <el-input v-model="form.rePass" show-password autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-tabs>
</template>

<script>

  import axios from 'axios'
  import editUser from '@/components/user/edit'

  export default {
    name: "list",
    components: {
      editUser
    },
    data() {
      var validateUsername = (rule, value, callback) => {
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
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        tableVis: true,
        qForm: {
          username: '',
          status: ''
        },
        tableData: [],
        currentPage: 1,
        size: 10,
        show: false,
        total: 0,
        option: {
          statusOption: []
        },
        tagType: {
          '0': 'success',
          '1': 'danger'
        },
        tabVal: 'list',
        tabs: [{
          title: '列表',
          name: 'list',
          closable: false
        }],
        editRow: {},
        dialogFormVisible: false,
        formVis: false,
        form: {
          username: '',
          password: '',
          rePass: ''
        },
        formLabelWidth: '140px',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {validator: validateUsername, trigger: 'blur'}
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            {validator: validatePass, trigger: 'blur'}
          ],
          rePass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            {validator: validatePass2, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getJson() {
        this.tableVis = true;
        axios.post('/auth/user/data/get', {
          username: this.qForm.username,
          status: this.qForm.status,
          current: this.currentPage,
          size: this.size
        }).then(response => {
          this.tableVis = false;
          this.tableData = response.data.records;
          this.total = response.data.total;
        });
      },
      query() {
        this.getJson();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val;
        this.getJson();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.getJson()
      },
      // 初始化下拉框
      initOption() {
        var that_ = this;
        axios.get('/auth/user/option/init')
          .then(response => {
            that_.option.statusOption = response.data.data.statusOption;
          });
      },
      formatStatus(row, column) {
        let t = this.option.statusOption.find(value => value.value === row.status);
        return t.text;
      },
      isNotEmpty(value) {
        if (value && value != undefined && value != null && value != '') return true;
      },
      dbClick(row, column, event) {
        this.edit(row);
      },
      showAdd() {
        this.dialogFormVisible = true;
        this.$refs['form'].resetFields();
      },
      add(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.formVis = true;
            axios.post('/auth/user/add', {
              username: this.form.username,
              password: this.form.password
            }).then(response => {
              this.formVis = false;
              if (response.data.success) {
                this.dialogFormVisible = false;
                this.formVis = false;
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      edit(row) {
        var obj = {
          title: '编辑',
          name: 'editUser',
          closable: true
        };
        var flag = this.tabs.some(value => {
          if (value.name === obj.name) {
            return true;
          }
        })
        if (!flag) {
          this.tabs.push(obj);
        } else {
          this.$refs.child[0].getOrg();
          this.$refs.child[0].getJson();
          this.$refs.child[0].row = row;
        }
        this.tabVal = obj.name;
        this.editRow = row;
      },
      removeTab(targetName) {
        this.tabs.forEach(function (item, index, arr) {
          if (item.name === targetName) {
            arr.splice(index, 1);
          }
        });
        if (targetName === this.tabVal) {
          this.tabVal = this.tabs[0].name;
        }
      },
      del() {
        var selected = this.$refs.table[0].selection;
        if (selected.length === 0) {
          this.$message.error('请至少选择一条记录');
          return;
        }
        var ids = '';
        for (var item of selected) {
          ids += (item.id + ',');
        }
        ids = ids.substr(0, ids.length - 1);
        this.$confirm('确定删除这些数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/tech/data/del/' + ids)
            .then(response => {
              if (response.data.success) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getJson();
              } else {
                this.$message.error(response.data.message);
              }
            });
        })
      }
    },
    mounted() {
      // 相当于jquery中的$.ready()  当dom元素全部渲染完成再执行
      this.$nextTick(function () {
        this.initOption();
        this.getJson();
      })
    }
  }
</script>

<style scoped>

</style>
