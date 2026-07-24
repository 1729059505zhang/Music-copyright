<template>
  <div class="settlement-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">分账明细</h2>
          <p class="page-subtitle">查看订单分账详情</p>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="search-bar">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 260px"
          />
          <el-select v-model="searchForm.status" placeholder="结算状态" clearable style="width: 140px">
            <el-option label="全部状态" value="" />
            <el-option label="待结算" value="pending" />
            <el-option label="已结算" value="settled" />
          </el-select>
          <el-input v-model="searchForm.keyword" placeholder="订单号/作品" style="width: 220px">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>

        <el-row :gutter="16" class="settlement-stats mb-20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value income">¥{{ stats.pendingAmount.toLocaleString() }}</div>
              <div class="stat-label">待结算金额</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value success">¥{{ stats.settledAmount.toLocaleString() }}</div>
              <div class="stat-label">已结算金额</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.pendingCount }} 笔</div>
              <div class="stat-label">待结算订单</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.settledCount }} 笔</div>
              <div class="stat-label">已结算订单</div>
            </div>
          </el-col>
        </el-row>

        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="settleNo" label="结算单号" width="180">
            <template #default="{ row }">
              <span class="settle-no">{{ row.settleNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="关联订单" width="170">
            <template #default="{ row }">
              <span class="link-text">{{ row.orderNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="workTitle" label="作品" min-width="160" />
          <el-table-column prop="orderAmount" label="订单金额" width="110" align="right">
            <template #default="{ row }">¥{{ row.orderAmount.toLocaleString() }}</template>
          </el-table-column>
          <el-table-column prop="platformFee" label="平台服务费" width="120" align="right">
            <template #default="{ row }">
              ¥{{ row.platformFee.toLocaleString() }} ({{ row.feeRate }}%)
            </template>
          </el-table-column>
          <el-table-column prop="myIncome" label="我的收益" width="110" align="right">
            <template #default="{ row }">
              <span class="income">¥{{ row.myIncome.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag size="small" :type="row.status === 'settled' ? 'success' : 'warning'" effect="light">
                {{ row.status === 'settled' ? '已结算' : '待结算' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="settleDate" label="结算日期" width="120">
            <template #default="{ row }">
              {{ row.settleDate || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleViewDetail(row)">详情</el-button>
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

      <el-dialog v-model="detailVisible" title="分账详情" width="560px">
        <div class="settle-detail" v-if="currentSettle">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="结算单号">{{ currentSettle.settleNo }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="currentSettle.status === 'settled' ? 'success' : 'warning'" effect="light">
                {{ currentSettle.status === 'settled' ? '已结算' : '待结算' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="关联订单" :span="2">
              <span class="link-text">{{ currentSettle.orderNo }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="作品名称" :span="2">{{ currentSettle.workTitle }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">¥{{ currentSettle.orderAmount.toLocaleString() }}</el-descriptions-item>
            <el-descriptions-item label="平台服务费">¥{{ currentSettle.platformFee.toLocaleString() }} ({{ currentSettle.feeRate }}%)</el-descriptions-item>
            <el-descriptions-item label="我的收益">
              <span class="income" style="font-size: 16px; font-weight: 600;">
                ¥{{ currentSettle.myIncome.toLocaleString() }}
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="结算周期">{{ currentSettle.cycle }}</el-descriptions-item>
            <el-descriptions-item label="预计结算日" :span="2">{{ currentSettle.settleDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <template #footer>
          <el-button @click="detailVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const loading = ref(false)
const total = ref(0)
const detailVisible = ref(false)
const currentSettle = ref(null)

const stats = ref({
  pendingAmount: 8950,
  settledAmount: 119700,
  pendingCount: 12,
  settledCount: 144
})

const searchForm = reactive({
  dateRange: [],
  status: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { id: 1, settleNo: 'STL202412010001', orderNo: 'ORD202412010001', workTitle: '夏日微风', orderAmount: 2999, platformFee: 599.8, feeRate: 20, myIncome: 2399.2, status: 'pending', cycle: 'T+7', settleDate: '2024-12-08' },
  { id: 2, settleNo: 'STL202412010002', orderNo: 'ORD202412010002', workTitle: '城市夜曲', orderAmount: 599, platformFee: 119.8, feeRate: 20, myIncome: 479.2, status: 'pending', cycle: 'T+7', settleDate: '2024-12-08' },
  { id: 3, settleNo: 'STL202412010003', orderNo: 'ORD202412010003', workTitle: '追梦人', orderAmount: 1999, platformFee: 399.8, feeRate: 20, myIncome: 1599.2, status: 'pending', cycle: 'T+7', settleDate: '2024-12-08' },
  { id: 4, settleNo: 'STL202411300004', orderNo: 'ORD202411300012', workTitle: '海边的风', orderAmount: 3999, platformFee: 799.8, feeRate: 20, myIncome: 3199.2, status: 'pending', cycle: 'T+7', settleDate: '2024-12-07' },
  { id: 5, settleNo: 'STL202411300005', orderNo: 'ORD202411300008', workTitle: '星辰大海', orderAmount: 299, platformFee: 59.8, feeRate: 20, myIncome: 239.2, status: 'pending', cycle: 'T+7', settleDate: '2024-12-07' },
  { id: 6, settleNo: 'STL202411290006', orderNo: 'ORD202411290015', workTitle: '江南雨', orderAmount: 19999, platformFee: 3999.8, feeRate: 20, myIncome: 15999.2, status: 'settled', cycle: 'T+7', settleDate: '2024-12-06' },
  { id: 7, settleNo: 'STL202411280007', orderNo: 'ORD202411280006', workTitle: '午夜情歌', orderAmount: 1599, platformFee: 319.8, feeRate: 20, myIncome: 1279.2, status: 'settled', cycle: 'T+7', settleDate: '2024-12-05' },
  { id: 8, settleNo: 'STL202411260008', orderNo: 'ORD202411260003', workTitle: '春天的故事', orderAmount: 0, platformFee: 0, feeRate: 0, myIncome: 0, status: 'settled', cycle: 'T+7', settleDate: '2024-12-03' },
  { id: 9, settleNo: 'STL202411250009', orderNo: 'ORD202411250018', workTitle: '霓虹灯下', orderAmount: 4999, platformFee: 999.8, feeRate: 20, myIncome: 3999.2, status: 'settled', cycle: 'T+7', settleDate: '2024-12-02' },
  { id: 10, settleNo: 'STL202411240010', orderNo: 'ORD202411240005', workTitle: '夏日微风', orderAmount: 2999, platformFee: 599.8, feeRate: 20, myIncome: 2399.2, status: 'settled', cycle: 'T+7', settleDate: '2024-12-01' }
])

total.value = 156

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.dateRange = []
  searchForm.status = ''
  searchForm.keyword = ''
  handleSearch()
}

const handleViewDetail = (row) => {
  currentSettle.value = row
  detailVisible.value = true
}
</script>

<style scoped lang="scss">
.settlement-page {
  .settle-no {
    font-family: monospace;
    font-size: 13px;
    color: $text-secondary;
  }

  .link-text {
    color: $primary-color;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  .income {
    color: $success-color;
    font-weight: 500;
  }

  .settlement-stats {
    .stat-item {
      background: $bg-body;
      border-radius: $border-radius;
      padding: 16px;
      text-align: center;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 700;
      color: $text-primary;
      margin-bottom: 6px;

      &.income { color: $warning-color; }
      &.success { color: $success-color; }
    }

    .stat-label {
      font-size: 13px;
      color: $text-muted;
    }
  }
}
</style>
