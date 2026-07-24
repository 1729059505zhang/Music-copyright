<template>
  <div class="invoices-page">
    <div class="page-tabs">
      <el-tabs v-model="activeTab" class="invoice-tabs">
        <el-tab-pane label="可开发票" name="available">
          <template #label>
            <span>可开发票 <el-badge :value="5" class="badge" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="申请记录" name="records" />
        <el-tab-pane label="发票信息" name="info" />
      </el-tabs>
    </div>

    <div v-if="activeTab === 'available'" class="available-section">
      <div class="action-bar">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索订单号、作品名称" 
          style="width: 280px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="action-right">
          <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
          <el-button type="primary" :disabled="!selectedOrders.length" @click="batchApply">
            批量申请开票
          </el-button>
        </div>
      </div>

      <el-table 
        :data="availableList" 
        stripe 
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column label="作品信息" min-width="200">
          <template #default="{ row }">
            <div class="work-cell">
              <img :src="row.cover" :alt="row.workTitle" class="work-cover" />
              <span>{{ row.workTitle }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="licenseType" label="授权类型" width="120" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="购买时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="applySingle(row)">申请开票</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="availableTotal"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <div v-else-if="activeTab === 'records'" class="records-section">
      <div class="filter-bar">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索发票号、订单号" 
          style="width: 280px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="开票状态" style="width: 140px" clearable>
          <el-option label="开票中" value="processing" />
          <el-option label="已开票" value="completed" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="recordList" stripe style="width: 100%">
        <el-table-column prop="invoiceNo" label="发票号" width="200" />
        <el-table-column prop="orderNo" label="关联订单" width="200" />
        <el-table-column prop="invoiceTitle" label="发票抬头" min-width="180" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span class="price-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="发票类型" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'completed'" type="primary" text size="small" @click="downloadInvoice(row)">
              下载发票
            </el-button>
            <el-button text size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="recordTotal"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <div v-else class="info-section">
      <div class="info-card">
        <h3 class="card-title">发票信息</h3>
        <el-form :model="invoiceForm" label-width="120px" class="invoice-form">
          <el-form-item label="发票类型">
            <el-radio-group v-model="invoiceForm.type">
              <el-radio label="normal">增值税普通发票</el-radio>
              <el-radio label="special">增值税专用发票</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票抬头">
            <el-input v-model="invoiceForm.title" placeholder="请输入发票抬头" style="width: 400px" />
          </el-form-item>
          <el-form-item label="税号">
            <el-input v-model="invoiceForm.taxNo" placeholder="请输入纳税人识别号" style="width: 400px" />
          </el-form-item>
          <el-form-item label="开户银行">
            <el-input v-model="invoiceForm.bank" placeholder="请输入开户银行" style="width: 400px" />
          </el-form-item>
          <el-form-item label="银行账号">
            <el-input v-model="invoiceForm.bankAccount" placeholder="请输入银行账号" style="width: 400px" />
          </el-form-item>
          <el-form-item label="企业地址">
            <el-input v-model="invoiceForm.address" placeholder="请输入企业地址" style="width: 400px" />
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input v-model="invoiceForm.phone" placeholder="请输入企业电话" style="width: 400px" />
          </el-form-item>
          <el-form-item label="收票人">
            <el-input v-model="invoiceForm.receiver" placeholder="请输入收票人姓名" style="width: 400px" />
          </el-form-item>
          <el-form-item label="收票电话">
            <el-input v-model="invoiceForm.receiverPhone" placeholder="请输入收票电话" style="width: 400px" />
          </el-form-item>
          <el-form-item label="收票邮箱">
            <el-input v-model="invoiceForm.email" placeholder="请输入收票邮箱" style="width: 400px" />
          </el-form-item>
          <el-form-item label="收票地址">
            <el-input v-model="invoiceForm.receiverAddress" placeholder="请输入收票地址" style="width: 400px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveInfo">保存信息</el-button>
            <el-button @click="resetInfo">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog v-model="applyDialogVisible" title="申请开票" width="560px">
      <el-form :model="applyForm" label-width="100px">
        <el-form-item label="开票金额">
          <span class="apply-amount">¥{{ applyForm.amount }}</span>
        </el-form-item>
        <el-form-item label="发票类型" required>
          <el-radio-group v-model="applyForm.type">
            <el-radio label="normal">增值税普通发票</el-radio>
            <el-radio label="special">增值税专用发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票抬头" required>
          <el-input v-model="applyForm.title" placeholder="请输入发票抬头" />
        </el-form-item>
        <el-form-item label="税号" required>
          <el-input v-model="applyForm.taxNo" placeholder="请输入纳税人识别号" />
        </el-form-item>
        <el-form-item label="收票邮箱">
          <el-input v-model="applyForm.email" placeholder="电子发票将发送到此邮箱" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="applyForm.remark" type="textarea" :rows="2" placeholder="选填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApply">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('available')
const searchKeyword = ref('')
const statusFilter = ref('')
const selectAll = ref(false)
const selectedOrders = ref([])
const availableTotal = ref(12)
const recordTotal = ref(28)
const applyDialogVisible = ref(false)

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const availableList = ref([
  {
    id: 1,
    orderNo: 'ORD202401150001',
    workTitle: '夏日微风',
    cover: 'https://picsum.photos/60/60?random=1',
    licenseType: '商业授权',
    amount: '899.00',
    createTime: '2024-01-15 14:30:00'
  },
  {
    id: 2,
    orderNo: 'ORD202401140002',
    workTitle: '星空下的约定',
    cover: 'https://picsum.photos/60/60?random=2',
    licenseType: '独家授权',
    amount: '5,999.00',
    createTime: '2024-01-14 10:15:00'
  },
  {
    id: 3,
    orderNo: 'ORD202401130003',
    workTitle: '江南烟雨',
    cover: 'https://picsum.photos/60/60?random=4',
    licenseType: '商业授权',
    amount: '2,999.00',
    createTime: '2024-01-13 16:45:00'
  },
  {
    id: 4,
    orderNo: 'ORD202401120004',
    workTitle: '城市夜晚',
    cover: 'https://picsum.photos/60/60?random=5',
    licenseType: '商业授权',
    amount: '1,599.00',
    createTime: '2024-01-12 09:20:00'
  },
  {
    id: 5,
    orderNo: 'ORD202401110005',
    workTitle: '追梦赤子心',
    cover: 'https://picsum.photos/60/60?random=6',
    licenseType: '商业授权',
    amount: '1,899.00',
    createTime: '2024-01-11 18:55:00'
  }
])

const recordList = ref([
  {
    id: 1,
    invoiceNo: 'INV2024010001',
    orderNo: 'ORD202401010010',
    invoiceTitle: '北京示例科技有限公司',
    amount: '2,499.00',
    type: '普票',
    status: 'completed',
    applyTime: '2024-01-10 10:30:00'
  },
  {
    id: 2,
    invoiceNo: 'INV2024010002',
    orderNo: 'ORD202401020008',
    invoiceTitle: '北京示例科技有限公司',
    amount: '3,999.00',
    type: '专票',
    status: 'completed',
    applyTime: '2024-01-08 14:20:00'
  },
  {
    id: 3,
    invoiceNo: 'INV2024010003',
    orderNo: 'ORD202401030005',
    invoiceTitle: '北京示例科技有限公司',
    amount: '1,299.00',
    type: '普票',
    status: 'processing',
    applyTime: '2024-01-15 09:15:00'
  },
  {
    id: 4,
    invoiceNo: 'INV2024010004',
    orderNo: 'ORD202312280012',
    invoiceTitle: '北京示例科技有限公司',
    amount: '799.00',
    type: '普票',
    status: 'rejected',
    applyTime: '2023-12-28 16:40:00'
  }
])

const invoiceForm = reactive({
  type: 'normal',
  title: '北京示例科技有限公司',
  taxNo: '91110105MA01XXXXXX',
  bank: '中国工商银行北京朝阳支行',
  bankAccount: '0200 0000 0000 0000 000',
  address: '北京市朝阳区建国路88号',
  phone: '010-88888888',
  receiver: '张经理',
  receiverPhone: '13800138000',
  email: 'finance@example.com',
  receiverAddress: '北京市朝阳区建国路88号A座1501室'
})

const applyForm = reactive({
  amount: '0.00',
  type: 'normal',
  title: '',
  taxNo: '',
  email: '',
  remark: ''
})

const getStatusType = (status) => {
  const map = {
    processing: 'warning',
    completed: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    processing: '开票中',
    completed: '已开票',
    rejected: '已驳回'
  }
  return map[status] || status
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

const toggleSelectAll = (val) => {
  console.log('全选', val)
}

const applySingle = (row) => {
  applyForm.amount = row.amount
  applyForm.title = invoiceForm.title
  applyForm.taxNo = invoiceForm.taxNo
  applyForm.email = invoiceForm.email
  applyDialogVisible.value = true
}

const batchApply = () => {
  const total = selectedOrders.value.reduce((sum, item) => sum + parseFloat(item.amount.replace(/,/g, '')), 0)
  applyForm.amount = total.toFixed(2)
  applyForm.title = invoiceForm.title
  applyForm.taxNo = invoiceForm.taxNo
  applyForm.email = invoiceForm.email
  applyDialogVisible.value = true
}

const submitApply = () => {
  ElMessage.success('发票申请已提交，预计1-3个工作日开具')
  applyDialogVisible.value = false
}

const downloadInvoice = (row) => {
  ElMessage.success(`正在下载发票：${row.invoiceNo}`)
}

const viewDetail = (row) => {
  ElMessage.info(`查看发票详情：${row.invoiceNo}`)
}

const saveInfo = () => {
  ElMessage.success('发票信息已保存')
}

const resetInfo = () => {
  ElMessage.info('已重置')
}
</script>

<style scoped lang="scss">
.invoices-page {
  padding: 24px;
}

.page-tabs {
  margin-bottom: 20px;
}

.invoice-tabs {
  :deep(.el-tabs__item) {
    font-size: 15px;
  }
}

.badge {
  margin-left: 6px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.work-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.work-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.price-text {
  color: $danger-color;
  font-weight: 600;
}

.info-section {
  .info-card {
    max-width: 600px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid $border-light;
  }
}

.apply-amount {
  font-size: 20px;
  font-weight: 700;
  color: $danger-color;
}
</style>
