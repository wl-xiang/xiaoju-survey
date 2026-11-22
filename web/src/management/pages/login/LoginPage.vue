<template>
  <div
    class="login-page"
    :style="{
      background: `url('/imgs/create/background.webp') no-repeat bottom right`,
      'background-size': 'cover'
    }"
  >
    <div class="login-top">
      <img src="/imgs/Logo.webp" alt="logo" />
      <div class="top-right">
        <ThemeToggle />
        <span>您好，请登录</span>
      </div>
    </div>
    <div class="login-box">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="100px"
        class="login-form"
        @submit.prevent
      >
        <el-form-item label="账号" prop="name">
          <el-input v-model="formData.name" size="large" placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            size="large"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item label="" v-if="passwordStrength">
          <span
            class="strength"
            v-for="item in 3"
            :key="item"
            :style="{ backgroundColor: strengthColor[item - 1][passwordStrength] }"
          ></span>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-wrapper">
            <el-input v-model="formData.captcha" size="large" placeholder="请输入验证码"></el-input>
            <div class="captcha-img" @click="refreshCaptcha" v-html="captchaImgData"></div>
          </div>
        </el-form-item>

        <el-form-item label="准入码" prop="accessCode">
          <el-input
            v-model="formData.accessCode"
            size="large"
            placeholder="请输入准入码"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item class="button-group">
          <el-button
            :loading="pending.register"
            class="button register-button"
            @click="submitForm('register')"
          >
            注册
          </el-button>
          <el-button
            :loading="pending.login"
            size="small"
            type="primary"
            class="button"
            @click="submitForm('login')"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'

import { debounce } from 'lodash-es'

import { getPasswordStrength, login, register } from '@/management/api/auth'
import { refreshCaptcha as refreshCaptchaApi } from '@/management/api/captcha'
import { CODE_MAP } from '@/management/api/base'
import { useUserStore } from '@/management/stores/user'
import { getUserInfo } from '@/management/utils/storage'
import { getUserInfo as userInfoApi } from '@/management/api/auth'
import ThemeToggle from '@/management/components/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()

const userinfo = getUserInfo()
if (userinfo?.userInfo?.token) {
  // 如果有《用户凭证》且可以获取用户信息则直接跳转到 survey 页面
  userInfoApi().then(() => {
    router.push({ name: 'survey' })
  })
}

interface FormData {
  name: string
  password: string
  captcha: string
  captchaId: string
  accessCode: string
}

interface Pending {
  login: boolean
  register: boolean
}

const formData = reactive<FormData>({
  name: '',
  password: '',
  captcha: '',
  captchaId: '',
  accessCode: ''
})

// 每个滑块不同强度的颜色，索引0对应第一个滑块
const strengthColor = reactive([
  {
    Strong: '#67C23A',
    Medium: '#ebb563',
    Weak: '#f78989'
  },
  {
    Strong: '#67C23A',
    Medium: '#ebb563',
    Weak: '#2a598a'
  },
  {
    Strong: '#67C23A',
    Medium: '#2a598a',
    Weak: '#2a598a'
  }
])

// 密码内容校验
const passwordValidator = (_: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
    passwordStrength.value = undefined
    return
  }

  if (value.length < 6 || value.length > 16) {
    callback(new Error('长度在 6 到 16 个字符'))
    passwordStrength.value = undefined
    return
  }

  if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(value)) {
    callback(new Error('只能输入数字、字母、特殊字符'))
    passwordStrength.value = undefined
    return
  }
  passwordStrengthHandle(value)
  callback()
}

const passwordStrengthHandle = async (value: string) => {
  const res: any = await getPasswordStrength(value)
  if (res.code === CODE_MAP.SUCCESS) {
    passwordStrength.value = res.data
  }
}

const rules = {
  name: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      min: 3,
      max: 10,
      message: '长度在 3 到 10 个字符',
      trigger: 'blur'
    }
  ],
  password: [{ required: true, validator: debounce(passwordValidator, 500), trigger: 'change' }],
  captcha: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ],
  accessCode: [
    {
      required: true,
      message: '请输入准入码',
      trigger: 'blur'
    }
  ]
}

onMounted(() => {
  refreshCaptcha()
})

const pending = reactive<Pending>({
  login: false,
  register: false
})

const captchaImgData = ref<string>('')
const formDataRef = ref<any>(null)
const passwordStrength = ref<'Strong' | 'Medium' | 'Weak'>()

const submitForm = (type: 'login' | 'register') => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const submitTypes = {
          login,
          register
        }
        pending[type] = true
        const res: any = await submitTypes[type]({
          username: formData.name,
          password: formData.password,
          captcha: formData.captcha,
          captchaId: formData.captchaId,
          accessCode: formData.accessCode
        })
        pending[type] = false
        if (res.code !== CODE_MAP.SUCCESS) {
          ElMessage.error(res.errmsg)
          throw new Error('登录/注册失败' + res.errmsg)
        }
        const userStore = useUserStore()
        userStore.login({
          username: res.data.username,
          token: res.data.token
        })
        let redirect: any = {
          name: 'survey'
        }
        if (route.query.redirect) {
          redirect = decodeURIComponent(route.query.redirect as string)
        }
        router.replace(redirect)
      } catch (error) {
        pending[type] = false
      }
      return true
    } else {
      return false
    }
  })
}

const refreshCaptcha = async () => {
  try {
    const res: any = await refreshCaptchaApi({
      captchaId: formData.captchaId
    })
    if (res.code === 200) {
      const { id, img } = res.data
      formData.captchaId = id
      captchaImgData.value = img
    }
  } catch (error) {
    ElMessage.error('获取验证码失败')
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  overflow: hidden;
  height: 100vh;

  .login-top {
    color: var(--app-text-primary, #4a4c5b);
    height: 56px;
    background: var(--app-bg-header, #fff);
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 90px;
    }

    .top-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
  }

  .login-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }

  .login-form {
    border-radius: var(--app-radius-card, 12px);
    padding: 60px 60px 60px 0;
    background: var(--app-bg-card, #fff);
    box-shadow: var(--app-shadow-card, 4px 0 20px 0 rgba(82, 82, 102, 0.15));
    margin-top: -150px;
    width: 580px;

    .button-group {
      margin-top: 40px;
    }

    .button {
      width: 204px;
      height: 40px;
      font-size: 14px;
      border-radius: var(--el-border-radius-base, 8px);
    }

    .register-button {
      border-color: #faa600;
      color: #faa600;
    }
  }

  .tips {
    color: var(--app-text-muted);
    position: fixed;
    bottom: 15px;
    text-align: center;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .captcha-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 16px;
    .el-input {
      flex: 1;
      min-width: 0;
    }
    .captcha-img {
      flex: 0 0 120px;
      width: 120px;
      height: 40px;
      cursor: pointer;
      border-radius: var(--el-border-radius-base, 8px);
      overflow: hidden;
      :deep(> svg) {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  .strength {
    display: inline-block;
    width: 30%;
    height: 6px;
    border-radius: 8px;
    background: red;
    &:not(:first-child) {
      margin-left: 8px;
    }
  }
}
</style>
