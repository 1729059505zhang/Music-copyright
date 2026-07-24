<template>
  <div class="favorites-page">
    <div class="filter-bar">
      <div class="filter-left">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索收藏的作品" 
          style="width: 280px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="filterGenre" placeholder="曲风分类" style="width: 140px" clearable>
          <el-option label="流行" value="pop" />
          <el-option label="民谣" value="folk" />
          <el-option label="电子" value="electronic" />
          <el-option label="古风" value="ancient" />
          <el-option label="摇滚" value="rock" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <div class="filter-right">
        <span class="count-text">共收藏 <span class="highlight">{{ total }}</span> 首作品</span>
      </div>
    </div>

    <div v-if="favoriteList.length > 0" class="work-grid">
      <div 
        v-for="item in favoriteList" 
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
          <div v-if="item.exclusive" class="exclusive-tag">独家</div>
          <el-button 
            circle 
            size="small" 
            class="favorite-btn"
            @click.stop="removeFavorite(item)"
          >
            <el-icon color="#ef4444"><Close /></el-icon>
          </el-button>
        </div>
        <div class="work-info">
          <h3 class="work-title text-ellipsis">{{ item.title }}</h3>
          <div class="work-creator">{{ item.creator }}</div>
          <div class="work-tags">
            <el-tag size="small" type="info" effect="plain">{{ item.genre }}</el-tag>
          </div>
          <div class="work-bottom">
            <div class="work-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ item.price }}</span>
              <span class="price-unit">起</span>
            </div>
            <el-button type="primary" size="small" @click.stop="handleBuy(item)">
              购买
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <el-empty description="暂无收藏的作品">
        <template #image>
          <div class="empty-icon">
            <el-icon :size="64" color="#cbd5e1"><Star /></el-icon>
          </div>
        </template>
        <el-button type="primary" @click="goToMarket">去逛逛</el-button>
      </el-empty>
    </div>

    <div v-if="favoriteList.length > 0" class="pagination-wrapper">
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchKeyword = ref('')
const filterGenre = ref('')
const total = ref(128)

const pagination = reactive({
  page: 1,
  pageSize: 12
})

const favoriteList = ref([
  {
    id: 1,
    title: '夏日微风',
    cover: 'https://picsum.photos/300/300?random=1',
    creator: '李音乐',
    genre: '流行',
    price: 899,
    exclusive: true
  },
  {
    id: 2,
    title: '星空下的约定',
    cover: 'https://picsum.photos/300/300?random=2',
    creator: '王创作',
    genre: '民谣',
    price: 1299,
    exclusive: false
  },
  {
    id: 3,
    title: '江南烟雨',
    cover: 'https://picsum.photos/300/300?random=4',
    creator: '古风韵',
    genre: '古风',
    price: 2999,
    exclusive: true
  },
  {
    id: 4,
    title: '电子狂欢',
    cover: 'https://picsum.photos/300/300?random=3',
    creator: 'DJ小飞',
    genre: '电子',
    price: 599,
    exclusive: false
  },
  {
    id: 5,
    title: '城市夜晚',
    cover: 'https://picsum.photos/300/300?random=5',
    creator: '都市音乐人',
    genre: 'R&B',
    price: 1599,
    exclusive: false
  },
  {
    id: 6,
    title: '追梦赤子心',
    cover: 'https://picsum.photos/300/300?random=6',
    creator: '摇滚青年',
    genre: '摇滚',
    price: 1899,
    exclusive: true
  },
  {
    id: 7,
    title: '午后咖啡',
    cover: 'https://picsum.photos/300/300?random=7',
    creator: '爵士猫',
    genre: '爵士',
    price: 2499,
    exclusive: false
  },
  {
    id: 8,
    title: '森林秘境',
    cover: 'https://picsum.photos/300/300?random=8',
    creator: '自然之声',
    genre: '纯音乐',
    price: 799,
    exclusive: false
  }
])

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const removeFavorite = (item) => {
  ElMessageBox.confirm(`确定要取消收藏「${item.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '再想想',
    type: 'warning'
  }).then(() => {
    const index = favoriteList.value.findIndex(f => f.id === item.id)
    if (index > -1) {
      favoriteList.value.splice(index, 1)
      total.value--
    }
    ElMessage.success('已取消收藏')
  }).catch(() => {})
}

const goToDetail = (id) => {
  router.push(`/market/${id}`)
}

const handleBuy = (item) => {
  router.push(`/market/${item.id}`)
}

const goToMarket = () => {
  router.push('/market')
}
</script>

<style scoped lang="scss">
.favorites-page {
  padding: 24px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.count-text {
  font-size: 14px;
  color: $text-secondary;

  .highlight {
    color: $primary-color;
    font-weight: 600;
  }
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.work-card {
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: $transition-base;

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
  background: rgba(0, 0, 0, 0.3);
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

.exclusive-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: #fff;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  opacity: 0;
  transition: $transition-base;
}

.work-card:hover .favorite-btn {
  opacity: 1;
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
  color: $text-secondary;
  margin-bottom: 8px;
}

.work-tags {
  margin-bottom: 12px;
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
    font-size: 18px;
    font-weight: 700;
  }

  .price-unit {
    font-size: 12px;
    color: $text-muted;
    margin-left: 2px;
  }
}

.empty-state {
  padding: 60px 0;
  text-align: center;

  .empty-icon {
    margin-bottom: 16px;
  }
}
</style>
