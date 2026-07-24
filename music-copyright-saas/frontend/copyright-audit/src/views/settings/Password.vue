<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">修改密码</h2>
    </div>

    <div class="card-wrapper password-card">
      <div class="password-header">
        <el-icon size="48" color="#166534"><Lock /></el-icon>
        <div>
          <h3>账户安全设置</h3>
          <p>定期修改密码可以保护您的账户安全</p>
        </div>
      </div>

      <el-divider />

      <el-form
        ref="formRef"
        :model="passwordForm"
        :rules="rules"
        label-width="100px"
        class="password-form"
      >
        <el-form-item label="当前账户">
          <el-input v-model="userStore.userInfo?.username" disabled>
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前登录密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码（8-20位，包含字母和数字）"
            show-password
          >
            <template #prefix>
              <el-icon><Key /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <div class="password-strength" v-if="passwordForm.newPassword">
            <span class="strength-label">密码强度：</span>
            <div class="strength-bar">
              <div class="strength-item" :class="{ active: strengthLevel >= 1 }"></div>
              <div class="strength-item" :class="{ active: strengthLevel >= 2 }"></div>
              <div class="strength-item" :class="{ active: strengthLevel >= 3 }"></div>
            </div>
            <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit" size="large">
            <el-icon><Check /></el-icon>
            确认修改
          </el-button>
          <el-button @click="handleReset" size="large">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="tips-section">
        <h4><el-icon><InfoFilled /></el-icon> 安全提示</h4>
        <ul>
          <li>密码长度建议 8-20 位</li>
          <li>建议包含大小写字母、数字和特殊字符</li>
          <li>不要使用与其他网站相同的密码</li>
          <li>建议每 3 个月更换一次密码</li>
          <li>请勿向任何人透露您的密码</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

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

const rules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度为8-20位', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      message: '密码需包含字母和数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const strengthLevel = computed(() => {
  const pwd = passwordForm.newPassword
  if (!pwd) return 0
  let level = 0
  if (pwd.length >= 8) level++
  if (/[a-zA-Z]/.test(pwd) && /\d/.test(pwd)) level++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd) || pwd.length >= 12) level++
  return level
})

const strengthText = computed(() => {
  const map = ['', '弱', '中', '强']
  return map[strengthLevel.value] || ''
})

const strengthClass = computed(() => {
  const map = ['', 'weak', 'medium', 'strong']
  return map[strengthLevel.value] || ''
})

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    ElMessageBox.confirm(
      '确定要修改登录密码吗？修改后需要重新登录。',
      '修改确认',
      {
        confirmButtonText: '确认修改',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(async () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        ElMessage.success('密码修改成功，请重新登录')
        userStore.logout()
        window.location.href = '/login'
      }, 1000)
    }).catch(() => {})
  } catch (error) {
    console.error(error)
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.password-card {
  max-width: 600px;
  margin: 0 auto;
}

.password-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 0;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #14532d;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: #71717a;
    margin: 0;
  }
}

.password-form {
  padding: 10px 0;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;

  .strength-label {
    font-size: 13px;
    color: #71717a;
  }

  .strength-bar {
    display: flex;
    gap: 4px;

    .strength-item {
      width: 40px;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      transition: all 0.3s;

      &.active {
        &:nth-child(1) {
          background: #ef4444;
        }
        &:nth-child(2) {
          background: #f59e0b;
        }
        &:nth-child(3) {
          background: #10b981;
        }
      }
    }
  }

  .strength-text {
    font-size: 13px;
    font-weight: 500;

    &.weak {
      color: #ef4444;
    }
    &.medium {
      color: #f59e0b;
    }
    &.strong {
      color: #10b981;
    }
  }
}

.tips-section {
  padding: 10px 0;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #14532d;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
      padding-left: 18px;
      font-size: 13px;
      color: #52525b;
      line-height: 1.8;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 10px;
        width: 6px;
        height: 6px;
        background: #166534;
        border-radius: 50%;
      }
    }
  }
}
</style>
