<template>
  <div class="block">
    <el-button type="primary" class="button-new-tag" size="mini" @click="showInput">添加系统菜单</el-button>
    <el-tree
      v-loading="treeVis"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <el-dialog title="添加子菜单" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" v-loading="formVis" ref="form">
        <el-form-item label="菜单名称" prop="menuName" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuUrl" :label-width="formLabelWidth">
          <el-input v-model="form.menuUrl" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="appendUrl('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑菜单" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="rules" v-loading="editFormVis" ref="editForm">
        <el-form-item label="菜单名称" prop="menuName" :label-width="formLabelWidth">
          <el-input v-model="editForm.menuName" clearable autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="menuUrl" :label-width="formLabelWidth">
          <el-input v-model="editForm.menuUrl" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUrl('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'list',
  data() {
    var validateMenuName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入菜单名称'));
      } else {
        callback();
      }
    };
    var validateMenuUrl = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入菜单路径'));
      } else {
        callback();
      }
    };
    return {
      treeVis: false,
      treeData: [],
      dialogFormVisible: false,
      editFormVisible: false,
      form: {
        menuName: '',
        menuUrl: ''
      },
      editForm: {
        menuName: '',
        menuUrl: ''
      },
      formLabelWidth: '120px',
      rules: {
        menuName: [
          {validator: validateMenuName, trigger: 'blur'}
        ],
        menuUrl: [
          {validator: validateMenuUrl, trigger: 'blur'}
        ]
      },
      formVis: false,
      editFormVis: false,
      parentId: 0,
      data: {},
      editData: {},
      editId: 0
    }
  },
  methods: {
    appendUrl(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.formVis = true;
          axios.post('/auth/auth/addMenu', {
            menuName: this.form.menuName,
            menuUrl: this.form.menuUrl,
            parentId: this.parentId
          }).then(response => {
            this.formVis = false;
            if (response.data.success) {
              this.dialogFormVisible = false;
              const newChild = { id: response.data.data, label: this.form.menuName, children: [], grade: '2', url: this.form.menuUrl };
              if (!this.data.children) {
                this.$set(this.data, 'children', []);
              }
              this.data.children.push(newChild);
              this.$message({
                type: 'success',
                message: '添加成功！'
              });
            } else {
              this.$message.warning(response.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    editUrl(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editFormVis = true;
          axios.post('/auth/auth/edit', {
            id: this.editId,
            menuName: this.editForm.menuName,
            menuUrl: this.editForm.menuUrl
          }).then(response => {
            this.editFormVis = false;
            if (response.data.success) {
              this.editFormVisible = false;
              this.editData.label = this.editForm.menuName;
              this.editData.url = this.editForm.menuUrl;
              this.$message({
                type: 'success',
                message: '添加成功！'
              });
            } else {
              this.$message.warning(response.data.message);
            }
          })
        } else {
          return false;
        }
      });
    },
    showInput() {
      this.$prompt('请输入系统菜单名称', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位字符'
      }).then(({ value }) => {
        this.treeVis = true;
        axios.post('/auth/auth/addSystemMenu?menuName=' + value)
        .then(response => {
          this.treeVis = false;
          if (response.data.success) {
            this.get();
            this.$message({
              message: response.data.message,
              type: 'success'
            });
          } else {
            this.$message.error(response.data.message);
          }
        })
      });
    },
    get() {
      axios.get('/auth/auth/getAllAuthorities')
        .then(response => {
          if (response.data.success) {
            this.treeData = [];
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
              // document.getElementsByClassName("el-tree-node__content").css()
            })
          }
        })
    },
    showAppend(node, data) {
      this.parentId = data.id;
      if (data.grade === '2') {
        this.$message.warning('无法继续创建子菜单');
      } else if (data.grade === '1') {
        this.dialogFormVisible = true;
        this.data = data;
        this.$refs['form'].resetFields();
      } else {
        this.$prompt('请输入菜单名称', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
          inputErrorMessage: '请输入2-10位字符'
        }).then(({ value }) => {
          this.treeVis = true;
          axios.post('/auth/auth/addMenu', {
            parentId: this.parentId,
            menuName: value
          }).then(response => {
            this.treeVis = false;
            if (response.data.success) {
              const newChild = { id: response.data.data, label: value, children: [], grade: '1' };
              if (!data.children) {
                this.$set(data, 'children', []);
              }
              data.children.push(newChild);
              this.$message({
                type: 'success',
                message: '添加成功！'
              });
            } else {
              this.$message.warning(response.data.message);
            }
          })
        });
      }
    },
    showEdit(data) {
      this.editId = data.id;
      if (data.grade === '2') {
        this.editFormVisible = true;
        this.editData = data;
        this.editForm.menuName = data.label;
        this.editForm.menuUrl = data.url;
      } else {
        this.$prompt('修改菜单名称', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
          inputErrorMessage: '请输入2-10位字符',
          inputValue: data.label
        }).then(({ value }) => {
          this.treeVis = true;
          axios.post('/auth/auth/edit', {
            id: data.id,
            menuName: value
          }).then(response => {
            this.treeVis = false;
            if (response.data.success) {
              data.label = value;
              this.$message({
                message: response.data.message,
                type: 'success'
              });
            } else {
              this.$message.warning(response.data.message);
            }
          })
        });
      }
    },
    remove(node, data) {
      if (data.children.length !== 0) {
        this.$message.error('存在子节点菜单，无法删除');
        return;
      }
      this.$confirm('此操作将永久删除菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/auth/auth/delete?id=' + data.id)
        .then(response => {
          if (response.data.success) {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$message.error(response.data.message);
          }
        })
      })
    },
    renderContent(h, {node, data, store}) {
      return (
        <span class="opt_p">
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>
        <span class="opt" style="display:inline;">
          <i class="el-icon-circle-plus-outline" style="color: #66b1ff;" on-click={() => this.showAppend(node, data)}></i>
          <i class="el-icon-edit" style="color: #66b1ff;" on-click={() => this.showEdit(data)}></i>
          <i class="el-icon-delete" style="color: #f56c6c;" on-click={() => this.remove(node, data)}></i>
        </span>
        </span>
      );
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.get();
    })
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content:hover .opt {
  display: none;
}
.el-tree-node__content {
  color: #de1a1a;
}
</style>
