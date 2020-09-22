<template>
  <el-menu :default-active="activeIndex"
           class="el-menu-demo"
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
</template>

<script>
  export default {
    name: "shead",
    data() {
      return {
        activeIndex: '0',
        menu: []
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        var tmp = this.menu.find(value => value.id.toString() === key)
        this.$emit('switchNav', tmp.subMenu);
        // this.$store.commit('updateLeftMenu', JSON.stringify(tmp.subMenu));
      },
      initMenu() {
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
