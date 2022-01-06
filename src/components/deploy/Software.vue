<template>
  <div class="maindiv">
    <!-- 头部面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安装部署</el-breadcrumb-item>
      <el-breadcrumb-item>软件安装</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体区域 -->
    <el-card class="sidecard">
      <el-row :gutter="20">
        <!-- 左侧软件列表区域 -->
        <el-col :span="16">
          <el-col :span="6" v-for="soft in softlist" :key="soft.id">
            <el-card shadow="hover">
              <el-tag class="soft-name-tag" size="medium" :hit="true" color="#67C23A" effect="dark">{{ soft.soft_name }}</el-tag>
              <el-image
                class="elimage"
                style="width: 100%; height: 100px"
                :src="soft.soft_img"
                fit="scale-down"
                :alt="soft.soft_desc"
                @click="soft_image_click(soft)">
              </el-image>
            </el-card>
          </el-col>
        </el-col>

        <!-- 右侧提示信息区域 -->
        <el-col :span="8">
            <el-alert class="right-alert" title="软件安装注意事项:" type="warning" :description=right_info_desc show-icon :closable="false"></el-alert>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "Software",
  data() {
    return {
      // 软件列表
      softlist: [],
      // 右侧的提示信息
      right_info_desc: '1.本系统只针对centos7.6做了适配,其他操作系统可能会出现问题\n\n2.新服务器建议先进行初始化\n\n3.软件安装速度取决于网速',
    };
  },
  methods: {
    // 获取软件列表
    get_softlist(){
      this.$axios
      .get('/deploy/softlist')
      .then(success => {
        if(success.data.status === 200){
          this.softlist = success.data.data
        }else{
          this.$message({type: 'error', center: true, message: success.data.msg})
        }
      })
      .catch(error => {
          this.$message({type: 'error', center: true, message: '请求软件列表接口失败'})
      })
    },
    
    // 软件图片点击后方法
    soft_image_click(soft){
      this.$router.push(soft.soft_path)
    },
  },

  created() {
    this.get_softlist()
  },
};
</script>

<style lang="less" scoped>
.right-col,.right_card {
  height: 100%;
}
.right-alert{
  margin-top: 10px;
  padding: 10px;
  white-space: pre-line;
  font-weight: bolder;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

// 软件列表的tag标签
.soft-name-tag{
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  font-size: larger;
  color: #000000;
}
// 图片框
.elimage{
  cursor: pointer;
}
</style>