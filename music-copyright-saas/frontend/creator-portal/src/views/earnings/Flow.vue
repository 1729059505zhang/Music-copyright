<template>
  <div class="earnings-flow-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">销售流水</h2>
          <p class="page-subtitle">查看所有收入和支出明细</p>
        </div>
        <div class="header-actions">
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出流水
          </el-button>
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
          <el-select v-model="searchForm.type" placeholder="流水类型" clearable style="width: 140px">
            <el-option label="全部类型" value="" />
            <el-option label="收入" value="income" />
            <el-option label="支出" value="expense" />
          </el-select>
          <el-select v-model="searchForm.bizType" placeholder="业务类型" clearable style="width: 160px">
            <el-option label="全部业务" value="" />
            <el-option label="商用授权" value="commercial" />
            <el-option label="非商用授权" value="non_commercial" />
            <el-option label="独家授权" value="exclusive" />
            <el-option label="提现" value="withdraw" />
            <el-option label="退款" value="refund" />
          </el-select>
          <el-input v-model="searchForm.keyword" placeholder="搜索订单号/作品" style="width: 220px">
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

        <div class="summary-bar">
          <div class="summary-item">
            <span class="label">总收入</span>
            <span class="value income">+¥{{ summary.totalIncome.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="label">总支出</span>
            <span class="value expense">-¥{{ summary.totalExpense.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="label">净收入</span>
            <span class="value net">¥{{ summary.netIncome.toLocaleString() }}</span>
          </div>
          <div class="summary-item">
            <span class="label">流水笔数</span>
            <span class="value count">{{ summary.count }} 笔</span>
          </div>
        </div>

        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="flowNo" label="流水号" width="180">
            <template #default="{ row }">
              <span class="flow-no">{{ row.flowNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="80">
            <template #default="{ row }">
              <el-tag size="small" :type="row.amountType === 'income' ? 'success' : 'warning'" effect="plain">
                {{ row.amountType === 'income' ? '收入' : '支出' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="bizType" label="业务类型" width="120" />
          <el-table-column prop="relatedOrder" label="关联订单" width="170">
            <template #default="{ row }">
              <span v-if="row.relatedOrder" class="link-text">{{ row.relatedOrder }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="workTitle" label="作品" min-width="160">
            <template #default="{ row }">
              <span v-if="row.workTitle">{{ row.workTitle }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额(元)" width="120" align="right">
            <template #default="{ row }">
              <span :class="row.amountType">
                {{ row.amountType === 'income' ? '+' : '-' }}¥{{ row.amount.toLocaleString() }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balanceAfter" label="余额(元)" width="120" align="right">
            <template #default="{ row }">
              ¥{{ row.balanceAfter.toLocaleString() }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="160">
            <template #default="{ row }">
              {{ row.remark || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="时间" width="160" />
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const total = ref(0)

const summary = ref({
  totalIncome: 25680.5,
  totalExpense: 8000,
  netIncome: 17680.5,
  count: 28
})

const searchForm = reactive({
  dateRange: [],
  type: '',
  bizType: '',
  keyword: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { id: 1, flowNo: 'FL202412010001', type: 'income', amountType: 'income', bizType: '商用授权', relatedOrder: 'ORD202412010001', workTitle: '夏日微风', amount: 2399.2, balanceAfter: 25680.5, remark: '星辰传媒有限公司商用授权', createdAt: '2024-12-01 14:32:10' },
  { id: 2, flowNo: 'FL202412010002', type: 'income', amountType: 'income', bizType: '非商用授权', relatedOrder: 'ORD202412010002', workTitle: '城市夜曲', amount: 479.2, balanceAfter: 23281.3, remark: '光影影视工作室非商用授权', createdAt: '2024-12-01 11:21:30' },
  { id: 3, flowNo: 'FL202411300003', type: 'expense', amountType: 'expense', bizType: '提现', relatedOrder: '-', workTitle: '-', amount: 5000, balanceAfter: 22802.1, remark: '提现到工商银行尾号8888', createdAt: '2024-11-30 16:00:00' },
  { id: 4, flowNo: 'FL202411300004', type: 'income', amountType: 'income', bizType: '商用授权', relatedOrder: 'ORD202411300012', workTitle: '海边的风', amount: 3199.2, balanceAfter: 27802.1, remark: '快乐综艺制作组商用授权', createdAt: '2024-11-30 16:48:00' },
  { id: 5, flowNo: 'FL202411300005', type: 'income', amountType: 'income', bizType: '非商用授权', relatedOrder: 'ORD202411300008', workTitle: '星辰大海', amount: 239.2, balanceAfter: 24602.9, remark: '短视频达人小李非商用授权', createdAt: '2024-11-30 09:31:20' },
  { id: 6, flowNo: 'FL202411290006', type: 'income', amountType: 'income', bizType: '独家授权', relatedOrder: 'ORD202411290015', workTitle: '江南雨', amount: 15999.2, balanceAfter: 24363.7, remark: '汉服品牌店独家授权', createdAt: '2024-11-29 15:25:30' },
  { id: 7, flowNo: 'FL202411280007', type: 'income', amountType: 'income', bizType: '商用授权', relatedOrder: 'ORD202411280006', workTitle: '午夜情歌', amount: 1279.2, balanceAfter: 8364.5, remark: '咖啡连锁店商用授权', createdAt: '2024-11-28 11:12:40' },
  { id: 8, flowNo: 'FL202411270008', type: 'expense', amountType: 'expense', bizType: '退款', relatedOrder: 'ORD202411270020', workTitle: '街头狂想', amount: 719.2, balanceAfter: 7085.3, remark: '订单取消退款', createdAt: '2024-11-27 18:00:00' },
  { id: 9, flowNo: 'FL202411260009', type: 'income', amountType: 'income', bizType: '非商用授权', relatedOrder: 'ORD202411260003', workTitle: '春天的故事', amount: 0, balanceAfter: 7804.5, remark: '公益基金会公益授权', createdAt: '2024-11-26 09:01:00' },
  { id: 10, flowNo: 'FL202411250010', type: 'income', amountType: 'income', bizType: '商用授权', relatedOrder: 'ORD202411250018', workTitle: '霓虹灯下', amount: 3999.2, balanceAfter: 7804.5, remark: '游戏开发公司商用授权', createdAt: '2024-11-25 16:35:10' }
])

total.value = 168

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.dateRange = []
  searchForm.type = ''
  searchForm.bizType = ''
  searchForm.keyword = ''
  handleSearch()
}

const handleExport = () => {
  ElMessage.info('流水导出功能开发中')
}
</script>

<style scoped lang="scss">
.earnings-flow-page {
  .flow-no {
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

  .expense {
    color: $danger-color;
    font-weight: 500;
  }

  .summary-bar {
    display: flex;
    gap: 32px;
    padding: 16px 20px;
    background: $bg-body;
    border-radius: $border-radius;
    margin-bottom: 16px;
  }

  .summary-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 13px;
      color: $text-muted;
    }

    .value {
      font-size: 18px;
      font-weight: 600;

      &.income { color: $success-color; }
      &.expense { color: $danger-color; }
      &.net { color: $primary-color; }
      &.count { color: $text-primary; font-size: 16px; }
    }
  }
}
</style>
