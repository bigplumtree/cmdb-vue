<template>
  <div>
    <!-- 头部导航区 -->
    <el-page-header @back="goBack" content="详情页面">
    </el-page-header>

    <!-- 上部分的用户名密码和内存CPU -->
    <el-row :gutter="30" style="margin-top:20px">
      <el-col :span="8" >
        <el-card class="topCard" :v-loading="true">
          <el-table :data="server_info" :border="true" stripe style="width: 100%" :header-cell-style="{fontSize: '18px'}">
            <el-table-column :resizable="false" min-width="35%" prop="ip" label="IP" align="center"></el-table-column>
            <el-table-column :resizable="false" min-width="20%" prop="username" label="用户名" align="center"></el-table-column>
            <el-table-column :resizable="false" min-width="40%" prop="password" label="密码" align="center"></el-table-column>
            <el-table-column :resizable="false" min-width="15%" prop="port" label="端口" align="center" ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card id="ServerRateCardRef" class="topCard">
          <el-col :span="20" >
            <el-descriptions  :column="3" :colon="false" size="small" border>
              <el-descriptions-item label="cpu使用率/1min"><el-tag size="small">{{ServerRate.cpu_rate_1min}}</el-tag></el-descriptions-item>
              <el-descriptions-item label="内存总量"><el-tag size="small">{{ServerRate.total_memory}}MB</el-tag></el-descriptions-item>
              <el-descriptions-item label="磁盘情况"><el-tag size="small">{{ServerRate.disk_rate}}</el-tag></el-descriptions-item>
              <el-descriptions-item label="cpu使用率/5min"><el-tag size="small">{{ServerRate.cpu_rate_5min}}</el-tag></el-descriptions-item>  
              <el-descriptions-item label="可用内存"><el-tag size="small">{{ServerRate.available_memory}}MB</el-tag></el-descriptions-item>
              <el-descriptions-item label="上次更新时间"><el-tag size="small">{{ServerRate.update_time}}</el-tag></el-descriptions-item>
              <el-descriptions-item label="cpu使用率/15min"><el-tag size="small">{{ServerRate.cpu_rate_15min}}</el-tag></el-descriptions-item>
              <el-descriptions-item label="可用占比"><el-tag size="small">{{ServerRate.memory_rate}}%</el-tag></el-descriptions-item>
              <el-descriptions-item label="刷新">
                <el-button style="float:right" type="primary" size="mini" icon="el-icon-refresh" circle @click="RefreshServerRate"></el-button></el-descriptions-item>              
            </el-descriptions>           
            
          </el-col>
          <el-col :span="4" >
            <div>
              <el-alert type="info" title="建议2K分辨率,目前只支持Linux系统下的服务器状态获取" show-icon :closable="false"></el-alert>
            </div>
          </el-col>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下部分的服务详情 -->
    <el-row style="margin-top:20px">
      <el-card>
        <el-col :span="24">
          <el-button icon="el-icon-circle-plus" style="float:right;margin-right:10px" plain type="primary" @click="addService"></el-button>     
        </el-col>
        <el-col :span="24"> 
          <el-table :data="services_list" border stripe class="fuwubiaoge">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="名称" align="center" min-width="60px">
              <template slot-scope="scope">      
                <div style="font-weight:bolder">
                  {{ scope.row.service_name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="service_dir" label="路径" align="center" header-align="center"></el-table-column>
            <el-table-column prop="service_port" label="端口" align="center" min-width="50px"></el-table-column>
            <el-table-column label="登录认证" align="center" min-width="80px">
              <template slot-scope="scope">      
                <div>
                  <el-tag size="mini" effect="dark">{{ scope.row.service_username }}</el-tag>
                    <span class="maohao">:</span>
                  <el-tag size="mini" effect="dark">{{ scope.row.service_password }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="版本" min-width="60px">
              <template slot-scope="scope">      
                <div>
                  <el-tag size="mini" effect="light">{{ scope.row.service_version }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="权限" align="center" min-width="100px">
              <template slot-scope="scope">      
                <div>
                  <el-tag type="success" size="mini" effect="dark">{{ scope.row.service_owner }}</el-tag>
                    <span class="maohao">:</span>
                  <el-tag type="success" size="mini" effect="dark">{{ scope.row.service_group }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="命令" header-align="center" align="left" min-width="140px" show-overflow-tooltip>
              <template slot-scope="scope">      
                <div>
                  <span class="maohao">启动</span>
                  <el-tag type="info" size="mini" effect="dark">{{ scope.row.service_start_comm }}</el-tag>
                </div>
                <div>
                  <span class="maohao">重启</span>
                  <el-tag type="info" size="mini" effect="dark">{{ scope.row.service_restart_comm }}</el-tag>
                </div>
                <div>
                  <span class="maohao">停止</span>
                  <el-tag type="info" size="mini" effect="dark">{{ scope.row.service_stop_comm }}</el-tag>
                </div>
                <div>
                  <span class="maohao">自启</span>
                  <el-tag type="info" size="mini" effect="dark">{{ scope.row.service_enable_comm }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="service_text" header-align="center" align="left" label="备注" ></el-table-column>
            <el-table-column label="操作" min-width="40px" align="center">
              <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
              <template slot-scope="scope">
                <div >
                  <el-tooltip effect="dark" content="配置文件" placement="top" :enterable="false">
                    <el-popover placement="left-start"  trigger="click" @show="configfilePopoverShow(scope.row)" @hide="configfilePopoverafterleave">
                    <!-- 上传框
                      name: 后端在接收这个文件时的key值
                      action: 上传接口
                      headers: 上传的请求头
                      multiple: 是否支持多文件同时上传
                      data: 上传时附带的额外参数
                      show-file-list: 是否显示已经上传的文件列表
                      with-credentials: 支持发送cookie凭证信息
                      drag: 是否启用上传
                      accept: 接收上传的文件类型
                      on-preview: 点击已经上传文件的的回调
                      on-remove: 文件列表移除文件时的回调
                      on-success: 文件上传成功时的回调
                      on-error: 文件上传失败时的回调
                      on-progress: 文件上传时的回调
                      on-exceed: 文件超出个数限制时的钩子
                      on-change: 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
                      list-type: 文件列表类型,text/picture/picture-card
                      auto-upload: 是否在选取文件后立即上传
                      file-list: 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
                      limit: 最大允许上传个数(不是同时上传文件的个数)
                      -->
                    <el-upload
                      name="serviceConfigFile"
                      class="upload-demo"
                      :data="uploadData"
                      :headers="uploadHeaders"
                      :action="uploadInterface"
                      :multiple='false'
                      :on-preview="fileClick"
                      :on-remove="fileRemove"
                      :before-upload="(file) => beforeFileUpload(file, scope.row)"
                      :before-remove="beforeFileRemove"
                      :on-success="(msg) => fileUploadSuccess(msg, scope.row)"
                      :on-error="fileUploadError"
                      :on-exceed="fileExceed"
                      :limit="fileUploadLimit"
                      :accept="acceptFileType"
                      :file-list="fileList"
                      ref="uploadFileRef">
          
                      <el-button size="small" icon="el-icon-upload" type="primary">点击上传(小于{{acceptFileSize}}KB)</el-button>
                      
                    </el-upload>
                    <el-button slot="reference" type="primary" icon="el-icon-coin" size="mini"></el-button>
                      <!-- <el-button type="primary" icon="el-icon-coin" size="mini" @click="showService(scope.row)"></el-button> -->
                    </el-popover>
                    
                  </el-tooltip>
                </div>
                <div class="caozuoanniu">
                  <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                    <el-button type="success" icon="el-icon-edit" size="mini" @click="editService(scope.row)"></el-button>
                  </el-tooltip>
                </div>
                <div >
                  <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteService(scope.row)"></el-button>
                  </el-tooltip>
                </div>
              </template> 
            </el-table-column>
          </el-table>
        </el-col>
      </el-card>
    </el-row>


    <!-- 添加服务面板 -->
    <el-dialog 
      :title="dialogTitleWord" 
      :visible.sync="addServiceDialogVisible" 
      width="60%" 
      :close-on-click-modal="false" 
      @close="addServicerDialogClosed"
      :show-close="false"
      lock-scroll>
      <!-- 添加参数的对话框 -->
      <el-form :model="addServiceForm" :rules="addServiceFormRules" ref="addServiceFormRef" label-width="70px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addServiceForm.name" placeholder="服务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="端口" prop="port">
            <el-input v-model="addServiceForm.port" placeholder="服务端口"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="版本" prop="version">
            <el-input v-model="addServiceForm.version" placeholder="服务版本号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="路径" prop="path">
            <el-input v-model="addServiceForm.path" placeholder="服务安装路径"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户" prop="username">
            <el-input v-model="addServiceForm.username" placeholder="登录的用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="addServiceForm.password" placeholder="登录的密码" show-password></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="属主" prop="owner">
            <el-input v-model="addServiceForm.owner" placeholder="启动服务的用户"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属组" prop="group">
            <el-input v-model="addServiceForm.group" placeholder="启动服务的用户组"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="启动" prop="startcmd">
          <el-input v-model="addServiceForm.startcmd" placeholder="启动服务的命令"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="重启" prop="restartcmd">
          <el-input v-model="addServiceForm.restartcmd" placeholder="重启服务的命令"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="停止" prop="stopcmd">
          <el-input v-model="addServiceForm.stopcmd" placeholder="停止服务的命令"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="自启" prop="enablecmd">
          <el-input v-model="addServiceForm.enablecmd" placeholder="开机启动服务的命令"></el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注" prop="text">
          <el-input v-model="addServiceForm.text" :rows="2" type="textarea" placeholder="其他信息"></el-input>
        </el-form-item>        
      </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addServiceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addServiceParams">{{ dialogButtonWord }}</el-button>
      </span>
    </el-dialog>

    <el-dialog 
      :title="dialogConfigFileTitle" 
      :visible="ConfigFileVisible" 
      width="70%" 
      :close-on-click-modal="false" 
      @close="ConfigFileDialogClosed"
      :show-close="false"
      lock-scroll>
      <el-input class="configfiletxt" type="textarea" :autosize="{ minRows: 10, maxRows: 15}" v-model="ConfigFileTXT"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ConfigFileVisible = false">关 闭</el-button>
        <!-- 下载的地址是minio的分享链接,会出现跨域的问题,a标签的download属性失效,目前不知道怎么解决,先不做下载了 -->
        <!-- <el-button type="primary" @click="DownloadConfigFile">下 载</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Services",
  data() {
    return {
      // 从session中取得服务器连接信息
      // 注意这个server_info用的是数组,因为展示用户名密码用的是表格组件
      server_info: [],
      server_id: '',

      // 添加面板和确定按钮标题
      dialogTitleWord: '',
      dialogButtonWord: '',

      // 添加面板是否可见
      addServiceDialogVisible: false,

      // 添加面板的绑定具体数据
      addServiceForm: {
        id: '',
        name: '',
        path: '',
        port: '',
        username: '',
        password: '',
        version: '',
        owner: '',
        group: '',
        startcmd: '',
        restartcmd: '',
        stopcmd: '',
        enablecmd: '',
        text: ''
      },

      // 这项仅仅是用在编辑服务时,对比数据是否有变动的
      editServiceFormCompared: {},

      // 添加面板的验证规则
      addServiceFormRules: {
        name: [{ required: true, message: '请输入服务名称', trigger: 'blur' }],
        path: [],
        port: [],
        username: [],
        password: [],
        version: [],
        owner: [],
        group: [],
        startcmd: [],
        restartcmd: [],
        stopcmd: [],
        enablecmd: [],
        text: [],
      },

      // 服务列表
      services_list: [],

      // 服务的配置文件列表
      fileList: [],

      // 允许上传文件的类型
      acceptFileType: '.txt,.cfg,.cnf,.conf,.ini',

      // 允许上传文件的大小,KB
      acceptFileSize: 500,

      // 允许上传文件的数量
      fileUploadLimit: 10,

      // 上传文件时附加的参数
      uploadData: {},

      // upload组件上传时要把认证的头也加上,不然后端会拒绝
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },

      // 上传/下载配置文件的接口地址,在主配置文件中定义好了地址,这边引用
      //uploadInterface: 'http://192.168.1.4:8000/api/assets/services/configfile/',
      uploadInterface: this.$uploadapi + 'assets/services/configfile/',
    
      // 展示配置文件弹出框标题
      dialogConfigFileTitle: '',

      // 展示配置文件是否可见
      ConfigFileVisible: false,

      // 展示的配置文件具体内容
      ConfigFileTXT: '',

      // 定义cpu,mem,disk的echart实例
      cpuChart: null,
      memChart: null,
      diskChart: null,

      // cpu echart数据
      cpuChartData: [{value: 0},{value: 0.1},{value: 0.2}],

      // 服务器资源使用情况
      ServerRate: {
        cpu_rate_1min: null,
        cpu_rate_5min: null,
        cpu_rate_15min: null,
        total_memory: null,
        available_memory: null,
        memory_rate: null,
        disk_rate: null,
        update_time: null,
      },

      // 0从数据库中获取资源, 1连接服务器获取资源
      ServerRateRefresh: 0,
    }
  },
  methods: {
    // 返回上一页按钮
    goBack(){
      this.$router.back()
    },

    // 获取服务列表
    getServicesList(){
      this.$axios
      .get('/assets/services/', {
        params:{
          server_id: this.server_id
          }
        })
      .then(success=>{
        if(success.data.status === 200){
          this.services_list = success.data.data
        }else{
          this.$message({type: 'error', center: true, message: success.data.msg})
        }
      })
      .catch(error=>{
          this.$message({type: 'error', center: true, message: '请求服务列表接口错误'})
      })
    },

    // 添加服务按钮
    addService(){
      // 先重置表单
      Object.assign(this.$data.addServiceForm, this.$options.data().addServiceForm)
      this.dialogTitleWord = '添加服务'
      this.dialogButtonWord = '提交'
      this.addServiceDialogVisible = true
    },

    // 编辑服务按钮
    editService(service){
      // 先重置表单
      Object.assign(this.$data.addServiceForm, this.$options.data().addServiceForm)
      // 更改添加面板的标题
      this.dialogTitleWord = '编辑服务'
      this.dialogButtonWord = '修改'
      
      // 填充数据
      this.addServiceForm.id = service.service_id
      this.addServiceForm.name = service.service_name
      this.addServiceForm.path = service.service_dir
      this.addServiceForm.port = service.service_port
      this.addServiceForm.username = service.service_username
      this.addServiceForm.password = service.service_password
      this.addServiceForm.version = service.service_version
      this.addServiceForm.owner = service.service_owner
      this.addServiceForm.group = service.service_group
      this.addServiceForm.startcmd = service.service_start_comm
      this.addServiceForm.restartcmd = service.service_restart_comm
      this.addServiceForm.stopcmd = service.service_stop_comm
      this.addServiceForm.enablecmd = service.service_enable_comm
      this.addServiceForm.text = service.service_text
      // 对比用的参数赋值,转换为字符串防止浅拷贝
      this.editServiceFormCompared = JSON.stringify(this.addServiceForm)
      // 展示面板
      this.addServiceDialogVisible = true
    },

    // 添加/编辑服务面板提交
    addServiceParams(){
      if(this.dialogButtonWord === '提交'){
        this.$refs.addServiceFormRef.validate((valid) => {
          if(!valid){
            this.$notify({type: 'error', message: '请填写必填项', center: 'true'})
          }else{
            let params = new URLSearchParams();
            params.append('server_id', this.server_id)
            params.append('name', this.addServiceForm.name)
            params.append('path', this.addServiceForm.path===''?'/':this.addServiceForm.path)
            params.append('port', this.addServiceForm.port===''?'/':this.addServiceForm.port)
            params.append('username', this.addServiceForm.username===''?'/':this.addServiceForm.username)
            params.append('password', this.addServiceForm.password===''?'/':this.addServiceForm.password)
            params.append('version', this.addServiceForm.version===''?'/':this.addServiceForm.version)
            params.append('owner', this.addServiceForm.owner===''?'/':this.addServiceForm.owner)
            params.append('group', this.addServiceForm.group===''?'/':this.addServiceForm.group)
            params.append('startcmd', this.addServiceForm.startcmd===''?'/':this.addServiceForm.startcmd)
            params.append('restartcmd', this.addServiceForm.restartcmd===''?'/':this.addServiceForm.restartcmd)
            params.append('stopcmd', this.addServiceForm.stopcmd===''?'/':this.addServiceForm.stopcmd)
            params.append('enablecmd', this.addServiceForm.enablecmd===''?'/':this.addServiceForm.enablecmd)
            params.append('text', this.addServiceForm.text)
            this.$axios
            .post('assets/services/', params)
            .then(success=>{
              if(success.data.status === 200){
                this.addServiceDialogVisible = false
                this.getServicesList()
                this.$notify({type: 'success', center: true, message: success.data.msg})
              }else{
                this.$notify({type: 'error', center: true, message: success.data.msg})
              }
            })
            .catch(error=>{
              this.$notify({type: 'error', center: true, message: '添加机器接口请求失败'})
            })
          }
        })
      }
      else if(this.dialogButtonWord === '修改'){
        this.$refs.addServiceFormRef.validate((valid) => {
          if (!valid) {
              this.$notify({type: 'error', message: '请填写必填项', center: 'true'})
          }else if(this.editServiceFormCompared === JSON.stringify(this.addServiceForm)){
            this.$notify({type: 'warning', message: '没有需要修改的项', center: 'true'})
          }else{
            let params = new URLSearchParams();
            params.append('service_id', this.addServiceForm.id)
            params.append('name', this.addServiceForm.name)
            params.append('path', this.addServiceForm.path)
            params.append('port', this.addServiceForm.port)
            params.append('username', this.addServiceForm.username)
            params.append('password', this.addServiceForm.password)
            params.append('version', this.addServiceForm.version)
            params.append('owner', this.addServiceForm.owner)
            params.append('group', this.addServiceForm.group)
            params.append('startcmd', this.addServiceForm.startcmd)
            params.append('restartcmd', this.addServiceForm.restartcmd)
            params.append('stopcmd', this.addServiceForm.stopcmd)
            params.append('enablecmd', this.addServiceForm.enablecmd)
            params.append('text', this.addServiceForm.text)
            this.$axios
            .post('assets/services/edit/', params)
            .then(success=>{
              if(success.data.status === 200){
                this.addServiceDialogVisible = false
                this.getServicesList()
                this.$notify({type: 'success', center: true, message: success.data.msg})
              }else{
                this.$notify({type: 'error', center: true, message: success.data.msg})
              }
            })
            .catch(error=>{
              this.$notify({type: 'error', center: true, message: '请求后端接口错误'})
            })
          }
        })
      }
    },

    // 删除服务时触发
    deleteService(service){
      console.log(service)
      this.$confirm('确定要删除"' + service.service_name + '"吗?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(success=>{
        let params = new URLSearchParams();
        params.append('service_id', service.service_id)
        this.$axios
        .post('assets/services/delete/', params)
        .then(success=>{
          if(success.data.status === 200){
            this.$message({type: 'success', center: true, message: success.data.msg})
            this.getServicesList()
          }else{
            this.$message({type: 'error', center: true, message: success.data.msg})
          }
        })
        .catch(error=>{
          this.$message({type: 'error', center: true, message: '删除服务接口请求失败'})
        })
      })
      .catch(error=>{
          this.$message({type: 'info', center: true, message: '已取消'})
      })
    },

    // 添加面板关闭时触发
    addServicerDialogClosed(){
      this.$refs.addServiceFormRef.resetFields()
    },

    // 获取配置文件列表
    getConfigfileList(service_id){
      this.$axios
      .get('/assets/services/configfile/', {params: {service_id: service_id}})
      .then(success=>{
        if(success.data.status === 200){
          this.fileList = success.data.data
        }else{
          this.$message({type:'error', message: success.data.msg, center: true})
        }
      })
      .catch(error=>{
        this.$message({type:'error', message: '请求服务配置文件列表失败', center: true})
      })
    },

    // 配置文件弹出框显示时触发
    configfilePopoverShow(service){
      // 弹出时获取该服务的配置文件
      this.getConfigfileList(service.service_id)
    },

    // 配置文件弹出框关闭动画完成后触发
    configfilePopoverafterleave(){
      // 关闭时清空该服务的配置文件
      this.fileList = []
    },

    // 文件上传前触发
    beforeFileUpload(file, service){
      if(file.size/1000 >= this.acceptFileSize){
        this.$notify({type: 'warning', message: '上传文件大于'+this.acceptFileSize+'KB'})
        return false
      }else{
        // 如果验证都通过了,就把这个服务的ID添加到data中,由upload组件代理请求后台接口
        this.uploadData['service_id'] = service.service_id
      }
    },

    // 文件上传成功时触发
    fileUploadSuccess(msg, service){
      this.getConfigfileList(service.service_id)
      this.$notify({type:'success', message: '文件上传成功', center: true})
    },

    // 文件上传失败时触发
    fileUploadError(file){
      this.$notify({type:'warn', message: '文件上传成功', center: true})
    },

    // 文件列表中文件移除前触发
    beforeFileRemove(file, fileList) {
      //console.log(file)
      if (file && file.status==="success") { 
        return this.$confirm(`确定移除 ${ file.name }？`); 
      }
    },
    
    // 文件列表移除时触发
    fileRemove(file, fileList) {
      let params = new URLSearchParams();
      params.append('configfile_id', file.id)
      params.append('configfile_hash', file.hash)
      this.$axios
      .post('/assets/services/configfile/delete/', params)
      .then(success=>{
        if(success.data.status === 200){
          this.$notify({type:'success', message: success.data.msg, center: true})
        }else{
          this.$notify({type:'error', message: success.data.msg, center: true})
        }
      })
      .catch(error=>{
        this.$notify({type:'error', message: '请求删除服务配置文件接口失败', center: true})
      })
    },

    // 文件列表中文件点击时触发
    fileClick(file) {
      this.$axios
      .get('/assets/services/configfile/txt/', {params: {config_hash: file.hash}})
      .then(success=>{
        this.ConfigFileTXT = success.data.data
      })
      .catch(error=>{
        this.$notify({type:'error', message:'请求配置文件内容接口错误',center:true})
      })
      this.dialogConfigFileTitle = file.name
      this.ConfigFileVisible = true
    },

    // 上传文件超过限制时触发
    fileExceed(files, fileList) {
      this.$message.warning('文件数量超过个'+this.fileUploadLimit+'个');
    },

    // 展示配置文件弹出框关闭时触发
    ConfigFileDialogClosed(){
      // 清空配置文件
      this.ConfigFileTXT = ''
    },

    // 获取服务器硬件使用状况
    getServerRate(){
      this.$nextTick(()=>{
        // 开启加载框
        const ServerRateLoading = this.$loading({
          target: document.querySelector('#ServerRateCardRef'),
          lock: false,
          //text: '加载中...',
          //spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 1)'
        });
        this.$axios
        .get('assets/serverrate/', {params: {'server_id': this.server_id,
                                            'server_ip': this.server_info[0].ip,
                                            'server_username': this.server_info[0].username,
                                            'server_password': this.server_info[0].password,
                                            'server_connport': this.server_info[0].port,
                                            'refresh': this.ServerRateRefresh}})
        .then(success=>{
          if(success.data.status === 200){
            this.ServerRate = success.data.data
          }else if(success.data.status === 503){
            console.log('服务器资源情况解析失败,1.刚创建的服务器;2.服务器无法连接')
          }else{
            this.$notify({type:'warning',message:success.data.msg})
          }
          // 关闭加载框
          ServerRateLoading.close()
        })
        .catch(error=>{
          this.$notify({type:'warning',message:'请求服务器资源接口失败'})
          ServerRateLoading.close()
        })
        
      })
    },

    // 尝试连接服务器去获取服务器状态(服务器信息取出来后存到数据库一份)
    RefreshServerRate(){
      this.ServerRateRefresh = 1
      this.getServerRate()
    }


  },
  mounted(){
    // 页面加载后获取服务器硬件使用率(从数据库取上一次的记录)
    this.getServerRate()


    // echart这个图太难调了,先不弄成echart了
    // this.$nextTick(()=>{
    // this.cpuChart = this.$echarts.init(this.$refs.cpu_echart)
    // this.memChart = this.$echarts.init(this.$refs.mem_echart)
    // this.diskChart = this.$echarts.init(this.$refs.disk_echart)
    //   const gaugeData = [
    //     {
    //       value: 10,
    //       name: 'CPU',
    //       title: {
    //         offsetCenter: ['0%', '80%']
    //       },
    //     },
    //   ];
    //   const cpu_option = {
    //     series: [
    //       {
    //         name: 'cpu',
    //         min:0,
    //         max:1.2,
    //         splitNumber:6,
    //         type: 'gauge',
    //         center:['50%', '55%'],
    //         radius: '90%',
    //         splitLine: {
    //           show: true,
    //           length: "10%"
    //         },
    //         axisTick: {
    //           show: true,
    //           splitNumber: 3,
    //         },
    //         anchor: {
    //           show: false,
    //         },
    //         pointer: {
    //           icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
    //           width: 3,
    //           length: '50%',
    //           offsetCenter: [0, '8%']
    //         },
    //         progress: {
    //           show: false,
    //         },
    //         axisLine: {
    //           show: true,
    //           roundCap: false,
    //           lineStyle: {       
    //             color: [[0.67, '#67C23A'],[0.84, '#409EFF'],[1.0, '#F56C6C']],
    //             width: 6,
    //             shadowColor : '#000', //默认透明
    //             shadowBlur: 10,
    //           }
    //         },
    //         data: this.cpuChartData,
    //         title: {
    //           show: true,
    //         },
    //         detail: {
    //           show: false,
    //         }
    //       }
    //     ]
    //   };

    //   const mem_option = {
    //     series: [
    // {
    //   type: 'gauge',
    //   startAngle: 90,
    //   endAngle: -270,
    //   pointer: {
    //     show: false
    //   },
    //   progress: {
    //     show: true,
    //     overlap: false,
    //     roundCap: true,
    //     clip: false,
    //     itemStyle: {
    //       borderWidth: 1,
    //       borderColor: '#464646'
    //     }
    //   },
    //   axisLine: {
    //     lineStyle: {
    //       width: 6,
    //     }
    //   },
    //   splitLine: {
    //     show: false,
    //   },
    //   axisTick: {
    //     show: false
    //   },
    //   axisLabel: {
    //     show: false,
    //   },
    //   data: gaugeData,
    //   title: {
    //     show: false,
    //     fontSize: 10
    //   },
    //   detail: {
    //     width: 20,
    //     height: 15,
    //     fontSize: 14,
    //     color: 'auto',
    //     borderColor: 'auto',
    //     borderRadius: 20,
    //     borderWidth: 1,
    //     formatter: '{value}G'
    //   }
    // }
    //     ]
    //   }

    // this.cpuChart.setOption(cpu_option)
    // this.memChart.setOption(mem_option)
    // this.diskChart.setOption(cpu_option)
    

  },

  created() {
    // 创建完成页面就从路由中取出参数
    this.server_info.push(JSON.parse(window.sessionStorage.getItem('server_info')))
    this.server_id = window.sessionStorage.getItem('server_id')
    // 请求服务列表
    this.getServicesList()



  },
  computed:{},
}
</script>

<style lang="less" scoped>
// 保留表格里面的换行符
/deep/ .el-table .cell {
  white-space: pre-line;
}

.topCard{
  height: 170px;
}
.echartCard{
  height: 170px;
  /deep/.el-card__body {
    padding: 0;
  }
}
.maohao{
  font-weight: bolder;
  margin-left: 2px;
  margin-right: 2px
}
.caozuoanniu{
  margin-top: 5px;
  margin-bottom: 5px;
}
.fuwubiaoge{
  margin-bottom: 20px;
}
/deep/.configfiletxt {
  .el-textarea__inner{
    background-color: #000;
    color: #ffffff;
  }
  margin-top: -20px;
}

.rateTag{
  margin-top: 8px;
}

</style>