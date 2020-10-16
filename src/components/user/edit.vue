<template>
  <div>
    <el-transfer
      filterable
      filter-placeholder="请输入角色"
      :titles="['未选组织', '已选组织']"
      @change="handleChange"
      v-model="tValue"
      :data="tData">
    </el-transfer>
    <el-button type="primary" @click="save" style="margin: 10px 0px">保存</el-button>
    <el-tree
      v-loading="treeVis"
      :data="treeData"
      show-checkbox
      node-key="id"
      ref="tree"
      default-expand-all
      :default-checked-keys="defaultChecked"
      :expand-on-click-node="false">
    </el-tree>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "edit",
  props: {
    row: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      tData: [],
      tValue: [],
      treeVis: false,
      treeData: [],
      defaultChecked: []
    }
  },
  methods: {
    getOrg() {
      if (this.row.id === undefined) {
        return;
      }
      axios.get('/auth/user/getOrgByUserId?userId=' + this.row.id)
      .then(response => {
        if (response.data.success) {
          var obj = [];
          response.data.data.all.forEach(item => {
            obj.push({
              key: item.id,
              label: item.partmentName
            });
          })
          this.tData = obj;
          this.tValue = response.data.data.selected;
        } else {
          this.$message.error(response.data.message);
        }
      })
    },
    getJson() {
      if (this.row.id === undefined) {
        return;
      }
      axios.get('/auth/user/getAuthByUserId?userId=' + this.row.id)
        .then(response => {
          if (response.data.success) {
            this.treeData = [];
            response.data.data.all.forEach(f => {
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
            this.defaultChecked = response.data.data.selected;
          } else {
            this.$message.error(response.data.message);
          }
        })
    },
    handleChange(value, direction, movedKeys) {
      axios.get('/auth/user/attachOrg?userId='+ this.row.id +'&orgIds=' + value)
        .then(response => {
          if (response.data.success) {
            this.getOrg();
            this.getJson();
            this.$message({
              type: 'success',
              message: '保存成功'
            });
          } else {
            this.$message.error(response.data.message);
          }
        })
    },
    save() {
      console.log(this.$refs.tree.getCheckedKeys());
      axios.get('/auth/user/attachAuth?userId='+ this.row.id +'&authIds=' + this.$refs.tree.getCheckedKeys())
        .then(response => {
          if (response.data.success) {
            this.getJson();
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
      this.getOrg();
      this.getJson();
    })
  }
}
</script>

<style scoped>

</style>
