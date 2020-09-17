// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import quillEditor  from 'vue-quill-editor'
import axios from 'axios'
import store from './store'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI, {size: 'small', zindex: 3000})
Vue.use(quillEditor)
Vue.use(axios)



Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// 添加拦截器，在请求头中增加oauth token验证
axios.interceptors.request.use(value => {
  if (value.url.indexOf("/oauth/token") === -1 && localStorage.getItem('Authorization')) {
    value.headers.Authorization = localStorage.getItem('Authorization');
  }
  return value;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(value => {
  if (value.status === 401) {
    localStorage.removeItem('Authorization');
    location.href = '/';
  }
  if (value.data.success && value.data.success === false) {
    window.vm.$message.error(value.data.message);
  }
  return value;
}, error => {
  if (error.response.status === 401) {
    localStorage.removeItem('Authorization');
    location.href = '/';
  }
  return Promise.reject(error);
})
