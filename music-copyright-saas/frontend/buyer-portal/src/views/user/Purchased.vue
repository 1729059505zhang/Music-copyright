<template>
  <div class="purchased-page">
    <div class="filter-bar">
      <div class="filter-left">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索作品名称、创作者" 
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
        <el-radio-group v-model="viewMode" size="default">
          <el-radio-button value="grid">
            <el-icon><Grid /></el-icon>
          </el-radio-button>
          <el-radio-button value="list">
            <el-icon><List /></el-icon>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div v-if="viewMode === 'grid'" class="work-grid">
      <div 
        v-for="item in workList" 
        :key="item.id" 
        class="work-card"
      >
        <div class="work-cover">
          <img :src="item.cover" :alt="item.title" />
          <div class="cover-overlay">
            <el-button circle size="large" class="play-btn">
              <el-icon><VideoPlay /></el-icon>
            </el-button>
          </div>
          <div class="license-tag">{{ item.licenseType }}</div>
        </div>
        <div class="work-info">
          <h3 class="work-title text-ellipsis">{{ item.title }}</h3>
          <div class="work-creator">{{ item.creator }}</div>
          <div class="work-meta">
            <span>{{ item.genre }}</span>
            <span>{{ item.duration }}</span>
          </div>
          <div class="work-actions">
            <el-button type="primary" size="small" @click="downloadWork(item)">
              <el-icon><Download /></el-icon>
              下载
            </el-button>
            <el-button size="small" @click="viewCertificate(item)">
              <el-icon><Document /></el-icon>
              凭证
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="work-list-view">
      <el-table :data="workList" stripe style="width: 100%">
        <el-table-column label="作品信息" min-width="300">
          <template #default="{ row }">
            <div class="table-work-info">
              <img :src="row.cover" :alt="row.title" class="table-cover" />
              <div class="table-work-detail">
                <div class="table-work-title">{{ row.title }}</div>
                <div class="table-work-creator">{{ row.creator }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="genre" label="曲风" width="100" />
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="licenseType" label="授权类型" width="120" />
        <el-table-column prop="purchaseTime" label="购买时间" width="180" />
        <el-table-column prop="amount" label="购买金额" width="120">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="downloadWork(row)">
              <el-icon><Download /></el-icon>
              下载
            </el-button>
            <el-button size="small" @click="viewCertificate(row)">
              <el-icon><Document /></el-icon>
              凭证
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterGenre = ref('')
const viewMode = ref('grid')
const total = ref(56)

const pagination = reactive({
  page: 1,
  pageSize: 12
})

const workList = ref([
  {
    id: 1,
    title: '夏日微风',
    cover: 'https://picsum.photos/300/300?random=1',
    creator: '李音乐',
    genre: '流行',
    duration: '3:45',
    licenseType: '商业授权',
    purchaseTime: '2024-01-15 14:30',
    amount: '899.00'
  },
  {
    id: 2,
    title: '星空下的约定',
    cover: 'https://picsum.photos/300/300?random=2',
    creator: '王创作',
    genre: '民谣',
    duration: '4:20',
    licenseType: '独家授权',
    purchaseTime: '2024-01-12 10:15',
    amount: '5,999.00'
  },
  {
    id: 3,
    title: '江南烟雨',
    cover: 'https://picsum.photos/300/300?random=4',
    creator: '古风韵',
    genre: '古风',
    duration: '4:50',
    licenseType: '商业授权',
    purchaseTime: '2024-01-10 16:45',
    amount: '2,999.00'
  },
  {
    id: 4,
    title: '城市夜晚',
    cover: 'https://picsum.photos/300/300?random=5',
    creator: '都市音乐人',
    genre: 'R&B',
    duration: '3:55',
    licenseType: '商业授权',
    purchaseTime: '2024-01-08 09:20',
    amount: '1,599.00'
  },
  {
    id: 5,
    title: '追梦赤子心',
    cover: 'https://picsum.photos/300/300?random=6',
    creator: '摇滚青年',
    genre: '摇滚',
    duration: '4:15',
    licenseType: '商业授权',
    purchaseTime: '2024-01-05 18:55',
    amount: '1,899.00'
  },
  {
    id: 6,
    title: '森林秘境',
    cover: 'https://picsum.photos/300/300?random=8',
    creator: '自然之声',
    genre: '纯音乐',
    duration: '6:30',
    licenseType: '个人授权',
    purchaseTime: '2024-01-03 11:30',
    amount: '799.00'
  },
  {
    id: 7,
    title: '午后咖啡',
    cover: 'https://picsum.photos/300/300?random=7',
    creator: '爵士猫',
    genre: '爵士',
    duration: '5:00',
    licenseType: '商业授权',
    purchaseTime: '2023-12-28 14:20',
    amount: '2,499.00'
  },
  {
    id: 8,
    title: '月光奏鸣曲',
    cover: 'https://picsum.photos/300/300?random=10',
    creator: '古典乐派',
    genre: '古典',
    duration: '7:00',
    licenseType: '商业授权',
    purchaseTime: '2023-12-25 09:45',
    amount: '3,999.00'
  }
])

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const downloadWork = (item) => {
  ElMessage.success(`开始下载：${item.title}`)
}

const viewCertificate = (item) => {
  ElMessage.info(`查看授权凭证：${item.title}`)
}
</script>

<style scoped lang="scss">
.purchased-page {
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

.work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.work-card {
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
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

.license-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(30, 64, 175, 0.9);
  color: #fff;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
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

.work-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: $text-muted;
  margin-bottom: 12px;
}

.work-actions {
  display: flex;
  gap: 8px;

  .el-button {
    flex: 1;
  }
}

.work-list-view {
  .table-work-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .table-cover {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
  }

  .table-work-title {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 4px;
  }

  .table-work-creator {
    font-size: 12px;
    color: $text-secondary;
  }

  .price-text {
    color: $danger-color;
    font-weight: 600;
  }
}
</style>
