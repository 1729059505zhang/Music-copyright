<template>
  <div class="join-page">
    <div class="join-container">
      <div class="join-header">
        <div class="logo">
          <el-icon :size="32"><Music /></el-icon>
          <span>创作者工作台</span>
        </div>
        <el-button text @click="handleLogout">
          退出登录
          <el-icon><SwitchButton /></el-icon>
        </el-button>
      </div>

      <div class="join-body">
        <div class="steps-wrapper">
          <el-steps :active="currentStep" finish-status="success" align-center>
            <el-step title="选择身份" />
            <el-step title="提交资料" />
            <el-step title="审核结果" />
          </el-steps>
        </div>

        <div class="step-content" v-if="currentStep === 1">
          <div class="content-header">
            <h2>选择您的创作者身份</h2>
            <p>不同身份享有不同的功能权限，请根据实际情况选择</p>
          </div>

          <div class="identity-options">
            <div 
              v-for="item in identityList" 
              :key="item.value"
              class="identity-item"
              :class="{ active: formData.identity === item.value }"
              @click="selectIdentity(item.value)"
            >
              <div class="item-icon" :class="item.value">
                <el-icon :size="28"><component :is="item.icon" /></el-icon>
              </div>
              <div class="item-info">
                <h4>{{ item.label }}</h4>
                <p>{{ item.desc }}</p>
              </div>
              <el-icon class="check-icon" v-if="formData.identity === item.value"><CircleCheckFilled /></el-icon>
            </div>
          </div>

          <div class="step-actions">
            <el-button type="primary" size="large" :disabled="!formData.identity" @click="nextStep">
              下一步，填写资料
            </el-button>
          </div>
        </div>

        <div class="step-content" v-if="currentStep === 2">
          <div class="content-header">
            <h2>提交入驻资料</h2>
            <p>请如实填写以下信息，我们将在1-3个工作日内完成审核</p>
          </div>

          <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
            <el-card class="form-section" shadow="never">
              <template #header>
                <span class="section-title">基本信息</span>
              </template>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="身份证号" prop="idCard">
                    <el-input v-model="formData.idCard" placeholder="请输入身份证号码" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="联系手机" prop="phone">
                    <el-input v-model="formData.phone" placeholder="请输入联系手机号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <el-card class="form-section" shadow="never">
              <template #header>
                <span class="section-title">资质证明</span>
              </template>
              <el-form-item label="手持身份证照" prop="idCardPhoto">
                <el-upload
                  class="upload-demo"
                  drag
                  action="#"
                  :auto-upload="false"
                  :limit="1"
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      请上传手持身份证正面照片，支持JPG/PNG格式，大小不超过5MB
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="音乐作品集">
                <el-upload
                  class="upload-demo"
                  drag
                  action="#"
                  :auto-upload="false"
                  multiple
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      上传您的音乐作品Demo或作品集链接，有助于审核通过
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-card>

            <el-card class="form-section" shadow="never">
              <template #header>
                <span class="section-title">结算信息</span>
              </template>
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="开户银行" prop="bankName">
                    <el-input v-model="formData.bankName" placeholder="请输入开户银行名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="银行卡号" prop="bankCard">
                    <el-input v-model="formData.bankCard" placeholder="请输入银行卡号" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="开户名" prop="bankAccount">
                    <el-input v-model="formData.bankAccount" placeholder="请输入开户人姓名" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>

            <div class="step-actions">
              <el-button size="large" @click="prevStep">上一步</el-button>
              <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
                提交审核
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="step-content" v-if="currentStep === 3">
          <div class="result-wrapper">
            <div class="result-icon pending">
              <el-icon :size="64"><Clock /></el-icon>
            </div>
            <h2>入驻申请已提交</h2>
            <p class="result-desc">
              您的创作者入驻申请已提交，我们将在1-3个工作日内完成审核。<br>
              审核结果将通过短信和站内信通知您，请耐心等待。
            </p>
            <div class="result-info">
              <div class="info-item">
                <span class="label">申请编号</span>
                <span class="value">CR202412001</span>
              </div>
              <div class="info-item">
                <span class="label">申请类型</span>
                <span class="value">{{ getIdentityLabel(formData.identity) }}</span>
              </div>
              <div class="info-item">
                <span class="label">提交时间</span>
                <span class="value">{{ new Date().toLocaleString() }}</span>
              </div>
            </div>
            <el-button type="primary" size="large" @click="refreshStatus">
              刷新状态
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref(null)
const currentStep = ref(1)
const submitting = ref(false)

const identityList = [
  { value: 'musician', label: '独立音乐人', desc: '个人词曲作者、歌手、音乐制作人', icon: 'User' },
  { value: 'company', label: '唱片公司', desc: '唱片公司、音乐发行公司等企业', icon: 'OfficeBuilding' },
  { value: 'mcn', label: 'MCN机构', desc: '音乐MCN、达人孵化机构', icon: 'Connection' },
  { value: 'studio', label: '音乐工作室', desc: '音乐制作工作室、录音棚', icon: 'Headset' }
]

const formData = reactive({
  identity: '',
  realName: '',
  idCard: '',
  phone: '',
  email: '',
  idCardPhoto: '',
  bankName: '',
  bankCard: '',
  bankAccount: ''
})

const formRules = {
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  bankName: [{ required: true, message: '请输入开户银行', trigger: 'blur' }],
  bankCard: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
  bankAccount: [{ required: true, message: '请输入开户名', trigger: 'blur' }]
}

const selectIdentity = (identity) => {
  formData.identity = identity
}

const getIdentityLabel = (value) => {
  const item = identityList.find(i => i.value === value)
  return item ? item.label : ''
}

const nextStep = () => {
  currentStep.value = 2
}

const prevStep = () => {
  currentStep.value = 1
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        currentStep.value = 3
        ElMessage.success('提交成功')
      } catch (error) {
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const refreshStatus = () => {
  ElMessage.info('当前审核状态：审核中')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.join-page {
  min-height: 100vh;
  background: $bg-body;
}

.join-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px;
}

.join-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  color: $primary-color;
}

.join-body {
  background: #fff;
  border-radius: $border-radius-lg;
  padding: 40px;
  box-shadow: $shadow-md;
}

.steps-wrapper {
  max-width: 500px;
  margin: 0 auto 40px;
}

.step-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-header {
  text-align: center;
  margin-bottom: 32px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: $text-muted;
  }
}

.identity-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.identity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid $border-color;
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition-base;
  position: relative;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary-color;
    background: rgba(30, 58, 138, 0.02);
  }
}

.item-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

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

.item-info {
  flex: 1;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: $text-muted;
  }
}

.check-icon {
  color: $primary-color;
  font-size: 24px;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.form-section {
  margin-bottom: 20px;
  border: 1px solid $border-light;

  :deep(.el-card__header) {
    padding: 16px 20px;
    background: $bg-body;
    border-bottom: 1px solid $border-light;
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.result-wrapper {
  text-align: center;
  padding: 40px 20px;
}

.result-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;

  &.pending {
    background: #fef3c7;
    color: $warning-color;
  }

  &.success {
    background: #dcfce7;
    color: $success-color;
  }
}

.result-wrapper h2 {
  font-size: 24px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.result-desc {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.8;
  margin-bottom: 32px;
}

.result-info {
  max-width: 400px;
  margin: 0 auto 32px;
  background: $bg-body;
  border-radius: $border-radius;
  padding: 20px;
  text-align: left;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;

  .label {
    color: $text-muted;
  }

  .value {
    color: $text-primary;
    font-weight: 500;
  }
}
</style>
