<template>
  <div class="copyright-apply-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">版权登记申请</h2>
          <p class="page-subtitle">为您的音乐作品申请著作权登记</p>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="16">
          <div class="card-wrapper">
            <el-steps :active="currentStep" finish-status="success" direction="vertical" class="steps-bar">
              <el-step title="选择作品">
                <template #description>
                  <div class="step-content" v-if="currentStep >= 0">
                    <el-form label-width="100px" class="step-form">
                      <el-form-item label="选择作品">
                        <el-select v-model="form.workId" placeholder="请选择要登记的作品" style="width: 100%" filterable>
                          <el-option 
                            v-for="work in workList" 
                            :key="work.id" 
                            :value="work.id"
                            :label="work.title"
                          >
                            <span>{{ work.title }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ work.genre }}</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="作品类型">
                        <el-radio-group v-model="form.workType">
                          <el-radio value="music">音乐作品</el-radio>
                          <el-radio value="lyrics">歌词作品</el-radio>
                          <el-radio value="melody">曲作品</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="nextStep">下一步</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-step>

              <el-step title="填写信息">
                <template #description>
                  <div class="step-content" v-if="currentStep >= 1">
                    <el-form :model="form" label-width="100px" class="step-form">
                      <el-form-item label="作品名称">
                        <el-input v-model="form.workName" />
                      </el-form-item>
                      <el-form-item label="作者姓名">
                        <el-input v-model="form.authorName" />
                      </el-form-item>
                      <el-form-item label="创作完成日期">
                        <el-date-picker v-model="form.createDate" type="date" style="width: 100%" />
                      </el-form-item>
                      <el-form-item label="首次发表日期">
                        <el-date-picker v-model="form.publishDate" type="date" style="width: 100%" />
                      </el-form-item>
                      <el-form-item label="创作性质">
                        <el-radio-group v-model="form.createNature">
                          <el-radio value="original">原创</el-radio>
                          <el-radio value="adapt">改编</el-radio>
                          <el-radio value="cooperate">合作</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="作品简介">
                        <el-input v-model="form.description" type="textarea" :rows="4" />
                      </el-form-item>
                      <el-form-item>
                        <el-button @click="prevStep">上一步</el-button>
                        <el-button type="primary" @click="nextStep">下一步</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-step>

              <el-step title="提交材料">
                <template #description>
                  <div class="step-content" v-if="currentStep >= 2">
                    <el-form label-width="100px" class="step-form">
                      <el-form-item label="作品样本">
                        <el-upload
                          class="upload-demo"
                          drag
                          action="#"
                          :auto-upload="false"
                          :limit="3"
                          multiple
                        >
                          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                          <div class="el-upload__text">
                            拖拽文件到此处，或<em>点击上传</em>
                          </div>
                          <template #tip>
                            <div class="el-upload__tip">
                              上传作品音频/乐谱/歌词文档，支持MP3、WAV、PDF、Word格式
                            </div>
                          </template>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="身份证明">
                        <el-upload
                          class="upload-demo"
                          drag
                          action="#"
                          :auto-upload="false"
                          :limit="2"
                          multiple
                        >
                          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                          <div class="el-upload__text">
                            拖拽文件到此处，或<em>点击上传</em>
                          </div>
                          <template #tip>
                            <div class="el-upload__tip">
                              身份证正反面照片，支持JPG、PNG格式
                            </div>
                          </template>
                        </el-upload>
                      </el-form-item>
                      <el-form-item label="权利归属证明">
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
                              如合作协议、委托协议等（可选）
                            </div>
                          </template>
                        </el-upload>
                      </el-form-item>
                      <el-form-item>
                        <el-button @click="prevStep">上一步</el-button>
                        <el-button type="primary" :loading="submitting" @click="handleSubmit">
                          提交申请
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">服务说明</span>
            </div>
            <div class="service-info">
              <div class="info-item">
                <div class="info-title">
                  <el-icon><InfoFilled /></el-icon>
                  版权登记优势
                </div>
                <ul class="info-list">
                  <li>保护原创权益，防止侵权</li>
                  <li>维权时提供法律依据</li>
                  <li>增加作品可信度和价值</li>
                  <li>便于授权交易和商业化</li>
                </ul>
              </div>
              <el-divider />
              <div class="info-item">
                <div class="info-title">
                  <el-icon><Clock /></el-icon>
                  办理周期
                </div>
                <p class="info-text">
                  普通办理：30个工作日<br>
                  加急办理：5-15个工作日
                </p>
              </div>
              <el-divider />
              <div class="info-item">
                <div class="info-title">
                  <el-icon><Wallet /></el-icon>
                  服务费用
                </div>
                <p class="price-info">
                  <span class="price">¥399</span>
                  <span class="unit">/件</span>
                </p>
                <p class="price-desc">包含版权登记全部服务费</p>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const currentStep = ref(0)
const submitting = ref(false)

const workList = ref([
  { id: 1, title: '夏日微风', genre: '流行' },
  { id: 2, title: '城市夜曲', genre: '电子' },
  { id: 3, title: '追梦人', genre: '民谣' },
  { id: 4, title: '海边的风', genre: '流行' },
  { id: 5, title: '星辰大海', genre: '摇滚' },
  { id: 6, title: '江南雨', genre: '古风' }
])

const form = reactive({
  workId: null,
  workType: 'music',
  workName: '',
  authorName: '',
  createDate: '',
  publishDate: '',
  createNature: 'original',
  description: ''
})

const nextStep = () => {
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const handleSubmit = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('版权登记申请已提交')
    setTimeout(() => {
      router.push('/copyright/list')
    }, 1500)
  }, 1500)
}
</script>

<style scoped lang="scss">
.copyright-apply-page {
  .steps-bar {
    :deep(.el-step__title) {
      font-weight: 600;
      font-size: 15px;
    }
  }

  .step-content {
    padding: 16px 0 0 40px;
  }

  .step-form {
    max-width: 500px;
  }

  .service-info {
    .info-item {
      margin-bottom: 16px;
    }

    .info-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 12px;
    }

    .info-list {
      padding-left: 28px;

      li {
        list-style: disc;
        font-size: 13px;
        color: $text-secondary;
        margin-bottom: 6px;
      }
    }

    .info-text {
      font-size: 13px;
      color: $text-secondary;
      line-height: 1.8;
      padding-left: 28px;
    }

    .price-info {
      padding-left: 28px;
      margin-bottom: 4px;
    }

    .price {
      font-size: 28px;
      font-weight: 700;
      color: $primary-color;
    }

    .unit {
      font-size: 14px;
      color: $text-secondary;
      margin-left: 4px;
    }

    .price-desc {
      font-size: 12px;
      color: $text-muted;
      padding-left: 28px;
    }
  }
}
</style>
