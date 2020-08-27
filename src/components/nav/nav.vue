<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse"
           :unique-opened="true"
           :router="true">
    <el-menu-item index="/index/index">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="1">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">个人技术</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/technique/list">技术列表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">爬虫</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/reptile/list">爬虫数据</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "nav",
    data() {
      return {
        isCollapse: false
      }
    },
    computed: {
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        // if set path, the sidebar will highlight the path you set
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
    }
  }
</script>

<style scoped>

</style>
