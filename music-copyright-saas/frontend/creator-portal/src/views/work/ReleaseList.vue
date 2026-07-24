<template>
  <div class="release-list-page">
    <div class="search-bar">
      <el-input v-model="searchForm.keyword" placeholder="搜索作品名称、歌手" style="width: 280px">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="searchForm.status" placeholder="发行状态" clearable style="width: 140px">
        <el-option label="全部状态" value="" />
        <el-option label="待发行" value="pending" />
        <el-option label="发行中" value="releasing" />
        <el-option label="已发行" value="released" />
        <el-option label="已下架" value="offline" />
      </el-select>
      <el-select v-model="searchForm.platform" placeholder="平台" clearable style="width: 140px">
        <el-option label="全部平台" value="" />
        <el-option label="网易云音乐" value="netease" />
        <el-option label="QQ音乐" value="qq" />
        <el-option label="酷狗音乐" value="kugou" />
        <el-option label="酷我音乐" value="kuwo" />
        <el-option label="抖音音乐" value="douyin" />
      </el-select>
      <el-button type="primary" @click="handleSearch">
        <el-icon><Search /></el-icon>
        搜索
      </el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <div class="table-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          上传发行作品
        </el-button>
        <el-alert
          title="发行作品功能需后台开通后方可使用"
          type="info"
          :closable="false"
          show-icon
          class="feature-tip"
        />
      </div>
      <div class="toolbar-right">
        <span class="total-text">共 {{ total }} 首作品</span>
      </div>
    </div>

    <el-table :data="tableData" v-loading="loading" border style="width: 100%">
      <el-table-column prop="cover" label="封面" width="90">
        <template #default="{ row }">
          <div class="work-cover">
            <el-icon v-if="!row.cover"><Picture /></el-icon>
            <img v-else :src="row.cover" :alt="row.title" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="歌曲名称" min-width="160">
        <template #default="{ row }">
          <div class="work-info">
            <span class="title">{{ row.title }}</span>
            <span class="artist">{{ row.artist }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="album" label="专辑" width="140" />
      <el-table-column prop="isrc" label="ISRC编码" width="140">
        <template #default="{ row }">
          <span class="isrc-code">{{ row.isrc || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="platforms" label="发行平台" min-width="200">
        <template #default="{ row }">
          <div class="platform-tags">
            <el-tag 
              v-for="platform in row.platforms" 
              :key="platform"
              size="small"
              type="info"
              effect="plain"
            >
              {{ getPlatformName(platform) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="发行状态" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="getStatusType(row.status)" effect="light">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="releaseDate" label="发行时间" width="140" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="info" link size="small" @click="handleViewData(row)">数据</el-button>
          <el-button type="danger" link size="small" @click="handleOffline(row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="total"
        :page-sizes="[10, 20, 50]"
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

const loading = ref(false)
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  status: '',
  platform: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { 
    id: 1, 
    title: '夏日微风', 
    artist: '张三', 
    album: '夏日专辑', 
    isrc: 'CN-A01-24-00001',
    platforms: ['netease', 'qq', 'kugou'],
    status: 'released',
    releaseDate: '2024-11-01',
    cover: ''
  },
  { 
    id: 2, 
    title: '城市夜曲', 
    artist: '李四', 
    album: '城市之声', 
    isrc: 'CN-A01-24-00002',
    platforms: ['netease', 'qq', 'douyin'],
    status: 'releasing',
    releaseDate: '2024-12-05',
    cover: ''
  },
  { 
    id: 3, 
    title: '追梦人', 
    artist: '王五', 
    album: '追梦人', 
    isrc: '-',
    platforms: ['netease', 'qq', 'kugou', 'kuwo', 'douyin'],
    status: 'pending',
    releaseDate: '-',
    cover: ''
  },
  { 
    id: 4, 
    title: '海边的风', 
    artist: '赵六', 
    album: '海风', 
    isrc: 'CN-A01-24-00004',
    platforms: ['netease', 'qq'],
    status: 'released',
    releaseDate: '2024-10-15',
    cover: ''
  },
  { 
    id: 5, 
    title: '星辰大海', 
    artist: '孙七', 
    album: '星辰', 
    isrc: 'CN-A01-24-00005',
    platforms: ['netease', 'qq', 'kugou', 'kuwo'],
    status: 'offline',
    releaseDate: '2024-08-20',
    cover: ''
  }
])

total.value = 23

const getPlatformName = (platform) => {
  const map = {
    netease: '网易云',
    qq: 'QQ音乐',
    kugou: '酷狗',
    kuwo: '酷我',
    douyin: '抖音'
  }
  return map[platform] || platform
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    releasing: 'primary',
    released: 'success',
    offline: 'info'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    pending: '待发行',
    releasing: '发行中',
    released: '已发行',
    offline: '已下架'
  }
  return map[status] || status
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.platform = ''
  handleSearch()
}

const handleCreate = () => {
  router.push('/work/release/create')
}

const handleEdit = (row) => {
  router.push(`/work/release/${row.id}/edit`)
}

const handleViewData = (row) => {
  ElMessage.info('查看播放数据功能开发中')
}

const handleOffline = (row) => {
  ElMessageBox.confirm(`确定要下架作品「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('下架申请已提交')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.release-list-page {
  .work-cover {
    width: 56px;
    height: 56px;
    border-radius: $border-radius-sm;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .work-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-weight: 500;
      color: $text-primary;
    }

    .artist {
      font-size: 12px;
      color: $text-muted;
    }
  }

  .isrc-code {
    font-family: monospace;
    font-size: 12px;
    color: $text-secondary;
  }

  .platform-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .feature-tip {
    margin-left: 16px;
  }

  .total-text {
    font-size: 13px;
    color: $text-muted;
  }
}
</style>
