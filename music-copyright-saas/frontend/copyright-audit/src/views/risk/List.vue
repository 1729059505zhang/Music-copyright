<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">风险作品筛查</h2>
      <div class="header-actions">
        <el-tag type="danger" effect="dark">
          <el-icon><Warning /></el-icon>
          待处理风险：{{ pendingRiskCount }}
        </el-tag>
      </div>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索作品名/权利人/风险类型"
          style="width: 280px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.riskType" placeholder="风险类型" style="width: 140px" clearable>
          <el-option label="全部类型" value="" />
          <el-option label="侵权嫌疑" value="infringement" />
          <el-option label="内容违规" value="illegal" />
          <el-option label="信息不实" value="false_info" />
        </el-select>
        <el-select v-model="searchForm.source" placeholder="风险来源" style="width: 140px" clearable>
          <el-option label="全部来源" value="" />
          <el-option label="系统自动标记" value="system" />
          <el-option label="人工举报标记" value="manual" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="处理状态" style="width: 140px" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="processing" />
          <el-option label="已处理" value="resolved" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="riskId" label="风险编号" width="140" />
        <el-table-column prop="workTitle" label="作品名称" min-width="160" />
        <el-table-column prop="riskType" label="风险类型" width="110">
          <template #default="{ row }">
            <el-tag :type="getRiskTypeTag(row.riskType)" size="small">{{ getRiskTypeName(row.riskType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelTag(row.riskLevel)" effect="dark" size="small">{{ getRiskLevelName(row.riskLevel) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="120">
          <template #default="{ row }">
            <span class="source-tag">
              <el-icon v-if="row.source === 'system'"><Cpu /></el-icon>
              <el-icon v-else><User /></el-icon>
              {{ row.source === 'system' ? '系统标记' : '人工标记' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="reporter" label="举报人/标记人" width="120" />
        <el-table-column prop="reportTime" label="标记时间" width="160" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看详情</el-button>
            <template v-if="row.status === 'pending' || row.status === 'processing'">
              <el-button type="success" link size="small" @click="handleMarkRisk(row)">标记风险</el-button>
              <el-button type="danger" link size="small" @click="handleTakeDown(row)">下架作品</el-button>
              <el-button type="info" link size="small" @click="handleDismiss(row)">标记无误</el-button>
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

    <el-dialog v-model="detailVisible" title="风险详情" width="700px" class="detail-dialog">
      <div v-if="currentRisk" class="risk-detail">
        <div class="risk-header">
          <div class="risk-title">
            <el-tag :type="getRiskLevelTag(currentRisk.riskLevel)" effect="dark" size="large">
              {{ getRiskLevelName(currentRisk.riskLevel) }}风险
            </el-tag>
            <span class="work-name">{{ currentRisk.workTitle }}</span>
          </div>
          <div class="risk-meta">
            <span>风险编号：{{ currentRisk.riskId }}</span>
            <span>标记时间：{{ currentRisk.reportTime }}</span>
          </div>
        </div>

        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="作品名称">{{ currentRisk.workTitle }}</el-descriptions-item>
          <el-descriptions-item label="风险类型">{{ getRiskTypeName(currentRisk.riskType) }}</el-descriptions-item>
          <el-descriptions-item label="权利人">{{ currentRisk.owner }}</el-descriptions-item>
          <el-descriptions-item label="风险等级">{{ getRiskLevelName(currentRisk.riskLevel) }}</el-descriptions-item>
          <el-descriptions-item label="来源">{{ currentRisk.source === 'system' ? '系统自动标记' : '人工举报标记' }}</el-descriptions-item>
          <el-descriptions-item label="标记人">{{ currentRisk.reporter }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>风险描述</h4>
          <div class="risk-desc">
            {{ currentRisk.description }}
          </div>
        </div>

        <div v-if="currentRisk.evidence" class="detail-section">
          <h4>证据材料</h4>
          <div class="evidence-list">
            <div class="evidence-item" v-for="(item, idx) in currentRisk.evidence" :key="idx">
              <el-icon><Paperclip /></el-icon>
              <span class="ev-name">{{ item.name }}</span>
              <el-button type="primary" link size="small">查看</el-button>
            </div>
          </div>
        </div>

        <div v-if="currentRisk.processResult" class="detail-section">
          <h4>处理记录</h4>
          <div class="process-record">
            <p><strong>处理结果：</strong>{{ currentRisk.processResult }}</p>
            <p><strong>处理人：</strong>{{ currentRisk.processor }}</p>
            <p><strong>处理时间：</strong>{{ currentRisk.processTime }}</p>
            <p><strong>处理说明：</strong>{{ currentRisk.processRemark }}</p>
          </div>
        </div>
      </div>
      <template #footer v-if="currentRisk?.status === 'pending' || currentRisk?.status === 'processing'">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="info" @click="handleDismiss(currentRisk)">标记无误</el-button>
        <el-button type="success" @click="handleMarkRisk(currentRisk)">确认风险</el-button>
        <el-button type="danger" @click="handleTakeDown(currentRisk)">下架作品</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="handleVisible" :title="handleTitle" width="500px">
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理类型">
          <el-tag>{{ handleTypeLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="处理原因">
          <el-select v-model="handleForm.reason" style="width: 100%" v-if="handleType !== 'dismiss'">
            <el-option v-for="item in reasonOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-else v-model="handleForm.reason" style="width: 100%">
            <el-option label="经核查无风险" value="no_risk" />
            <el-option label="举报信息不实" value="false_report" />
            <el-option label="作品已整改" value="fixed" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input
            v-model="handleForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入详细的处理说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button :type="handleBtnType" @click="confirmHandle">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const detailVisible = ref(false)
const handleVisible = ref(false)
const currentRisk = ref(null)
const handleType = ref('')
const pendingRiskCount = ref(23)

const searchForm = reactive({
  keyword: '',
  riskType: '',
  source: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 45
})

const handleForm = reactive({
  reason: '',
  remark: ''
})

const handleTitle = computed(() => {
  const map = {
    mark: '标记风险确认',
    takedown: '下架作品确认',
    dismiss: '标记无误确认'
  }
  return map[handleType.value] || '处理确认'
})

const handleTypeLabel = computed(() => {
  const map = {
    mark: '标记为风险作品',
    takedown: '下架作品',
    dismiss: '标记为无风险'
  }
  return map[handleType.value] || ''
})

const handleBtnType = computed(() => {
  const map = {
    mark: 'success',
    takedown: 'danger',
    dismiss: 'info'
  }
  return map[handleType.value] || 'primary'
})

const reasonOptions = computed(() => {
  if (handleType.value === 'mark') {
    return [
      { label: '涉嫌侵权抄袭', value: 'infringement' },
      { label: '内容违规违法', value: 'illegal' },
      { label: '信息虚假不实', value: 'false_info' },
      { label: '版权归属存疑', value: 'copyright_doubt' },
      { label: '其他风险原因', value: 'other' }
    ]
  } else if (handleType.value === 'takedown') {
    return [
      { label: '确认侵权', value: 'infringement' },
      { label: '内容违规', value: 'illegal' },
      { label: '版权纠纷', value: 'dispute' },
      { label: '信息严重不实', value: 'false_info' },
      { label: '其他原因', value: 'other' }
    ]
  }
  return []
})

const tableData = ref([
  { riskId: 'RK20240115001', workTitle: '夜曲翻唱版', riskType: 'infringement', riskLevel: 'high', source: 'system', reporter: '系统检测', reportTime: '2024-01-15 10:30:00', status: 'pending', owner: '李某', description: '系统音频指纹比对发现，该作品与周杰伦《夜曲》相似度高达92%，涉嫌侵权抄袭。', evidence: [{ name: '音频比对报告.pdf' }, { name: '相似度分析图.png' }] },
  { riskId: 'RK20240115002', workTitle: '某某之歌', riskType: 'illegal', riskLevel: 'high', source: 'manual', reporter: '用户举报', reportTime: '2024-01-15 09:20:00', status: 'processing', owner: '王某', description: '举报人称该作品歌词含有低俗色情内容，违反平台内容规范。', evidence: [{ name: '举报截图.png' }, { name: '歌词内容.txt' }] },
  { riskId: 'RK20240114008', workTitle: '快乐每一天', riskType: 'false_info', riskLevel: 'medium', source: 'system', reporter: '系统检测', reportTime: '2024-01-14 16:45:00', status: 'pending', owner: '张某', description: '系统检测到该作品登记信息与实际创作者信息不符，存在信息不实嫌疑。', evidence: [{ name: '信息比对报告.pdf' }] },
  { riskId: 'RK20240114007', workTitle: '风的季节', riskType: 'infringement', riskLevel: 'medium', source: 'manual', reporter: '徐某举报', reportTime: '2024-01-14 14:30:00', status: 'resolved', owner: '赵某', description: '举报人声称该作品旋律与其原创作品高度相似，涉嫌抄袭。', evidence: [{ name: '原创作品.mp3' }, { name: '对比说明.docx' }], processResult: '标记无误', processor: '审核员张明', processTime: '2024-01-14 17:20:00', processRemark: '经核查，两首作品虽有相似段落，但不属于抄袭范畴，属于常见和弦走向。' },
  { riskId: 'RK20240114006', workTitle: '灰色天空', riskType: 'illegal', riskLevel: 'low', source: 'system', reporter: '系统检测', reportTime: '2024-01-14 11:15:00', status: 'pending', owner: '钱某', description: '系统AI内容检测标记该歌词可能含有敏感词汇，需人工复核。', evidence: [{ name: '检测报告.pdf' }] },
  { riskId: 'RK20240113005', workTitle: '旧时光', riskType: 'infringement', riskLevel: 'high', source: 'manual', reporter: '华研音乐', reportTime: '2024-01-13 15:50:00', status: 'resolved', owner: '孙某', description: '华研音乐官方举报该作品未经授权翻唱其旗下艺人作品，侵犯著作权。', evidence: [{ name: '律师函.pdf' }, { name: '原创证明.zip' }], processResult: '已下架', processor: '审核员李华', processTime: '2024-01-13 18:30:00', processRemark: '经核查，侵权事实成立，已下架作品并通知权利人。' },
  { riskId: 'RK20240113004', workTitle: '追光者2', riskType: 'false_info', riskLevel: 'low', source: 'system', reporter: '系统检测', reportTime: '2024-01-13 10:30:00', status: 'processing', owner: '周某', description: '系统检测到该作品标题与热门作品高度相似，存在蹭热度嫌疑。', evidence: [] },
  { riskId: 'RK20240112003', workTitle: '暗黑森林', riskType: 'illegal', riskLevel: 'medium', source: 'manual', reporter: '用户举报', reportTime: '2024-01-12 16:20:00', status: 'pending', owner: '吴某', description: '举报人称该作品宣扬暴力恐怖内容，对未成年人有不良引导。', evidence: [{ name: '举报材料.zip' }] },
  { riskId: 'RK20240112002', workTitle: '爱的告白', riskType: 'infringement', riskLevel: 'low', source: 'system', reporter: '系统检测', reportTime: '2024-01-12 09:45:00', status: 'resolved', owner: '郑某', description: '系统检测该作品副歌部分与某知名歌曲旋律相似。', evidence: [{ name: '音频比对结果.pdf' }], processResult: '标记风险', processor: '审核员张明', processTime: '2024-01-12 14:00:00', processRemark: '经人工复核，确实存在一定相似性，已标记为风险作品并限流器。' },
  { riskId: 'RK20240111001', workTitle: '梦想起飞', riskType: 'false_info', riskLevel: 'medium', source: 'manual', reporter: '内部审核', reportTime: '2024-01-11 14:10:00', status: 'resolved', owner: '王某', description: '内部审核发现该作品创作者身份信息存在伪造嫌疑。', evidence: [{ name: '身份核验报告.pdf' }], processResult: '已下架', processor: '审核员李华', processTime: '2024-01-11 16:45:00', processRemark: '信息不实确认，已下架作品并封禁账号。' }
])

const getRiskTypeTag = (type) => {
  const map = { infringement: 'danger', illegal: 'warning', false_info: 'primary' }
  return map[type] || ''
}

const getRiskTypeName = (type) => {
  const map = { infringement: '侵权嫌疑', illegal: '内容违规', false_info: '信息不实' }
  return map[type] || type
}

const getRiskLevelTag = (level) => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[level] || ''
}

const getRiskLevelName = (level) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[level] || level
}

const getStatusTag = (status) => {
  const map = { pending: 'danger', processing: 'warning', resolved: 'success' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { pending: '待处理', processing: '处理中', resolved: '已处理' }
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
  searchForm.riskType = ''
  searchForm.source = ''
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
  currentRisk.value = row
  detailVisible.value = true
}

const handleMarkRisk = (row) => {
  currentRisk.value = row
  handleType.value = 'mark'
  handleForm.reason = ''
  handleForm.remark = ''
  handleVisible.value = true
}

const handleTakeDown = (row) => {
  currentRisk.value = row
  handleType.value = 'takedown'
  handleForm.reason = ''
  handleForm.remark = ''
  handleVisible.value = true
}

const handleDismiss = (row) => {
  currentRisk.value = row
  handleType.value = 'dismiss'
  handleForm.reason = ''
  handleForm.remark = ''
  handleVisible.value = true
}

const confirmHandle = () => {
  if (!handleForm.reason) {
    ElMessage.warning('请选择处理原因')
    return
  }
  if (!handleForm.remark) {
    ElMessage.warning('请输入处理说明')
    return
  }
  let msg = '处理成功'
  if (handleType.value === 'takedown') {
    msg = '作品已下架'
  } else if (handleType.value === 'mark') {
    msg = '已标记为风险作品'
  } else if (handleType.value === 'dismiss') {
    msg = '已标记为无风险'
  }
  ElMessage.success(msg)
  handleVisible.value = false
  detailVisible.value = false
}
</script>

<style lang="scss" scoped>
.source-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52525b;
}

.risk-detail {
  .risk-header {
    margin-bottom: 16px;

    .risk-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .work-name {
        font-size: 18px;
        font-weight: 600;
        color: #14532d;
      }
    }

    .risk-meta {
      font-size: 12px;
      color: #71717a;
      display: flex;
      gap: 20px;
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

  .risk-desc {
    padding: 12px 16px;
    background: #fef2f2;
    border-radius: 8px;
    color: #dc2626;
    font-size: 14px;
    line-height: 1.6;
  }

  .evidence-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .evidence-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 6px;
      font-size: 13px;

      .el-icon {
        color: #166534;
      }

      .ev-name {
        flex: 1;
        color: #14532d;
      }
    }
  }

  .process-record {
    padding: 12px 16px;
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.8;
    color: #14532d;

    strong {
      color: #166534;
    }
  }
}
</style>
