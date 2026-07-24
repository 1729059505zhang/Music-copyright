<template>
  <div class="profile-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">基本资料</h2>
          <p class="page-subtitle">管理您的创作者基本信息</p>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="16">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">创作者信息</span>
            </div>
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
              <el-form-item label="头像">
                <div class="avatar-upload">
                  <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    accept="image/*"
                    @change="handleAvatarChange"
                  >
                    <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                    <el-icon v-else class="avatar-placeholder"><Plus /></el-icon>
                  </el-upload>
                  <div class="avatar-tip">
                    <p>建议上传正方形头像，尺寸不小于200x200px</p>
                    <p>支持JPG、PNG格式，文件大小不超过2MB</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="创作者名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入创作者名称" />
              </el-form-item>
              <el-form-item label="身份类型">
                <el-tag type="primary" effect="light">独立音乐人</el-tag>
              </el-form-item>
              <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="form.realName" placeholder="请输入真实姓名" />
              </el-form-item>
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="form.idCard" placeholder="请输入身份证号码" />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入手机号码" />
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入电子邮箱" />
              </el-form-item>
              <el-form-item label="所在地区">
                <el-cascader
                  v-model="form.region"
                  :options="regionOptions"
                  style="width: 100%"
                />
              </el-form-item>
              <el-form-item label="个人简介" prop="bio">
                <el-input
                  v-model="form.bio"
                  type="textarea"
                  :rows="4"
                  placeholder="介绍一下自己吧，让买家更好地了解您"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="擅长风格">
                <el-select
                  v-model="form.styles"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选择或输入擅长风格"
                  style="width: 100%"
                >
                  <el-option label="流行" value="流行" />
                  <el-option label="民谣" value="民谣" />
                  <el-option label="电子" value="电子" />
                  <el-option label="摇滚" value="摇滚" />
                  <el-option label="古风" value="古风" />
                  <el-option label="R&B" value="R&B" />
                  <el-option label="嘻哈" value="嘻哈" />
                  <el-option label="爵士" value="爵士" />
                </el-select>
              </el-form-item>
              <el-form-item label="社交账号">
                <div class="social-inputs">
                  <el-input v-model="form.weibo" placeholder="微博账号" style="width: 200px">
                    <template #prepend>微博</template>
                  </el-input>
                  <el-input v-model="form.wechat" placeholder="微信公众号" style="width: 220px">
                    <template #prepend>微信</template>
                  </el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="submitting" @click="handleSave">
                  保存修改
                </el-button>
                <el-button @click="handleReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">入驻信息</span>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="label">入驻状态</span>
                <el-tag type="success" effect="light">已通过</el-tag>
              </div>
              <div class="info-item">
                <span class="label">入驻时间</span>
                <span class="value">2024-08-15</span>
              </div>
              <div class="info-item">
                <span class="label">创作者ID</span>
                <span class="value">CR001234</span>
              </div>
              <div class="info-item">
                <span class="label">认证等级</span>
                <span class="value">
                  <el-rate v-model="authLevel" disabled show-score text-color="#ff9900" :max="5" />
                </span>
              </div>
            </div>
          </div>

          <div class="card-wrapper mt-20">
            <div class="card-header">
              <span class="card-title">数据统计</span>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-num">128</div>
                <div class="stat-label">作品数</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">156</div>
                <div class="stat-label">订单数</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">98%</div>
                <div class="stat-label">好评率</div>
              </div>
              <div class="stat-item">
                <div class="stat-num">1.2k</div>
                <div class="stat-label">收藏数</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const submitting = ref(false)
const authLevel = ref(4)

const form = reactive({
  avatar: '',
  name: '音乐人张三',
  realName: '张三',
  idCard: '110***********1234',
  phone: '138****8888',
  email: 'zhangsan@example.com',
  region: [],
  bio: '独立音乐制作人，擅长流行、民谣风格，从事音乐创作10年，作品曾多次获得多项音乐奖项。',
  styles: ['流行', '民谣', '电子'],
  weibo: '@音乐人张三',
  wechat: 'zhangsan_music'
})

const rules = {
  name: [{ required: true, message: '请输入创作者名称', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

const regionOptions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      { value: 'dongcheng', label: '东城区' },
      { value: 'xicheng', label: '西城区' },
      { value: 'chaoyang', label: '朝阳区' },
      { value: 'haidian', label: '海淀区' }
    ]
  },
  {
    value: 'shanghai',
    label: '上海市',
    children: [
      { value: 'huangpu', label: '黄浦区' },
      { value: 'pudong', label: '浦东新区' }
    ]
  }
]

const handleAvatarChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        ElMessage.success('保存成功')
      }, 1000)
    }
  })
}

const handleReset = () => {
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.profile-page {
  .avatar-upload {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .avatar-uploader {
    :deep(.el-upload) {
      border: 2px dashed $border-color;
      border-radius: $border-radius;
      overflow: hidden;
      cursor: pointer;
      transition: $transition-base;

      &:hover {
        border-color: $primary-color;
      }
    }
  }

  .avatar {
    width: 120px;
    height: 120px;
    object-fit: cover;
  }

  .avatar-placeholder {
    font-size: 32px;
    color: $text-muted;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-tip {
    p {
      font-size: 12px;
      color: $text-muted;
      margin: 4px 0;
    }
  }

  .social-inputs {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .info-list {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }
    }

    .label {
      font-size: 13px;
      color: $text-muted;
    }

    .value {
      font-size: 14px;
      color: $text-primary;
      font-weight: 500;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-item {
    text-align: center;
    padding: 16px;
    background: $bg-body;
    border-radius: $border-radius;

    .stat-num {
      font-size: 22px;
      font-weight: 700;
      color: $primary-color;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: $text-muted;
    }
  }
}
</style>
