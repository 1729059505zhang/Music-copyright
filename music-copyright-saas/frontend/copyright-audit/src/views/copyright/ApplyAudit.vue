<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">版权登记申请审核</h2>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索申请编号/作品名/申请人"
          style="width: 280px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="申请状态" style="width: 140px" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待核验" value="pending" />
          <el-option label="核验通过" value="passed" />
          <el-option label="待补正" value="correction" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="applyNo" label="申请编号" width="160" />
        <el-table-column prop="workTitle" label="作品名称" min-width="160" />
        <el-table-column prop="workType" label="作品类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.workType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicant" label="申请人" width="120" />
        <el-table-column prop="idType" label="证件类型" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="160" />
        <el-table-column prop="status" label="状态" width="110">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看详情</el-button>
            <template v-if="row.status === 'pending'">
              <el-button type="success" link size="small" @click="handleApprove(row)">核验通过</el-button>
              <el-button type="warning" link size="small" @click="handleCorrection(row)">要求补正</el-button>
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

    <el-dialog v-model="detailVisible" title="版权登记申请详情" width="800px" class="detail-dialog">
      <div v-if="currentApply" class="apply-detail">
        <el-steps :active="getStepIndex(currentApply.status)" finish-status="success" simple>
          <el-step title="提交申请" />
          <el-step title="材料核验" />
          <el-step title="版权登记" />
          <el-step title="颁发证书" />
        </el-steps>

        <el-divider />

        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="申请编号">{{ currentApply.applyNo }}</el-descriptions-item>
            <el-descriptions-item label="申请时间">{{ currentApply.submitTime }}</el-descriptions-item>
            <el-descriptions-item label="作品名称">{{ currentApply.workTitle }}</el-descriptions-item>
            <el-descriptions-item label="作品类型">{{ currentApply.workType }}</el-descriptions-item>
            <el-descriptions-item label="创作完成时间">{{ currentApply.createTime }}</el-descriptions-item>
            <el-descriptions-item label="首次发表时间">{{ currentApply.publishTime }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>申请人信息</h4>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="申请人姓名">{{ currentApply.applicant }}</el-descriptions-item>
            <el-descriptions-item label="证件类型">{{ currentApply.idType }}</el-descriptions-item>
            <el-descriptions-item label="证件号码">{{ currentApply.idNo }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentApply.phone }}</el-descriptions-item>
            <el-descriptions-item label="电子邮箱" :span="2">{{ currentApply.email }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="detail-section">
          <h4>申请材料</h4>
          <div class="material-list">
            <div class="material-item">
              <div class="material-icon">
                <el-icon><Document /></el-icon>
              </div>
              <div class="material-info">
                <div class="material-name">作品样本</div>
                <div class="material-desc">audio_sample.mp3 (5.2MB)</div>
              </div>
              <el-button type="primary" link size="small">预览</el-button>
            </div>
            <div class="material-item">
              <div class="material-icon success">
                <el-icon><Picture /></el-icon>
              </div>
              <div class="material-info">
                <div class="material-name">作品封面</div>
                <div class="material-desc">cover.jpg (1.8MB)</div>
              </div>
              <el-button type="primary" link size="small">预览</el-button>
            </div>
            <div class="material-item">
              <div class="material-icon warning">
                <el-icon><Files /></el-icon>
              </div>
              <div class="material-info">
                <div class="material-name">权属证明</div>
                <div class="material-desc">ownership_proof.pdf (2.1MB)</div>
              </div>
              <el-button type="primary" link size="small">预览</el-button>
            </div>
            <div class="material-item">
              <div class="material-icon info">
                <el-icon><Postcard /></el-icon>
              </div>
              <div class="material-info">
                <div class="material-name">身份证明</div>
                <div class="material-desc">id_card.jpg (856KB)</div>
              </div>
              <el-button type="primary" link size="small">预览</el-button>
            </div>
          </div>
        </div>

        <div v-if="currentApply.correctionContent" class="detail-section">
          <h4>补正要求</h4>
          <div class="correction-box">
            <p><strong>补正原因：</strong>{{ currentApply.correctionContent }}</p>
            <p v-if="currentApply.correctionTime"><strong>发出时间：</strong>{{ currentApply.correctionTime }}</p>
            <p v-if="currentApply.correctionDeadline"><strong>截止日期：</strong>{{ currentApply.correctionDeadline }}</p>
          </div>
        </div>

        <div v-if="currentApply.rejectReason" class="detail-section">
          <h4>驳回原因</h4>
          <div class="reject-reason">
            {{ currentApply.rejectReason }}
          </div>
        </div>
      </div>
      <template #footer v-if="currentApply?.status === 'pending'">
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="success" @click="handleApprove(currentApply)">核验通过</el-button>
        <el-button type="warning" @click="handleCorrection(currentApply)">要求补正</el-button>
        <el-button type="danger" @click="handleReject(currentApply)">驳回申请</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="correctionVisible" title="要求补正" width="550px">
      <el-form :model="correctionForm" label-width="100px">
        <el-form-item label="补正类型">
          <el-checkbox-group v-model="correctionForm.types">
            <el-checkbox label="material">材料补充</el-checkbox>
            <el-checkbox label="info">信息更正</el-checkbox>
            <el-checkbox label="sample">样本更换</el-checkbox>
            <el-checkbox label="other">其他</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="补正内容">
          <el-input
            v-model="correctionForm.content"
            type="textarea"
            :rows="5"
            placeholder="请详细说明需要补正的内容"
          />
        </el-form-item>
        <el-form-item label="补正期限">
          <el-date-picker
            v-model="correctionForm.deadline"
            type="date"
            placeholder="选择补正截止日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="correctionVisible = false">取消</el-button>
        <el-button type="warning" @click="confirmCorrection">发送补正通知</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectVisible" title="驳回申请" width="500px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因">
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="5"
            placeholder="请输入驳回原因"
          />
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
const correctionVisible = ref(false)
const rejectVisible = ref(false)
const currentApply = ref(null)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 22
})

const correctionForm = reactive({
  types: [],
  content: '',
  deadline: ''
})

const rejectForm = reactive({
  reason: ''
})

const tableData = ref([
  { applyNo: 'CR20240115001', workTitle: '夜的第七章', workType: '音乐作品', applicant: '张三', idType: '身份证', submitTime: '2024-01-15 10:30:00', status: 'pending', createTime: '2023-12-20', publishTime: '2024-01-01', idNo: '110***********1234', phone: '138****5678', email: 'zhangsan@example.com' },
  { applyNo: 'CR20240115002', workTitle: '晴天', workType: '音乐作品', applicant: '李四', idType: '身份证', submitTime: '2024-01-15 09:20:00', status: 'pending', createTime: '2023-11-15', publishTime: '2023-12-25', idNo: '110***********5678', phone: '139****9876', email: 'lisi@example.com' },
  { applyNo: 'CR20240114008', workTitle: '稻香', workType: '音乐作品', applicant: '王五', idType: '身份证', submitTime: '2024-01-14 16:45:00', status: 'passed', createTime: '2023-10-10', publishTime: '2023-11-20', idNo: '110***********9012', phone: '137****3456', email: 'wangwu@example.com' },
  { applyNo: 'CR20240114007', workTitle: '青花瓷', workType: '音乐作品', applicant: '赵六', idType: '身份证', submitTime: '2024-01-14 14:30:00', status: 'correction', createTime: '2023-09-25', publishTime: '2023-10-30', idNo: '110***********3456', phone: '136****7890', email: 'zhaoliu@example.com', correctionContent: '请补充完整的权属证明文件，当前材料缺少原始创作记录', correctionTime: '2024-01-15 10:00:00', correctionDeadline: '2024-01-22' },
  { applyNo: 'CR20240114006', workTitle: '七里香', workType: '音乐作品', applicant: '钱七', idType: '身份证', submitTime: '2024-01-14 11:15:00', status: 'pending', createTime: '2023-08-18', publishTime: '2023-09-28', idNo: '110***********7890', phone: '135****2345', email: 'qianqi@example.com' },
  { applyNo: 'CR20240113005', workTitle: '东风破', workType: '音乐作品', applicant: '孙八', idType: '护照', submitTime: '2024-01-13 15:50:00', status: 'rejected', createTime: '2023-07-22', publishTime: '2023-08-15', idNo: 'E12345678', phone: '134****6789', email: 'sunba@example.com', rejectReason: '申请材料不实，经查证该作品非申请人原创，存在抄袭嫌疑' },
  { applyNo: 'CR20240113004', workTitle: '双截棍', workType: '音乐作品', applicant: '周九', idType: '身份证', submitTime: '2024-01-13 10:30:00', status: 'passed', createTime: '2023-06-30', publishTime: '2023-07-20', idNo: '110***********0123', phone: '133****0123', email: 'zhoujiu@example.com' },
  { applyNo: 'CR20240112003', workTitle: '发如雪', workType: '音乐作品', applicant: '吴十', idType: '身份证', submitTime: '2024-01-12 16:20:00', status: 'pending', createTime: '2023-05-15', publishTime: '2023-06-25', idNo: '110***********4567', phone: '132****4567', email: 'wushi@example.com' },
  { applyNo: 'CR20240112002', workTitle: '霍元甲', workType: '音乐作品', applicant: '郑十一', idType: '身份证', submitTime: '2024-01-12 09:45:00', status: 'correction', createTime: '2023-04-10', publishTime: '2023-05-18', idNo: '110***********8901', phone: '131****8901', email: 'zheng11@example.com', correctionContent: '身份证明文件模糊，请重新上传清晰的证件照片', correctionTime: '2024-01-13 14:00:00', correctionDeadline: '2024-01-20' },
  { applyNo: 'CR20240111001', workTitle: '以父之名', workType: '音乐作品', applicant: '王十二', idType: '身份证', submitTime: '2024-01-11 14:10:00', status: 'pending', createTime: '2023-03-25', publishTime: '2023-04-30', idNo: '110***********2345', phone: '130****2345', email: 'wang12@example.com' }
])

const getStatusTag = (status) => {
  const map = { pending: 'warning', passed: 'success', correction: 'primary', rejected: 'danger' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { pending: '待核验', passed: '核验通过', correction: '待补正', rejected: '已驳回' }
  return map[status] || status
}

const getStepIndex = (status) => {
  const map = { pending: 1, correction: 1, passed: 2, registered: 3, certified: 4, rejected: 1 }
  return map[status] || 0
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
  currentApply.value = row
  detailVisible.value = true
}

const handleApprove = (row) => {
  ElMessageBox.confirm(
    `确定核验通过「${row.workTitle}」的版权登记申请吗？核验通过后将进入版权登记流程。`,
    '核验确认',
    {
      confirmButtonText: '确认通过',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    ElMessage.success('核验通过，已进入版权登记流程')
    detailVisible.value = false
  }).catch(() => {})
}

const handleCorrection = (row) => {
  currentApply.value = row
  correctionForm.types = []
  correctionForm.content = ''
  correctionForm.deadline = ''
  correctionVisible.value = true
}

const confirmCorrection = () => {
  if (correctionForm.types.length === 0) {
    ElMessage.warning('请选择补正类型')
    return
  }
  if (!correctionForm.content) {
    ElMessage.warning('请输入补正内容')
    return
  }
  if (!correctionForm.deadline) {
    ElMessage.warning('请选择补正期限')
    return
  }
  ElMessage.success('补正通知已发送')
  correctionVisible.value = false
  detailVisible.value = false
}

const handleReject = (row) => {
  currentApply.value = row
  rejectForm.reason = ''
  rejectVisible.value = true
}

const confirmReject = () => {
  if (!rejectForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }
  ElMessageBox.confirm(
    `确定驳回「${currentApply.value.workTitle}」的版权登记申请吗？此操作不可撤销。`,
    '驳回确认',
    {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('申请已驳回')
    rejectVisible.value = false
    detailVisible.value = false
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.apply-detail {
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

  .material-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .material-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 8px;

      .material-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background: #e0f2fe;
        color: #0284c7;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;

        &.success {
          background: #dcfce7;
          color: #16a34a;
        }
        &.warning {
          background: #fef3c7;
          color: #d97706;
        }
        &.info {
          background: #ede9fe;
          color: #7c3aed;
        }
      }

      .material-info {
        flex: 1;

        .material-name {
          font-size: 14px;
          font-weight: 500;
          color: #14532d;
          margin-bottom: 2px;
        }

        .material-desc {
          font-size: 12px;
          color: #71717a;
        }
      }
    }
  }

  .correction-box {
    padding: 12px 16px;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
    color: #92400e;
    font-size: 14px;
    line-height: 1.8;
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
