<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">版权存证登记</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleBatchGenerate">
          <el-icon><Medal /></el-icon>
          批量生成证书
        </el-button>
      </div>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索登记号/作品名/权利人"
          style="width: 280px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="登记状态" style="width: 140px" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="待生成证书" value="pending" />
          <el-option label="证书已生成" value="certified" />
          <el-option label="已上链存证" value="blockchain" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="regNo" label="登记号" width="160" />
        <el-table-column prop="workTitle" label="作品名称" min-width="160" />
        <el-table-column prop="owner" label="权利人" width="120" />
        <el-table-column prop="workType" label="作品类型" width="100" />
        <el-table-column prop="approveTime" label="核验通过时间" width="160" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看</el-button>
            <el-button v-if="row.status === 'pending'" type="success" link size="small" @click="handleGenerateCert(row)">生成证书</el-button>
            <el-button v-if="row.status === 'certified'" type="warning" link size="small" @click="handleBlockchain(row)">上链存证</el-button>
            <el-button v-if="row.blockchainTx" type="info" link size="small" @click="handleViewBlockchain(row)">存证记录</el-button>
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

    <el-dialog v-model="detailVisible" title="版权存证详情" width="750px" class="detail-dialog">
      <div v-if="currentReg" class="reg-detail">
        <el-steps :active="getStepIndex(currentReg.status)" finish-status="success" simple>
          <el-step title="提交申请" />
          <el-step title="材料核验" />
          <el-step title="生成证书" />
          <el-step title="区块链存证" />
        </el-steps>

        <el-divider />

        <div class="detail-section">
          <h4>版权登记信息</h4>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="版权登记号">{{ currentReg.regNo }}</el-descriptions-item>
            <el-descriptions-item label="作品名称">{{ currentReg.workTitle }}</el-descriptions-item>
            <el-descriptions-item label="作品类型">{{ currentReg.workType }}</el-descriptions-item>
            <el-descriptions-item label="权利人">{{ currentReg.owner }}</el-descriptions-item>
            <el-descriptions-item label="创作完成日期">{{ currentReg.createDate }}</el-descriptions-item>
            <el-descriptions-item label="首次发表日期">{{ currentReg.publishDate }}</el-descriptions-item>
            <el-descriptions-item label="登记日期">{{ currentReg.regDate }}</el-descriptions-item>
            <el-descriptions-item label="登记机构">音乐版权SaaS平台</el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="currentReg.certNo" class="detail-section">
          <h4>版权证书信息</h4>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="证书编号">{{ currentReg.certNo }}</el-descriptions-item>
            <el-descriptions-item label="发证日期">{{ currentReg.certDate }}</el-descriptions-item>
            <el-descriptions-item label="证书状态">
              <el-tag type="success">已颁发</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="证书文件">
              <el-button type="primary" link size="small">下载证书</el-button>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="currentReg.blockchainTx" class="detail-section">
          <h4>区块链存证信息</h4>
          <div class="blockchain-info">
            <div class="bc-item">
              <span class="bc-label">存证交易哈希：</span>
              <span class="bc-value mono">{{ currentReg.blockchainTx }}</span>
            </div>
            <div class="bc-item">
              <span class="bc-label">区块高度：</span>
              <span class="bc-value mono">{{ currentReg.blockHeight }}</span>
            </div>
            <div class="bc-item">
              <span class="bc-label">存证时间：</span>
              <span class="bc-value">{{ currentReg.blockchainTime }}</span>
            </div>
            <div class="bc-item">
              <span class="bc-label">存证链：</span>
              <span class="bc-value">版权存证联盟链</span>
            </div>
            <div class="bc-item">
              <span class="bc-label">存证状态：</span>
              <span class="bc-value">
                <el-tag type="success">已确认</el-tag>
              </span>
            </div>
          </div>
        </div>

        <div v-if="!currentReg.certNo" class="detail-section">
          <h4>待处理</h4>
          <div class="pending-box">
            <el-icon size="48" color="#f59e0b"><Warning /></el-icon>
            <p>当前版权登记尚未生成证书，请点击下方按钮生成版权证书。</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button v-if="currentReg?.status === 'pending'" type="success" @click="handleGenerateCert(currentReg)">生成版权证书</el-button>
        <el-button v-if="currentReg?.status === 'certified'" type="warning" @click="handleBlockchain(currentReg)">区块链存证</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="blockchainVisible" title="区块链存证记录" width="700px">
      <div class="blockchain-detail">
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in blockchainRecords"
            :key="index"
            :timestamp="record.time"
            :type="record.type"
            :hollow="record.hollow"
          >
            <el-card>
              <h4>{{ record.title }}</h4>
              <p v-if="record.desc" class="record-desc">{{ record.desc }}</p>
              <p v-if="record.txHash" class="record-hash">
                <span>交易哈希：</span>
                <code>{{ record.txHash }}</code>
              </p>
              <p v-if="record.blockHeight" class="record-block">
                <span>区块高度：</span>
                <code>{{ record.blockHeight }}</code>
              </p>
              <p v-if="record.operator" class="record-operator">
                <span>操作人：</span>{{ record.operator }}
              </p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <template #footer>
        <el-button @click="blockchainVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const detailVisible = ref(false)
const blockchainVisible = ref(false)
const currentReg = ref(null)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 18
})

const blockchainRecords = ref([
  { title: '版权存证完成', time: '2024-01-15 15:30:00', type: 'success', hollow: false, desc: '版权信息已成功上链存证，证书永久有效', txHash: '0x7f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e', blockHeight: '12,856,342', operator: '审核员-张明' },
  { title: '证书生成', time: '2024-01-15 14:20:00', type: 'primary', hollow: false, desc: '电子版权证书已生成并颁发', operator: '审核员-张明' },
  { title: '材料核验通过', time: '2024-01-15 11:45:00', type: 'success', hollow: false, desc: '申请材料核验通过，进入证书生成流程', operator: '审核员-李华' },
  { title: '申请提交', time: '2024-01-14 16:30:00', type: 'info', hollow: true, desc: '用户提交版权登记申请', operator: '申请人-张三' }
])

const tableData = ref([
  { regNo: 'CR2024010001', workTitle: '夜的第七章', workType: '音乐作品', owner: '张三', approveTime: '2024-01-15 10:30:00', status: 'blockchain', createDate: '2023-12-20', publishDate: '2024-01-01', regDate: '2024-01-15', certNo: 'CZ202401150001', certDate: '2024-01-15', blockchainTx: '0x7f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e', blockHeight: '12,856,342', blockchainTime: '2024-01-15 15:30:00' },
  { regNo: 'CR2024010002', workTitle: '晴天', workType: '音乐作品', owner: '李四', approveTime: '2024-01-15 09:20:00', status: 'certified', createDate: '2023-11-15', publishDate: '2023-12-25', regDate: '2024-01-15', certNo: 'CZ202401150002', certDate: '2024-01-15', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010003', workTitle: '稻香', workType: '音乐作品', owner: '王五', approveTime: '2024-01-14 16:45:00', status: 'certified', createDate: '2023-10-10', publishDate: '2023-11-20', regDate: '2024-01-14', certNo: 'CZ202401140003', certDate: '2024-01-14', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010004', workTitle: '青花瓷', workType: '音乐作品', owner: '赵六', approveTime: '2024-01-14 14:30:00', status: 'pending', createDate: '2023-09-25', publishDate: '2023-10-30', regDate: '', certNo: '', certDate: '', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010005', workTitle: '七里香', workType: '音乐作品', owner: '钱七', approveTime: '2024-01-14 11:15:00', status: 'pending', createDate: '2023-08-18', publishDate: '2023-09-28', regDate: '', certNo: '', certDate: '', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010006', workTitle: '东风破', workType: '音乐作品', owner: '孙八', approveTime: '2024-01-13 15:50:00', status: 'blockchain', createDate: '2023-07-22', publishDate: '2023-08-15', regDate: '2024-01-13', certNo: 'CZ202401130006', certDate: '2024-01-13', blockchainTx: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', blockHeight: '12,845,678', blockchainTime: '2024-01-13 18:00:00' },
  { regNo: 'CR2024010007', workTitle: '双截棍', workType: '音乐作品', owner: '周九', approveTime: '2024-01-13 10:30:00', status: 'certified', createDate: '2023-06-30', publishDate: '2023-07-20', regDate: '2024-01-13', certNo: 'CZ202401130007', certDate: '2024-01-13', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010008', workTitle: '发如雪', workType: '音乐作品', owner: '吴十', approveTime: '2024-01-12 16:20:00', status: 'pending', createDate: '2023-05-15', publishDate: '2023-06-25', regDate: '', certNo: '', certDate: '', blockchainTx: '', blockHeight: '', blockchainTime: '' },
  { regNo: 'CR2024010009', workTitle: '霍元甲', workType: '音乐作品', owner: '郑十一', approveTime: '2024-01-12 09:45:00', status: 'blockchain', createDate: '2023-04-10', publishDate: '2023-05-18', regDate: '2024-01-12', certNo: 'CZ202401120009', certDate: '2024-01-12', blockchainTx: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', blockHeight: '12,834,567', blockchainTime: '2024-01-12 14:30:00' },
  { regNo: 'CR2024010010', workTitle: '以父之名', workType: '音乐作品', owner: '王十二', approveTime: '2024-01-11 14:10:00', status: 'pending', createDate: '2023-03-25', publishDate: '2023-04-30', regDate: '', certNo: '', certDate: '', blockchainTx: '', blockHeight: '', blockchainTime: '' }
])

const getStatusTag = (status) => {
  const map = { pending: 'warning', certified: 'primary', blockchain: 'success' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { pending: '待生成证书', certified: '证书已生成', blockchain: '已上链存证' }
  return map[status] || status
}

const getStepIndex = (status) => {
  const map = { pending: 2, certified: 3, blockchain: 4 }
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
  currentReg.value = row
  detailVisible.value = true
}

const handleGenerateCert = (row) => {
  ElMessageBox.confirm(
    `确定为「${row.workTitle}」生成版权证书吗？`,
    '生成确认',
    {
      confirmButtonText: '确认生成',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    ElMessage.success('版权证书生成成功')
    detailVisible.value = false
  }).catch(() => {})
}

const handleBlockchain = (row) => {
  ElMessageBox.confirm(
    `确定将「${row.workTitle}」的版权信息上链存证吗？上链后数据不可篡改。`,
    '存证确认',
    {
      confirmButtonText: '确认上链',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('区块链存证成功')
    detailVisible.value = false
  }).catch(() => {})
}

const handleViewBlockchain = (row) => {
  currentReg.value = row
  blockchainVisible.value = true
}

const handleBatchGenerate = () => {
  ElMessage.info('请先选择要生成证书的登记记录')
}
</script>

<style lang="scss" scoped>
.reg-detail {
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

  .blockchain-info {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px 20px;

    .bc-item {
      display: flex;
      padding: 8px 0;
      font-size: 13px;

      &:not(:last-child) {
        border-bottom: 1px dashed #e2e8f0;
      }

      .bc-label {
        width: 120px;
        color: #71717a;
        flex-shrink: 0;
      }

      .bc-value {
        flex: 1;
        color: #14532d;

        &.mono {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 12px;
          word-break: break-all;
        }
      }
    }
  }

  .pending-box {
    text-align: center;
    padding: 30px 20px;
    background: #fffbeb;
    border-radius: 8px;
    color: #92400e;

    p {
      margin-top: 12px;
      font-size: 14px;
    }
  }
}

.blockchain-detail {
  .record-desc {
    color: #52525b;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .record-hash,
  .record-block,
  .record-operator {
    font-size: 12px;
    color: #71717a;
    margin-bottom: 4px;

    code {
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      color: #166534;
    }
  }

  :deep(.el-timeline-item__content) {
    padding-bottom: 10px;
  }

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #14532d;
    margin-bottom: 8px;
  }
}
</style>
