<template>
  <div>
    <!-- 头部导航区 -->
    <el-page-header @back="goBack" content="初始化"></el-page-header>

    <el-row :gutter="30" style="margin-top:20px">
      <el-col :span="18" >
        <el-card id="installCard" class="installCard">

    <!-- 进度条
        :active绑定的是第几个步骤(数字类型),0第一个,这里的进度条和tabs标签页做了绑定
        当tabs页面改变,tabs的值就对应获取name的值,tabs中name 的值要和steps中的步骤对应上 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step icon="el-icon-link"></el-step>
        <el-step icon="el-icon-edit"></el-step>
        <el-step icon="el-icon-date"></el-step>
      </el-steps>

      <!-- v-model绑定的就是el-tab-pane中的name值,这个值和上面的el-steps的active值联动 -->
      <el-tabs v-model="activeIndex" :before-leave="beforeTabLeave"  :stretch="true">
        <el-tab-pane label="连接" name="0">
          <!-- 连接服务器的ip port username password表单 
          :inline="true" 所有标签可以放在一行,宽度不够会换行
          label-position="left" 标签在输入框左边-->
          <el-form :model="sshConnectForm" :rules="sshConnectFormRules" ref="sshConnectFormRef" :inline="true" label-position="left">
            <el-form-item label="IP地址" prop="ip" label-width="80px">
              <el-input v-model="sshConnectForm.ip"  style="width:350px;margin-right:40px" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port" label-width="80px">
              <el-input v-model="sshConnectForm.port" style="width:350px;margin-right:40px"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username"  label-width="80px">
              <el-input v-model="sshConnectForm.username" style="width:350px;margin-right:40px"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password"  label-width="80px">
              <el-input v-model="sshConnectForm.password" show-password style="width:350px;margin-right:40px"></el-input>
            </el-form-item>
          </el-form>
          <span style="float:right">
            <el-button type="primary" :loading="button_sshtest_loading" @click="button_sshtest_click">连接</el-button>
            <el-button :type="button_sshsuccess_type" :disabled="button_sshsuccess_disabled" @click="button_sshsuccess_click">下一步</el-button>
          </span>
        </el-tab-pane>
        <el-tab-pane label="参数" name="1">
          <el-form :model="softInstallParamters" label-width="180px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="关闭SElinux">
                  <el-switch v-model="softInstallParamters.close_selinux"></el-switch>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="关闭防火墙">
                  <el-switch v-model="softInstallParamters.close_firewall"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="更改上海时区">
                  <el-switch v-model="softInstallParamters.change_zone"></el-switch>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="系统调优">
                  <el-switch v-model="softInstallParamters.system_tuning"></el-switch>
                </el-form-item>
              </el-col> 
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="安装基础依赖">
                  <el-switch v-model="softInstallParamters.install_dependencies"></el-switch>
                </el-form-item>
              </el-col> 
              <el-col :span="12">
                <el-form-item label="无法上网">
                  <el-switch v-model="softInstallParamters.none_network"></el-switch>
                </el-form-item>
              </el-col> 
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="创建工作目录" >
                  <el-input :disabled="true" placeholder="例如:/data,/soft,多个路径以逗号分割,也可以不创建" v-model="softInstallParamters.work_dir"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="时间服务器">
                  <el-input v-model="softInstallParamters.ntp_server"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <span style="float:right;margin-right:200px">
            <el-button @click="install_start" type="primary">安装</el-button>
          </span>
        </el-tab-pane>

        <el-tab-pane label="部署" name="2" >
          <el-collapse v-model="activeNames" :accordion="true">
            <el-collapse-item name="success">
              <template slot="title"><span class="ansible_result_title">成功</span><el-badge type="success" :value="ansible_result.status.ok" /></template>
              <div class="ansible_result_div">{{ ansible_result.ok }}</div>
            </el-collapse-item>
            <el-collapse-item name="failed">
              <template slot="title"><span class="ansible_result_title">失败</span><el-badge type="danger" :value="ansible_result.status.failed" /></template>
              <div class="ansible_result_div">{{ ansible_result.failed }}</div>
            </el-collapse-item>
            <el-collapse-item name="changed">
              <template slot="title"><span class="ansible_result_title">改变</span><el-badge type="primary" :value="ansible_result.status.changed" /></template>
              <div class="ansible_result_div">{{ ansible_result.changed }}</div>
            </el-collapse-item>
            <el-collapse-item name="skipped">
              <template slot="title"><span class="ansible_result_title">跳过</span><el-badge type="info" :value="ansible_result.status.skipped" /></template>
              <div class="ansible_result_div">{{ ansible_result.skipped }}</div>
            </el-collapse-item>
            <el-collapse-item name="unreachable">
              <template slot="title"><span class="ansible_result_title">不可达</span><el-badge type="warning" :value="ansible_result.status.unreachable" /></template>
              <div class="ansible_result_div">{{ ansible_result.unreachable }}</div>
            </el-collapse-item>
          </el-collapse>
          <el-button style="margin-top:20px;float:right" type="primary" @click="goBack">返回安装列表页面</el-button>
        </el-tab-pane>
      </el-tabs>

        </el-card>
      </el-col>

      <el-col :span="6" >
        <el-card class="infoCard">
          <el-alert class="rightAlert" title="页面内所有选项都可以为默认,不做修改" type="info" :closable="false" show-icon></el-alert>
          <el-alert class="rightAlert" title="时间服务器可以自行修改" type="info" :closable="false" show-icon></el-alert>
          <el-alert class="rightAlert" title="如果服务器无法连接互联网,请打开无法上网选项,系统会传输一个4G+的镜像到服务器,安装时间会很长,100M带宽的网络全部部署完成大约需要8分钟" type="warning" :closable="false" show-icon></el-alert>          
        </el-card>
      </el-col>
    </el-row> 





  </div>

</template>

<script>
export default {
    name: 'Init',
    data() {
      return {
        // 步骤条和tabs的索引值
        activeIndex: '0',
        // 测试连接服务器按钮的加载状态
        button_sshtest_loading: false,
        // 连接服务器成功后下一步按钮的可用状态
        button_sshsuccess_disabled: true,
        // 测试连接服务器成功后,下一步按钮的颜色
        button_sshsuccess_type: 'info',
        // 测试连接服务器时的ip,port,username,password
        sshConnectForm:{
          ip: '',
          port: '',
          username: '',
          password: ''
        },
        // 测试连接服务器时的验证规则
        sshConnectFormRules:{
          ip: [
            { required: true, message: '请输入IP地址', trigger: 'blur' }
          ],
          port: [
            { required: true, message: '请输入端口', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        // 当前正在安装的软件
        current_install_soft: {},
        // 软件安装时候的信息,要传给后端
        installSoftForm:{},
        // 软件安装时候的验证规则
        installSoftFormRules:[],
        // 软件安装时的参数
        softInstallParamters: {
          close_selinux: true,
          close_firewall: true ,
          change_zone: true,
          system_tuning: true,
          none_network: false,
          install_dependencies: true,
          ntp_server: 'ntp1.aliyun.com',
          work_dir: '/data',        
        },

        // 折叠框默认打开哪个页面
        activeNames: 'success',

        // 任务下发后的返回结果
        ansible_result: {
          // 这是返回的日志信息
          skipped: '',
          failed: '',
          ok: '',
          unreachable: '',
          changed: '',
          // 这是返回的数字
          status: {
            skipped: 0,
            failed: 0,
            ok: 0,
            unreachable: 0,
            changed: 0,
          }
        }
      }
    },
    methods: {
      // 返回上一页按钮
      goBack(){
        this.$router.back()
      },

      // tab标签页从一个标签离开到另一个标签之前的回调
      // activeName:即将进入的标签页名字
      // oldActiveName:即将离开的标签页名字
      beforeTabLeave(activeName, oldActiveName) {
        // 如果从测试主机连接的标签划走,并且主机连接状态不可用,就不让划走
        if (oldActiveName === '0' && this.button_sshsuccess_disabled) {
          this.$message({type: 'error', message: '请先测试主机是否可以连接',center: true})
          return false
        }
      },

      // 测试连接服务器的按钮点击触发事件
      button_sshtest_click(){
        this.$refs.sshConnectFormRef.validate((valid, obj) => {
          // validate可以进行预验证,可以接收两个参数①否校验成功②未通过校验的字段
          if (!valid) 
            console.log("表单未通过验证项:",obj)
          else{
              this.button_sshtest_loading = true
              let params = new URLSearchParams();
              params.append('ip', this.sshConnectForm.ip)
              params.append('port', this.sshConnectForm.port)
              params.append('username', this.sshConnectForm.username)
              params.append('password', this.sshConnectForm.password)
              this.$axios
              .post('deploy/machine/state/', params)
              .then(success => {
                this.button_sshtest_loading = false
                if(success.data.status === 200){
                  this.$message({type: 'success', center: true, message:'连接成功'})
                  this.button_sshsuccess_type = 'success'
                  this.button_sshsuccess_disabled = false
                }else{
                  this.button_sshsuccess_type = 'info'
                  this.button_sshsuccess_disabled = true
                  this.$message({type: 'error', center: true, message:'连接失败'})
                }
              })
              .catch(error => {
                this.button_sshtest_loading = false
                this.$message({type: 'error', center: true, message:'后台接口请求错误'})
              })
          }
        })
      },

      // 主机联通后,下一步按钮点击触发事件,移动步骤条和标签页的索引值到下一页
      button_sshsuccess_click(){
        this.activeIndex = '1'
      },

      // 软件开始安装
      install_start(){
        this.activeIndex = '2'
        const installing = this.$loading({
          target: document.querySelector('#installCard'),
          lock: false,
          text: '正在安装...',
          //spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.8)'
        });
        let params = new URLSearchParams();
          params.append('ip', this.sshConnectForm.ip)
          params.append('port', this.sshConnectForm.port)
          params.append('username', this.sshConnectForm.username)
          params.append('password', this.sshConnectForm.password)
          params.append('close_selinux', this.softInstallParamters.close_selinux)
          params.append('close_firewall', this.softInstallParamters.close_firewall)
          params.append('change_zone', this.softInstallParamters.change_zone)
          params.append('system_tuning', this.softInstallParamters.system_tuning)
          params.append('none_network', this.softInstallParamters.none_network)
          params.append('install_dependencies', this.softInstallParamters.install_dependencies)
          params.append('ntp_server', this.softInstallParamters.ntp_server)
          params.append('work_dir', this.softInstallParamters.work_dir)
          this.$axios
            .post('deploy/server/init/', params, {timeout: 0})
            .then(success => {
              if(success.data.status === 200){
                this.$notify({type: 'success', message:'部署成功'})
                this.ansible_result = success.data.data
                installing.close()
              }else{
                this.$notify({type: 'warning', message:'部署时出现一些错误'})
                this.ansible_result.failed = success.data.msg
                this.ansible_result.status.failed = 1
                this.activeNames = 'failed'
                installing.close()
              }
            })
            .catch(error => {
              console.log(error)
              this.$notify({type: 'warning', message:'后端接口超时'})
              this.ansible_result.failed = '后端接口超时'
              this.ansible_result.status.failed = 1
              this.activeNames = 'failed'
              installing.close()
            })
          
      },
    }
}
</script>

<style lang="less" scoped>
.installCard{
  height: 750px;
}
.infoCard{
  height: 750px;
}

.rightAlert {
  margin-top: 10px;
  padding: 10px;
}


// 保留标签里面的换行符
.ansible_result_div {
  white-space: pre-line;
  overflow:auto;
  height:200px;
}
.ansible_result_title{
  font-weight:bolder;
}

</style>