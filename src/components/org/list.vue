<template>
  <div class="block" style="display: -webkit-box;">
    <el-button type="primary" class="button-new-tag" size="mini" @click="addRootOrg">添加组织</el-button>
    <el-tree
      style="width: 30%;margin-left: 20px"
      v-loading="treeVis"
      :data="treeData"
      node-key="id"
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :render-content="renderContent"
      @node-click="handleNodeClick">
    </el-tree>
    <el-transfer
      v-show="tVis"
      style="margin-left: 20px"
      filterable
      filter-placeholder="请输入角色"
      :titles="['未选角色', '已选角色']"
      @change="handleChange"
      v-model="tValue"
      :data="tData">
    </el-transfer>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'list',
  data() {
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
      formVis: false,
      data: {},
      tData: [],
      tValue: [],
      tVis: false,
      orgId: 0
    }
  },
  methods: {
    get() {
      axios.get('/auth/org/getData')
        .then(response => {
          if (response.data.success) {
            this.treeData = [];
            var object = [];
            this.packageOrg(response.data.data, object);
            this.treeData = object;
          }
        })
    },
    packageOrg(data, object) {
      data.forEach(f => {
        var tmp = {
          id: f.id,
          parentId: f.parentId,
          code: f.partmentCode,
          label: f.partmentName,
          children: []
        };
        object.push(tmp);
        this.packageOrg(f.subOrg, tmp.children);
      })
    },
    addRootOrg() {
      this.$prompt('请输入组织名称', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位字符'
      }).then(({ value }) => {
        this.treeVis = true;
        axios.post('/auth/org/add', {
          parentId: 0,
          orgName: value
        })
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
    addOrg(node, data) {
      this.$prompt('请输入组织名称', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位字符'
      }).then(({ value }) => {
        this.treeVis = true;
        axios.post('/auth/org/add', {
          parentId: data.id,
          orgName: value
        }).then(response => {
          this.treeVis = false;
          if (response.data.success) {
            const newChild = { id: response.data.data, label: value, children: []};
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
    },
    editOrg(data) {
      this.$prompt('修改组织名称', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
        inputErrorMessage: '请输入2-10位字符',
        inputValue: data.label
      }).then(({ value }) => {
        this.treeVis = true;
        axios.post('/auth/org/edit', {
          id: data.id,
          orgName: value
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
    },
    remove(node, data) {
      if (data.children.length !== 0) {
        this.$message.error('存在子节点菜单，无法删除');
        return;
      }
      this.$confirm('此操作将永久删除组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.get('/auth/org/delete?id=' + data.id)
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
          <i class="el-icon-circle-plus-outline" style="color: #66b1ff;" on-click={() => this.addOrg(node, data)}></i>
          <i class="el-icon-edit" style="color: #66b1ff;" on-click={() => this.editOrg(data)}></i>
          <i class="el-icon-delete" style="color: #f56c6c;" on-click={() => this.remove(node, data)}></i>
        </span>
        </span>
      );
    },
    handleNodeClick(data) {
      this.orgId = data.id;
      this.tVis = true;
      this.tData = [];
      this.tValue = [];
      axios.get('/auth/org/getRolesByOrgId?id=' + data.id)
      .then(response => {
        if (response.data.success) {
          response.data.data.all.forEach(item => {
            this.tData.push({
              key: item.id,
              label: item.roleName
            });
          })
          this.tValue = response.data.data.selected;
        } else {
          this.$message.error(response.data.message);
        }
      })
    },
    handleChange(value, direction, movedKeys) {
      axios.get('/auth/org/attachRoles?orgId='+ this.orgId +'&roleIds=' + value)
      .then(response => {
        if (response.data.success) {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
        } else {
          this.$message.error(response.data.message);
        }
      })
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
.bg{
  background-color: rgb(64, 158, 255);
}
</style>
