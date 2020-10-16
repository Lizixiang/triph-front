import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  // 属性
  state: {
    // token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    // 菜单
    menu: localStorage.getItem('menu') ? localStorage.getItem('menu') : '',
    // 左侧菜单
    leftMenu: localStorage.getItem('leftMenu') ? localStorage.getItem('leftMenu') : '',
    // 用户名
    userName: localStorage.getItem('userName') ? localStorage.getItem('userName') : '',
  },
  // 方法
  mutations: {
    changeLogin(state, token) {
      state.Authorization = token;
      localStorage.setItem('Authorization', token);
    },
    initMenu(state, menu) {
      state.menu = menu;
      localStorage.setItem('menu', menu);
    },
    updateLeftMenu(state, leftMenu) {
      state.leftMenu = leftMenu;
      localStorage.setItem('leftMenu', leftMenu);
    },
    updateName(state, userName) {
      state.userName = userName;
      localStorage.setItem('userName', userName);
    }
  }
});

export default store;
