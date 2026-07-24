<template>
  <div class="lyric-list-page">
    <div class="search-bar">
      <el-input v-model="searchForm.keyword" placeholder="搜索作品标题、标签" style="width: 280px">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="searchForm.genre" placeholder="曲风" clearable style="width: 120px">
        <el-option label="全部曲风" value="" />
        <el-option label="流行" value="pop" />
        <el-option label="民谣" value="folk" />
        <el-option label="电子" value="electronic" />
        <el-option label="摇滚" value="rock" />
        <el-option label="古风" value="ancient" />
        <el-option label="R&B" value="rnb" />
        <el-option label="嘻哈" value="hiphop" />
      </el-select>
      <el-select v-model="searchForm.status" placeholder="状态" clearable style="width: 120px">
        <el-option label="全部状态" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已上架" value="online" />
        <el-option label="已下架" value="offline" />
        <el-option label="审核驳回" value="rejected" />
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
          上传词曲作品
        </el-button>
        <el-button :disabled="selectedRows.length === 0" @click="handleBatchOnline">
          批量上架
        </el-button>
        <el-button :disabled="selectedRows.length === 0" @click="handleBatchOffline">
          批量下架
        </el-button>
      </div>
      <div class="toolbar-right">
        <span class="total-text">共 {{ total }} 首作品</span>
      </div>
    </div>

    <el-table
      :data="tableData"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      border
      style="width: 100%"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="cover" label="封面" width="90">
        <template #default="{ row }">
          <div class="work-cover">
            <el-icon v-if="!row.cover"><Picture /></el-icon>
            <img v-else :src="row.cover" :alt="row.title" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="作品标题" min-width="180">
        <template #default="{ row }">
          <div class="work-title">
            <span class="title-text">{{ row.title }}</span>
            <div class="work-tags">
              <el-tag size="small" type="info" effect="plain">{{ row.genre }}</el-tag>
              <el-tag v-if="row.exclusive" size="small" type="warning" effect="plain">独家</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="bpm" label="BPM" width="80" align="center" />
      <el-table-column prop="price" label="授权价格" width="150" align="right">
        <template #default="{ row }">
          <div class="price-info">
            <span class="price">¥{{ row.price }}</span>
            <span class="price-type">起</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="getStatusType(row.status)" effect="light">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="销量" width="80" align="center" />
      <el-table-column prop="createdAt" label="创建时间" width="160" />
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button 
            v-if="row.status === 'offline' || row.status === 'rejected'" 
            type="success" 
            link 
            size="small"
            @click="handleOnline(row)"
          >
            上架
          </el-button>
          <el-button 
            v-if="row.status === 'online'" 
            type="warning" 
            link 
            size="small"
            @click="handleOffline(row)"
          >
            下架
          </el-button>
          <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
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
const selectedRows = ref([])
const total = ref(0)

const searchForm = reactive({
  keyword: '',
  genre: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { id: 1, title: '夏日微风', genre: '流行', bpm: 120, price: 299, status: 'online', sales: 156, createdAt: '2024-11-15 10:30', cover: '', exclusive: true },
  { id: 2, title: '城市夜曲', genre: '电子', bpm: 128, price: 399, status: 'online', sales: 89, createdAt: '2024-11-14 14:20', cover: '', exclusive: false },
  { id: 3, title: '追梦人', genre: '民谣', bpm: 90, price: 199, status: 'pending', sales: 0, createdAt: '2024-12-01 09:15', cover: '', exclusive: false },
  { id: 4, title: '海边的风', genre: '流行', bpm: 110, price: 259, status: 'online', sales: 234, createdAt: '2024-11-10 16:45', cover: '', exclusive: true },
  { id: 5, title: '星辰大海', genre: '摇滚', bpm: 135, price: 349, status: 'offline', sales: 67, createdAt: '2024-10-28 11:30', cover: '', exclusive: false },
  { id: 6, title: '江南雨', genre: '古风', bpm: 85, price: 299, status: 'rejected', sales: 0, createdAt: '2024-11-20 13:00', cover: '', exclusive: false },
  { id: 7, title: '午夜情歌', genre: 'R&B', bpm: 95, price: 279, status: 'online', sales: 123, createdAt: '2024-11-05 08:45', cover: '', exclusive: true },
  { id: 8, title: '街头狂想', genre: '嘻哈', bpm: 140, price: 229, status: 'online', sales: 56, createdAt: '2024-11-18 15:20', cover: '', exclusive: false },
  { id: 9, title: '春天的故事', genre: '民谣', bpm: 88, price: 179, status: 'pending', sales: 0, createdAt: '2024-12-01 10:00', cover: '', exclusive: false },
  { id: 10, title: '霓虹灯下', genre: '电子', bpm: 130, price: 329, status: 'online', sales: 178, createdAt: '2024-10-25 12:30', cover: '', exclusive: true }
])

total.value = 56

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    online: 'success',
    offline: 'info',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    pending: '待审核',
    online: '已上架',
    offline: '已下架',
    rejected: '审核驳回'
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
  searchForm.genre = ''
  searchForm.status = ''
  handleSearch()
}

const handleCreate = () => {
  router.push('/work/lyric/create')
}

const handleEdit = (row) => {
  router.push(`/work/lyric/${row.id}/edit`)
}

const handleOnline = (row) => {
  ElMessageBox.confirm(`确定要上架作品「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    row.status = 'pending'
    ElMessage.success('已提交上架审核')
  }).catch(() => {})
}

const handleOffline = (row) => {
  ElMessageBox.confirm(`确定要下架作品「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 'offline'
    ElMessage.success('下架成功')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除作品「${row.title}」吗？删除后不可恢复。`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleBatchOnline = () => {
  ElMessageBox.confirm(`确定要批量上架选中的 ${selectedRows.value.length} 个作品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('已提交批量上架审核')
  }).catch(() => {})
}

const handleBatchOffline = () => {
  ElMessageBox.confirm(`确定要批量下架选中的 ${selectedRows.value.length} 个作品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量下架成功')
  }).catch(() => {})
}

const handleSizeChange = (size) => {
  pagination.size = size
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
  handleSearch()
}
</script>

<style scoped lang="scss">
.lyric-list-page {
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

  .work-title {
    .title-text {
      display: block;
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 6px;
    }

    .work-tags {
      display: flex;
      gap: 6px;
    }
  }

  .price-info {
    .price {
      font-size: 16px;
      font-weight: 600;
      color: $primary-color;
    }

    .price-type {
      font-size: 12px;
      color: $text-muted;
      margin-left: 2px;
    }
  }

  .total-text {
    font-size: 13px;
    color: $text-muted;
  }
}
</style>
