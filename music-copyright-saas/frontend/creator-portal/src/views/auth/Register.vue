<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <router-link to="/login" class="back-link">
          <el-icon><ArrowLeft /></el-icon>
          返回登录
        </router-link>
      </div>
      
      <div class="register-body">
        <div class="register-title">
          <h1>选择创作者身份</h1>
          <p>请选择适合您的创作者类型开始入驻</p>
        </div>

        <div class="identity-cards">
          <div 
            class="identity-card" 
            :class="{ active: selectedIdentity === 'musician' }"
            @click="selectIdentity('musician')"
          >
            <div class="card-icon musician">
              <el-icon :size="36"><User /></el-icon>
            </div>
            <h3>独立音乐人</h3>
            <p>适合个人词曲作者、歌手、独立音乐制作人</p>
            <ul class="benefits">
              <li><el-icon><Check /></el-icon>作品上传与管理</li>
              <li><el-icon><Check /></el-icon>多平台授权交易</li>
              <li><el-icon><Check /></el-icon>收益实时结算</li>
            </ul>
          </div>

          <div 
            class="identity-card" 
            :class="{ active: selectedIdentity === 'company' }"
            @click="selectIdentity('company')"
          >
            <div class="card-icon company">
              <el-icon :size="36"><OfficeBuilding /></el-icon>
            </div>
            <h3>唱片公司</h3>
            <p>适合唱片公司、音乐发行公司等企业机构</p>
            <ul class="benefits">
              <li><el-icon><Check /></el-icon>海量作品批量管理</li>
              <li><el-icon><Check /></el-icon>子账号权限管理</li>
              <li><el-icon><Check /></el-icon>企业级对账结算</li>
            </ul>
          </div>

          <div 
            class="identity-card" 
            :class="{ active: selectedIdentity === 'mcn' }"
            @click="selectIdentity('mcn')"
          >
            <div class="card-icon mcn">
              <el-icon :size="36"><Connection /></el-icon>
            </div>
            <h3>MCN机构</h3>
            <p>适合音乐MCN、达人孵化机构等内容机构</p>
            <ul class="benefits">
              <li><el-icon><Check /></el-icon>签约音乐人管理</li>
              <li><el-icon><Check /></el-icon>版权分销运营</li>
              <li><el-icon><Check /></el-icon>数据统计分析</li>
            </ul>
          </div>

          <div 
            class="identity-card" 
            :class="{ active: selectedIdentity === 'studio' }"
            @click="selectIdentity('studio')"
          >
            <div class="card-icon studio">
              <el-icon :size="36"><Headset /></el-icon>
            </div>
            <h3>音乐工作室</h3>
            <p>适合音乐制作工作室、录音棚等专业机构</p>
            <ul class="benefits">
              <li><el-icon><Check /></el-icon>定制音乐服务</li>
              <li><el-icon><Check /></el-icon>项目协作管理</li>
              <li><el-icon><Check /></el-icon>专业版权服务</li>
            </ul>
          </div>
        </div>

        <div class="register-form">
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="账户名称" prop="name">
                  <el-input v-model="registerForm.name" placeholder="请输入真实姓名/企业名称" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="registerForm.phone" placeholder="请输入手机号" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设置密码" prop="password">
                  <el-input v-model="registerForm.password" type="password" placeholder="6-20位密码" size="large" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input v-model="registerForm.confirmPassword" type="password" placeholder="再次输入密码" size="large" show-password />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验证码" prop="code">
                  <el-input v-model="registerForm.code" placeholder="短信验证码" size="large">
                    <template #append>
                      <el-button :disabled="countdown > 0" @click="sendCode">
                        {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                      </el-button>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item prop="agreement">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意
                <a href="javascript:;" class="link">《创作者服务协议》</a>
                和
                <a href="javascript:;" class="link">《隐私政策》</a>
              </el-checkbox>
            </el-form-item>

            <el-button type="primary" size="large" class="submit-btn" :loading="loading" @click="handleRegister">
              注册并申请入驻
            </el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const registerFormRef = ref(null)
const loading = ref(false)
const countdown = ref(0)
const selectedIdentity = ref('musician')

const registerForm = reactive({
  name: '',
  phone: '',
  password: '',
  confirmPassword: '',
  code: '',
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
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  agreement: [
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意服务协议'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const selectIdentity = (identity) => {
  selectedIdentity.value = identity
}

const sendCode = () => {
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号')
    return
  }
  ElMessage.success('验证码已发送')
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        ElMessage.success('注册成功，请完善入驻资料')
        router.push('/join')
      } catch (error) {
        console.error(error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: $bg-body;
}

.register-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.register-header {
  margin-bottom: 32px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $text-secondary;
  font-size: 14px;
  transition: $transition-base;

  &:hover {
    color: $primary-color;
  }
}

.register-body {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: 40px;
  box-shadow: $shadow-md;
}

.register-title {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: $text-muted;
  }
}

.identity-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.identity-card {
  border: 2px solid $border-color;
  border-radius: $border-radius;
  padding: 24px 16px;
  cursor: pointer;
  transition: $transition-base;
  background: #fff;

  &:hover {
    border-color: $primary-light;
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  &.active {
    border-color: $primary-color;
    background: rgba(30, 58, 138, 0.02);
  }
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  &.musician {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: $primary-color;
  }

  &.company {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: $success-color;
  }

  &.mcn {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: $warning-color;
  }

  &.studio {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    color: $info-color;
  }
}

.identity-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.identity-card p {
  font-size: 12px;
  color: $text-muted;
  margin-bottom: 12px;
  line-height: 1.5;
}

.benefits {
  li {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: $text-secondary;
    margin-bottom: 6px;

    .el-icon {
      color: $success-color;
    }
  }
}

.register-form {
  max-width: 600px;
  margin: 0 auto;

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: $text-primary;
  }
}

.link {
  color: $primary-color;

  &:hover {
    color: $primary-light;
  }
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  border-radius: $border-radius;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}
</style>
