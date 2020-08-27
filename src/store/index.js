import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  // 属性
  state: {
    // token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
  },
  // 方法
  mutations: {
    changeLogin(state, token) {
      state.Authorization = token;
      localStorage.setItem('Authorization', token);
    }
  }
});

export default store;
