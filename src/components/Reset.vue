<template>
    <div>
      <h3>注册</h3>
      <div>
        <el-form style="width:600px;margin: auto;" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input type="username" v-model="ruleForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <span class="sizeFont" @click="goLogin">立马登录</span>
      </div>
    </div>
    
  </template>
  
  <script>
  export default {
    name: 'Reset',
    data () {
      return {
        ruleForm: {
          pass: '',
          username: '',
          checkPass: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名',  trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码',  trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请再次输入密码',  trigger: 'blur' }
          ],
        },
      }
    },
    methods:{
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log(this.ruleForm)
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
          checkPass: '',
        }
      },
      goLogin(){
        this.$router.push('/Login')
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
  </style>
  