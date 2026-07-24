<template>
  <div class="lyric-edit-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">{{ isEdit ? '编辑词曲作品' : '上传词曲作品' }}</h2>
          <p class="page-subtitle">填写作品信息并提交审核</p>
        </div>
        <div class="header-actions">
          <el-button @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            提交审核
          </el-button>
        </div>
      </div>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">基本信息</span>
          </template>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="作品标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入作品标题" maxlength="50" show-word-limit />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="曲风" prop="genre">
                <el-select v-model="form.genre" placeholder="请选择曲风" style="width: 100%">
                  <el-option label="流行" value="pop" />
                  <el-option label="民谣" value="folk" />
                  <el-option label="电子" value="electronic" />
                  <el-option label="摇滚" value="rock" />
                  <el-option label="古风" value="ancient" />
                  <el-option label="R&B" value="rnb" />
                  <el-option label="嘻哈" value="hiphop" />
                  <el-option label="爵士" value="jazz" />
                  <el-option label="古典" value="classical" />
                  <el-option label="乡村" value="country" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="语言" prop="language">
                <el-select v-model="form.language" placeholder="请选择语言" style="width: 100%">
                  <el-option label="国语" value="chinese" />
                  <el-option label="粤语" value="cantonese" />
                  <el-option label="英语" value="english" />
                  <el-option label="日语" value="japanese" />
                  <el-option label="韩语" value="korean" />
                  <el-option label="纯音乐" value="instrumental" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调性" prop="tonality">
                <el-select v-model="form.tonality" placeholder="请选择调性" style="width: 100%">
                  <el-option label="C大调" value="C" />
                  <el-option label="G大调" value="G" />
                  <el-option label="D大调" value="D" />
                  <el-option label="A大调" value="A" />
                  <el-option label="E大调" value="E" />
                  <el-option label="F大调" value="F" />
                  <el-option label="a小调" value="Am" />
                  <el-option label="e小调" value="Em" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="BPM" prop="bpm">
                <el-input-number v-model="form.bpm" :min="40" :max="220" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用场景" prop="scenes">
                <el-select v-model="form.scenes" multiple placeholder="请选择适用场景" style="width: 100%">
                  <el-option label="短视频" value="short_video" />
                  <el-option label="影视配乐" value="film" />
                  <el-option label="广告宣传" value="ad" />
                  <el-option label="游戏配乐" value="game" />
                  <el-option label="直播背景" value="live" />
                  <el-option label="综艺节⽬" value="variety" />
                  <el-option label="舞台剧" value="theater" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标签" prop="tags">
                <el-select
                  v-model="form.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="输入标签后按回车添加"
                  style="width: 100%"
                >
                  <el-option label="治愈" value="治愈" />
                  <el-option label="励志" value="励志" />
                  <el-option label="浪漫" value="浪漫" />
                  <el-option label="伤感" value="伤感" />
                  <el-option label="欢快" value="欢快" />
                  <el-option label="中国风" value="中国风" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">作品内容</span>
          </template>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="作品封面" prop="cover">
                <el-upload
                  class="cover-uploader"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="image/*"
                  @change="handleCoverChange"
                >
                  <div class="uploader-box" v-if="!form.cover">
                    <el-icon class="uploader-icon"><Plus /></el-icon>
                    <div class="uploader-text">上传封面</div>
                    <div class="uploader-tip">建议尺寸 600x600px，JPG/PNG格式</div>
                  </div>
                  <img v-else :src="form.cover" class="cover-preview" />
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="歌词内容" prop="lyrics">
                <el-input
                  v-model="form.lyrics"
                  type="textarea"
                  :rows="12"
                  placeholder="请输入歌词内容..."
                  maxlength="10000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="曲谱文件" prop="sheetMusic">
                <el-upload
                  class="file-uploader"
                  action="#"
                  :auto-upload="false"
                  drag
                  :limit="3"
                  multiple
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持PDF、Word、图片格式，最多上传3个文件
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Demo音频" prop="demo">
                <el-upload
                  class="file-uploader"
                  action="#"
                  :auto-upload="false"
                  drag
                  :limit="2"
                  accept="audio/*"
                  multiple
                >
                  <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                  <div class="el-upload__text">
                    拖拽文件到此处，或<em>点击上传</em>
                  </div>
                  <template #tip>
                    <div class="el-upload__tip">
                      支持MP3、WAV格式，最多上传2个Demo
                    </div>
                  </template>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">授权设置</span>
          </template>
          <el-form-item label="授权模式" prop="licenseMode">
            <el-radio-group v-model="form.licenseMode">
              <el-radio value="pricing">明码标价</el-radio>
              <el-radio value="negotiation">仅询价</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.licenseMode === 'pricing'">
            <el-form-item label="非商用授权" prop="nonCommercialPrice">
              <el-input-number v-model="form.nonCommercialPrice" :min="0" :step="10" />
              <span class="unit">元</span>
              <span class="price-desc">个人/非商业用途授权价格</span>
            </el-form-item>
            <el-form-item label="商用授权" prop="commercialPrice">
              <el-input-number v-model="form.commercialPrice" :min="0" :step="100" />
              <span class="unit">元</span>
              <span class="price-desc">商业广告/项目使用授权价格</span>
            </el-form-item>
            <el-form-item label="独家授权" prop="exclusivePrice">
              <el-input-number v-model="form.exclusivePrice" :min="0" :step="1000" />
              <span class="unit">元</span>
              <span class="price-desc">独家买断授权价格（可选）</span>
            </el-form-item>
          </template>
          <el-alert
            v-else
            title="仅询价模式下，买家无法直接购买，需要通过询价方式与您沟通价格"
            type="info"
            :closable="false"
            show-icon
          />
        </el-card>

        <el-card class="form-card" shadow="never">
          <template #header>
            <span class="card-title">作品简介</span>
          </template>
          <el-form-item label="创作背景" prop="background">
            <el-input
              v-model="form.background"
              type="textarea"
              :rows="4"
              placeholder="请描述作品的创作背景、故事..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="作品简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请描述作品的风格、特点、适用场景..."
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <div class="form-actions">
          <el-button size="large" @click="handleBack">返回</el-button>
          <el-button size="large" @click="handleSaveDraft">保存草稿</el-button>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            提交审核
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const formRef = ref(null)
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  genre: '',
  language: '',
  tonality: '',
  bpm: 120,
  scenes: [],
  tags: [],
  cover: '',
  lyrics: '',
  sheetMusic: [],
  demo: [],
  licenseMode: 'pricing',
  nonCommercialPrice: 99,
  commercialPrice: 999,
  exclusivePrice: null,
  background: '',
  description: ''
})

const rules = {
  title: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
  genre: [{ required: true, message: '请选择曲风', trigger: 'change' }],
  language: [{ required: true, message: '请选择语言', trigger: 'change' }],
  licenseMode: [{ required: true, message: '请选择授权模式', trigger: 'change' }]
}

const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    form.cover = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSaveDraft = () => {
  ElMessage.success('草稿已保存')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        ElMessage.success('提交成功，等待审核')
        setTimeout(() => {
          router.push('/work/lyric')
        }, 1000)
      } catch (error) {
        console.error(error)
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleBack = () => {
  router.push('/work/lyric')
}
</script>

<style scoped lang="scss">
.lyric-edit-page {
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
    width: 200px;
    height: 200px;
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
    font-size: 40px;
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
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: $border-radius;
  }

  .file-uploader {
    :deep(.el-upload-dragger) {
      padding: 20px;
    }
  }

  .unit {
    margin-left: 8px;
    color: $text-secondary;
  }

  .price-desc {
    margin-left: 12px;
    font-size: 13px;
    color: $text-muted;
  }

  .form-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 20px 0;
  }
}
</style>
