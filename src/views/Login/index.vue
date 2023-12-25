<template>
  <div class="login_body" @keyup.enter="handleLogin">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <!--表单校验四要素-->
      <!--1.el-form :model 对应的值 表单对应的数据对象-->
      <!--2.el-form :rules 对应的校验规则-->
      <!--3.el-form-item prop 表示要校验的字段-->
      <!--4.表单元素(el-input、el-checkbox...) v-model中 -->
      <el-form ref="form" :model="loginForm" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input placeholder="请输入用户名" v-model="loginForm.username"/>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input placeholder="请输入密码" v-model="loginForm.password" show-password/>
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox>记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button  type="primary" class="login_btn"  @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          // blur: 失焦 ，change：内容改变
          // { required: true, message: '用户名不可为空', trigger: ['blur', 'change'] }
          { required: true, message: '用户名不可为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不可为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs['form'].validate(async(flag) => {
        if (!flag) return
        // const res = await loginAPI(this.loginForm)
        // this.$store.commit('user/setToken', res.data.token)
        this.$store.dispatch('user/loginAction', this.loginForm)
      })
    }
  }

}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
