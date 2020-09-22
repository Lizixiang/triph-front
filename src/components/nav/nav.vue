<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :collapse="isCollapse"
           :unique-opened="true"
           :router="true">
    <el-menu-item index="/index/index">
      <i class="el-icon-menu"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-submenu v-for="item in leftMenu"
                :key="item.id"
                :index="item.id.toString()">
      <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">{{item.authName}}</span>
      </template>
      <el-menu-item-group v-if="item.subMenu != null && item.subMenu.length > 0">
        <el-menu-item v-for="value in item.subMenu"
                      :key="value.id"
                      :index="value.authUrl">
          {{value.authName}}
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
  export default {
    name: "snav",
    data() {
      return {
        isCollapse: false,
        leftMenu: []
      }
    },
    methods: {
      switchNav(submenu) {
        this.leftMenu = submenu;
      },
      initMenu() {
        this.leftMenu = JSON.parse(localStorage.getItem('leftMenu'));
      }
    },
    mounted() {
      this.initMenu();
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
      }
    }
  }
</script>

<style scoped>

</style>
