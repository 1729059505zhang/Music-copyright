<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">电子版权证书管理</h2>
    </div>

    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索证书编号/作品名/权利人"
          style="width: 280px"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="证书状态" style="width: 140px" clearable>
          <el-option label="全部状态" value="" />
          <el-option label="有效" value="valid" />
          <el-option label="已补发" value="reissued" />
          <el-option label="已作废" value="void" />
        </el-select>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="发证开始日期"
          end-placeholder="发证结束日期"
          style="width: 260px"
        />
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="primary">
            <el-icon><Download /></el-icon>
            批量导出
          </el-button>
        </div>
        <div class="toolbar-right">
          <span class="total-text">共 {{ pagination.total }} 条证书记录</span>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="certNo" label="证书编号" width="180" />
        <el-table-column prop="workTitle" label="作品名称" min-width="160" />
        <el-table-column prop="owner" label="权利人" width="120" />
        <el-table-column prop="workType" label="作品类型" width="100" />
        <el-table-column prop="regNo" label="登记号" width="160" />
        <el-table-column prop="issueDate" label="发证日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handlePreview(row)">预览</el-button>
            <el-button type="success" link size="small" @click="handleDownload(row)">下载</el-button>
            <el-button v-if="row.status === 'valid'" type="warning" link size="small" @click="handleReissue(row)">补发</el-button>
            <el-button v-if="row.status === 'valid'" type="danger" link size="small" @click="handleVoid(row)">作废</el-button>
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

    <el-dialog v-model="previewVisible" title="证书预览" width="600px" class="preview-dialog">
      <div class="certificate-preview">
        <div class="cert-paper">
          <div class="cert-header">
            <div class="cert-logo">
              <el-icon size="32"><Medal /></el-icon>
            </div>
            <h1>音乐版权登记证书</h1>
            <p class="cert-subtitle">MUSIC COPYRIGHT REGISTRATION CERTIFICATE</p>
          </div>
          <div class="cert-body">
            <p class="cert-no">证书编号：{{ currentCert?.certNo }}</p>
            <div class="cert-info">
              <div class="info-row">
                <span class="label">作品名称：</span>
                <span class="value">{{ currentCert?.workTitle }}</span>
              </div>
              <div class="info-row">
                <span class="label">作品类型：</span>
                <span class="value">{{ currentCert?.workType }}</span>
              </div>
              <div class="info-row">
                <span class="label">权利人：</span>
                <span class="value">{{ currentCert?.owner }}</span>
              </div>
              <div class="info-row">
                <span class="label">登记号：</span>
                <span class="value">{{ currentCert?.regNo }}</span>
              </div>
              <div class="info-row">
                <span class="label">创作完成日期：</span>
                <span class="value">{{ currentCert?.createDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">首次发表日期：</span>
                <span class="value">{{ currentCert?.publishDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">登记日期：</span>
                <span class="value">{{ currentCert?.issueDate }}</span>
              </div>
            </div>
            <p class="cert-desc">
              兹证明上述作品的版权已在本平台登记，登记事项与事实相符，特发此证。
            </p>
          </div>
          <div class="cert-footer">
            <div class="issuer">
              <p>发证机构：音乐版权SaaS平台</p>
              <p>发证日期：{{ currentCert?.issueDate }}</p>
            </div>
            <div class="seal">
              <el-icon size="64"><Stamp /></el-icon>
            </div>
          </div>
          <div class="blockchain-mark">
            <el-icon><Link /></el-icon>
            <span>区块链存证 · 不可篡改</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentCert)">下载证书</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reissueVisible" title="证书补发" width="500px">
      <el-form :model="reissueForm" label-width="100px">
        <el-form-item label="原证书号">
          <el-input v-model="reissueForm.certNo" disabled />
        </el-form-item>
        <el-form-item label="补发原因">
          <el-select v-model="reissueForm.reason" style="width: 100%">
            <el-option label="证书遗失" value="lost" />
            <el-option label="证书损坏" value="damaged" />
            <el-option label="信息变更" value="info_change" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="补发说明">
          <el-input
            v-model="reissueForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入补发说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reissueVisible = false">取消</el-button>
        <el-button type="warning" @click="confirmReissue">确认补发</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="voidVisible" title="证书作废" width="500px">
      <el-form :model="voidForm" label-width="100px">
        <el-form-item label="证书编号">
          <el-input v-model="voidForm.certNo" disabled />
        </el-form-item>
        <el-form-item label="作废原因">
          <el-select v-model="voidForm.reason" style="width: 100%">
            <el-option label="版权转移" value="transfer" />
            <el-option label="登记错误" value="error" />
            <el-option label="侵权纠纷" value="dispute" />
            <el-option label="权利人申请" value="owner_request" />
            <el-option label="其他原因" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="作废说明">
          <el-input
            v-model="voidForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入详细的作废说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="voidVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmVoid">确认作废</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const previewVisible = ref(false)
const reissueVisible = ref(false)
const voidVisible = ref(false)
const currentCert = ref(null)

const searchForm = reactive({
  keyword: '',
  status: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 156
})

const reissueForm = reactive({
  certNo: '',
  reason: '',
  remark: ''
})

const voidForm = reactive({
  certNo: '',
  reason: '',
  remark: ''
})

const tableData = ref([
  { certNo: 'CZ202401150001', workTitle: '夜的第七章', workType: '音乐作品', owner: '张三', regNo: 'CR2024010001', issueDate: '2024-01-15', status: 'valid', createDate: '2023-12-20', publishDate: '2024-01-01' },
  { certNo: 'CZ202401150002', workTitle: '晴天', workType: '音乐作品', owner: '李四', regNo: 'CR2024010002', issueDate: '2024-01-15', status: 'valid', createDate: '2023-11-15', publishDate: '2023-12-25' },
  { certNo: 'CZ202401140003', workTitle: '稻香', workType: '音乐作品', owner: '王五', regNo: 'CR2024010003', issueDate: '2024-01-14', status: 'valid', createDate: '2023-10-10', publishDate: '2023-11-20' },
  { certNo: 'CZ202401130006', workTitle: '东风破', workType: '音乐作品', owner: '孙八', regNo: 'CR2024010006', issueDate: '2024-01-13', status: 'valid', createDate: '2023-07-22', publishDate: '2023-08-15' },
  { certNo: 'CZ202401130007', workTitle: '双截棍', workType: '音乐作品', owner: '周九', regNo: 'CR2024010007', issueDate: '2024-01-13', status: 'reissued', createDate: '2023-06-30', publishDate: '2023-07-20' },
  { certNo: 'CZ202401120009', workTitle: '霍元甲', workType: '音乐作品', owner: '郑十一', regNo: 'CR2024010009', issueDate: '2024-01-12', status: 'valid', createDate: '2023-04-10', publishDate: '2023-05-18' },
  { certNo: 'CZ202401100012', workTitle: '七里香', workType: '音乐作品', owner: '钱七', regNo: 'CR2024010012', issueDate: '2024-01-10', status: 'valid', createDate: '2023-08-18', publishDate: '2023-09-28' },
  { certNo: 'CZ202401080015', workTitle: '发如雪', workType: '音乐作品', owner: '吴十', regNo: 'CR2024010015', issueDate: '2024-01-08', status: 'void', createDate: '2023-05-15', publishDate: '2023-06-25' },
  { certNo: 'CZ202401050018', workTitle: '青花瓷', workType: '音乐作品', owner: '赵六', regNo: 'CR2024010018', issueDate: '2024-01-05', status: 'valid', createDate: '2023-09-25', publishDate: '2023-10-30' },
  { certNo: 'CZ202401020020', workTitle: '以父之名', workType: '音乐作品', owner: '王十二', regNo: 'CR2024010020', issueDate: '2024-01-02', status: 'valid', createDate: '2023-03-25', publishDate: '2023-04-30' }
])

const getStatusTag = (status) => {
  const map = { valid: 'success', reissued: 'warning', void: 'info' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { valid: '有效', reissued: '已补发', void: '已作废' }
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

const handlePageChange = (page) => {
  pagination.page = page
}

const handleSizeChange = (size) => {
  pagination.size = size
}

const handlePreview = (row) => {
  currentCert.value = row
  previewVisible.value = true
}

const handleDownload = (row) => {
  ElMessage.success('证书下载中...')
}

const handleReissue = (row) => {
  currentCert.value = row
  reissueForm.certNo = row.certNo
  reissueForm.reason = ''
  reissueForm.remark = ''
  reissueVisible.value = true
}

const confirmReissue = () => {
  if (!reissueForm.reason) {
    ElMessage.warning('请选择补发原因')
    return
  }
  ElMessageBox.confirm(
    '确定要补发该证书吗？原证书将标记为已补发状态。',
    '补发确认',
    {
      confirmButtonText: '确认补发',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('证书补发成功')
    reissueVisible.value = false
  }).catch(() => {})
}

const handleVoid = (row) => {
  currentCert.value = row
  voidForm.certNo = row.certNo
  voidForm.reason = ''
  voidForm.remark = ''
  voidVisible.value = true
}

const confirmVoid = () => {
  if (!voidForm.reason) {
    ElMessage.warning('请选择作废原因')
    return
  }
  if (!voidForm.remark) {
    ElMessage.warning('请输入作废说明')
    return
  }
  ElMessageBox.confirm(
    '确定要作废该证书吗？此操作不可撤销，证书将永久失效。',
    '作废确认',
    {
      confirmButtonText: '确认作废',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    ElMessage.success('证书已作废')
    voidVisible.value = false
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.total-text {
  font-size: 13px;
  color: #71717a;
}

.certificate-preview {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.cert-paper {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  border: 2px solid #166534;
  border-radius: 8px;
  padding: 30px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border: 1px solid #bbf7d0;
    border-radius: 4px;
    pointer-events: none;
  }

  .cert-header {
    text-align: center;
    margin-bottom: 24px;

    .cert-logo {
      color: #166534;
      margin-bottom: 8px;
    }

    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #14532d;
      letter-spacing: 4px;
      margin-bottom: 4px;
    }

    .cert-subtitle {
      font-size: 10px;
      color: #166534;
      letter-spacing: 2px;
    }
  }

  .cert-body {
    .cert-no {
      text-align: center;
      font-size: 13px;
      color: #52525b;
      margin-bottom: 20px;
      font-family: 'Monaco', monospace;
    }

    .cert-info {
      padding: 0 20px;
      margin-bottom: 20px;

      .info-row {
        display: flex;
        padding: 6px 0;
        font-size: 13px;

        .label {
          width: 110px;
          color: #71717a;
          flex-shrink: 0;
        }

        .value {
          flex: 1;
          color: #14532d;
          font-weight: 500;
        }
      }
    }

    .cert-desc {
      font-size: 12px;
      color: #52525b;
      text-align: center;
      line-height: 1.6;
      padding: 0 20px;
    }
  }

  .cert-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 24px;
    padding: 0 20px;

    .issuer {
      font-size: 12px;
      color: #52525b;
      line-height: 1.8;
    }

    .seal {
      color: #dc2626;
      opacity: 0.6;
      transform: rotate(-15deg);
    }
  }

  .blockchain-mark {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #166534;
    opacity: 0.7;
  }
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
}
</style>
