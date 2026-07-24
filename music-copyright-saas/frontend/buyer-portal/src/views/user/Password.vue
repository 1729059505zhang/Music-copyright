<template>
  <div class="password-page">
    <div class="password-card">
      <div class="card-header">
        <div class="header-icon">
          <el-icon :size="32"><Lock /></el-icon>
        </div>
        <div>
          <h3>修改密码</h3>
          <p>定期修改密码可以保护您的账户安全</p>
        </div>
      </div>

      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" class="password-form">
        <el-form-item label="当前密码" prop="oldPassword">
          <el-input 
            v-model="passwordForm.oldPassword" 
            type="password" 
            placeholder="请输入当前密码" 
            size="large"
            show-password
            style="width: 360px"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入8-20位新密码，包含字母和数字" 
            size="large"
            show-password
            style="width: 360px"
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码" 
            size="large"
            show-password
            style="width: 360px"
          />
        </el-form-item>

        <div class="strength-section">
          <span class="strength-label">密码强度：</span>
          <div class="strength-bars">
            <div 
              class="strength-bar" 
              :class="{ weak: passwordStrength >= 1, medium: passwordStrength >= 2, strong: passwordStrength >= 3 }"
            ></div>
            <div 
              class="strength-bar" 
              :class="{ weak: passwordStrength >= 2, medium: passwordStrength >= 2, strong: passwordStrength >= 3 }"
            ></div>
            <div 
              class="strength-bar" 
              :class="{ weak: passwordStrength >= 3, medium: passwordStrength >= 3, strong: passwordStrength >= 3 }"
            ></div>
          </div>
          <span class="strength-text">{{ strengthText }}</span>
        </div>

        <div class="tips-section">
          <h4 class="tips-title">密码安全建议</h4>
          <ul class="tips-list">
            <li :class="{ done: hasLength }">
              <el-icon><Check v-if="hasLength" /><Close v-else /></el-icon>
              密码长度在8-20位之间
            </li>
            <li :class="{ done: hasLetter }">
              <el-icon><Check v-if="hasLetter" /><Close v-else /></el-icon>
              包含英文字母
            </li>
            <li :class="{ done: hasNumber }">
              <el-icon><Check v-if="hasNumber" /><Close v-else /></el-icon>
              包含数字
            </li>
            <li :class="{ done: hasSpecial }">
              <el-icon><Check v-if="hasSpecial" /><Close v-else /></el-icon>
              包含特殊符号（推荐）
            </li>
          </ul>
        </div>

        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" @click="handleSubmit">
            确认修改
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="security-card">
      <h3 class="card-title">安全设置</h3>
      <div class="security-list">
        <div class="security-item">
          <div class="security-info">
            <div class="security-icon phone">
              <el-icon :size="20"><Iphone /></el-icon>
            </div>
            <div>
              <div class="security-name">手机绑定</div>
              <div class="security-desc">已绑定手机号：138****8000</div>
            </div>
          </div>
          <el-button text type="primary">修改</el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <div class="security-icon email">
              <el-icon :size="20"><Message /></el-icon>
            </div>
            <div>
              <div class="security-name">邮箱绑定</div>
              <div class="security-desc">已绑定邮箱：zhang@example.com</div>
            </div>
          </div>
          <el-button text type="primary">修改</el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <div class="security-icon protect">
              <el-icon :size="20"><Shield /></el-icon>
            </div>
            <div>
              <div class="security-name">登录保护</div>
              <div class="security-desc">异地登录时需要验证</div>
            </div>
          </div>
          <el-switch v-model="loginProtect" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const passwordFormRef = ref(null)
const loginProtect = ref(true)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const hasLength = computed(() => {
  return passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length <= 20
})

const hasLetter = computed(() => {
  return /[a-zA-Z]/.test(passwordForm.newPassword)
})

const hasNumber = computed(() => {
  return /\d/.test(passwordForm.newPassword)
})

const hasSpecial = computed(() => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.newPassword)
})

const passwordStrength = computed(() => {
  let strength = 0
  if (hasLength.value) strength++
  if (hasLetter.value && hasNumber.value) strength++
  if (hasSpecial.value) strength++
  return strength
})

const strengthText = computed(() => {
  const texts = ['弱', '中等', '强']
  if (!passwordForm.newPassword) return ''
  return texts[passwordStrength.value - 1] || '弱'
})

const handleSubmit = async () => {
  try {
    await passwordFormRef.value.validate()
    loading.value = true
    
    setTimeout(() => {
      loading.value = false
      ElMessage.success('密码修改成功，请重新登录')
      handleReset()
    }, 1000)
  } catch (error) {
    console.error('验证失败:', error)
  }
}

const handleReset = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordFormRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.password-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.password-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: $shadow-sm;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid $border-light;

  .header-icon {
    width: 56px;
    height: 56px;
    background: rgba(30, 64, 175, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $primary-color;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
    margin: 0 0 4px;
  }

  p {
    font-size: 13px;
    color: $text-muted;
    margin: 0;
  }
}

.password-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
    width: 120px;
  }
}

.strength-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-left: 120px;
}

.strength-label {
  font-size: 13px;
  color: $text-secondary;
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bar {
  width: 40px;
  height: 6px;
  background: $border-light;
  border-radius: 3px;
  transition: $transition-base;

  &.weak {
    background: $danger-color;
  }

  &.medium {
    background: $warning-color;
  }

  &.strong {
    background: $success-color;
  }
}

.strength-text {
  font-size: 13px;
  font-weight: 500;
  color: $text-secondary;
}

.tips-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px 20px;
  margin-left: 120px;
  margin-bottom: 24px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.tips-list {
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }

    &.done {
      color: $success-color;

      .el-icon {
        color: $success-color;
      }
    }

    &:not(.done) {
      .el-icon {
        color: $text-muted;
      }
    }
  }
}

.security-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: $shadow-sm;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid $border-light;
}

.security-list {
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid $border-light;

    &:last-child {
      border-bottom: none;
    }
  }
}

.security-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.security-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  &.phone {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }

  &.email {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.protect {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
}

.security-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 4px;
}

.security-desc {
  font-size: 13px;
  color: $text-secondary;
}
</style>
