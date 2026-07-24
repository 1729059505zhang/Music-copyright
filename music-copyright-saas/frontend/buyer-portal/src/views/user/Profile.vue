<template>
  <div class="profile-page">
    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="企业信息" name="company" />
      <el-tab-pane label="联系人信息" name="contact" />
    </el-tabs>

    <div v-show="activeTab === 'company'" class="form-section">
      <div class="section-header">
        <h3>企业基本信息</h3>
        <p>请确保企业信息准确无误，这将影响版权授权的法律效力</p>
      </div>

      <el-form :model="companyForm" :rules="companyRules" ref="companyFormRef" label-width="140px" class="profile-form">
        <el-form-item label="企业名称" prop="companyName">
          <el-input v-model="companyForm.companyName" placeholder="请输入企业全称" style="width: 400px" />
        </el-form-item>

        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input v-model="companyForm.creditCode" placeholder="请输入18位统一社会信用代码" style="width: 400px" />
        </el-form-item>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="企业类型" prop="companyType">
              <el-select v-model="companyForm.companyType" placeholder="请选择企业类型" style="width: 100%">
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
              <el-select v-model="companyForm.industry" placeholder="请选择所属行业" style="width: 100%">
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

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="注册资本" prop="registeredCapital">
              <el-input v-model="companyForm.registeredCapital" placeholder="请输入注册资本" style="width: 100%">
                <template #append>万元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成立日期" prop="establishDate">
              <el-date-picker 
                v-model="companyForm.establishDate" 
                type="date" 
                placeholder="请选择成立日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="经营范围" prop="businessScope">
          <el-input 
            v-model="companyForm.businessScope" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入经营范围"
            style="width: 500px"
          />
        </el-form-item>

        <el-form-item label="企业地址" prop="address">
          <el-input v-model="companyForm.address" placeholder="请输入企业详细地址" style="width: 500px" />
        </el-form-item>

        <el-form-item label="营业执照">
          <div class="license-upload">
            <div class="license-preview">
              <img :src="companyForm.businessLicense" alt="营业执照" />
              <div class="license-mask">
                <el-button type="primary" size="small">重新上传</el-button>
              </div>
            </div>
            <div class="license-tip">
              <p>支持JPG、PNG格式，文件大小不超过10MB</p>
              <p>请确保证照清晰可辨，四角完整</p>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="saving" @click="saveCompany">保存修改</el-button>
          <el-button size="large" @click="resetCompany">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="activeTab === 'contact'" class="form-section">
      <div class="section-header">
        <h3>联系人信息</h3>
        <p>平台重要通知将发送至以下联系方式，请保持信息准确</p>
      </div>

      <el-form :model="contactForm" :rules="contactRules" ref="contactFormRef" label-width="140px" class="profile-form">
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="contactForm.contactName" placeholder="请输入联系人姓名" style="width: 300px" />
        </el-form-item>

        <el-form-item label="联系人职位" prop="contactPosition">
          <el-input v-model="contactForm.contactPosition" placeholder="请输入职位" style="width: 300px" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="contactForm.phone" placeholder="请输入手机号码" style="width: 300px">
            <template #append>
              <el-button type="primary" link size="small">修改</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="contactForm.email" placeholder="请输入邮箱地址" style="width: 300px">
            <template #append>
              <el-tag size="small" type="success">已验证</el-tag>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="微信号">
          <el-input v-model="contactForm.wechat" placeholder="请输入微信号（选填）" style="width: 300px" />
        </el-form-item>

        <el-form-item label="办公电话">
          <el-input v-model="contactForm.officePhone" placeholder="请输入办公电话（选填）" style="width: 300px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="saving" @click="saveContact">保存修改</el-button>
          <el-button size="large" @click="resetContact">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('company')
const saving = ref(false)
const companyFormRef = ref(null)
const contactFormRef = ref(null)

const companyForm = reactive({
  companyName: '北京示例科技有限公司',
  creditCode: '91110105MA01XXXXXX',
  companyType: 'limited',
  industry: 'internet',
  registeredCapital: '500',
  establishDate: '2020-01-15',
  businessScope: '技术开发、技术咨询、技术服务、技术转让；计算机系统服务；基础软件服务；应用软件服务；软件开发；软件咨询；产品设计；模型设计；包装装潢设计；教育咨询；经济贸易咨询；文化咨询；体育咨询；公共关系服务；会议服务；工艺美术设计；电脑动画设计；企业策划、设计；设计、制作、代理、发布广告；市场调查；企业管理咨询；组织文化艺术交流活动；文艺创作；承办展览展示活动；会议服务。',
  address: '北京市朝阳区建国路88号A座15层1501室',
  businessLicense: 'https://picsum.photos/400/280?random=50'
})

const companyRules = {
  companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { len: 18, message: '统一社会信用代码为18位', trigger: 'blur' }
  ],
  companyType: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
  industry: [{ required: true, message: '请选择所属行业', trigger: 'change' }],
  registeredCapital: [{ required: true, message: '请输入注册资本', trigger: 'blur' }],
  establishDate: [{ required: true, message: '请选择成立日期', trigger: 'change' }],
  address: [{ required: true, message: '请输入企业地址', trigger: 'blur' }]
}

const contactForm = reactive({
  contactName: '张经理',
  contactPosition: '市场部经理',
  phone: '138****8000',
  email: 'zhang@example.com',
  wechat: 'zhangweixin',
  officePhone: '010-88888888'
})

const contactRules = {
  contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
  contactPosition: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const saveCompany = async () => {
  try {
    await companyFormRef.value.validate()
    saving.value = true
    setTimeout(() => {
      saving.value = false
      ElMessage.success('企业信息已保存')
    }, 1000)
  } catch (error) {
    console.error('验证失败:', error)
  }
}

const resetCompany = () => {
  ElMessage.info('已重置')
}

const saveContact = async () => {
  try {
    await contactFormRef.value.validate()
    saving.value = true
    setTimeout(() => {
      saving.value = false
      ElMessage.success('联系人信息已保存')
    }, 1000)
  } catch (error) {
    console.error('验证失败:', error)
  }
}

const resetContact = () => {
  ElMessage.info('已重置')
}
</script>

<style scoped lang="scss">
.profile-page {
  padding: 24px;
}

.profile-tabs {
  margin-bottom: 24px;

  :deep(.el-tabs__item) {
    font-size: 15px;
  }
}

.form-section {
  max-width: 800px;
}

.section-header {
  margin-bottom: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  p {
    font-size: 13px;
    color: $text-muted;
    margin: 0;
  }
}

.profile-form {
  :deep(.el-form-item__label) {
    font-weight: 500;
  }
}

.license-upload {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.license-preview {
  width: 300px;
  height: 200px;
  border: 1px solid $border-color;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover .license-mask {
    opacity: 1;
  }
}

.license-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: $transition-base;
}

.license-tip {
  p {
    font-size: 13px;
    color: $text-muted;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
