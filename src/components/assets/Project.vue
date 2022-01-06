<template>
  <div>
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目列表</el-breadcrumb-item>
    </el-breadcrumb>  

    <!-- 主体区域 -->
    <el-card>
      <!-- 栅格间距 -->
      <el-row :gutter="20">
        <!-- 栅格占用大小，一行24 -->
        <el-col :span="10">
            <el-button type="primary" @click="addProject">添加项目</el-button>
        </el-col>
      </el-row>
      
      <!-- 数据表格，最外层data绑定数据，label指定列名，prop接收指定列数据 
      show-overflow-tooltip:当内容过长被隐藏时显示 tooltip-->
      <el-table :data="ProjectList" border style="width: 100%" stripe>
        <el-table-column :show-overflow-tooltip="true" align="center"  type="index" label="序号"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" min-width="40px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="create_time" label="创建时间"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="text" label="备注"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" label="有效状态" min-width="20px">
          <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
          <template slot-scope="scope">
            <!-- 开关状态的改变会触发change对应的方法 -->
            <el-switch v-model="scope.row.is_del" active-color="#ff4949" inactive-color="#13ce66" @change="changeProjectStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="40px" label="操作">
          <!-- 表格内想要加其他格式的元素就得这么用（作用域插槽），固定格式slot-scope="scope" scope.row -->
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editProject(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProject(scope.row)"></el-button>
            </el-tooltip>
          </template>            
        </el-table-column>   
      </el-table>
    </el-card>

    <!-- 添加项目的对话框
    :visible.sync="addProjectDialogVisible" 表单是否可见
    :close-on-click-modal="false" 当点击表单之外的元素是否关闭表单 -->
    <el-dialog title="添加项目" :visible.sync="addProjectDialogVisible" width="40%" :close-on-click-modal="false" @close="addProjectDialogClosed">
      <!-- 添加项目的对话框 -->
      <el-form :model="addProjectForm" :rules="addProjectFormRules" ref="addProjectFormRef" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addProjectForm.text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProjectParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑项目的对话框
    :visible.sync="addProjectDialogVisible" 表单是否可见
    :close-on-click-modal="false" 当点击表单之外的元素是否关闭表单 -->
    <el-dialog title="编辑项目" :visible.sync="editProjectDialogVisible" width="40%" :close-on-click-modal="false" @close="editProjectDialogClosed">
      <!-- 添加参数的对话框 校验规则复用了添加项目规则-->
      <el-form :model="editProjectForm" :rules="addProjectFormRules" ref="editProjectFormRef" label-width="100px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="editProjectForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editProjectForm.text"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editProjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editProjectParams(editProjectForm.old_data)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'Project',
    data(){
      return{
        // 项目列表
        ProjectList: [],

        // 添加项目信息
        addProjectForm: {
          name: '',
          text: ''
        },

        // 编辑项目信息
        editProjectForm: {
          name: '',
          text: '',
          // 这个old_data是存储当编辑按钮点击后,提交前的数据
          // 为了验证当点击按钮,提交前和提交后的数据是否一样
          old_data: '' 
        },

        // 添加项目验证表单
        addProjectFormRules: {
          name: [
            // 项目名称为必填项,当焦点离开时验证
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          text: []
        },

        // 添加项目面板是否可见
        addProjectDialogVisible: false,
        // 编辑项目面板是否可见
        editProjectDialogVisible: false
      }
    },
    computed:{},
    methods:{
      // 当页面添加项目按钮点击触发事件
      addProject(){
        this.addProjectDialogVisible = true
      },

      // 当页面编辑按钮点击触发事件
      editProject(Projectinfo){
        this.editProjectForm.id = Projectinfo.id
        this.editProjectForm.name = Projectinfo.name
        this.editProjectForm.text = Projectinfo.text
        this.editProjectForm.old_data = Projectinfo
        this.editProjectDialogVisible = true
      },

      // 当页面删除项目按钮点击触发事件
      deleteProject(Project){
        this.$confirm('确定要删除"' + Project.name + '"吗?', '提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(success=>{
          let params = new URLSearchParams();
          params.append('project_id', Project.id)
          this.$axios
          .post('assets/project/delete/', params)
          .then(success=>{
            if(success.data.status === 200){
              this.$message({type: 'success', center: true, message: success.data.msg})
              this.get_Projectlist()
            }else{
              this.$message({type: 'error', center: true, message: success.data.msg})
            }
          })
          .catch(error=>{
            this.$message({type: 'error', center: true, message: '删除项目接口请求失败'})
          })
        })
        .catch(error=>{
            this.$message({type: 'info', center: true, message: '已取消'})
        })
      },

      // 当添加项目表单点击提交按钮触发事件
      addProjectParams(){
        this.$refs.addProjectFormRef.validate((valid,obj) => {
          if (!valid) return
          else {
            let params = new URLSearchParams();
            params.append('project_name', this.addProjectForm.name)
            params.append('project_text', this.addProjectForm.text)
            this.$axios
              .post('assets/project/', params)
              .then(success => {
                  if(success.data.status === 200){
                    this.addProjectDialogVisible = false
                    this.get_Projectlist()
                    this.$message({type: 'success', center: true, message: success.data.msg})
                  }
                  else{
                    this.$message({type: 'error', center: true, message: success.data.msg})
                  }
              })
              .catch(error => {
                this.$message({type: 'error', center: true, message: '请求添加项目接口错误'})
              })
          }
          })
      },

      // 当编辑项目表单点击提交按钮触发事件
      editProjectParams(old_data){
        // 先自校验
        this.$refs.editProjectFormRef.validate((valid,obj) => {
          if (!valid) return
          // 在验证提交数据是否有变动
          else if (this.editProjectForm.name === old_data.name && 
                  this.editProjectForm.text === old_data.text){
            this.$message({type: 'warning', center: true, message: '没有需要修改的表单'})
          }
          else{
            let params = new URLSearchParams();
            params.append('project_id', this.editProjectForm.id)
            params.append('project_name', this.editProjectForm.name)
            params.append('project_text', this.editProjectForm.text)
            this.$axios
              .post('assets/project/edit/', params)
              .then(success=>{
                if(success.data.status === 200){
                  this.editProjectDialogVisible = false
                  this.get_Projectlist()
                  this.$message({type: 'success', center: true, message: success.data.msg})
                }else{
                  this.$message({type: 'error', center: true, message: success.data.msg})
                }
              })
              .catch(error=>{
                  this.$message({type: 'error', center: true, message: '修改项目信息接口请求失败'})
              })
          }
              
        })        

      },
      // 当添加项目面板被关闭
      addProjectDialogClosed(){
        this.$refs.addProjectFormRef.resetFields()
      },

      // 当编辑项目面板被关闭
      editProjectDialogClosed(){
        this.$refs.editProjectFormRef.resetFields()
      },

      // 当更改有效状态按钮触发
      changeProjectStatus(Project){
        // 组post数据
        let params = new URLSearchParams();
        params.append('project_id',Project.id)
        params.append('project_state',Project.is_del)
        this.$axios
        .post('assets/project/state/', params)
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

      // 获取项目列表
      get_Projectlist(){
        this.$axios
        .get('assets/project/')
        .then((success)=>{
          if(success.data.status === 200){
            this.ProjectList = success.data.data
          }else{
            this.$message({message: success.data.msg, type: "error", center: true, duration: '3000'});
          }
        })
        .catch((error)=>{
          this.$message({message: "获取项目列表接口请求失败", type: "error", center: true, duration: '3000'});
        })
      },
    },
    created(){
      // 页面创建完成后马上获取项目列表
      this.get_Projectlist()
    },
}
</script>

<style>

</style>