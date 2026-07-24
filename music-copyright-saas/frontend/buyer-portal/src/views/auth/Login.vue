<template>
  <div class="login-container">
    <div class="login-left">
      <div class="brand-info">
        <div class="logo">
          <el-icon :size="48" color="#ffffff"><Music /></el-icon>
        </div>
        <h1 class="brand-title">音乐版权采购平台</h1>
        <p class="brand-desc">专业的音乐版权交易服务平台</p>
        <ul class="feature-list">
          <li>
            <el-icon><Check /></el-icon>
            <span>海量正版词曲作品</span>
          </li>
          <li>
            <el-icon><Check /></el-icon>
            <span>灵活授权方案</span>
          </li>
          <li>
            <el-icon><Check /></el-icon>
            <span>电子授权凭证</span>
          </li>
          <li>
            <el-icon><Check /></el-icon>
            <span>专业版权服务</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="login-right">
      <div class="login-box">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-subtitle">采购正版音乐，助力企业发展</p>
        
        <el-tabs v-model="loginType" class="login-tabs">
          <el-tab-pane label="手机号登录" name="phone" />
          <el-tab-pane label="邮箱登录" name="email" />
        </el-tabs>

        <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" @submit.prevent="handleLogin">
          <el-form-item prop="account">
            <el-input 
              v-model="loginForm.account" 
              :placeholder="loginType === 'phone' ? '请输入手机号' : '请输入邮箱'"
              size="large"
            >
              <template #prefix>
                <el-icon>{{ loginType === 'phone' ? 'Iphone' : 'Message' }}</el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码" 
              size="large"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="login-options">
            <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            <a class="forgot-link" href="javascript:;">忘记密码？</a>
          </div>

          <el-button 
            type="primary" 
            size="large" 
            class="login-btn" 
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>

        <div class="register-link">
          还没有账号？
          <router-link to="/register">立即注册</router-link>
        </div>

        <div class="login-footer">
          <p>登录即表示您同意 <a href="javascript:;">《用户协议》</a> 和 <a href="javascript:;">《隐私政策》</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const loginType = ref('phone')
const loading = ref(false)
const loginFormRef = ref(null)

const loginForm = reactive({
  account: '',
  password: '',
  remember: false
})

const loginRules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    await userStore.login({
      type: loginType.value,
      account: loginForm.account,
      password: loginForm.password
    })
    
    ElMessage.success('登录成功')
    router.push('/market')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
}

.brand-info {
  position: relative;
  z-index: 1;
  color: #fff;
  text-align: center;
  max-width: 480px;
  padding: 40px;
}

.logo {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.brand-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.brand-desc {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.feature-list {
  text-align: left;
  display: inline-block;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 15px;

    .el-icon {
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 4px;
    }
  }
}

.login-right {
  width: 520px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 32px;
}

.login-tabs {
  margin-bottom: 24px;

  :deep(.el-tabs__item) {
    font-size: 15px;
    height: 40px;
  }
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: $primary-light;
  font-size: 14px;

  &:hover {
    color: $primary-color;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  color: $text-secondary;
  font-size: 14px;

  a {
    color: $primary-light;
    font-weight: 500;

    &:hover {
      color: $primary-color;
    }
  }
}

.login-footer {
  margin-top: 32px;
  text-align: center;
  font-size: 12px;
  color: $text-muted;

  a {
    color: $primary-light;

    &:hover {
      color: $primary-color;
    }
  }
}
</style>
