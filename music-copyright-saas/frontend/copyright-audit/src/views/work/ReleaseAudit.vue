<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">发行作品审核</h2>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索作品名/歌手/专辑"
          style="width: 280px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="审核状态" style="width: 140px" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待审核" value="pending" />
          <el-option label="已通过" value="passed" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <div class="cover-thumb">
              <el-icon class="cover-placeholder"><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="作品名称" min-width="160">
          <template #default="{ row }">
            <div class="work-name">{{ row.title }}</div>
            <div class="work-artist">{{ row.artist }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="album" label="所属专辑" width="140" />
        <el-table-column prop="duration" label="时长" width="90" />
        <el-table-column prop="audioQuality" label="音质" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.audioQuality === '无损' ? 'success' : 'info'">{{ row.audioQuality }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="integrity" label="音频完整性" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="row.integrity === '正常' ? 'success' : 'warning'">{{ row.integrity }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitter" label="提交人" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="handleReject(row)">驳回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="发行作品详情" width="750px" class="detail-dialog">
      <div v-if="currentWork" class="release-detail">
        <div class="detail-header">
          <div class="cover-large">
            <el-icon class="cover-placeholder-lg"><Picture /></el-icon>
          </div>
          <div class="work-info">
            <h3>{{ currentWork.title }}</h3>
            <p class="artist">歌手：{{ currentWork.artist }}</p>
            <p class="album">专辑：{{ currentWork.album }}</p>
            <div class="info-tags">
              <el-tag size="small">{{ currentWork.genre }}</el-tag>
              <el-tag size="small" :type="currentWork.audioQuality === '无损' ? 'success' : 'info'">{{ currentWork.audioQuality }}</el-tag>
              <el-tag size="small" :type="currentWork.integrity === '正常' ? 'success' : 'warning'">完整性: {{ currentWork.integrity }}</el-tag>
            </div>
          </div>
        </div>

        <el-divider />

        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="发行版本">{{ currentWork.version }}</el-descriptions-item>
          <el-descriptions-item label="ISRC编码">{{ currentWork.isrc }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ currentWork.duration }}</el-descriptions-item>
          <el-descriptions-item label="采样率">{{ currentWork.sampleRate }}</el-descriptions-item>
          <el-descriptions-item label="比特率">{{ currentWork.bitrate }}</el-descriptions-item>
          <el-descriptions-item label="文件格式">{{ currentWork.format }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>音频试听</h4>
          <div class="audio-player">
            <el-button circle>
              <el-icon><VideoPlay /></el-icon>
            </el-button>
            <div class="progress-bar">
              <div class="progress-inner" style="width: 45%"></div>
            </div>
            <span class="time">02:15 / {{ currentWork.duration }}</span>
            <el-icon><Volume /></el-icon>
          </div>
        </div>

        <div class="detail-section">
          <h4>音频完整性检测</h4>
          <div class="integrity-check">
            <div class="check-item pass">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>文件头校验</span>
            </div>
            <div class="check-item pass">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>音频时长检测</span>
            </div>
            <div class="check-item pass">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>比特率一致性</span>
            </div>
            <div class="check-item pass">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>声道平衡检测</span>
            </div>
            <div class="check-item warn">
              <el-icon><WarningFilled /></el-icon>
              <span>峰值电平检测（偏高）</span>
            </div>
            <div class="check-item pass">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>噪声门限检测</span>
            </div>
          </div>
        </div>

        <div v-if="currentWork.rejectReason" class="detail-section">
          <h4>驳回原因</h4>
          <div class="reject-reason">
            {{ currentWork.rejectReason }}
          </div>
        </div>
      </div>
      <template #footer v-if="currentWork?.status === 'pending'">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="success" @click="handleApprove(currentWork)">审核通过</el-button>
        <el-button type="danger" @click="handleReject(currentWork)">审核驳回</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectVisible" title="驳回原因" width="500px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <el-form-item label="问题类型">
          <el-checkbox-group v-model="rejectForm.types">
            <el-checkbox label="cover">封面问题</el-checkbox>
            <el-checkbox label="audio">音频质量</el-checkbox>
            <el-checkbox label="metadata">元信息错误</el-checkbox>
            <el-checkbox label="copyright">版权问题</el-checkbox>
            <el-checkbox label="content">内容违规</el-checkbox>
            <el-checkbox label="other">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentWork = ref(null)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 15
})

const rejectForm = reactive({
  reason: '',
  types: []
})

const tableData = ref([
  { id: 1, title: '夜曲', artist: '周杰伦', album: '十一月的萧邦', duration: '03:48', audioQuality: '无损', integrity: '正常', submitter: '张三', submitTime: '2024-01-15 11:20:00', status: 'pending', genre: '流行', version: '正式版', isrc: 'CN-A23-24-00001', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'WAV' },
  { id: 2, title: '稻香', artist: '周杰伦', album: '魔杰座', duration: '03:43', audioQuality: '高品质', integrity: '正常', submitter: '李四', submitTime: '2024-01-15 10:15:00', status: 'pending', genre: '流行', version: '正式版', isrc: 'CN-A23-24-00002', sampleRate: '44.1kHz', bitrate: '320kbps', format: 'MP3' },
  { id: 3, title: '青花瓷', artist: '周杰伦', album: '我很忙', duration: '03:59', audioQuality: '无损', integrity: '正常', submitter: '王五', submitTime: '2024-01-14 16:30:00', status: 'passed', genre: '中国风', version: '正式版', isrc: 'CN-A23-24-00003', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'FLAC' },
  { id: 4, title: '七里香', artist: '周杰伦', album: '七里香', duration: '04:59', audioQuality: '无损', integrity: '异常', submitter: '赵六', submitTime: '2024-01-14 14:45:00', status: 'pending', genre: '流行', version: '正式版', isrc: 'CN-A23-24-00004', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'WAV' },
  { id: 5, title: '东风破', artist: '周杰伦', album: '叶惠美', duration: '05:15', audioQuality: '高品质', integrity: '正常', submitter: '钱七', submitTime: '2024-01-14 11:30:00', status: 'passed', genre: '中国风', version: '正式版', isrc: 'CN-A23-24-00005', sampleRate: '44.1kHz', bitrate: '320kbps', format: 'MP3' },
  { id: 6, title: '双截棍', artist: '周杰伦', album: '范特西', duration: '03:22', audioQuality: '标准', integrity: '正常', submitter: '孙八', submitTime: '2024-01-13 15:20:00', status: 'rejected', genre: '说唱', version: '正式版', isrc: 'CN-A23-24-00006', sampleRate: '44.1kHz', bitrate: '128kbps', format: 'MP3', rejectReason: '封面图片不符合规范，分辨率过低且含有水印' },
  { id: 7, title: '发如雪', artist: '周杰伦', album: '十一月的萧邦', duration: '04:55', audioQuality: '无损', integrity: '正常', submitter: '周九', submitTime: '2024-01-13 10:45:00', status: 'pending', genre: '中国风', version: '正式版', isrc: 'CN-A23-24-00007', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'FLAC' },
  { id: 8, title: '霍元甲', artist: '周杰伦', album: '霍元甲 EP', duration: '03:08', audioQuality: '高品质', integrity: '正常', submitter: '吴十', submitTime: '2024-01-12 16:10:00', status: 'rejected', genre: '中国风', version: 'EP版', isrc: 'CN-A23-24-00008', sampleRate: '44.1kHz', bitrate: '320kbps', format: 'MP3', rejectReason: '音频质量不达标，存在明显杂音和爆音' },
  { id: 9, title: '晴天', artist: '周杰伦', album: '叶惠美', duration: '04:29', audioQuality: '无损', integrity: '正常', submitter: '郑十一', submitTime: '2024-01-12 09:30:00', status: 'passed', genre: '流行', version: '正式版', isrc: 'CN-A23-24-00009', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'WAV' },
  { id: 10, title: '以父之名', artist: '周杰伦', album: '叶惠美', duration: '05:44', audioQuality: '无损', integrity: '正常', submitter: '王十二', submitTime: '2024-01-11 14:25:00', status: 'pending', genre: '说唱', version: '正式版', isrc: 'CN-A23-24-00010', sampleRate: '44.1kHz', bitrate: '1411kbps', format: 'FLAC' }
])

const getStatusTag = (status) => {
  const map = { pending: 'warning', passed: 'success', rejected: 'danger' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { pending: '待审核', passed: '已通过', rejected: '已驳回' }
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
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
}

const handleSizeChange = (size) => {
  pagination.size = size
}

const handleView = (row) => {
  currentWork.value = row
  detailVisible.value = true
}

const handleApprove = (row) => {
  ElMessageBox.confirm(
    `确定要通过发行作品「${row.title}」的审核吗？`,
    '审核确认',
    {
      confirmButtonText: '确认通过',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    ElMessage.success('审核通过成功')
    detailVisible.value = false
  }).catch(() => {})
}

const handleReject = (row) => {
  currentWork.value = row
  rejectForm.reason = ''
  rejectForm.types = []
  rejectVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  ElMessageBox.confirm(
    `确定要驳回发行作品「${currentWork.value.title}」吗？`,
    '驳回确认',
    {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('已驳回')
    rejectVisible.value = false
    detailVisible.value = false
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.cover-thumb {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  display: flex;
  align-items: center;
  justify-content: center;

  .cover-placeholder {
    font-size: 24px;
    color: #166534;
  }
}

.work-name {
  font-size: 14px;
  font-weight: 500;
  color: #14532d;
  margin-bottom: 4px;
}

.work-artist {
  font-size: 12px;
  color: #71717a;
}

.release-detail {
  .detail-header {
    display: flex;
    gap: 20px;

    .cover-large {
      width: 120px;
      height: 120px;
      border-radius: 10px;
      background: linear-gradient(135deg, #dcfce7, #bbf7d0);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .cover-placeholder-lg {
        font-size: 48px;
        color: #166534;
      }
    }

    .work-info {
      flex: 1;

      h3 {
        font-size: 20px;
        font-weight: 600;
        color: #14532d;
        margin-bottom: 8px;
      }

      .artist, .album {
        font-size: 14px;
        color: #52525b;
        margin-bottom: 6px;
      }

      .info-tags {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
    }
  }

  .detail-section {
    margin-top: 20px;

    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #14532d;
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 3px solid #166534;
    }
  }

  .audio-player {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #f0fdf4;
    border-radius: 8px;

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #bbf7d0;
      border-radius: 3px;
      cursor: pointer;

      .progress-inner {
        height: 100%;
        background: #166534;
        border-radius: 3px;
      }
    }

    .time {
      font-size: 12px;
      color: #71717a;
      min-width: 80px;
      text-align: center;
    }

    .el-icon {
      font-size: 18px;
      color: #71717a;
      cursor: pointer;
    }
  }

  .integrity-check {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .check-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #f8fafc;
      border-radius: 6px;
      font-size: 13px;

      &.pass {
        color: #16a34a;
      }

      &.warn {
        color: #d97706;
      }
    }
  }

  .reject-reason {
    padding: 12px 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    color: #dc2626;
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>
