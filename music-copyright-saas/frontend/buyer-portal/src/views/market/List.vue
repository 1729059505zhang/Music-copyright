<template>
  <div class="market-list">
    <div class="banner-section">
      <div class="banner-inner">
        <div class="banner-content">
          <h1>海量正版词曲，一站式采购</h1>
          <p>10万+优质音乐作品，灵活授权方案，助力您的项目成功</p>
          <div class="banner-search">
            <el-input v-model="searchKeyword" size="large" placeholder="搜索词曲作品、创作者、曲风...">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
              <template #append>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </div>
          <div class="hot-tags">
            <span class="tag-label">热门搜索：</span>
            <span v-for="tag in hotTags" :key="tag" class="hot-tag" @click="searchByTag(tag)">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="main-container">
      <aside class="filter-sidebar">
        <div class="filter-card">
          <h3 class="filter-title">筛选条件</h3>
          
          <div class="filter-section">
            <div class="filter-label">曲风分类</div>
            <div class="filter-options">
              <el-tag 
                v-for="genre in genreList" 
                :key="genre.value"
                :type="filters.genre === genre.value ? 'primary' : 'info'"
                effect="plain"
                class="filter-tag"
                @click="filters.genre = filters.genre === genre.value ? '' : genre.value"
              >
                {{ genre.label }}
              </el-tag>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">调性</div>
            <div class="filter-options">
              <el-tag 
                v-for="key in keyList" 
                :key="key.value"
                :type="filters.key === key.value ? 'primary' : 'info'"
                effect="plain"
                class="filter-tag"
                @click="filters.key = filters.key === key.value ? '' : key.value"
              >
                {{ key.label }}
              </el-tag>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">BPM范围</div>
            <div class="bpm-filter">
              <el-slider 
                v-model="filters.bpm" 
                range 
                :min="60" 
                :max="200"
                show-stops
              />
              <div class="bpm-value">{{ filters.bpm[0] }} - {{ filters.bpm[1] }} BPM</div>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">适用场景</div>
            <div class="filter-options">
              <el-tag 
                v-for="scene in sceneList" 
                :key="scene.value"
                :type="filters.scene === scene.value ? 'primary' : 'info'"
                effect="plain"
                class="filter-tag"
                @click="filters.scene = filters.scene === scene.value ? '' : scene.value"
              >
                {{ scene.label }}
              </el-tag>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">价格区间</div>
            <div class="price-filter">
              <el-radio-group v-model="filters.priceRange" size="default">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="0-500">500以下</el-radio-button>
                <el-radio-button label="500-2000">500-2000</el-radio-button>
                <el-radio-button label="2000-5000">2000-5000</el-radio-button>
                <el-radio-button label="5000+">5000以上</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">授权方式</div>
            <div class="filter-options">
              <el-checkbox v-model="filters.exclusive">可独家授权</el-checkbox>
              <el-checkbox v-model="filters.nonExclusive">非独家授权</el-checkbox>
            </div>
          </div>

          <div class="filter-section">
            <div class="filter-label">语言</div>
            <div class="filter-options">
              <el-tag 
                v-for="lang in languageList" 
                :key="lang.value"
                :type="filters.language === lang.value ? 'primary' : 'info'"
                effect="plain"
                class="filter-tag"
                @click="filters.language = filters.language === lang.value ? '' : lang.value"
              >
                {{ lang.label }}
              </el-tag>
            </div>
          </div>

          <div class="filter-actions">
            <el-button @click="resetFilters">重置</el-button>
            <el-button type="primary" @click="applyFilters">应用筛选</el-button>
          </div>
        </div>
      </aside>

      <div class="content-area">
        <div class="content-header">
          <div class="result-info">
            共找到 <span class="highlight">{{ total }}</span> 首作品
          </div>
          <div class="sort-bar">
            <span class="sort-label">排序：</span>
            <el-radio-group v-model="sortBy" size="default">
              <el-radio-button label="newest">最新上架</el-radio-button>
              <el-radio-button label="hot">最热门</el-radio-button>
              <el-radio-button label="price-asc">价格从低到高</el-radio-button>
              <el-radio-button label="price-desc">价格从高到低</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div class="work-grid">
          <div 
            v-for="work in workList" 
            :key="work.id" 
            class="work-card"
            @click="goToDetail(work.id)"
          >
            <div class="work-cover">
              <img :src="work.cover" :alt="work.title" />
              <div class="cover-overlay">
                <el-button circle size="large" class="play-btn">
                  <el-icon><VideoPlay /></el-icon>
                </el-button>
              </div>
              <div v-if="work.exclusive" class="exclusive-tag">独家</div>
              <div class="duration-tag">{{ work.duration }}</div>
            </div>
            <div class="work-info">
              <h3 class="work-title text-ellipsis">{{ work.title }}</h3>
              <div class="work-creator">
                <el-avatar :size="20" :src="work.creatorAvatar" />
                <span>{{ work.creator }}</span>
              </div>
              <div class="work-tags">
                <el-tag size="small" type="info" effect="plain">{{ work.genre }}</el-tag>
                <el-tag size="small" effect="plain">{{ work.key }}</el-tag>
              </div>
              <div class="work-bottom">
                <div class="work-price">
                  <span class="price-symbol">¥</span>
                  <span class="price-value">{{ work.price }}</span>
                  <span class="price-unit">起</span>
                </div>
                <el-button 
                  text 
                  type="primary" 
                  class="favorite-btn"
                  :class="{ 'is-favorite': work.favorite }"
                  @click.stop="toggleFavorite(work)"
                >
                  <el-icon><Star v-if="work.favorite" /><Star v-else :fill="false" /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[12, 24, 48]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const searchKeyword = ref('')
const sortBy = ref('newest')
const total = ref(1286)

const hotTags = ['流行', '电子', '古风', '摇滚', '民谣', '纯音乐', '励志']

const filters = reactive({
  genre: '',
  key: '',
  bpm: [60, 200],
  scene: '',
  priceRange: 'all',
  exclusive: false,
  nonExclusive: false,
  language: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 12
})

const genreList = [
  { label: '流行', value: 'pop' },
  { label: '摇滚', value: 'rock' },
  { label: '民谣', value: 'folk' },
  { label: '电子', value: 'electronic' },
  { label: '古风', value: 'ancient' },
  { label: 'R&B', value: 'rnb' },
  { label: '嘻哈', value: 'hiphop' },
  { label: '爵士', value: 'jazz' },
  { label: '古典', value: 'classical' },
  { label: '纯音乐', value: 'instrumental' }
]

const keyList = [
  { label: 'C大调', value: 'C' },
  { label: 'G大调', value: 'G' },
  { label: 'D大调', value: 'D' },
  { label: 'A小调', value: 'Am' },
  { label: 'E小调', value: 'Em' },
  { label: 'F大调', value: 'F' }
]

const sceneList = [
  { label: '广告宣传片', value: 'ad' },
  { label: '影视配乐', value: 'film' },
  { label: '游戏音乐', value: 'game' },
  { label: '短视频', value: 'short_video' },
  { label: '电商直播', value: 'live' },
  { label: '企业年会', value: 'annual' },
  { label: '婚礼庆典', value: 'wedding' },
  { label: '播客配乐', value: 'podcast' }
]

const languageList = [
  { label: '国语', value: 'mandarin' },
  { label: '粤语', value: 'cantonese' },
  { label: '英语', value: 'english' },
  { label: '日语', value: 'japanese' },
  { label: '韩语', value: 'korean' },
  { label: '纯音乐', value: 'instrumental' }
]

const workList = ref([
  {
    id: 1,
    title: '夏日微风',
    cover: 'https://picsum.photos/400/400?random=1',
    creator: '李音乐',
    creatorAvatar: 'https://picsum.photos/100/100?random=101',
    genre: '流行',
    key: 'C大调',
    bpm: 120,
    duration: '3:45',
    price: 899,
    exclusive: true,
    favorite: false
  },
  {
    id: 2,
    title: '星空下的约定',
    cover: 'https://picsum.photos/400/400?random=2',
    creator: '王创作',
    creatorAvatar: 'https://picsum.photos/100/100?random=102',
    genre: '民谣',
    key: 'G大调',
    bpm: 95,
    duration: '4:20',
    price: 1299,
    exclusive: false,
    favorite: true
  },
  {
    id: 3,
    title: '电子狂欢',
    cover: 'https://picsum.photos/400/400?random=3',
    creator: 'DJ小飞',
    creatorAvatar: 'https://picsum.photos/100/100?random=103',
    genre: '电子',
    key: 'A小调',
    bpm: 128,
    duration: '3:30',
    price: 599,
    exclusive: false,
    favorite: false
  },
  {
    id: 4,
    title: '江南烟雨',
    cover: 'https://picsum.photos/400/400?random=4',
    creator: '古风韵',
    creatorAvatar: 'https://picsum.photos/100/100?random=104',
    genre: '古风',
    key: 'D大调',
    bpm: 80,
    duration: '4:50',
    price: 2999,
    exclusive: true,
    favorite: false
  },
  {
    id: 5,
    title: '城市夜晚',
    cover: 'https://picsum.photos/400/400?random=5',
    creator: '都市音乐人',
    creatorAvatar: 'https://picsum.photos/100/100?random=105',
    genre: 'R&B',
    key: 'E小调',
    bpm: 100,
    duration: '3:55',
    price: 1599,
    exclusive: false,
    favorite: true
  },
  {
    id: 6,
    title: '追梦赤子心',
    cover: 'https://picsum.photos/400/400?random=6',
    creator: '摇滚青年',
    creatorAvatar: 'https://picsum.photos/100/100?random=106',
    genre: '摇滚',
    key: 'C大调',
    bpm: 140,
    duration: '4:15',
    price: 1899,
    exclusive: true,
    favorite: false
  },
  {
    id: 7,
    title: '午后咖啡',
    cover: 'https://picsum.photos/400/400?random=7',
    creator: '爵士猫',
    creatorAvatar: 'https://picsum.photos/100/100?random=107',
    genre: '爵士',
    key: 'F大调',
    bpm: 110,
    duration: '5:00',
    price: 2499,
    exclusive: false,
    favorite: false
  },
  {
    id: 8,
    title: '森林秘境',
    cover: 'https://picsum.photos/400/400?random=8',
    creator: '自然之声',
    creatorAvatar: 'https://picsum.photos/100/100?random=108',
    genre: '纯音乐',
    key: 'G大调',
    bpm: 70,
    duration: '6:30',
    price: 799,
    exclusive: false,
    favorite: true
  },
  {
    id: 9,
    title: '街头派对',
    cover: 'https://picsum.photos/400/400?random=9',
    creator: '嘻哈达人',
    creatorAvatar: 'https://picsum.photos/100/100?random=109',
    genre: '嘻哈',
    key: 'A小调',
    bpm: 90,
    duration: '3:20',
    price: 1099,
    exclusive: false,
    favorite: false
  },
  {
    id: 10,
    title: '月光奏鸣曲',
    cover: 'https://picsum.photos/400/400?random=10',
    creator: '古典乐派',
    creatorAvatar: 'https://picsum.photos/100/100?random=110',
    genre: '古典',
    key: 'C#小调',
    bpm: 66,
    duration: '7:00',
    price: 3999,
    exclusive: true,
    favorite: false
  },
  {
    id: 11,
    title: '阳光明媚',
    cover: 'https://picsum.photos/400/400?random=11',
    creator: '小清新',
    creatorAvatar: 'https://picsum.photos/100/100?random=111',
    genre: '流行',
    key: 'D大调',
    bpm: 105,
    duration: '3:15',
    price: 699,
    exclusive: false,
    favorite: false
  },
  {
    id: 12,
    title: '赛博朋克',
    cover: 'https://picsum.photos/400/400?random=12',
    creator: '未来之声',
    creatorAvatar: 'https://picsum.photos/100/100?random=112',
    genre: '电子',
    key: 'E小调',
    bpm: 140,
    duration: '4:00',
    price: 1999,
    exclusive: true,
    favorite: true
  }
])

const handleSearch = () => {
  ElMessage.info(`搜索：${searchKeyword.value}`)
}

const searchByTag = (tag) => {
  searchKeyword.value = tag
  handleSearch()
}

const resetFilters = () => {
  filters.genre = ''
  filters.key = ''
  filters.bpm = [60, 200]
  filters.scene = ''
  filters.priceRange = 'all'
  filters.exclusive = false
  filters.nonExclusive = false
  filters.language = ''
}

const applyFilters = () => {
  ElMessage.success('筛选条件已应用')
}

const toggleFavorite = (work) => {
  work.favorite = !work.favorite
  ElMessage.success(work.favorite ? '已收藏' : '已取消收藏')
}

const goToDetail = (id) => {
  router.push(`/market/${id}`)
}
</script>

<style scoped lang="scss">
.market-list {
  background: $bg-body;
  min-height: calc(100vh - #{$header-height});
}

.banner-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: 60px 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: -50px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
}

.banner-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  z-index: 1;
}

.banner-content {
  text-align: center;
  color: #fff;

  h1 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 32px;
  }
}

.banner-search {
  max-width: 600px;
  margin: 0 auto 20px;

  :deep(.el-input__wrapper) {
    border-radius: 8px 0 0 8px;
  }

  :deep(.el-input-group__append) {
    border-radius: 0 8px 8px 0;
    padding: 0;

    .el-button {
      height: 100%;
      border: none;
    }
  }
}

.hot-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .tag-label {
    font-size: 13px;
    opacity: 0.8;
  }
}

.hot-tag {
  font-size: 13px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
}

.main-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  gap: 24px;
}

.filter-sidebar {
  width: 260px;
  flex-shrink: 0;
}

.filter-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: $shadow-sm;
  position: sticky;
  top: 80px;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid $border-light;
}

.filter-section {
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 24px;
  }
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 12px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  cursor: pointer;
  font-size: 12px;
}

.bpm-filter {
  padding: 0 8px;

  .bpm-value {
    font-size: 13px;
    color: $text-secondary;
    text-align: center;
    margin-top: 8px;
  }
}

.price-filter {
  :deep(.el-radio-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  :deep(.el-radio-button__inner) {
    font-size: 12px;
    padding: 8px 10px;
  }
}

.filter-actions {
  display: flex;
  gap: 12px;

  .el-button {
    flex: 1;
  }
}

.content-area {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-info {
  font-size: 14px;
  color: $text-secondary;

  .highlight {
    color: $primary-color;
    font-weight: 600;
  }
}

.sort-bar {
  display: flex;
  align-items: center;
  gap: 12px;

  .sort-label {
    font-size: 14px;
    color: $text-secondary;
  }
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.work-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: $transition-base;
  box-shadow: $shadow-sm;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;

    .cover-overlay {
      opacity: 1;
    }
  }
}

.work-cover {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: $transition-base;
}

.play-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: $primary-color;

  &:hover {
    background: #fff;
    color: $primary-color;
  }
}

.exclusive-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: #fff;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.duration-tag {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.work-info {
  padding: 16px;
}

.work-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 10px;
}

.work-creator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 12px;

  .el-avatar {
    width: 20px;
    height: 20px;
  }
}

.work-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
}

.work-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.work-price {
  display: flex;
  align-items: baseline;
  color: $danger-color;

  .price-symbol {
    font-size: 12px;
    margin-right: 2px;
  }

  .price-value {
    font-size: 20px;
    font-weight: 700;
  }

  .price-unit {
    font-size: 12px;
    color: $text-muted;
    margin-left: 2px;
  }
}

.favorite-btn {
  color: $text-muted;

  &.is-favorite {
    color: #f59e0b;
  }

  &:hover {
    color: #f59e0b;
  }
}
</style>
