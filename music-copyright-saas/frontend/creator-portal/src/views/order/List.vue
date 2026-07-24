<template>
  <div class="order-list-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">交易台账</h2>
          <p class="page-subtitle">查看所有订单交易记录</p>
        </div>
        <div class="header-actions">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出账单
          </el-button>
        </div>
      </div>

      <el-row :gutter="16" class="stats-row mb-20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">¥{{ stats.totalAmount.toLocaleString() }}</div>
            <div class="stat-label">总交易额</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.monthOrders }}</div>
            <div class="stat-label">本月订单</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-value">{{ stats.pendingOrders }}</div>
            <div class="stat-label">待确认订单</div>
          </div>
        </el-col>
      </el-row>

      <div class="card-wrapper">
        <div class="search-bar">
          <el-input v-model="searchForm.keyword" placeholder="订单号/作品名称/买家" style="width: 260px">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
          <el-select v-model="searchForm.status" placeholder="订单状态" clearable style="width: 130px">
            <el-option label="全部状态" value="" />
            <el-option label="待确认" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
            <el-option label="已退款" value="refunded" />
          </el-select>
          <el-select v-model="searchForm.licenseType" placeholder="授权类型" clearable style="width: 130px">
            <el-option label="全部类型" value="" />
            <el-option label="非商用" value="non_commercial" />
            <el-option label="商用" value="commercial" />
            <el-option label="独家" value="exclusive" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="orderNo" label="订单号" width="170">
            <template #default="{ row }">
              <span class="order-no" @click="handleViewDetail(row)">{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workTitle" label="作品信息" min-width="200">
            <template #default="{ row }">
              <div class="work-cell">
                <div class="work-cover">
                  <el-icon><Picture /></el-icon>
                </div>
                <div class="work-info">
                  <div class="work-title">{{ row.workTitle }}</div>
                  <div class="work-genre">{{ row.genre }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="buyer" label="买家" width="130" />
          <el-table-column prop="licenseType" label="授权类型" width="100">
            <template #default="{ row }">
              <el-tag size="small" :type="getLicenseType(row.licenseType)" effect="light">
                {{ row.licenseType }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额(元)" width="120" align="right">
            <template #default="{ row }">
              <span class="amount">¥{{ row.amount.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="myIncome" label="我的收益" width="110" align="right">
            <template #default="{ row }">
              <span class="income">¥{{ row.myIncome.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag size="small" :type="getStatusType(row.status)" effect="light">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="下单时间" width="160" />
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewDetail(row)">
                详情
              </el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="success" 
                link 
                size="small"
                @click="handleConfirm(row)"
              >
                确认
              </el-button>
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
          />
        </div>
      </div>

      <el-dialog v-model="detailVisible" title="订单详情" width="640px">
        <div class="order-detail" v-if="currentOrder">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <el-tag :type="getStatusType(currentOrder.status)" effect="light">
                {{ getStatusLabel(currentOrder.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="作品名称" :span="2">{{ currentOrder.workTitle }}</el-descriptions-item>
            <el-descriptions-item label="买家">{{ currentOrder.buyer }}</el-descriptions-item>
            <el-descriptions-item label="授权类型">{{ currentOrder.licenseType }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">
              <span class="amount">¥{{ currentOrder.amount.toLocaleString() }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="平台服务费">
              ¥{{ currentOrder.fee.toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="我的收益">
              <span class="income">¥{{ currentOrder.myIncome.toLocaleString() }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="下单时间">{{ currentOrder.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="支付时间">{{ currentOrder.payTime || '-' }}</el-descriptions-item>
            <el-descriptions-item label="授权期限" :span="2">
              {{ currentOrder.licensePeriod || '永久' }}
            </el-descriptions-item>
            <el-descriptions-item label="使用范围" :span="2">
              {{ currentOrder.usageScope || '商业广告、短视频、影视配乐等' }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ currentOrder.remark || '无' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <template #footer>
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button v-if="currentOrder?.status === 'pending'" type="primary" @click="handleConfirm(currentOrder)">
            确认订单
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const total = ref(0)
const detailVisible = ref(false)
const currentOrder = ref(null)

const stats = ref({
  totalAmount: 128650,
  totalOrders: 156,
  monthOrders: 42,
  pendingOrders: 5
})

const searchForm = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  licenseType: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { 
    id: 1, 
    orderNo: 'ORD202412010001', 
    workTitle: '夏日微风', 
    genre: '流行',
    buyer: '星辰传媒有限公司', 
    licenseType: '商用授权', 
    amount: 2999, 
    fee: 599.8,
    myIncome: 2399.2,
    status: 'completed', 
    createdAt: '2024-12-01 14:30:25',
    payTime: '2024-12-01 14:32:10',
    licensePeriod: '1年',
    usageScope: '商业广告投放，包含线上线下',
    remark: '用于品牌年度宣传片'
  },
  { 
    id: 2, 
    orderNo: 'ORD202412010002', 
    workTitle: '城市夜曲', 
    genre: '电子',
    buyer: '光影影视工作室', 
    licenseType: '非商用授权', 
    amount: 599, 
    fee: 119.8,
    myIncome: 479.2,
    status: 'completed', 
    createdAt: '2024-12-01 11:20:15',
    payTime: '2024-12-01 11:21:30',
    licensePeriod: '永久',
    usageScope: '学生毕业作品，非商业用途',
    remark: ''
  },
  { 
    id: 3, 
    orderNo: 'ORD202412010003', 
    workTitle: '追梦人', 
    genre: '民谣',
    buyer: '音乐工作室A', 
    licenseType: '商用授权', 
    amount: 1999, 
    fee: 399.8,
    myIncome: 1599.2,
    status: 'pending', 
    createdAt: '2024-12-01 10:15:30',
    payTime: '-',
    licensePeriod: '2年',
    usageScope: '企业内部宣传视频',
    remark: '请尽快确认，项目比较急'
  },
  { 
    id: 4, 
    orderNo: 'ORD202411300012', 
    workTitle: '海边的风', 
    genre: '流行',
    buyer: '快乐综艺制作组', 
    licenseType: '商用授权', 
    amount: 3999, 
    fee: 799.8,
    myIncome: 3199.2,
    status: 'completed', 
    createdAt: '2024-11-30 16:45:20',
    payTime: '2024-11-30 16:48:00',
    licensePeriod: '3年',
    usageScope: '综艺节目背景音乐，全平台播放',
    remark: '需要提供发票'
  },
  { 
    id: 5, 
    orderNo: 'ORD202411300008', 
    workTitle: '星辰大海', 
    genre: '摇滚',
    buyer: '短视频达人小李', 
    licenseType: '非商用授权', 
    amount: 299, 
    fee: 59.8,
    myIncome: 239.2,
    status: 'completed', 
    createdAt: '2024-11-30 09:30:45',
    payTime: '2024-11-30 09:31:20',
    licensePeriod: '1年',
    usageScope: '个人短视频账号背景音乐',
    remark: ''
  },
  { 
    id: 6, 
    orderNo: 'ORD202411290015', 
    workTitle: '江南雨', 
    genre: '古风',
    buyer: '汉服品牌店', 
    licenseType: '独家授权', 
    amount: 19999, 
    fee: 3999.8,
    myIncome: 15999.2,
    status: 'processing', 
    createdAt: '2024-11-29 15:20:10',
    payTime: '2024-11-29 15:25:30',
    licensePeriod: '永久独家',
    usageScope: '品牌主题曲，全渠道独家使用',
    remark: '已签署独家授权协议'
  },
  { 
    id: 7, 
    orderNo: 'ORD202411280006', 
    workTitle: '午夜情歌', 
    genre: 'R&B',
    buyer: '咖啡连锁店', 
    licenseType: '商用授权', 
    amount: 1599, 
    fee: 319.8,
    myIncome: 1279.2,
    status: 'completed', 
    createdAt: '2024-11-28 11:10:55',
    payTime: '2024-11-28 11:12:40',
    licensePeriod: '1年',
    usageScope: '门店背景音乐播放',
    remark: '全国50家门店使用'
  },
  { 
    id: 8, 
    orderNo: 'ORD202411270020', 
    workTitle: '街头狂想', 
    genre: '嘻哈',
    buyer: '街舞培训机构', 
    licenseType: '商用授权', 
    amount: 899, 
    fee: 179.8,
    myIncome: 719.2,
    status: 'cancelled', 
    createdAt: '2024-11-27 14:55:30',
    payTime: '-',
    licensePeriod: '-',
    usageScope: '-',
    remark: '买家取消订单'
  },
  { 
    id: 9, 
    orderNo: 'ORD202411260003', 
    workTitle: '春天的故事', 
    genre: '民谣',
    buyer: '公益基金会', 
    licenseType: '非商用授权', 
    amount: 0, 
    fee: 0,
    myIncome: 0,
    status: 'completed', 
    createdAt: '2024-11-26 09:00:00',
    payTime: '2024-11-26 09:01:00',
    licensePeriod: '永久',
    usageScope: '公益宣传片，非营利用途',
    remark: '公益授权，免费使用'
  },
  { 
    id: 10, 
    orderNo: 'ORD202411250018', 
    workTitle: '霓虹灯下', 
    genre: '电子',
    buyer: '游戏开发公司', 
    licenseType: '商用授权', 
    amount: 4999, 
    fee: 999.8,
    myIncome: 3999.2,
    status: 'completed', 
    createdAt: '2024-11-25 16:30:25',
    payTime: '2024-11-25 16:35:10',
    licensePeriod: '5年',
    usageScope: '游戏背景音乐及宣传素材',
    remark: '用于独立游戏项目'
  }
])

total.value = 156

const getLicenseType = (type) => {
  const map = {
    '非商用授权': 'info',
    '商用授权': 'warning',
    '独家授权': 'danger'
  }
  return map[type] || 'info'
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info',
    refunded: 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    pending: '待确认',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
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
  searchForm.dateRange = []
  searchForm.status = ''
  searchForm.licenseType = ''
  handleSearch()
}

const handleViewDetail = (row) => {
  currentOrder.value = row
  detailVisible.value = true
}

const handleConfirm = (row) => {
  ElMessageBox.confirm(`确定要确认订单「${row.orderNo}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    row.status = 'processing'
    detailVisible.value = false
    ElMessage.success('订单已确认')
  }).catch(() => {})
}

const handleExport = () => {
  ElMessage.info('账单导出功能开发中')
}
</script>

<style scoped lang="scss">
.order-list-page {
  .stats-row {
    .stat-item {
      background: #fff;
      border-radius: $border-radius;
      padding: 20px;
      text-align: center;
      box-shadow: $shadow-sm;
    }
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 13px;
    color: $text-muted;
  }

  .order-no {
    color: $primary-color;
    cursor: pointer;
    font-family: monospace;
    font-size: 13px;

    &:hover {
      text-decoration: underline;
    }
  }

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

  .work-info {
    .work-title {
      font-weight: 500;
      color: $text-primary;
      margin-bottom: 2px;
    }
    .work-genre {
      font-size: 12px;
      color: $text-muted;
    }
  }

  .amount {
    font-weight: 500;
    color: $text-primary;
  }

  .income {
    font-weight: 600;
    color: $success-color;
  }

  .order-detail {
    .amount {
      font-size: 16px;
      font-weight: 600;
    }
    .income {
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
