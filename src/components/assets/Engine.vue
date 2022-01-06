<template>
  <div>
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>机房列表</el-breadcrumb-item>
    </el-breadcrumb>



    <!-- 主体区域 -->
    <el-card>
      <!-- 栅格间距 -->
      <el-row :gutter="20">
        <!-- 栅格占用大小，一行24 -->
        <el-col :span="10">
            <el-button type="primary" @click="addEngine">添加机房</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格，最外层data绑定数据，label指定列名，prop接收指定列数据
      show-overflow-tooltip:当内容过长被隐藏时显示 tooltip -->
        <el-table :data="engineList" border style="width: 100%" stripe>
          <el-table-column :show-overflow-tooltip="true" align="center" type="index" label="序号"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" min-width="40px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="location" label="位置"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="create_time" label="创建时间"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="text" label="备注"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" label="有效状态" min-width="20px">
            <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
            <template slot-scope="scope">
              <!-- 开关状态的改变会触发change对应的方法 -->
              <el-switch v-model="scope.row.is_del" active-color="#ff4949" inactive-color="#13ce66" @change="changeEngineStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="40px" label="操作">
            <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editEngine(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEngine(scope.row)"></el-button>
              </el-tooltip>
            </template>            
          </el-table-column>   
        </el-table>
    </el-card>


    <!-- 添加机房的对话框
    :visible.sync="addEngineDialogVisible" 表单是否可见
    :close-on-click-modal="false" 当点击表单之外的元素是否关闭表单 -->
    <el-dialog title="添加机房" :visible.sync="addEngineDialogVisible" width="40%" :close-on-click-modal="false" @close="addEngineDialogClosed">
      <!-- 添加参数的对话框 -->
      <el-form :model="addEngineForm" :rules="addEngineFormRules" ref="addEngineFormRef" label-width="100px">
        <el-form-item label="机房名称" prop="name">
          <el-input v-model="addEngineForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机房位置">
          <el-input v-model="addEngineForm.location"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addEngineForm.text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEngineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEngineParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑机房的对话框
    :visible.sync="addEngineDialogVisible" 表单是否可见
    :close-on-click-modal="false" 当点击表单之外的元素是否关闭表单 -->
    <el-dialog title="编辑机房" :visible.sync="editEngineDialogVisible" width="40%" :close-on-click-modal="false" @close="editEngineDialogClosed">
      <!-- 添加参数的对话框 校验规则复用了添加机房规则-->
      <el-form :model="editEngineForm" :rules="addEngineFormRules" ref="editEngineFormRef" label-width="100px">
        <el-form-item label="机房名称" prop="name">
          <el-input v-model="editEngineForm.name"></el-input>
        </el-form-item>
        <el-form-item label="机房位置">
          <el-input v-model="editEngineForm.location"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editEngineForm.text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editEngineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEngineParams(editEngineForm.old_data)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'Engine',
    data(){
      return{
        // 机房列表
        engineList: [],

        // 添加机房信息
        addEngineForm: {
          name: '',
          location: '',
          text: ''
        },

        // 编辑机房信息
        editEngineForm: {
          name: '',
          location: '',
          text: '',
          // 这个old_data是存储当编辑按钮点击后,提交前的数据
          // 为了验证当点击按钮,提交前和提交后的数据是否一样
          old_data: '' 
        },

        // 添加机房验证表单
        addEngineFormRules: {
          name: [
            // 机房名称为必填项,当焦点离开时验证
            { required: true, message: '请输入机房名称', trigger: 'blur' },
          ],
          location: [],
          text: []
        },

        // 添加机房面板是否可见
        addEngineDialogVisible: false,
        // 编辑机房面板是否可见
        editEngineDialogVisible: false
      }
    },
    computed:{},
    methods:{
      // 当页面添加机房按钮点击触发事件
      addEngine(){
        this.addEngineDialogVisible = true
      },

      // 当页面编辑按钮点击触发事件
      editEngine(engineinfo){
        this.editEngineForm.id = engineinfo.id
        this.editEngineForm.name = engineinfo.name
        this.editEngineForm.location = engineinfo.location
        this.editEngineForm.text = engineinfo.text
        this.editEngineForm.old_data = engineinfo
        this.editEngineDialogVisible = true
      },

      // 当页面删除机房按钮点击触发事件
      deleteEngine(engine){
        this.$confirm('确定要删除"' + engine.name + '"吗?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(success=>{
          let params = new URLSearchParams();
          params.append('engine_id', engine.id)
          this.$axios
          .post('assets/engineroom/delete/', params)
          .then(success=>{
            if(success.data.status === 200){
              this.$message({type: 'success', center: true, message: success.data.msg})
              this.get_enginelist()
            }else{
              this.$message({type: 'error', center: true, message: success.data.msg})
            }
          })
          .catch(error=>{
            this.$message({type: 'error', center: true, message: '删除机房接口请求失败'})
          })
        })
        .catch(error=>{
            this.$message({type: 'info', center: true, message: '已取消'})
        })
      },

      // 当添加机房表单点击提交按钮触发事件
      addEngineParams(){
        this.$refs.addEngineFormRef.validate((valid,obj) => {
          if (!valid) return
          else {
            let params = new URLSearchParams();
            params.append('engine_name', this.addEngineForm.name)
            params.append('engine_location',this.addEngineForm.location)
            params.append('engine_text', this.addEngineForm.text)
            this.$axios
              .post('assets/engineroom/', params)
              .then(success => {
                  if(success.data.status === 200){
                    this.addEngineDialogVisible = false
                    this.get_enginelist()
                    this.$message({type: 'success', center: true, message: success.data.msg})
                  }
                  else{
                    this.$message({type: 'error', center: true, message: success.data.msg})
                  }
              })
              .catch(error => {
                this.$message({type: 'error', center: true, message: '请求添加机房接口错误'})
              })
          }
          })
      },

      // 当编辑机房表单点击提交按钮触发事件
      editEngineParams(old_data){
        // 先自校验
        this.$refs.editEngineFormRef.validate((valid,obj) => {
          if (!valid) return
          // 在验证提交数据是否有变动
          else if (this.editEngineForm.name === old_data.name && 
                  this.editEngineForm.location === old_data.location &&
                  this.editEngineForm.text === old_data.text){
            this.$message({type: 'warning', center: true, message: '没有需要修改的表单'})
          }
          else{
            let params = new URLSearchParams();
            params.append('engine_id', this.editEngineForm.id)
            params.append('engine_name', this.editEngineForm.name)
            params.append('engine_location',this.editEngineForm.location)
            params.append('engine_text', this.editEngineForm.text)
            this.$axios
              .post('assets/engineroom/edit/', params)
              .then(success=>{
                if(success.data.status === 200){
                  this.editEngineDialogVisible = false
                  this.get_enginelist()
                  this.$message({type: 'success', center: true, message: success.data.msg})
                }else{
                  this.$message({type: 'error', center: true, message: success.data.msg})
                }
              })
              .catch(error=>{
                  this.$message({type: 'error', center: true, message: '修改机房信息接口请求失败'})
              })
          }
              
        })        

      },
      // 当添加机房面板被关闭
      addEngineDialogClosed(){
        this.$refs.addEngineFormRef.resetFields()
      },

      // 当编辑机房面板被关闭
      editEngineDialogClosed(){
        this.$refs.editEngineFormRef.resetFields()
      },

      // 当更改有效状态按钮触发
      changeEngineStatus(engine){
        // 组post数据
        let params = new URLSearchParams();
        params.append('engine_id',engine.id)
        params.append('engine_state',engine.is_del)
        this.$axios
        .post('assets/engineroom/state/', params)
        .then((success)=>{
          if(success.data.status === 200){
            this.$message({message: "状态更改成功", type: "success", center: true, duration: '1000'});
          }else{
            this.$message({message: success.data.msg, type: "error", center: true, duration: '3000'});
          }
        })
        .catch((error)=>{
          this.$message({message: "更改状态接口请求失败", type: "error", center: true, duration: '3000'});
        })
      },

      // 获取机房列表
      get_enginelist(){
        this.$axios
        .get('assets/engineroom/')
        .then((success)=>{
          if(success.data.status === 200){
            this.engineList = success.data.data
          }else{
            this.$message({message: success.data.msg, type: "error", center: true, duration: '3000'});
          }
        })
        .catch((error)=>{
          this.$message({message: "获取机房列表接口请求失败", type: "error", center: true, duration: '3000'});
        })
      },
    },
    created(){
      // 页面创建完成后马上获取机房列表
      this.get_enginelist()
    },
}
</script>

<style>

</style>