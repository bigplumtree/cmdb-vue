<template>
  <!-- 整体区域 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img style="margin-left:20px" src="../assets/icon.png" alt=""/>
        <span>综合运维平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button></el-header
    >
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">
          <i :class="toggleButtonIcon"></i>
        </div>
        <!-- 侧边栏菜单区域 -->
        <!-- unique-opened:是否只保持一个子菜单的展开
            active-text-color:当前激活菜单的文字颜色（仅支持 hex 格式）
            collapse:是否折叠
            collapse-transition:是否开启折叠动画
            router:开启路由模式
            default-active:默认高亮项
        -->
        <el-menu         
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!-- 每一个菜单都需要一个唯一的index，且值为字符串，用来区分点击折叠事件和路由跳转地址，如果index值相同，点击菜单时会同时展开或同时闭合 -->
          <el-submenu :index="submenu.path+''" v-for="submenu in menulist" :key="submenu.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="submenu.icon"></i>
              <!-- 文本 -->
              <span>{{submenu.name}}</span>
            </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="menuitem.path+''" v-for="menuitem in submenu.children" :key="menuitem.id" @click="saveNavState(menuitem.path)">
                <template slot="title">
                  <!-- 图标 -->
                  <i :class="menuitem.icon"></i>
                  <!-- 文本 -->
                  <span>{{menuitem.name}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 右侧内容主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部区域 -->
        <!-- <el-footer height="30px">
          <div>
              <span>@@@@@</span>
          </div>
        </el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 菜单列表
      menulist: [],
      // 左侧菜单是否折叠
      isCollapse: false,
      // 当前正在打开的页面
      activePath: '',
    };
  },
  computed:{
    // 是否折叠左侧边栏的宽度
    asideWidth(){
      return this.isCollapse ? "70px" : "200px"
    },
    // 折叠按钮的图标
    toggleButtonIcon(){
      return this.isCollapse ? "el-icon-s-unfold" : "el-icon-s-fold"
    }
  },
  methods: {
    logout() {
      // 退出之前先清空token
      window.sessionStorage.clear();
      // 重定向到登陆页面
      this.$router.push("/login");
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },    
    // 保存链接的激活状态
    saveNavState(path) {
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    },
    // 获取菜单列表
    get_menu(){
      this.$axios
        .get("assets/menus/")
        .then((success) => {
          if (success.data.status == 200) {
            this.menulist = success.data.data;
          } else {
              console.log(success)
              this.$message({message: success.data.msg, type: "error", center: true, duration: '0'});
          }})
        .catch((error) => {
          this.$message({message: "菜单列表接口请求错误", type: "error", center: true, duration: '0'});
        });
    }

  },
  created() {
    // 页面创建完成后就请求页面接口，获取菜单列表
    this.get_menu()
    // 从session中获取正在点击的按钮
    this.activePath = window.sessionStorage.getItem('activePath')
  },

};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 20px;
  line-height: 14px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>