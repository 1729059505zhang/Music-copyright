<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <el-icon :size="36" color="#fff"><Medal /></el-icon>
        </div>
        <h1 class="title">版权审核平台</h1>
        <p class="subtitle">Copyright Audit Management System</p>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入审核员账号"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
      <div class="login-footer">
        <p>© 2024 音乐版权SaaS平台 · 版权审核端</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: 'auditor',
  password: 'auditor123'
})

const loginRules = {
  username: [{ required: true, message: '请输入审核员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    await userStore.login(loginForm)
    await userStore.fetchUserInfo()
    ElMessage.success('登录成功')
    router.push('/')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #14532d 0%, #166534 50%, #052e16 100%);
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(5, 150, 105, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(22, 101, 52, 0.2) 0%, transparent 50%);
}

.login-card {
  position: relative;
  width: 420px;
  padding: 48px 40px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;

  .logo {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #166534, #059669);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);
  }

  .title {
    font-size: 22px;
    font-weight: 600;
    color: #14532d;
    margin-bottom: 8px;
  }

  .subtitle {
    font-size: 13px;
    color: #84cc16;
    letter-spacing: 1px;
  }
}

.login-form {
  .login-btn {
    width: 100%;
    margin-top: 8px;
    height: 44px;
    font-size: 15px;
    letter-spacing: 4px;
    background: linear-gradient(135deg, #166534, #059669);
    border: none;

    &:hover {
      opacity: 0.9;
    }
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}
</style>
