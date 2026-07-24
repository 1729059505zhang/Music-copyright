<template>
  <div class="copyright-list-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">版权登记记录</h2>
          <p class="page-subtitle">查看您的版权登记申请记录</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="goToApply">
            <el-icon><Plus /></el-icon>
            新增登记
          </el-button>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="search-bar">
          <el-input v-model="searchForm.keyword" placeholder="作品名称/登记号" style="width: 260px">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.status" placeholder="登记状态" clearable style="width: 140px">
            <el-option label="全部状态" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="审核中" value="reviewing" />
            <el-option label="已登记" value="registered" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="workTitle" label="作品名称" min-width="160">
            <template #default="{ row }">
              <div class="work-cell">
                <div class="work-cover">
                  <el-icon><Picture /></el-icon>
                </div>
                <span>{{ row.workTitle }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="registerNo" label="登记号" width="180">
            <template #default="{ row }">
              <span v-if="row.registerNo" class="register-no">{{ row.registerNo }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="workType" label="作品类型" width="100" />
          <el-table-column prop="applyType" label="申请类型" width="100" />
          <el-table-column prop="status" label="状态" width="110">
            <template #default="{ row }">
              <el-tag size="small" :type="getStatusType(row.status)" effect="light">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyDate" label="申请日期" width="120" />
          <el-table-column prop="expectDate" label="预计完成" width="120">
            <template #default="{ row }">
              {{ row.expectDate || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleDetail(row)">
                详情
              </el-button>
              <el-button 
                v-if="row.status === 'registered'"
                type="success" 
                link 
                size="small"
                @click="handleViewCert(row)"
              >
                查看证书
              </el-button>
              <el-button 
                v-if="row.status === 'registered'"
                type="primary" 
                link 
                size="small"
                @click="handleDownloadCert(row)"
              >
                下载证书
              </el-button>
              <el-button 
                v-if="row.status === 'rejected'"
                type="warning" 
                link 
                size="small"
                @click="handleReapply(row)"
              >
                重新申请
              </el-button>
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

      <el-dialog v-model="detailVisible" title="版权登记详情" width="640px">
        <div class="copyright-detail" v-if="currentItem">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="作品名称" :span="2">{{ currentItem.workTitle }}</el-descriptions-item>
            <el-descriptions-item label="登记号">
              {{ currentItem.registerNo || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusType(currentItem.status)" effect="light">
                {{ getStatusLabel(currentItem.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="作品类型">{{ currentItem.workType }}</el-descriptions-item>
            <el-descriptions-item label="申请类型">{{ currentItem.applyType }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{ currentItem.author }}</el-descriptions-item>
            <el-descriptions-item label="创作完成日期">{{ currentItem.createDate }}</el-descriptions-item>
            <el-descriptions-item label="首次发表日期">{{ currentItem.publishDate }}</el-descriptions-item>
            <el-descriptions-item label="申请日期">{{ currentItem.applyDate }}</el-descriptions-item>
            <el-descriptions-item label="预计完成">{{ currentItem.expectDate || '-' }}</el-descriptions-item>
            <el-descriptions-item label="登记完成日期" :span="2">
              {{ currentItem.completeDate || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="驳回原因" :span="2" v-if="currentItem.status === 'rejected'">
              <div class="reject-reason">{{ currentItem.rejectReason }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <template #footer>
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button 
            v-if="currentItem?.status === 'registered'"
            type="primary" 
            @click="handleDownloadCert(currentItem)"
          >
            下载证书
          </el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="certVisible" title="著作权登记证书" width="600px">
        <div class="cert-preview">
          <div class="cert-paper">
            <div class="cert-header">
              <div class="cert-title">作品著作权登记证书</div>
              <div class="cert-no">登记号：{{ currentItem?.registerNo }}</div>
            </div>
            <div class="cert-body">
              <p>兹证明，作品名称：<b>{{ currentItem?.workTitle }}</b></p>
              <p>作者：<b>{{ currentItem?.author }}</b></p>
              <p>创作完成日期：<b>{{ currentItem?.createDate }}</b></p>
              <p>首次发表日期：<b>{{ currentItem?.publishDate }}</b></p>
              <p>经中国版权保护中心审核，根据《计算机软件保护条例》和《计算机软件著作权登记办法》的规定，对上述作品予以登记。</p>
            </div>
            <div class="cert-footer">
              <div class="cert-seal">中国版权保护中心</div>
              <div class="cert-date">{{ currentItem?.completeDate }}</div>
            </div>
          </div>
        </div>
        <template #footer>
          <el-button @click="certVisible = false">关闭</el-button>
          <el-button type="primary" @click="handleDownloadCert(currentItem)">
            <el-icon><Download /></el-icon>
            下载证书
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loading = ref(false)
const total = ref(0)
const detailVisible = ref(false)
const certVisible = ref(false)
const currentItem = ref(null)

const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { 
    id: 1, 
    workTitle: '夏日微风', 
    registerNo: '国作登字-2024-B-00012345', 
    workType: '音乐作品', 
    applyType: '普通',
    status: 'registered', 
    author: '张三',
    createDate: '2024-06-15',
    publishDate: '2024-07-01',
    applyDate: '2024-09-01',
    expectDate: '2024-10-15',
    completeDate: '2024-10-10'
  },
  { 
    id: 2, 
    workTitle: '城市夜曲', 
    registerNo: '国作登字-2024-B-00012346', 
    workType: '音乐作品', 
    applyType: '加急',
    status: 'registered', 
    author: '张三',
    createDate: '2024-08-10',
    publishDate: '2024-08-20',
    applyDate: '2024-10-15',
    expectDate: '2024-10-30',
    completeDate: '2024-10-25'
  },
  { 
    id: 3, 
    workTitle: '追梦人', 
    registerNo: '-', 
    workType: '歌词作品', 
    applyType: '普通',
    status: 'reviewing', 
    author: '张三',
    createDate: '2024-10-01',
    publishDate: '2024-10-15',
    applyDate: '2024-11-20',
    expectDate: '2024-12-25',
    completeDate: '-'
  },
  { 
    id: 4, 
    workTitle: '海边的风', 
    registerNo: '-', 
    workType: '音乐作品', 
    applyType: '普通',
    status: 'pending', 
    author: '张三',
    createDate: '2024-09-20',
    publishDate: '2024-10-01',
    applyDate: '2024-12-01',
    expectDate: '2025-01-10',
    completeDate: '-'
  },
  { 
    id: 5, 
    workTitle: '星辰大海', 
    registerNo: '-', 
    workType: '音乐作品', 
    applyType: '普通',
    status: 'rejected', 
    author: '张三',
    createDate: '2024-05-10',
    publishDate: '2024-06-01',
    applyDate: '2024-08-15',
    expectDate: '-',
    completeDate: '-',
    rejectReason: '提交的身份证明材料不清晰，请重新上传清晰的身份证正反面照片。作品样本文件损坏，请重新上传完整的音频文件。'
  }
])

total.value = 8

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    reviewing: 'primary',
    registered: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    pending: '待审核',
    reviewing: '审核中',
    registered: '已登记',
    rejected: '已驳回'
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
  searchForm.dateRange = []
  handleSearch()
}

const goToApply = () => {
  router.push('/copyright/apply')
}

const handleDetail = (row) => {
  currentItem.value = row
  detailVisible.value = true
}

const handleViewCert = (row) => {
  currentItem.value = row
  certVisible.value = true
}

const handleDownloadCert = (row) => {
  ElMessage.success('证书下载中...')
}

const handleReapply = (row) => {
  router.push('/copyright/apply')
}
</script>

<style scoped lang="scss">
.copyright-list-page {
  .work-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .work-cover {
    width: 44px;
    height: 44px;
    border-radius: $border-radius-sm;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .register-no {
    font-family: monospace;
    font-size: 12px;
    color: $text-secondary;
  }

  .reject-reason {
    color: $danger-color;
    font-size: 13px;
    line-height: 1.6;
  }

  .cert-preview {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .cert-paper {
    width: 100%;
    max-width: 480px;
    background: linear-gradient(135deg, #fef9e7 0%, #fde68a 100%);
    border: 3px double #b45309;
    border-radius: 8px;
    padding: 40px 32px;
    text-align: center;
  }

  .cert-header {
    border-bottom: 2px solid #b45309;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .cert-title {
    font-size: 24px;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 8px;
    letter-spacing: 4px;
  }

  .cert-no {
    font-size: 13px;
    color: #92400e;
  }

  .cert-body {
    text-align: left;
    font-size: 14px;
    color: #78350f;
    line-height: 2;
    margin-bottom: 32px;

    b {
      color: #92400e;
    }
  }

  .cert-footer {
    text-align: right;
    color: #92400e;
  }

  .cert-seal {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .cert-date {
    font-size: 13px;
  }
}
</style>
