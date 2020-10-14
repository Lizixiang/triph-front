import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index/index'
import xmain from '@/components/main/xmain'
import editTechinique from '@/components/technique/edit'
import addTechinique from '@/components/technique/add'
import navigation from '@/components/nav/nav'
import techniqueList from '@/components/technique/list'
import reptileList from '@/components/reptile/list'
import reptileEdit from '@/components/reptile/edit'
import techniqueCate from '@/components/technique/cate'
import authList from '@/components/auth/list'
import roleList from '@/components/role/list'
import orgList from '@/components/org/list'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/xmain',
      name: 'xmain',
      component: xmain,
      children: [
        {
          path: '/index/index',
          name: 'index',
          component: index,
          meta: {'title': '首页'}
        },
        {
          path: '/left/nav',
          name: 'navigation',
          component: navigation,
          meta: {'title': '导航'}
        },
        {
          path: '/technique/list',
          name: 'techniqueList',
          component: techniqueList,
          meta: {'title': '个人技术'},
          children: [
            {
              path: '/technique/edit',
              name: 'editTechinique',
              component: editTechinique,
              meta: {'title': '修改'}
            },
            {
              path: '/technique/add',
              name: 'addTechinique',
              component: addTechinique,
              meta: {'title': '新增'}
            }
          ]
        },
        {
          path: '/technique/cate',
          name: 'techniqueCate',
          component: techniqueCate,
          meta: {'title': '技术分类'}
          // children: [
          //   {
          //     path: '/technique/edit',
          //     name: 'editTechinique',
          //     component: editTechinique,
          //     meta: {'title': '修改'}
          //   },
          //   {
          //     path: '/technique/add',
          //     name: 'addTechinique',
          //     component: addTechinique,
          //     meta: {'title': '新增'}
          //   }
          // ]
        },
        {
          path: '/reptile/list',
          name: 'reptileList',
          component: reptileList,
          meta: {'title': '爬虫'},
          children: [
            {
              path: '/reptile/edit',
              name: 'reptileEdit',
              component: reptileEdit,
              meta: {'title': '修改'}
            }
          ]
        },
        {
          path: '/auth/list',
          name: 'authList',
          component: authList,
          meta: {'title': '权限列表'}
        },
        {
          path: '/role/list',
          name: 'roleList',
          component: roleList,
          meta: {'title': '角色列表'}
        },
        {
          path: '/org/list',
          name: 'orgList',
          component: orgList,
          meta: {'title': '组织列表'}
        }
      ]
    }

  ]
});


// 导航守卫  注册前置守卫用于判断用户是否登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem("Authorization");
    if (token === null || token === undefined || token === 'null' || token === '') {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
