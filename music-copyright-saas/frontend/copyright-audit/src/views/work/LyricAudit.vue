<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">词曲作品审核</h2>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索作品名/作者"
          style="width: 240px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.type" placeholder="作品类型" style="width: 140px" clearable>
          <el-option label="全部类型" value="" />
          <el-option label="流行" value="pop" />
          <el-option label="摇滚" value="rock" />
          <el-option label="民谣" value="folk" />
          <el-option label="古典" value="classical" />
          <el-option label="电子" value="electronic" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-tabs v-model="activeTab" class="audit-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="待审核" name="pending">
          <span class="tab-count">{{ pendingCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="已通过" name="passed">
          <span class="tab-count passed">{{ passedCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="已驳回" name="rejected">
          <span class="tab-count rejected">{{ rejectedCount }}</span>
        </el-tab-pane>
      </el-tabs>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="workId" label="作品编号" width="120" />
        <el-table-column prop="title" label="作品名称" min-width="180">
          <template #default="{ row }">
            <div class="work-title">
              <el-icon class="work-icon"><DocumentMusic /></el-icon>
              <span>{{ row.title }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="submitter" label="提交人" width="120" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看详情</el-button>
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

    <el-dialog v-model="detailVisible" title="作品详情" width="700px" class="detail-dialog">
      <div v-if="currentWork" class="work-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="作品编号">{{ currentWork.workId }}</el-descriptions-item>
          <el-descriptions-item label="作品名称">{{ currentWork.title }}</el-descriptions-item>
          <el-descriptions-item label="作品类型">{{ getTypeName(currentWork.type) }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ currentWork.author }}</el-descriptions-item>
          <el-descriptions-item label="提交人">{{ currentWork.submitter }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ currentWork.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ currentWork.duration }}</el-descriptions-item>
          <el-descriptions-item label="文件格式">{{ currentWork.format }}</el-descriptions-item>
          <el-descriptions-item label="审核状态" :span="2">
            <el-tag :type="getStatusTag(currentWork.status)">{{ getStatusName(currentWork.status) }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>音频试听</h4>
          <div class="audio-player">
            <el-icon class="play-btn"><VideoPlay /></el-icon>
            <div class="progress-bar">
              <div class="progress-inner" style="width: 35%"></div>
            </div>
            <span class="time">01:23 / {{ currentWork.duration }}</span>
            <el-icon><Volume /></el-icon>
          </div>
        </div>

        <div class="detail-section">
          <h4>歌词查看</h4>
          <div class="lyrics-box">
            <pre>{{ currentWork.lyrics || '暂无歌词' }}</pre>
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
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="驳回原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
        <el-form-item label="原因分类">
          <el-select v-model="rejectForm.category" style="width: 100%">
            <el-option label="内容违规" value="illegal" />
            <el-option label="版权存疑" value="copyright" />
            <el-option label="信息不全" value="incomplete" />
            <el-option label="质量不合格" value="quality" />
            <el-option label="其他原因" value="other" />
          </el-select>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const activeTab = ref('pending')
const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentWork = ref(null)
const pendingCount = ref(28)
const passedCount = ref(156)
const rejectedCount = ref(12)

const searchForm = reactive({
  keyword: '',
  type: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 28
})

const rejectForm = reactive({
  reason: '',
  category: ''
})

const tableData = ref([
  { workId: 'W20240115001', title: '夜的第七章', type: 'pop', author: '周杰伦', submitter: '张三', submitTime: '2024-01-15 10:30:00', status: 'pending', duration: '04:25', format: 'MP3/320kbps', lyrics: '1983年小巷 十二月晴朗\n夜的第七章 打字机继续推向接近事实的那下一行\n石楠烟斗的雾 飘向枯萎的树\n沉默的对我哭诉' },
  { workId: 'W20240115002', title: '晴天', type: 'pop', author: '周杰伦', submitter: '李四', submitTime: '2024-01-15 09:45:00', status: 'pending', duration: '04:29', format: 'MP3/320kbps', lyrics: '故事的小黄花 从出生那年就飘着\n童年的荡秋千 随记忆一直晃到现在\nRe So So Si Do Si La\nSo La Si Si Si Si La Si La So' },
  { workId: 'W20240115003', title: '稻香', type: 'folk', author: '周杰伦', submitter: '王五', submitTime: '2024-01-14 16:20:00', status: 'pending', duration: '03:43', format: 'WAV/无损', lyrics: '对这个世界如果你有太多的抱怨\n跌倒了就不敢继续往前走\n为什么人要这么的脆弱 堕落' },
  { workId: 'W20240114008', title: '青花瓷', type: 'pop', author: '周杰伦', submitter: '赵六', submitTime: '2024-01-14 14:10:00', status: 'passed', duration: '03:59', format: 'MP3/320kbps', lyrics: '素胚勾勒出青花笔锋浓转淡\n瓶身描绘的牡丹一如你初妆\n冉冉檀香透过窗心事我了然\n宣纸上走笔至此搁一半' },
  { workId: 'W20240114007', title: '七里香', type: 'pop', author: '周杰伦', submitter: '钱七', submitTime: '2024-01-14 11:30:00', status: 'passed', duration: '04:59', format: 'MP3/320kbps', lyrics: '窗外的麻雀 在电线杆上多嘴\n你说这一句 很有夏天的感觉\n手中的铅笔 在纸上来来回回\n我用几行字形容你是我的谁' },
  { workId: 'W20240114006', title: '以父之名', type: 'rap', author: '周杰伦', submitter: '孙八', submitTime: '2024-01-13 15:45:00', status: 'rejected', duration: '05:44', format: 'MP3/320kbps', lyrics: '微凉的晨露 沾湿黑礼服\n石板路有雾 父在低诉\n无奈的觉悟 只能更残酷\n一切都为了 通往圣堂的路', rejectReason: '歌词内容涉及暴力描写，不符合平台内容规范' },
  { workId: 'W20240113005', title: '东风破', type: 'folk', author: '周杰伦', submitter: '周九', submitTime: '2024-01-13 10:20:00', status: 'passed', duration: '05:15', format: 'WAV/无损', lyrics: '一盏离愁 孤单伫立在窗口\n我在门后 假装你人还没走\n旧地如重游 月圆更寂寞\n夜半清醒的烛火 不忍苛责我' },
  { workId: 'W20240113004', title: '双截棍', type: 'rock', author: '周杰伦', submitter: '吴十', submitTime: '2024-01-12 16:00:00', status: 'pending', duration: '03:22', format: 'MP3/320kbps', lyrics: '岩烧店的烟味弥漫 隔壁是国术馆\n店里面的妈妈桑 茶道有三段\n教拳脚武术的老板 练铁沙掌 耍杨家枪\n硬底子功夫最擅长 还会金钟罩铁步衫' },
  { workId: 'W20240112003', title: '发如雪', type: 'pop', author: '周杰伦', submitter: '郑十一', submitTime: '2024-01-12 09:30:00', status: 'pending', duration: '04:55', format: 'MP3/320kbps', lyrics: '狼牙月 伊人憔悴\n我举杯 饮尽了风雪\n是谁打翻前世柜 惹尘埃是非' },
  { workId: 'W20240112002', title: '霍元甲', type: 'electronic', author: '周杰伦', submitter: '王十二', submitTime: '2024-01-11 14:15:00', status: 'rejected', duration: '03:08', format: 'MP3/320kbps', lyrics: '吓 命有几回合 擂台等着\n生死状 赢了什么 冷笑着', rejectReason: '音频文件质量不达标，存在明显杂音' }
])

const getTypeTag = (type) => {
  const map = { pop: '', rock: 'danger', folk: 'success', classical: 'info', electronic: 'warning', rap: 'primary' }
  return map[type] || ''
}

const getTypeName = (type) => {
  const map = { pop: '流行', rock: '摇滚', folk: '民谣', classical: '古典', electronic: '电子', rap: '说唱' }
  return map[type] || type
}

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
  searchForm.type = ''
  handleSearch()
}

const handleTabChange = (tab) => {
  activeTab.value = tab
  pagination.page = 1
  if (tab === 'pending') {
    pagination.total = pendingCount.value
  } else if (tab === 'passed') {
    pagination.total = passedCount.value
  } else {
    pagination.total = rejectedCount.value
  }
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
    `确定要通过作品「${row.title}」的审核吗？`,
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
  rejectForm.category = ''
  rejectVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  ElMessageBox.confirm(
    `确定要驳回作品「${currentWork.value.title}」吗？`,
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

onMounted(() => {
})
</script>

<style lang="scss" scoped>
.audit-tabs {
  margin-bottom: 16px;

  :deep(.el-tabs__item) {
    .tab-count {
      display: inline-block;
      padding: 2px 8px;
      background: #fef3c7;
      color: #d97706;
      border-radius: 10px;
      font-size: 12px;
      margin-left: 6px;

      &.passed {
        background: #dcfce7;
        color: #16a34a;
      }

      &.rejected {
        background: #fee2e2;
        color: #dc2626;
      }
    }
  }
}

.work-title {
  display: flex;
  align-items: center;
  gap: 8px;

  .work-icon {
    color: #166534;
    font-size: 18px;
  }
}

.work-detail {
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

    .play-btn {
      font-size: 24px;
      color: #166534;
      cursor: pointer;
    }

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

  .lyrics-box {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    max-height: 200px;
    overflow-y: auto;

    pre {
      font-family: inherit;
      font-size: 14px;
      line-height: 1.8;
      color: #52525b;
      white-space: pre-wrap;
      word-wrap: break-word;
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
