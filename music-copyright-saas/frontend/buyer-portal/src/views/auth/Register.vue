<template>
  <div class="register-container">
    <div class="register-left">
      <div class="brand-info">
        <div class="logo">
          <el-icon :size="48" color="#ffffff"><Music /></el-icon>
        </div>
        <h1 class="brand-title">音乐版权采购平台</h1>
        <p class="brand-desc">加入我们，开启正版音乐采购之旅</p>
        <div class="stats">
          <div class="stat-item">
            <div class="stat-number">10万+</div>
            <div class="stat-label">正版音乐作品</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5000+</div>
            <div class="stat-label">合作企业客户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">版权保障率</div>
          </div>
        </div>
      </div>
    </div>
    <div class="register-right">
      <div class="register-box">
        <h2 class="register-title">企业注册</h2>
        <p class="register-subtitle">完善企业信息，享受专业版权服务</p>

        <el-steps :active="1" finish-status="success" class="register-steps">
          <el-step title="基本信息" />
          <el-step title="资质认证" />
          <el-step title="注册完成" />
        </el-steps>

        <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="registerForm.companyName" placeholder="请输入企业全称" size="large" />
          </el-form-item>

          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input v-model="registerForm.creditCode" placeholder="请输入18位统一社会信用代码" size="large" />
          </el-form-item>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="联系人姓名" prop="contactName">
                <el-input v-model="registerForm.contactName" placeholder="请输入联系人姓名" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人职位" prop="contactPosition">
                <el-input v-model="registerForm.contactPosition" placeholder="请输入职位" size="large" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="registerForm.phone" placeholder="请输入手机号" size="large">
                  <template #append>
                    <el-button :disabled="countdown > 0" @click="sendCode">
                      {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="验证码" prop="code">
                <el-input v-model="registerForm.code" placeholder="请输入验证码" size="large" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" placeholder="请输入企业邮箱" size="large" />
          </el-form-item>

          <el-form-item label="设置密码" prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请设置8-20位密码，包含字母和数字" size="large" show-password />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password />
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意 <a href="javascript:;">《用户协议》</a> 和 <a href="javascript:;">《隐私政策》</a>
            </el-checkbox>
          </el-form-item>

          <el-button 
            type="primary" 
            size="large" 
            class="register-btn" 
            :loading="loading"
            @click="handleRegister"
          >
            注册并提交认证
          </el-button>
        </el-form>

        <div class="login-link">
          已有账号？
          <router-link to="/login">立即登录</router-link>
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

const loading = ref(false)
const countdown = ref(0)
const registerFormRef = ref(null)

const registerForm = reactive({
  companyName: '',
  creditCode: '',
  contactName: '',
  contactPosition: '',
  phone: '',
  code: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { len: 18, message: '统一社会信用代码为18位', trigger: 'blur' }
  ],
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议和隐私政策'))
        } else {
          callback()
        }
      }, 
      trigger: 'change' 
    }
  ]
}

const sendCode = () => {
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  ElMessage.success('验证码已发送')
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    loading.value = true
    
    await userStore.register(registerForm)
    
    ElMessage.success('注册成功，请完成企业认证')
    router.push('/certify')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.register-left {
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
  margin-bottom: 48px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.register-right {
  width: 600px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
}

.register-box {
  width: 100%;
  max-width: 480px;
}

.register-title {
  font-size: 28px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 32px;
}

.register-steps {
  margin-bottom: 32px;
}

.register-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
}

.login-link {
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
</style>
