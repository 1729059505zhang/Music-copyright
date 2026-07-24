<template>
  <div class="release-edit-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ isEdit ? '编辑发行作品' : '上传发行作品' }}</h2>
          <p class="page-subtitle">填写歌曲信息并提交发行</p>
        </div>
        <div class="header-actions">
          <el-button @click="handleBack">返回</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            提交发行
          </el-button>
        </div>
      </div>

      <el-steps :active="currentStep" finish-status="success" align-center class="steps-bar">
        <el-step title="基本信息" />
        <el-step title="音频文件" />
        <el-step title="发行设置" />
      </el-steps>

      <div class="step-content">
        <div v-if="currentStep === 0">
          <el-card class="form-card" shadow="never">
            <template #header>
              <span class="card-title">歌曲基本信息</span>
            </template>
            <el-form :model="form" label-width="120px">
              <el-row :gutter="24">
                <el-col :span="12">
                  <el-form-item label="歌曲名称">
                    <el-input v-model="form.title" placeholder="请输入歌曲名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="歌手/艺人">
                    <el-input v-model="form.artist" placeholder="请输入歌手名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="所属专辑">
                    <el-input v-model="form.album" placeholder="请输入专辑名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="语种">
                    <el-select v-model="form.language" placeholder="请选择" style="width: 100%">
                      <el-option label="国语" value="chinese" />
                      <el-option label="粤语" value="cantonese" />
                      <el-option label="英语" value="english" />
                      <el-option label="纯音乐" value="instrumental" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="曲风">
                    <el-select v-model="form.genre" placeholder="请选择" style="width: 100%">
                      <el-option label="流行" value="pop" />
                      <el-option label="民谣" value="folk" />
                      <el-option label="电子" value="electronic" />
                      <el-option label="摇滚" value="rock" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="发行时间">
                    <el-date-picker
                      v-model="form.releaseDate"
                      type="date"
                      placeholder="选择日期"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="时长">
                    <el-input v-model="form.duration" placeholder="例如：03:45" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="唱片公司">
                    <el-input v-model="form.label" placeholder="请输入唱片公司名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="专辑封面">
                    <el-upload
                      class="cover-uploader"
                      action="#"
                      :auto-upload="false"
                      :show-file-list="false"
                      accept="image/*"
                    >
                      <div class="uploader-box" v-if="!form.cover">
                        <el-icon class="uploader-icon"><Plus /></el-icon>
                        <div class="uploader-text">上传封面</div>
                        <div class="uploader-tip">建议尺寸 3000x3000px，JPG格式</div>
                      </div>
                      <img v-else :src="form.cover" class="cover-preview" />
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="歌词">
                    <el-input
                      v-model="form.lyrics"
                      type="textarea"
                      :rows="8"
                      placeholder="请输入歌词内容..."
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-card>
        </div>

        <div v-if="currentStep === 1">
          <el-card class="form-card" shadow="never">
            <template #header>
              <span class="card-title">音频文件上传</span>
            </template>
            <el-form label-width="120px">
              <el-form-item label="主音频文件">
                <el-upload
                  class="audio-uploader"
                  action="#"
                  :auto-upload="false"
                  drag
                  accept="audio/*"
                  :limit="1"
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持WAV/MP3格式，采样率44.1kHz以上，比特率320kbps以上
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
              <el-form-item label="伴奏/纯音乐">
                <el-upload
                  class="audio-uploader"
                  action="#"
                  :auto-upload="false"
                  drag
                  accept="audio/*"
                  :limit="1"
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      可选，上传伴奏版本音频文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <div v-if="currentStep === 2">
          <el-card class="form-card" shadow="never">
            <template #header>
              <span class="card-title">发行平台选择</span>
            </template>
            <div class="platform-grid">
              <div 
                v-for="platform in platforms" 
                :key="platform.value"
                class="platform-item"
                :class="{ active: form.platforms.includes(platform.value) }"
                @click="togglePlatform(platform.value)"
              >
                <div class="platform-icon" :class="platform.value">
                  <el-icon :size="28"><component :is="platform.icon" /></el-icon>
                </div>
                <div class="platform-name">{{ platform.label }}</div>
                <el-icon class="check-icon" v-if="form.platforms.includes(platform.value)">
                  <CircleCheckFilled />
                </el-icon>
              </div>
            </div>
          </el-card>

          <el-card class="form-card" shadow="never">
            <template #header>
              <span class="card-title">版权信息</span>
            </template>
            <el-form :model="form" label-width="120px">
              <el-form-item label="ISRC编码">
                <el-input v-model="form.isrc" placeholder="如有请填写，没有则自动申请" />
              </el-form-item>
              <el-form-item label="版权声明">
                <el-radio-group v-model="form.copyrightType">
                  <el-radio value="original">原创作品（自有版权）</el-radio>
                  <el-radio value="cover">翻唱作品（已获授权）</el-radio>
                  <el-radio value="agency">代理发行（已获授权）</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="授权文件">
                <el-upload
                  action="#"
                  :auto-upload="false"
                  drag
                  multiple
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      非原创作品请上传授权证明文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <div class="step-actions">
          <el-button v-if="currentStep > 0" size="large" @click="prevStep">上一步</el-button>
          <el-button v-if="currentStep < 2" type="primary" size="large" @click="nextStep">
            下一步
          </el-button>
          <el-button v-if="currentStep === 2" type="primary" size="large" :loading="submitting" @click="handleSubmit">
            提交发行
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const submitting = ref(false)
const currentStep = ref(0)

const isEdit = computed(() => !!route.params.id)

const platforms = [
  { value: 'netease', label: '网易云音乐', icon: 'Headset' },
  { value: 'qq', label: 'QQ音乐', icon: 'Headset' },
  { value: 'kugou', label: '酷狗音乐', icon: 'Headset' },
  { value: 'kuwo', label: '酷我音乐', icon: 'Headset' },
  { value: 'douyin', label: '抖音音乐', icon: 'Headset' },
  { value: 'xiami', label: '虾米音乐', icon: 'Headset' }
]

const form = reactive({
  title: '',
  artist: '',
  album: '',
  language: '',
  genre: '',
  releaseDate: '',
  duration: '',
  label: '',
  cover: '',
  lyrics: '',
  isrc: '',
  copyrightType: 'original',
  platforms: ['netease', 'qq', 'kugou']
})

const togglePlatform = (platform) => {
  const index = form.platforms.indexOf(platform)
  if (index > -1) {
    form.platforms.splice(index, 1)
  } else {
    form.platforms.push(platform)
  }
}

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
    ElMessage.success('发行申请已提交，等待审核')
    setTimeout(() => {
      router.push('/work/release')
    }, 1000)
  }, 1500)
}

const handleBack = () => {
  router.push('/work/release')
}
</script>

<style scoped lang="scss">
.release-edit-page {
  .steps-bar {
    background: #fff;
    padding: 24px;
    border-radius: $border-radius;
    margin-bottom: 20px;
    box-shadow: $shadow-sm;
  }

  .form-card {
    margin-bottom: 20px;
    border: 1px solid $border-light;
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }

  .cover-uploader {
    :deep(.el-upload) {
      border: none;
    }
  }

  .uploader-box {
    width: 180px;
    height: 180px;
    border: 2px dashed $border-color;
    border-radius: $border-radius;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: $transition-base;
    background: $bg-body;

    &:hover {
      border-color: $primary-color;
    }
  }

  .uploader-icon {
    font-size: 36px;
    color: $text-muted;
    margin-bottom: 8px;
  }

  .uploader-text {
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 4px;
  }

  .uploader-tip {
    font-size: 12px;
    color: $text-muted;
  }

  .cover-preview {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: $border-radius;
  }

  .audio-uploader {
    width: 100%;

    :deep(.el-upload-dragger) {
      width: 100%;
    }
  }

  .platform-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .platform-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 2px solid $border-color;
    border-radius: $border-radius;
    cursor: pointer;
    transition: $transition-base;

    &:hover {
      border-color: $primary-light;
    }

    &.active {
      border-color: $primary-color;
      background: rgba(30, 58, 138, 0.02);
    }
  }

  .platform-icon {
    width: 48px;
    height: 48px;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: $primary-color;
  }

  .platform-name {
    flex: 1;
    font-weight: 500;
    color: $text-primary;
  }

  .check-icon {
    color: $primary-color;
    font-size: 22px;
  }

  .step-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 20px 0;
  }
}
</style>
