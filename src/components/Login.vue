<template>
  <div>
    <h3>登录</h3>
    <div>
      <el-form style="width:600px;margin: auto;" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input :type="showPwd?'':'password'" v-model="ruleForm.pass" autocomplete="off"></el-input>
          <i @click="passwordClick" class="el-icon-view"></i>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <span class="sizeFont" @click="goReset">未有账号?先注册</span>
    </div>
  </div>
  
</template>

<script>
import { getLogin} from "@/assets/api/api.js"

export default {
  name: 'Login',
  data () {
    return {
      showPwd: false,
      ruleForm: {
        pass: '',
        username: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名',  trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '请输入密码',  trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入活动名称',  trigger: 'blur' }
        ],
      },
    }
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            getLogin({username: 'yy',password: '123'}).then((res)=>{console.log(res)})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(){
      this.ruleForm = {
        pass: '',
        username: '',
      }
    },
    goReset(){
      this.$router.push('/Reset')
    },
    passwordClick(e){
      this.showPwd = !this.showPwd
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.sizeFont{
    font-size: 13px;
    font-weight: 400;
    margin-left: 10px;
  }
  .sizeFont:hover{
    border-bottom: 1px solid grey;
    cursor: pointer;
  }
  /deep/ .el-icon-view{
    position: absolute;
    top: 13px;
    right: 30px;
    cursor: pointer;
  }
</style>
