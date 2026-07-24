<template>
  <div class="certify-container">
    <div class="certify-card">
      <div class="certify-header">
        <el-icon :size="48" color="#1e40af"><OfficeBuilding /></el-icon>
        <h1>企业资质实名认证</h1>
        <p>完成企业资质认证后，方可进行音乐版权采购</p>
      </div>

      <el-steps :active="currentStep" finish-status="success" class="certify-steps">
        <el-step title="填写企业信息" />
        <el-step title="提交审核" />
        <el-step title="认证完成" />
      </el-steps>

      <div v-if="currentStep === 0" class="certify-content">
        <el-form :model="certifyForm" :rules="certifyRules" ref="certifyFormRef" label-width="140px">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="certifyForm.companyName" placeholder="请输入企业全称" size="large" />
          </el-form-item>

          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input v-model="certifyForm.creditCode" placeholder="请输入18位统一社会信用代码" size="large" />
          </el-form-item>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="企业类型" prop="companyType">
                <el-select v-model="certifyForm.companyType" placeholder="请选择企业类型" size="large" style="width: 100%">
                  <el-option label="有限责任公司" value="limited" />
                  <el-option label="股份有限公司" value="joint_stock" />
                  <el-option label="合伙企业" value="partnership" />
                  <el-option label="个人独资企业" value="sole" />
                  <el-option label="个体工商户" value="individual" />
                  <el-option label="事业单位" value="institution" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业" prop="industry">
                <el-select v-model="certifyForm.industry" placeholder="请选择所属行业" size="large" style="width: 100%">
                  <el-option label="互联网/科技" value="internet" />
                  <el-option label="影视/传媒" value="media" />
                  <el-option label="广告/营销" value="advertising" />
                  <el-option label="游戏" value="game" />
                  <el-option label="电商/零售" value="ecommerce" />
                  <el-option label="教育" value="education" />
                  <el-option label="金融" value="finance" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="注册资本" prop="registeredCapital">
            <el-input v-model="certifyForm.registeredCapital" placeholder="请输入注册资本" size="large">
              <template #append>万元</template>
            </el-input>
          </el-form-item>

          <el-form-item label="营业执照" prop="businessLicense">
            <el-upload
              class="license-uploader"
              :show-file-list="false"
              :auto-upload="false"
              @change="handleLicenseUpload"
            >
              <div v-if="certifyForm.businessLicense" class="license-preview">
                <img :src="certifyForm.businessLicense" alt="营业执照" />
              </div>
              <div v-else class="upload-placeholder">
                <el-icon :size="40"><Plus /></el-icon>
                <p>点击上传营业执照</p>
                <span>支持JPG、PNG格式，不超过10MB</span>
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item label="法人姓名" prop="legalPerson">
            <el-input v-model="certifyForm.legalPerson" placeholder="请输入法人代表姓名" size="large" />
          </el-form-item>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="法人身份证号" prop="legalIdCard">
                <el-input v-model="certifyForm.legalIdCard" placeholder="请输入法人身份证号" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contactPhone">
                <el-input v-model="certifyForm.contactPhone" placeholder="请输入联系电话" size="large" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="企业地址" prop="address">
            <el-input v-model="certifyForm.address" placeholder="请输入企业详细地址" size="large" />
          </el-form-item>

          <div class="certify-actions">
            <el-button size="large" @click="goBack">返回登录</el-button>
            <el-button type="primary" size="large" :loading="submitting" @click="submitCertify">
              提交认证
            </el-button>
          </div>
        </el-form>
      </div>

      <div v-else-if="currentStep === 1" class="certify-content text-center">
        <el-icon :size="80" color="#f59e0b" class="status-icon"><Clock /></el-icon>
        <h2>资质审核中</h2>
        <p class="desc">我们将在1-3个工作日内完成审核，请耐心等待</p>
        <div class="tips-box">
          <h4>温馨提示</h4>
          <ul>
            <li>审核结果将通过短信和邮件通知您</li>
            <li>审核期间，您可以浏览平台作品，但无法进行采购</li>
            <li>如有疑问，请联系客服：400-888-8888</li>
          </ul>
        </div>
        <el-button type="primary" size="large" @click="goBack">返回首页</el-button>
      </div>

      <div v-else class="certify-content text-center">
        <el-icon :size="80" color="#10b981" class="status-icon"><CircleCheck /></el-icon>
        <h2>认证成功</h2>
        <p class="desc">您的企业资质已通过认证，可以开始采购音乐版权了</p>
        <el-button type="primary" size="large" @click="goToMarket">前往词曲集市</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const currentStep = ref(0)
const submitting = ref(false)
const certifyFormRef = ref(null)

const certifyForm = reactive({
  companyName: '',
  creditCode: '',
  companyType: '',
  industry: '',
  registeredCapital: '',
  businessLicense: '',
  legalPerson: '',
  legalIdCard: '',
  contactPhone: '',
  address: ''
})

const certifyRules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { len: 18, message: '统一社会信用代码为18位', trigger: 'blur' }
  ],
  companyType: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  registeredCapital: [{ required: true, message: '请输入注册资本', trigger: 'blur' }],
  businessLicense: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
  legalPerson: [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
  legalIdCard: [{ required: true, message: '请输入法人身份证号', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  address: [{ required: true, message: '请输入企业地址', trigger: 'blur' }]
}

const handleLicenseUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    certifyForm.businessLicense = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const submitCertify = async () => {
  try {
    await certifyFormRef.value.validate()
    submitting.value = true
    
    setTimeout(() => {
      submitting.value = false
      currentStep.value = 1
      ElMessage.success('认证申请已提交')
    }, 1500)
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/market')
}

const goToMarket = () => {
  router.push('/market')
}
</script>

<style scoped lang="scss">
.certify-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.certify-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  border-radius: 12px;
  padding: 48px;
  box-shadow: $shadow-lg;
}

.certify-header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    color: $text-primary;
    margin: 16px 0 8px;
  }

  p {
    font-size: 14px;
    color: $text-secondary;
  }
}

.certify-steps {
  margin-bottom: 40px;
}

.certify-content {
  &.text-center {
    text-align: center;
    padding: 20px 0;

    h2 {
      font-size: 24px;
      font-weight: 600;
      color: $text-primary;
      margin: 16px 0 12px;
    }

    .desc {
      font-size: 14px;
      color: $text-secondary;
      margin-bottom: 32px;
    }
  }
}

.status-icon {
  margin-bottom: 16px;
}

.license-uploader {
  width: 300px;
  height: 180px;

  :deep(.el-upload) {
    width: 100%;
    height: 100%;
  }
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed $border-color;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $text-muted;
  transition: $transition-base;

  &:hover {
    border-color: $primary-light;
    color: $primary-light;
  }

  .el-icon {
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    margin-bottom: 4px;
  }

  span {
    font-size: 12px;
  }
}

.license-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid $border-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.certify-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}

.tips-box {
  background: #fef3c7;
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 32px;
  text-align: left;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 12px;
  }

  ul {
    li {
      font-size: 13px;
      color: #92400e;
      margin-bottom: 8px;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 6px;
        height: 6px;
        background: #f59e0b;
        border-radius: 50%;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
