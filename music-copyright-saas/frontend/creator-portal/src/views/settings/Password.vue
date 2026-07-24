<template>
  <div class="password-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">修改密码</h2>
          <p class="page-subtitle">定期修改密码，保护账户安全</p>
        </div>
      </div>

      <div class="card-wrapper password-card">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="当前密码" prop="oldPassword">
            <el-input v-model="form.oldPassword" type="password" show-password placeholder="请输入当前密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
            <div class="password-strength mt-8">
              <span class="strength-label">密码强度：</span>
              <div class="strength-bar">
                <div class="strength-item" :class="{ active: strengthLevel >= 1, weak: strengthLevel === 1 }"></div>
                <div class="strength-item" :class="{ active: strengthLevel >= 2, medium: strengthLevel === 2 }"></div>
                <div class="strength-item" :class="{ active: strengthLevel >= 3, strong: strengthLevel === 3 }"></div>
              </div>
              <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
              确认修改
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="card-wrapper security-card mt-20">
        <div class="card-header">
          <span class="card-title">安全设置</span>
        </div>
        <div class="security-list">
          <div class="security-item">
            <div class="item-left">
              <div class="item-icon phone">
                <el-icon><Phone /></el-icon>
              </div>
              <div class="item-info">
                <div class="item-title">绑定手机</div>
                <div class="item-desc">已绑定手机：138****8888</div>
              </div>
            </div>
            <el-button type="primary" link>更换</el-button>
          </div>
          <div class="security-item">
            <div class="item-left">
              <div class="item-icon email">
                <el-icon><Message /></el-icon>
              </div>
              <div class="item-info">
                <div class="item-title">绑定邮箱</div>
                <div class="item-desc">已绑定邮箱：zhangsan@example.com</div>
              </div>
            </div>
            <el-button type="primary" link>更换</el-button>
          </div>
          <div class="security-item">
            <div class="item-left">
              <div class="item-icon protect">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="item-info">
                <div class="item-title">登录保护</div>
                <div class="item-desc">异地登录需要手机验证码</div>
              </div>
            </div>
            <el-switch v-model="loginProtect" />
          </div>
          <div class="security-item">
            <div class="item-left">
              <div class="item-icon record">
                <el-icon><Document /></el-icon>
              </div>
              <div class="item-info">
                <div class="item-title">登录记录</div>
                <div class="item-desc">查看最近登录记录</div>
              </div>
            </div>
            <el-button type="primary" link @click="showLoginRecords = true">查看</el-button>
          </div>
        </div>
      </div>

      <el-dialog v-model="showLoginRecords" title="登录记录" width="600px">
        <el-table :data="loginRecords" border>
          <el-table-column prop="time" label="登录时间" width="180" />
          <el-table-column prop="ip" label="IP地址" width="140" />
          <el-table-column prop="location" label="登录地点" />
          <el-table-column prop="device" label="设备" />
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag size="small" :type="row.status === '成功' ? 'success' : 'danger'" effect="light">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const submitting = ref(false)
const loginProtect = ref(true)
const showLoginRecords = ref(false)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const strengthLevel = computed(() => {
  const pwd = form.newPassword
  if (!pwd) return 0
  let level = 0
  if (pwd.length >= 6) level++
  if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd)) level++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) level++
  return level
})

const strengthText = computed(() => {
  const map = { 0: '请输入密码', 1: '弱', 2: '中', 3: '强' }
  return map[strengthLevel.value]
})

const strengthClass = computed(() => {
  const map = { 0: '', 1: 'weak', 2: 'medium', 3: 'strong' }
  return map[strengthLevel.value]
})

const loginRecords = ref([
  { time: '2024-12-01 10:30:25', ip: '192.168.1.1', location: '北京市朝阳区', device: 'Chrome / Windows', status: '成功' },
  { time: '2024-11-30 14:20:10', ip: '192.168.1.2', location: '北京市朝阳区', device: 'Chrome / Windows', status: '成功' },
  { time: '2024-11-29 09:15:33', ip: '10.0.0.1', location: '上海市浦东新区', device: 'Safari / macOS', status: '成功' },
  { time: '2024-11-28 16:45:20', ip: '192.168.1.1', location: '北京市朝阳区', device: 'Chrome / Windows', status: '成功' },
  { time: '2024-11-27 20:10:05', ip: '203.0.113.1', location: '广东省深圳市', device: '未知', status: '失败' }
])

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        ElMessage.success('密码修改成功，请重新登录')
        form.oldPassword = ''
        form.newPassword = ''
        form.confirmPassword = ''
      }, 1000)
    }
  })
}
</script>

<style scoped lang="scss">
.password-page {
  .password-card {
    max-width: 600px;
  }

  .password-strength {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;

    .strength-label {
      color: $text-muted;
    }

    .strength-bar {
      display: flex;
      gap: 4px;
    }

    .strength-item {
      width: 40px;
      height: 6px;
      background: $border-color;
      border-radius: 3px;
      transition: $transition-base;

      &.active.weak {
        background: $danger-color;
      }
      &.active.medium {
        background: $warning-color;
      }
      &.active.strong {
        background: $success-color;
      }
    }

    .strength-text {
      font-weight: 500;

      &.weak { color: $danger-color; }
      &.medium { color: $warning-color; }
      &.strong { color: $success-color; }
    }
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

    .item-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;

      &.phone {
        background: #dbeafe;
        color: $primary-color;
      }
      &.email {
        background: #dcfce7;
        color: $success-color;
      }
      &.protect {
        background: #fef3c7;
        color: $warning-color;
      }
      &.record {
        background: #ede9fe;
        color: $info-color;
      }
    }

    .item-info {
      .item-title {
        font-size: 15px;
        font-weight: 500;
        color: $text-primary;
        margin-bottom: 4px;
      }
      .item-desc {
        font-size: 13px;
        color: $text-muted;
      }
    }
  }
}
</style>
