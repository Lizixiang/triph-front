<template>
  <div>
    <el-row>
      <el-col :span="6" style="display: inline-flex">
        <el-input placeholder="角色名称" v-model="qForm.roleName" clearable></el-input>
        <el-button type="primary" style="margin-left: 3px" @click="getJson">查询</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" style="display: inline-flex">
        <el-button type="primary" @click="showAdd">新增</el-button>
        <el-button type="danger" @click="showDel">删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="tableVis" ref="table1" :data="tableData" border stripe height="300" style="width: 100%;">
      <el-table-column header-align="center" type="selection" width="35"/>
      <el-table-column header-align="center" prop="roleName" label="角色名称" width="140"
                       show-overflow-tooltip/>
      <el-table-column header-align="center" prop="createTime" label="创建时间" width="140"/>
      <el-table-column header-align="center" prop="createName" label="创建人" width="140"/>
      <el-table-column header-align="center" prop="updateTime" label="修改时间" width="140"/>
      <el-table-column header-align="center" prop="updateName" label="修改人" width="140"/>
      <el-table-column header-align="center" prop="operate" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      style="overflow: auto">
      <el-input v-model="form.roleName" autocomplete="off"></el-input>
      <el-divider></el-divider>
      <el-tree
        v-loading="treeVis"
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="roleTree"
        default-expand-all
        :expand-on-click-node="false"
        :default-checked-keys="defaultCheckd"
        style="height: 50%">
      </el-tree>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "list",
  data() {
    return {
      qForm: {
        roleName: ''
      },
      tableVis: true,
      tableData: [],
      currentPage: 1,
      size: 10,
      show: false,
      total: 0,
      dialogVisible: false,
      treeVis: false,
      treeData: [],
      defaultCheckd: [],
      form: {
        id: 0,
        roleName: ''
      },
      title: '新增角色'
    }
  },
  methods: {
    getJson() {
      this.tableVis = true;
      axios.post('/auth/role/getRoles', {
        roleName: this.qForm.roleName,
        current: this.currentPage,
        size: this.size,
        orderType: 'asc'
      }).then(response => {
        this.tableVis = false;
        this.tableData = response.data.records;
        this.total = response.data.total;
      });
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
    handleEdit(index, row) {
      this.title = '编辑角色';
      this.dialogVisible = true;
      this.treeVis = true;
      this.treeData = [];
      axios.get('/auth/auth/getAuth/' + row.id)
      .then(response => {
        this.treeVis = false;
        if (response.data.success) {
          this.form.id = row.id;
          this.form.roleName = row.roleName;
          response.data.data.allAuth.forEach(f => {
            var c = [];
            f.subMenu.forEach(s => {
              var c1 = [];
              s.subMenu.forEach(t => {
                c1.push({
                  id: t.id,
                  label: t.authName,
                  grade: t.grade,
                  url: t.authUrl,
                  children: []
                })
              })
              c.push({
                id: s.id,
                label: s.authName,
                grade: s.grade,
                url: s.authUrl,
                children: c1
              })
            })
            this.treeData.push({
              id: f.id,
              label: f.authName,
              grade: f.grade,
              url: f.authUrl,
              children: c
            });
          })
          this.$nextTick(function () {
            // this.defaultCheckd = response.data.data.roleAuth;
            this.$refs.roleTree.setCheckedKeys(response.data.data.roleAuth);
          })
        } else {
          this.$message.error(response.data.message);
        }
      })
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm('确定删除此角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/auth/role/del/' + row.id)
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
    },
    editRole() {
      this.treeVis = true;
      let ids = this.$refs.roleTree.getCheckedKeys();
      axios.post('/auth/role/editRole', {
        id: this.form.id,
        authIds: ids,
        roleName: this.form.roleName
      }).then(response => {
        this.treeVis = false;
        if (response.data.success) {
          this.dialogVisible = false;
          this.getJson();
        } else {
          this.$message.error(response.data.message);
        }
      })
    },
    showAdd() {
      this.title = '新增角色';
      this.dialogVisible = true;
      this.treeVis = true;
      this.treeData = [];
      this.form.id = 0;
      this.form.roleName = '';
      axios.get('/auth/auth/getAllAuthorities')
        .then(response => {
          this.treeVis = false;
          if (response.data.success) {
            response.data.data.forEach(f => {
              var c = [];
              f.subMenu.forEach(s => {
                var c1 = [];
                s.subMenu.forEach(t => {
                  c1.push({
                    id: t.id,
                    label: t.authName,
                    grade: t.grade,
                    url: t.authUrl,
                    children: []
                  })
                })
                c.push({
                  id: s.id,
                  label: s.authName,
                  grade: s.grade,
                  url: s.authUrl,
                  children: c1
                })
              })
              this.treeData.push({
                id: f.id,
                label: f.authName,
                grade: f.grade,
                url: f.authUrl,
                children: c
              });
            })
          }
        })
    },
    showDel() {
      var selected = this.$refs.table1.selection;
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
        axios.get('/auth/role/del/' + ids)
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
      this.getJson();
    })
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
</style>
