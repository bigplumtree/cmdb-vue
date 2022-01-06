import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Engine from '../components/assets/Engine'
import Password from '../components/assets/Password'
import Project from '../components/assets/Project'
import Server from '../components/assets/Server'
import Services from '../components/assets/Services'
import Software from '../components/deploy/Software'
import Jdk from '../components/deploy/install/Jdk'
import Init from '../components/deploy/install/Init'
import Mysql from '../components/deploy/install/Mysql'
import Redis from '../components/deploy/install/Redis'
import Influxdb from '../components/deploy/install/Influxdb'
import Minio from '../components/deploy/install/Minio'
import Nodejs from '../components/deploy/install/Nodejs'
import Mongodb from '../components/deploy/install/Mongodb'


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'root',
    component: Home,
    children: [
      {path: '/engine', component: Engine},
      {path: '/password', component: Password},
      {path: '/project', component: Project},
      {path: '/server', component: Server},
      {path: '/services', component: Services , name: 'services'},
      {path: '/software', component: Software},
      {path: '/jdk', component: Jdk},
      {path: '/init', component: Init},
      {path: '/mysql', component: Mysql},
      {path: '/redis', component: Redis},
      {path: '/influxdb', component: Influxdb},
      {path: '/minio', component: Minio},
      {path: '/nodejs', component: Nodejs},
      {path: '/mongodb', component: Mongodb},
    ]
  },

  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: Home,
  //   //redirect: '/welcome',
  //   children: []
  // }
]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
  VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 路由守卫
// 如果用户没有登陆，但是直接通过URL放到指定接口，需要重新导航倒登陆页面进行登陆
router.beforeEach((to, from, next) => {
  // 如果用户访问的登陆页面，直接放行
  if (to.path == '/login') {
    next()
  }
  // 如果访问的不是登陆页面，需要进行验证token
  else {
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr){
      next('/login')
    }
    else{
      // 如果通过了就放行
      next()
    }
  }
})

export default router
