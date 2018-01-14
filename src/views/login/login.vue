<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名" @on-focus="initLoginTip">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码" @on-focus="initLoginTip">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
          <p class="login-tip">{{loginTip}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import md5 from 'js-md5'
import userApi from '@/api/user'
export default {
  data() {
    return {
      // 登陆提示
      loginTip: '',
      form: {
        userName: 'iview_admin',
        password: ''
      },
      rules: {
        userName: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      const self = this
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          Cookies.set('user', this.form.userName)
          Cookies.set('password', this.form.password)
          // 验证用户名和密码
          const params = {
            name: this.form.userName,
            password: md5(this.form.password)
          }
          userApi
            .userLogin(params)
            .then(response => {
              self.$router.push({
                name: 'home'
              })
            })
            .catch(err => {
              console.log('err', err)
              self.loginTip = '请输入正确的用户名或密码！'
            })
        }
      })
    },
    initLoginTip() {
      this.loginTip = ''
    }
  }
}
</script>

<style lang='less'>
@import './login.less';
</style>
