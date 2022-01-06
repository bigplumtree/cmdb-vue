<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--  ===============================
            登录表单区域
            el-form代表整个表单
            el-form-item代表区域内的各个组件
            ===============================
            -> 数据绑定步骤:
            1.先在大表单上通过:model固定格式(不是双向绑定),为这个表单绑定数据,绑定的值需要在data中定义为对象格式
            2.之后在大表单内的每个数据表单上都过v-model进行双向数据绑定
            ===============================
            -> 数据验证操作步骤
            1.先在大表单上声明数据验证规则对象rules的值
            2.在data中定义数据验证规则对象,对象中可以有多个验证规则小对象,每一个小对象都是一个数组,数组中包含具体的验证规则对象,详情见data中的loginFormRules
            3.在需要验证的表单组件上使用prop属性指定验证规则,例如:<el-form-item prop="username">
            4.prop中的验证规则名称要和v-model中的数据对象名称一致！！！
            其他见:https://element.faas.ele.me/#/zh-CN/component/form
            ===============================
            -> 数据重置操作步骤
            1.对表单内的内容进行重置需要先拿到表单的实例对象,可以使用ref属性指定表单实例对象名称
            2.通过this.$refs.loginFormRef.resetFields()就可以进行重置
            ===============================
            -> 表单预验证
            1.在表单提交前先进行一次表单内验证,可以减少网络请求,如果验证通过就进行后端服务器登陆验证,如果没通过验证就不进行操作
            2.通过this.$refs.loginFormRef.validate((valid,obj) => {if (!valid) return})
            3.validate可以进行预验证,可以接收两个参数①否校验成功②未通过校验的字段
      -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-notebook-2" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          // 验证必填项,trigger: 'blur'指的是当光标离开时验证
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // 通过refs获取表单对象
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 先进行预验证
      this.$refs.loginFormRef.validate((valid, obj) => {
        // validate可以进行预验证,可以接收两个参数①否校验成功②未通过校验的字段
        if (!valid) 
          console.log("表单未通过验证项:",obj)
        else{
          let params = new URLSearchParams();
          params.append('username', this.loginForm.username)
          params.append('password', this.loginForm.password)
          this.$axios
          .post('/login/', params)
          .then((success) => { 
            if (success.data.status == 200) {
              this.$message({message: '登陆成功', type: 'success', center: true});
              //1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
              //2. 项目中除了登录之外的其他API接口，必须在登录之后才能访问
              //3. token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
              window.sessionStorage.setItem('token', success.data.data.token);

              // 把登录之后的页面写到session中,登陆页面创建的时候会调用这个值,这个地方值写死了
              window.sessionStorage.setItem('activePath', '/software')
              //1. 通过编程式导航跳转到后台主页，路由地址是 /
              this.$router.push('/software')
            }
            else {
              this.$message({message: success.data.msg, type: 'error',center: true});
            }
            })
          .catch((error) => { 
            this.$message({message: '接口请求错误', type: 'error', center: true});
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-image: url("../assets/background.png");
  background-repeat: no-repeat;
  background-size: 100%,100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
