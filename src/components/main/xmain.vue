<template>
  <el-container style="height: 570px;">
    <el-header></el-header>
    <el-container>
      <el-aside width="200px">
        <Nav></Nav>
      </el-aside>
      <el-container>
        <el-main style="padding-top: 5px;">
          <el-row>
            <el-col :span="24">
              <!--              <el-tab-pane-->
              <!--                v-for="(item, index) in editableTabs"-->
              <!--                :key="item.path"-->
              <!--                :label="item.title"-->
              <!--                :to="{ path: item.path, query: item.query, fullPath: item.fullPath }"-->
              <!--                :name="item.name"-->
              <!--                :closable="item.closable"-->
              <!--              >-->
              <!--                <el-col :span="24" class="content-wrapper">-->
              <!--                  <transition name="fade" mode="out-in">-->
              <!--                    <keep-alive :include="cachedViews">-->
              <!--                      <router-view :key="item.path"></router-view>-->
              <!--                    </keep-alive>-->
              <!--                  </transition>-->
              <!--                </el-col>-->
              <!--              </el-tab-pane>-->
              <router-link
                v-for="tag in editableTabs"
                ref="tag"
                :key="tag.path"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
                @click.native="toTag(tag.name)"
                tag="span"
                style="padding-right: 2px;margin-bottom: 20px;">
                <el-tag
                  style="cursor: pointer;"
                  :closable="tag.closable"
                  effect="light"
                  :type="isActive(tag)?'':'info'"
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{ tag.title }}
                  <i v-if="tag.name !== 'index'" class="el-icon-refresh-right icon-refresh" @click="flushTag"></i>
                </el-tag>
              </router-link>
            </el-col>
            <el-divider />
            <el-col :span="24" class="content-wrapper">
              <transition name="el-fade-in" mode="out-in">
                <keep-alive>
                  <router-view :key="activeTime"></router-view>
                </keep-alive>
              </transition>
            </el-col>
          </el-row>
        </el-main>
        <!--        <el-footer>Footer</el-footer>-->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
  import Nav from "@/components/nav/nav";

  export default {
    name: 'xmain',
    components: {Nav},
    data() {
      return {
        editableTabsValue: 'index',
        editableTabs: [{
          title: '首页',
          path: '/index/index',
          name: 'index',
          closable: false
        }],
        activeTime: ''
        // cachedViews: []
      }
    },
    methods: {
      addTags() {
        if (this.$route.name === 'index') return;
        var obj = {
          title: this.$route.meta.title,
          path: this.$route.path,
          name: this.$route.name,
          closable: true
        };
        var flag = this.editableTabs.some(item => {
          if (item.name === obj.name) {
            return true;
          }
        });
        if (flag) return;
        this.editableTabs.push(obj);
        // this.cachedViews.push(obj.path);
      },
      moveToCurrentTab() {
        this.editableTabsValue = this.$route.name;
      },
      handleClose(tag) {
        console.log(tag);
        this.editableTabs.forEach(function (item, index, arr) {
          if (item.name === tag.name) {
            arr.splice(index, 1);
            // this.cachedViews.splice(index, 1);
          }
        });
        if (this.editableTabsValue == tag.name) {
          let selTab = this.editableTabs[this.editableTabs.length - 1];
          this.editableTabsValue = selTab.name;
          this.$router.push(selTab.path);
        }
      },
      isActive(tag) {
        return tag.name == this.editableTabsValue;
      },
      // 改变key值 来刷新当前路由的页面
      flushTag() {
        var ev = window.event || arguments.callee.caller.arguments[0];
        if (window.event) {
          ev.cancelBubble = true;
        } else {
          ev.stopPropagation();
        }
        this.activeTime = new Date().getTime()+'';
      },
      toTag(tagName) {
        this.activeTime = tagName;
      }
    },
    watch: {
      $route() {
        console.log(this.$route);
        this.addTags();
        this.moveToCurrentTab();
        this.toTag(this.$route.name);
      }
    },
    computed: {},
    mounted() {
      this.addTags();
      this.moveToCurrentTab();
    }
  }
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #409EFF;
    color: #333;
    /*text-align: center;*/
    /*line-height: 60px;*/
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    /*text-align: center;*/
    /*line-height: 200px;*/
  }

  .icon-refresh {
    margin-right: -6px !important;
    border-radius: 50%;
  }

  .icon-refresh:hover{
    background-color: #409eff;
    color: white;
  }

  /*.el-main {*/
  /*  background-color: #E9EEF3;*/
  /*  color: #333;*/
  /*  !*text-align: center;*!*/
  /*  line-height: 160px;*/
  /*}*/

  /*body > .el-container {*/
  /*  margin-bottom: 40px;*/
  /*}*/

  /*.el-container:nth-child(5) .el-aside,*/
  /*.el-container:nth-child(6) .el-aside {*/
  /*  line-height: 260px;*/
  /*}*/

  /*.el-container:nth-child(7) .el-aside {*/
  /*  line-height: 320px;*/
  /*}*/
</style>
