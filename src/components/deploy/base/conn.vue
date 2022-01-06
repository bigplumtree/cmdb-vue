// 这个文件是把"测试连接服务器"抽出组件,但是没有时间研究怎么弄成组件,都写完再说吧
<template>
  <div>
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
  </div>
</template>

<script>
export default {
    name: 'Conn',
    data() {
        return {
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
        }
    },
    methods: {
        
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
    }
}
</script>

<style>

</style>