import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入 NProgress 包对应的JS和CSS,页面顶部的加载条,非常好用
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


// 导入加载狂
import { Loading } from 'element-ui'
Vue.prototype.$loading = Loading.service

// 导入echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 导入axios
import axios from 'axios'
// 全局引用axios
Vue.prototype.$axios = axios;

// 配置上传文件时upload组件的上传地址
Vue.prototype.$uploadapi = 'http://192.168.1.183:8000/api/'

// 配置请求路径
// axios.defaults.baseURL = 'http://192.168.1.4:8000/api/'
axios.defaults.baseURL = 'http://192.168.1.183:8000/api/'
// 每次请求前，先在请求头中加入token，用于接口认证，固定格式如下
axios.interceptors.request.use(config => {
  // console.log(config)
  // 这条是每次进行axios请求的时候会出现顶部进度条
  NProgress.start()
  // 添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  // 在每次axios获得响应后,隐藏进度条
  NProgress.done()
  return config
})

document.title = "综合运维平台"
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
