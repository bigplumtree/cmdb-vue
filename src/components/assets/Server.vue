<template>
  <div>
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>机器列表</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 主体区域 -->
    <el-card>
      <!-- 栅格间距 -->
      <el-row :gutter="20">
        <!-- 栅格占用大小，一行24 -->
        <el-col :span="24">
          <!-- 级联选择框,数据在页面创建完成的时候就从后端接口加载进来了 
          :options="CascaderList" 绑定的数据
          :props="props"  其他选项
          collapse-tags 多选模式下是否折叠tag
          clearable 可清除的
          :show-all-levels="false" 是否展示所有层级标签
          -->
          <el-cascader 
            @visible-change="CascaderVisibleChange"
            @remove-tag="CascaderRemoveTag"
            :options="CascaderList" 
            :props="CascaderProps" 
            collapse-tags 
            :show-all-levels="false"
            v-model="CascaderValue"
            :clearable="false"
          >
          </el-cascader>
          
          <el-button style="float:right" type="primary" @click="addServer">添加机器</el-button>

          <el-button style="float:right;margin-right:20px" type="primary" @click="showAllServerEchart">全局易叉特</el-button>
        </el-col>

      </el-row>
      <!-- 数据表格，最外层data绑定数据，label指定列名，prop接收指定列数据
      show-overflow-tooltip:当内容过长被隐藏时显示 tooltip -->
        <el-table :data="ServerList" border style="width: 100%" stripe>
          <el-table-column :show-overflow-tooltip="true" align="center" type="index" label="序号"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="private_ip_address" label="内网IP" min-width="40px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="public_ip_address" label="外网IP" min-width="40px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="os" label="操作系统" min-width="30px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="type" label="机器类型" min-width="30px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="engine_room" label="机房" min-width="30px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="project" label="项目" min-width="20px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" prop="text" label="备注" min-width="60px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="50px" label="操作">
            <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="服务" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-coin" size="mini" @click="showService(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="success" icon="el-icon-edit" size="mini" @click="editServer(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteServer(scope.row)"></el-button>
              </el-tooltip>
            </template>            
          </el-table-column>   
        </el-table>

      <!-- 分页区域 
      size-change: 每页条数改变时
      current-change: 当前页面改变时
      current-page: 当前页码
      page-size: 页面大小
      -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryInfo.current_pag" :page-sizes="[3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>

    <!-- 添加服务器面板 -->
    <el-dialog :title="dialogTitleWord" :visible.sync="addServerDialogVisible" width="50%" :close-on-click-modal="false" @close="addServerDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="addServerForm" :rules="addServerFormRules" ref="addServerFormRef" label-width="70px">
        <el-row >
          <el-col :span="12">
            <el-form-item label="内网IP" prop="private_ip">
              <el-input v-model="addServerForm.private_ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外网IP" prop="public_ip">
              <el-input v-model="addServerForm.public_ip"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addServerForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addServerForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="端口" prop="port">
              <el-input v-model.number="addServerForm.port"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="" prop="engine" label-width="0px">
              <el-select v-model="addServerForm.engine" placeholder="请选择机房">
                <el-option v-for="i in SelectOptions.engine" :key="i.id" :label="i.label" :value="i.id" :disabled="i.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="project" label-width="0px">
              <el-select v-model="addServerForm.project" placeholder="请选择项目">
                <el-option v-for="i in SelectOptions.project" :key="i.id" :label="i.label" :value="i.id" :disabled="i.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="os" label-width="0px">
              <el-select v-model="addServerForm.os" placeholder="请选择系统">
                <el-option v-for="i in SelectOptions.os" :key="i.id" :label="i.label" :value="i.id" :disabled="i.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="machine_type" label-width="0px">
              <el-select v-model="addServerForm.machine_type" placeholder="请选择类型">
                <el-option v-for="i in SelectOptions.type" :key="i.id" :label="i.label" :value="i.id" :disabled="i.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="" prop="text" label-width="0px">
              <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="备注" v-model="addServerForm.text" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addServerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addServerParams">{{ dialogButtonWord }}</el-button>
      </span>
    </el-dialog>

    <el-dialog 
      class="allServerEchartDialog" 
      :visible.sync="allServerEchartDialogVisible" 
      top="0px"
      :show-close="false"
      :fullscreen="true"
      :close-on-click-modal="false" 
      @close="allServerEchartDialogClosed"
    >
      <div>
        <el-button style="float:right;margin-right:20px;" type="info" @click="allServerEchartDialogVisible = false">关 闭</el-button>
      </div>
      <div ref="allServerEchartDialogRef" class="el-dialog-div" > </div>
    </el-dialog>



  </div>
</template>

<script>
export default {
    name: 'Server',
    data(){
      return{
        // 查询参数
        queryInfo: {
          query: '',
          current_pag: 1,
          pagesize: 10,
        },

        // 添加/编辑服务器面板的标题
        dialogTitleWord: '',

        // 添加/编辑服务器面板的确定按钮
        dialogButtonWord: '',

        // 总计返回条数,给分页框用的
        total: 0,

        // 服务器列表
        ServerList: [],

        // 级联选择框数据
        CascaderList: [],

        // select标签的内容
        SelectOptions: {
          engine: [],
          project: [],
          os: [],
          type: [],
        },

        // 级联选择框其他选项
        CascaderProps: { 
          // 是否多选
          multiple: true,
          // 次级标签的打开方式click / hover
          expandTrigger: 'hover',
          // 选中的菜单只返回菜单值,字符串类型
          emitPath: false
        },

        // 级联选择框被选中的数据
        CascaderValue: [],

        // 添加服务器框是否可见
        addServerDialogVisible: false,

        // 展示全局服务器echart图表
        allServerEchartDialogVisible: false,

        // 添加服务器表单数据项
        addServerForm: {
          private_ip: '',
          public_ip: '',
          username: '',
          password: '',
          port: '',
          engine: 1,
          project: 1,
          os: 1,
          machine_type: 1,
          text: '',
          server_id: ''
        },

        // 这个数据仅仅是在编辑表单的时候,对比编辑前和编辑后的数据是否一致用的
        editServerFormCompared: {},

        // 添加服务器表单的数据验证
        addServerFormRules:{
          private_ip: [{ required: true, message: '请输入内网IP', trigger: 'blur' },],
          public_ip: [],
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' },],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
          port: [{ required: true, message: '请输入连接端口', trigger: 'blur' },],
          engine: [{ required: true, message: '请选择机房', trigger: ['blur','change'] },],
          project: [{ required: true, message: '请选择项目', trigger: ['blur','change'] },],
          os: [{ required: true, message: '请选择操作系统', trigger: ['blur','change'] },],
          machine_type: [{ required: true, message: '请选择硬件类型', trigger: ['blur','change'] },],
          text: [],
        },

        // 全局服务器的echart实例
        allServerChart: null,

        // echart图表数据,需要从后端取
        echartData: {},

      }
    },
    methods:{
      // 添加服务器按钮 
      addServer(){
        // 先重置表单数据
        Object.assign(this.$data.addServerForm, this.$options.data().addServerForm)
        // 如果后面需要追加选择框,在这要多加
        this.$nextTick(()=>{
          // 填充添加面板的选择框内容
          this.SelectOptions.engine = this.CascaderList[0].children
          this.SelectOptions.project = this.CascaderList[1].children
          this.SelectOptions.os = this.CascaderList[2].children
          this.SelectOptions.type = this.CascaderList[3].children
          // 更改添加面板的标题
          this.dialogTitleWord = '添加服务器'
          this.dialogButtonWord = '添加'
          // 显示添加面板
          this.addServerDialogVisible = true
        })
      },

      // 改变服务器状态方法
      changeServerStatus(){},

      // 查看服务器内服务列表方法
      showService(server){
        let server_info = JSON.stringify({username: server.username,
                                          password: server.password, 
                                          port: server.port,
                                          ip: server.public_ip_address})
        window.sessionStorage.setItem('server_info', server_info)
        window.sessionStorage.setItem('server_id', server.id)
        this.$router.push({
          name: 'services',
          params: { }
        })
      },

      // 编辑服务器方法
      editServer(server){
        // 先重置表单
        Object.assign(this.$data.addServerForm, this.$options.data().addServerForm)
        // 填充添加面板的选择框内容
        this.$nextTick(()=>{
          this.SelectOptions.engine = this.CascaderList[0].children
          this.SelectOptions.project = this.CascaderList[1].children
          this.SelectOptions.os = this.CascaderList[2].children
          this.SelectOptions.type = this.CascaderList[3].children
          // 更改添加面板的标题
          this.dialogTitleWord = '编辑服务器'
          this.dialogButtonWord = '修改'
          // 填充数据
          this.addServerForm.server_id = server.id
          this.addServerForm.private_ip = server.private_ip_address
          this.addServerForm.public_ip = server.public_ip_address
          this.addServerForm.username = server.username
          this.addServerForm.password = server.password
          this.addServerForm.port = server.port
          this.addServerForm.engine = server.engine_room_id
          this.addServerForm.project = server.project_id
          this.addServerForm.os = server.os_id
          this.addServerForm.machine_type = server.type_id
          this.addServerForm.text = server.text
          // 对比用的参数赋值,转换为字符串防止浅拷贝
          this.editServerFormCompared = JSON.stringify(this.addServerForm) 
          // 显示添加面板
          this.addServerDialogVisible = true
        })
      },

      // 删除服务器方法
      deleteServer(server){
        this.$confirm('确定要删除"' + server.private_ip_address + '"吗?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(success=>{
          let params = new URLSearchParams();
          params.append('server_id', server.id)
          this.$axios
          .post('assets/server/delete/', params)
          .then(success=>{
            if(success.data.status === 200){
              this.$message({type: 'success', center: true, message: success.data.msg})
              this.getServerList()
            }else{
              this.$message({type: 'error', center: true, message: success.data.msg})
            }
          })
          .catch(error=>{
            this.$message({type: 'error', center: true, message: '删除服务器接口请求失败'})
          })
        })
        .catch(error=>{
            this.$message({type: 'info', center: true, message: '已取消'})
        })
      },

      // 每页条数改变时
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        // 在session中存入页面大小,以便刷新后调取
        window.sessionStorage.setItem('pagesize', newSize);
        this.getServerList()
      },

      // 当前页面改变时 
      handleCurrentChange(newPage){
        this.queryInfo.current_pag = newPage
        // 在session中存入当前页,以便刷新后调取
        window.sessionStorage.setItem('current_pag', newPage);
        this.getServerList()
      },
      
      // 当下拉框出现或隐藏
      CascaderVisibleChange(event){
        if(!event){
          let newQuery = this.CascaderValue.toString()
          // 判断下级联选择框数据是否有变化,没变化就不向后端发请求
          if(this.queryInfo.query !== newQuery) 
            this.$nextTick(()=>{
              // 把级联选择框中的数据赋值到查询参数传给后端,并且这个参数需要转字符串          
              this.queryInfo.query = newQuery
              window.sessionStorage.setItem('CascaderValue', this.CascaderValue);
              this.getServerList()
            })
        }
      },

      // 当选项被移除
      CascaderRemoveTag(event){
        // 需要先更新DOM元素在执行函数
        this.$nextTick(()=>{
          this.CascaderVisibleChange()
        })
      },

      // 获取服务器列表
      getServerList(){
        this.$nextTick(()=>{
          this.$axios
          .get('assets/server/', {params: this.queryInfo})
          .then((success)=>{
            if(success.data.status === 200){
              this.ServerList = success.data.data.data
              this.total = success.data.data.total
            }else{
              this.$message({message: success.data.msg, type: "error", center: true, duration: '3000'});
            }
          })
          .catch((error)=>{
            this.$message({message: "获取服务器列表接口请求失败", type: "error", center: true, duration: '3000'});
          })
        })
      },

      // 获取级联选择框的数据
      getCascaderList(){
        this.$axios
        .get('assets/server/cascader/')
        .then((success)=>{
          if(success.data.status === 200){
            this.CascaderList = success.data.data
          }else{
            this.$message({message: success.data.msg, type: "error", center: true, duration: '3000'});
          }
        })
        .catch((error)=>{
          this.$message({message: "获取接连选择框数据接口请求失败", type: "error", center: true, duration: '3000'});
        })
      },

      // 添加服务器框关闭事件
      addServerDialogClosed(){
        // 我发现下面的refs没法彻底的重置表单中的数据,在网上查的用这种方法可以重置
        // Object.assign(this.$data.addServerForm, this.$options.data().addServerForm)
        // 单独用上面的重置表单数据,验证规则的红字不会重置,下面这个重置验证规则的红字
        this.$refs.addServerFormRef.resetFields()       
      },

      // 添加服务器点击提交事件
      addServerParams(){
        if(this.dialogButtonWord === '添加'){
          this.$refs.addServerFormRef.validate((valid) => {
            if (!valid) {
              this.$notify({type: 'error', message: '请填写必填项', center: 'true'})
            } else {
              let params = new URLSearchParams();
              params.append('private_ip', this.addServerForm.private_ip)
              params.append('public_ip', this.addServerForm.public_ip)
              params.append('username', this.addServerForm.username)
              params.append('password', this.addServerForm.password)
              params.append('port', this.addServerForm.port)
              params.append('engine', this.addServerForm.engine)
              params.append('project', this.addServerForm.project)
              params.append('os', this.addServerForm.os)
              params.append('machine_type', this.addServerForm.machine_type)
              params.append('text', this.addServerForm.text)
              this.$axios
              .post('assets/server/', params)
              .then(success=>{
                if(success.data.status === 200){
                  this.addServerDialogVisible = false
                  this.getServerList()
                  this.$notify({type: 'success', center: true, message: success.data.msg})
                }else{
                  this.$notify({type: 'error', center: true, message: success.data.msg})
                }
              })
              .catch(error=>{
                this.$notify({type: 'error', center: true, message: '添加机器接口请求失败'})
              })
          }});
        }
        else if(this.dialogButtonWord === '修改'){
          this.$refs.addServerFormRef.validate((valid) => {
            if (!valid) {
              this.$notify({type: 'error', message: '请填写必填项', center: 'true'})
            }
            // 在打开编辑表单的时候editServerFormCompared已经转换为字符串了,所以这里这样判断
            // 不这样写是因为对象的比较会一直一样,所以没法判断
            // else if(this.editServerFormCompared === this.addServerForm){
            else if(this.editServerFormCompared === JSON.stringify(this.addServerForm)){     
              this.$notify({type: 'warning', message: '没有需要修改的项', center: 'true'})
            }else{
              let params = new URLSearchParams();
              params.append('server_id', this.addServerForm.server_id)
              params.append('private_ip', this.addServerForm.private_ip)
              params.append('public_ip', this.addServerForm.public_ip)
              params.append('username', this.addServerForm.username)
              params.append('password', this.addServerForm.password)
              params.append('port', this.addServerForm.port)
              params.append('engine', this.addServerForm.engine)
              params.append('project', this.addServerForm.project)
              params.append('os', this.addServerForm.os)
              params.append('machine_type', this.addServerForm.machine_type)
              params.append('text', this.addServerForm.text)
              this.$axios
              .post('assets/server/edit/', params)
              .then(success=>{
                if(success.data.status === 200){
                  this.addServerDialogVisible = false
                  this.getServerList()
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

      // 点击"全局易叉特"按钮时调用
      showAllServerEchart(){
        this.allServerEchartDialogVisible = true
        this.$nextTick(() => {
          this.allServerChart = this.$echarts.init(this.$refs.allServerEchartDialogRef)
          this.allServerChart.showLoading();
          this.$axios
          .get('assets/server/echart/')
          .then(success=>{
            if (success.data.status === 200){
              this.echartData = success.data.data
              this.allServerChart.setOption(
                ({
                  tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                  },
                  series: [
                    {
                      type: 'tree',
                      data: [this.echartData],
                      top: '1%',
                      left: '17%',
                      bottom: '1%',
                      right: '20%',
                      symbol: 'circle',
                      symbolSize: 5,
                      roam: true,
                      itemStyle: {
                        borderType : 'dashed',
                        color: '#91cc75',
                        borderColor: '#5470c6',
                      },
                      label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right',
                        fontSize: 15,
                        fontStyle: 'normal',
                        fontWeight: 'bolder',
                        lineHeight: 1
                      },
                      leaves: {
                        label: {
                          position: 'right',
                          verticalAlign: 'middle',
                          align: 'left'
                        }
                      },
                      emphasis: {
                        focus: 'descendant'
                      },
                      expandAndCollapse: true,
                      animationDuration: 550,
                      animationDurationUpdate: 750
                    }
                  ]
                })
              );
              this.allServerChart.hideLoading();
              window.onresize = this.allServerChart.resize
            }
            else(
              this.$notify({type: 'error', 'message': success.data.message, center: true})
            )
          })
          .catch(error=>{
            this.$notify({type: 'error', 'message': '从后端接口取echart数据失败', center: true})
          })
        })
      },
      
      // echart图表框关闭时触发
      allServerEchartDialogClosed(){
        // 重置数据
        this.echartData = {}
        // 销毁echart
        this.allServerChart.dispose()
      },

      
    },
    created(){
      // 刷新后取回当前页面和页面大小
      this.queryInfo.current_pag = parseInt(window.sessionStorage.getItem('current_pag')) || 1
      this.queryInfo.pagesize = parseInt(window.sessionStorage.getItem('pagesize')) || 10

      // 页面刷新后从session中获取级联选择框的选中项,因为存储的时候转成了字符串,这里得转回数组
      if (window.sessionStorage.getItem('CascaderValue')){
        this.CascaderValue = window.sessionStorage.getItem('CascaderValue').split(',') || []
      }

      // 请求后端的参数重新赋值
      this.queryInfo.query = this.CascaderValue.toString()
      
      // 获取级联选择框内容
      this.getCascaderList()

      // 获取服务器数据
      this.getServerList()   
    },
}
</script>

<style lang="less" scoped>
.el-dialog-div{
    height: 90vh;
    overflow: auto;
    opacity: 1
}
/deep/ .allServerEchartDialog{
  opacity: 0.9
  
}
/deep/ .allServerEchartDialog .el-dialog__header{
  display:none;
}
/deep/ .allServerEchartDialog .el-dialog-footer{
  display:none;
}

</style>