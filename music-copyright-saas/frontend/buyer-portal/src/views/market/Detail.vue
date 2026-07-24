<template>
  <div class="market-detail">
    <div class="detail-container">
      <div class="detail-main">
        <div class="detail-left">
          <div class="cover-section">
            <div class="cover-wrapper">
              <img :src="work.cover" :alt="work.title" class="work-cover" />
              <div class="cover-shadow"></div>
            </div>
            
            <div class="player-section">
              <div class="player-info">
                <div class="audio-progress">
                  <div class="progress-bar" :style="{ width: progressPercent + '%' }"></div>
                </div>
                <div class="time-display">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ work.duration }}</span>
                </div>
              </div>
              <div class="player-controls">
                <el-button circle size="small" class="control-btn">
                  <el-icon><Rewind /></el-icon>
                </el-button>
                <el-button circle size="large" type="primary" class="play-btn" @click="togglePlay">
                  <el-icon :size="20">{{ isPlaying ? 'VideoPause' : 'VideoPlay' }}</el-icon>
                </el-button>
                <el-button circle size="small" class="control-btn">
                  <el-icon><FastForward /></el-icon>
                </el-button>
                <el-button circle size="small" class="control-btn volume-btn">
                  <el-icon><Microphone /></el-icon>
                </el-button>
              </div>
              <div class="demo-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>试听为30秒Demo片段，购买后可下载完整版本</span>
              </div>
            </div>

            <div class="action-buttons">
              <el-button 
                size="large" 
                :type="isFavorite ? 'warning' : 'default'"
                @click="toggleFavorite"
              >
                <el-icon>{{ isFavorite ? 'Star' : 'Star' }}</el-icon>
                {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
              <el-button size="large" @click="handleShare">
                <el-icon><Share /></el-icon>
                分享
              </el-button>
            </div>
          </div>
        </div>

        <div class="detail-right">
          <div class="work-header">
            <div class="work-tags-top">
              <el-tag v-if="work.exclusive" type="danger" effect="dark">独家授权</el-tag>
              <el-tag type="info">有版权登记</el-tag>
            </div>
            <h1 class="work-title">{{ work.title }}</h1>
            <div class="work-meta">
              <div class="creator-info">
                <el-avatar :size="40" :src="work.creatorAvatar" />
                <div class="creator-detail">
                  <div class="creator-name">{{ work.creator }}</div>
                  <div class="creator-desc">认证音乐人</div>
                </div>
                <el-button type="primary" plain size="small">关注</el-button>
              </div>
            </div>
            <div class="work-tags">
              <el-tag effect="plain" size="small">{{ work.genre }}</el-tag>
              <el-tag effect="plain" size="small">{{ work.key }}</el-tag>
              <el-tag effect="plain" size="small">{{ work.bpm }} BPM</el-tag>
              <el-tag effect="plain" size="small">{{ work.duration }}</el-tag>
              <el-tag effect="plain" size="small">国语</el-tag>
            </div>
          </div>

          <div class="license-section">
            <h3 class="section-title">授权套餐</h3>
            <div class="license-cards">
              <div 
                v-for="license in licensePlans" 
                :key="license.id"
                class="license-card"
                :class="{ active: selectedLicense === license.id }"
                @click="selectedLicense = license.id"
              >
                <div class="license-header">
                  <h4>{{ license.name }}</h4>
                  <div class="license-price">
                    <span class="symbol">¥</span>
                    <span class="value">{{ license.price }}</span>
                  </div>
                </div>
                <p class="license-desc">{{ license.desc }}</p>
                <ul class="license-features">
                  <li v-for="(feature, idx) in license.features" :key="idx">
                    <el-icon color="#10b981"><Check /></el-icon>
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="purchase-section">
            <div class="price-summary">
              <span class="label">授权费用：</span>
              <span class="price">¥{{ currentPrice }}</span>
            </div>
            <div class="purchase-buttons">
              <el-button size="large" type="primary" class="buy-btn" @click="handleBuy">
                <el-icon><ShoppingCart /></el-icon>
                立即购买
              </el-button>
              <el-button size="large" class="inquiry-btn" @click="handleInquiry">
                <el-icon><ChatDotRound /></el-icon>
                发起询价
              </el-button>
            </div>
            <div class="purchase-tips">
              <el-icon color="#f59e0b"><Warning /></el-icon>
              <span>购买后将自动生成电子授权凭证，可在用户中心查看</span>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-bottom">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="作品介绍" name="intro">
            <div class="tab-content">
              <h4>作品简介</h4>
              <p class="intro-text">{{ work.intro }}</p>
              
              <h4>创作背景</h4>
              <p class="intro-text">{{ work.background }}</p>
              
              <h4>适用场景</h4>
              <div class="scene-tags">
                <el-tag v-for="scene in work.scenes" :key="scene" effect="plain" size="large">
                  {{ scene }}
                </el-tag>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="完整歌词" name="lyrics">
            <div class="tab-content">
              <div class="lyrics-wrapper" :class="{ blurred: !showFullLyrics }">
                <div class="lyrics-text">
                  <p v-for="(line, idx) in lyrics" :key="idx">{{ line }}</p>
                </div>
                <div v-if="!showFullLyrics" class="lyrics-mask">
                  <div class="mask-content">
                    <el-icon :size="48" color="#94a3b8"><Lock /></el-icon>
                    <p>购买后可查看完整歌词</p>
                    <el-button type="primary" @click="handleBuy">立即购买</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="曲谱预览" name="score">
            <div class="tab-content">
              <div class="score-preview">
                <div class="score-images">
                  <div v-for="i in 4" :key="i" class="score-page">
                    <img :src="`https://picsum.photos/600/800?random=${i + 20}`" :alt="`乐谱第${i}页`" />
                    <div class="score-watermark">Demo预览</div>
                  </div>
                </div>
                <div class="score-tip">
                  <el-icon color="#f59e0b"><InfoFilled /></el-icon>
                  <span>以上为曲谱预览图，购买后可下载高清完整曲谱PDF</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="recommend-section">
        <h3 class="section-title">相似推荐</h3>
        <div class="work-grid">
          <div 
            v-for="item in recommendList" 
            :key="item.id" 
            class="work-card"
            @click="goToDetail(item.id)"
          >
            <div class="work-cover">
              <img :src="item.cover" :alt="item.title" />
              <div class="cover-overlay">
                <el-button circle size="large" class="play-btn">
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="work-info">
              <h4 class="work-title text-ellipsis">{{ item.title }}</h4>
              <div class="work-creator">{{ item.creator }}</div>
              <div class="work-price">¥{{ item.price }}起</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const isPlaying = ref(false)
const currentTime = ref(45)
const isFavorite = ref(false)
const selectedLicense = ref('commercial')
const activeTab = ref('intro')
const showFullLyrics = ref(false)

let playTimer = null

const work = reactive({
  id: route.params.id,
  title: '夏日微风',
  cover: 'https://picsum.photos/600/600?random=1',
  creator: '李音乐',
  creatorAvatar: 'https://picsum.photos/100/100?random=101',
  genre: '流行',
  key: 'C大调',
  bpm: 120,
  duration: '3:45',
  exclusive: true,
  intro: '《夏日微风》是一首充满阳光气息的流行音乐作品，旋律轻快明朗，编曲融合了原声吉他与电子元素，营造出夏日午后慵懒惬意的氛围。作品整体色调明亮，节奏舒缓有致，适合用于各类品牌广告、短视频配乐及公共场所播放。',
  background: '这首作品创作于2023年夏天，灵感来源于创作者在海边度假时的美好时光。海浪、阳光、微风，这些元素被巧妙地融入到旋律和编曲中，希望听者能感受到那份纯粹的快乐与自由。',
  scenes: ['品牌广告', '短视频配乐', '电商直播', '企业宣传片', '线下门店', 'Vlog背景音乐']
})

const licensePlans = [
  {
    id: 'personal',
    name: '个人授权',
    price: 299,
    desc: '适用于个人非商业用途',
    features: [
      '个人项目使用',
      '非商业用途',
      '可用于社交媒体',
      'MP3/WAV格式',
      '有效期1年'
    ]
  },
  {
    id: 'commercial',
    name: '商业授权',
    price: 899,
    desc: '适用于企业商业项目',
    features: [
      '商业项目使用',
      '可用于广告/宣传片',
      '可用于线下门店',
      'MP3/WAV/分轨文件',
      '永久授权',
      '电子授权凭证'
    ]
  },
  {
    id: 'exclusive',
    name: '独家授权',
    price: 5999,
    desc: '独家买断，全权拥有',
    features: [
      '独家版权授权',
      '全渠道商业使用',
      '可二次创作改编',
      '所有格式源文件',
      '永久独家授权',
      '版权登记变更',
      '专属客服服务'
    ]
  }
]

const lyrics = [
  '夏日的风轻轻吹过脸庞',
  '阳光洒在海面上闪着光',
  '你的笑容像花儿一样绽放',
  '让我心动让我向往',
  '',
  '走在沙滩上脚印一双双',
  '海浪拍打着礁石在歌唱',
  '这一刻的美好值得珍藏',
  '让时间停留在这地方',
  '',
  '哦~夏日的微风',
  '带走了所有忧愁',
  '哦~温暖的阳光',
  '照亮了我的心头',
  '',
  '让我们一起感受',
  '这夏日的温柔',
  '让快乐永远停留',
  '在这美好的时候'
]

const recommendList = ref([
  { id: 101, title: '阳光海岸线', cover: 'https://picsum.photos/300/300?random=11', creator: '海洋之声', price: 799 },
  { id: 102, title: '午后阳光', cover: 'https://picsum.photos/300/300?random=12', creator: '小清新', price: 599 },
  { id: 103, title: '夏天的故事', cover: 'https://picsum.photos/300/300?random=13', creator: '民谣诗人', price: 1099 },
  { id: 104, title: '海风轻拂', cover: 'https://picsum.photos/300/300?random=14', creator: '自然音乐', price: 699 }
])

const progressPercent = computed(() => {
  const totalSeconds = 225
  return (currentTime.value / totalSeconds) * 100
})

const currentPrice = computed(() => {
  const license = licensePlans.find(l => l.id === selectedLicense.value)
  return license ? license.price : 0
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    playTimer = setInterval(() => {
      currentTime.value++
      if (currentTime.value >= 30) {
        currentTime.value = 0
      }
    }, 1000)
  } else {
    clearInterval(playTimer)
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '已添加到收藏' : '已取消收藏')
}

const handleShare = () => {
  ElMessage.success('分享链接已复制到剪贴板')
}

const handleBuy = () => {
  ElMessageBox.confirm(
    `确定要以 ¥${currentPrice.value} 购买「${licensePlans.find(l => l.id === selectedLicense.value)?.name}」授权吗？`,
    '确认购买',
    {
      confirmButtonText: '确认购买',
      cancelButtonText: '再想想',
      type: 'info'
    }
  ).then(() => {
    ElMessage.success('购买成功！可在用户中心查看授权凭证')
    router.push('/user/orders')
  }).catch(() => {})
}

const handleInquiry = () => {
  ElMessage.info('询价功能开发中，可联系客服：400-888-8888')
}

const goToDetail = (id) => {
  router.push(`/market/${id}`)
}

onMounted(() => {
})

onUnmounted(() => {
  if (playTimer) {
    clearInterval(playTimer)
  }
})
</script>

<style scoped lang="scss">
.market-detail {
  background: $bg-body;
  min-height: calc(100vh - #{$header-height});
  padding-bottom: 60px;
}

.detail-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 32px;
}

.detail-main {
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
}

.detail-left {
  width: 480px;
  flex-shrink: 0;
}

.cover-section {
  position: sticky;
  top: 80px;
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: $shadow-lg;
  margin-bottom: 20px;
}

.work-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-shadow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
}

.player-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: $shadow-sm;
  margin-bottom: 16px;
}

.player-info {
  margin-bottom: 16px;
}

.audio-progress {
  height: 4px;
  background: $border-light;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: $primary-color;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: $text-muted;
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;

  .control-btn {
    border: none;
    background: $bg-body;
    color: $text-secondary;

    &:hover {
      color: $primary-color;
      background: rgba(30, 64, 175, 0.1);
    }
  }

  .play-btn {
    width: 56px;
    height: 56px;
  }

  .volume-btn {
    margin-left: auto;
  }
}

.demo-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-muted;
  justify-content: center;
}

.action-buttons {
  display: flex;
  gap: 12px;

  .el-button {
    flex: 1;
  }
}

.detail-right {
  flex: 1;
  min-width: 0;
}

.work-header {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: $shadow-sm;
  margin-bottom: 20px;
}

.work-tags-top {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.work-title {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 16px;
}

.work-meta {
  margin-bottom: 16px;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.creator-detail {
  flex: 1;

  .creator-name {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 2px;
  }

  .creator-desc {
    font-size: 12px;
    color: $text-muted;
  }
}

.work-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 16px;
}

.license-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: $shadow-sm;
  margin-bottom: 20px;
}

.license-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.license-card {
  border: 2px solid $border-color;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: $transition-base;
  position: relative;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary-color;
    background: rgba(30, 64, 175, 0.02);

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 32px 32px 0;
      border-color: transparent $primary-color transparent transparent;
    }
  }
}

.license-header {
  margin-bottom: 12px;

  h4 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
  }
}

.license-price {
  color: $danger-color;
  display: flex;
  align-items: baseline;

  .symbol {
    font-size: 14px;
    font-weight: 600;
  }

  .value {
    font-size: 28px;
    font-weight: 700;
  }
}

.license-desc {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 16px;
}

.license-features {
  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.purchase-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: $shadow-sm;
}

.price-summary {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-light;

  .label {
    font-size: 14px;
    color: $text-secondary;
  }

  .price {
    font-size: 32px;
    font-weight: 700;
    color: $danger-color;
  }
}

.purchase-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .buy-btn {
    flex: 2;
    height: 48px;
    font-size: 16px;
  }

  .inquiry-btn {
    flex: 1;
    height: 48px;
    font-size: 16px;
  }
}

.purchase-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-muted;
}

.detail-bottom {
  background: #fff;
  border-radius: 12px;
  box-shadow: $shadow-sm;
  padding: 24px;
  margin-bottom: 32px;
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 24px;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 500;
  }
}

.tab-content {
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }
  }

  .intro-text {
    font-size: 14px;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: 8px;
  }
}

.scene-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.lyrics-wrapper {
  position: relative;
  max-height: 500px;
  overflow: hidden;

  &.blurred {
    .lyrics-text {
      filter: blur(4px);
      user-select: none;
    }
  }
}

.lyrics-text {
  text-align: center;
  padding: 20px;

  p {
    font-size: 15px;
    color: $text-secondary;
    line-height: 2.2;
    margin-bottom: 0;
  }
}

.lyrics-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #fff 30%, transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 40px;
}

.mask-content {
  text-align: center;

  p {
    font-size: 14px;
    color: $text-secondary;
    margin: 12px 0 16px;
  }
}

.score-preview {
  .score-images {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;
  }

  .score-page {
    position: relative;
    border: 1px solid $border-color;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      display: block;
    }
  }

  .score-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 32px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.1);
    white-space: nowrap;
  }

  .score-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: $text-muted;
    justify-content: center;
  }
}

.recommend-section {
  .work-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .work-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    transition: $transition-base;
    box-shadow: $shadow-sm;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }

  .work-cover {
    position: relative;
    aspect-ratio: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .cover-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: $transition-base;
  }

  .work-card:hover .cover-overlay {
    opacity: 1;
  }

  .play-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    color: $primary-color;
  }

  .work-info {
    padding: 14px;
  }

  .work-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 6px;
  }

  .work-creator {
    font-size: 12px;
    color: $text-muted;
    margin-bottom: 8px;
  }

  .work-price {
    font-size: 16px;
    font-weight: 700;
    color: $danger-color;
  }
}
</style>
