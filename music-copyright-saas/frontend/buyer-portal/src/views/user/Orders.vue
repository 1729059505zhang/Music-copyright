<template>
  <div class="orders-page">
    <div class="filter-bar">
      <el-tabs v-model="activeTab" class="status-tabs">
        <el-tab-pane label="全部订单" name="all" />
        <el-tab-pane label="待付款" name="pending" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="已取消" name="cancelled" />
        <el-tab-pane label="退款中" name="refunding" />
      </el-tabs>

      <div class="search-section">
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
        <el-date-picker 
          v-model="dateRange" 
          type="daterange" 
          range-separator="至" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="order-list">
      <div v-for="order in orderList" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-label">订单号：</span>
            <span class="order-no">{{ order.orderNo }}</span>
            <span class="order-time">{{ order.createTime }}</span>
          </div>
          <div class="order-status">
            <el-tag :type="getStatusType(order.status)" effect="dark">
              {{ getStatusText(order.status) }}
            </el-tag>
          </div>
        </div>

        <div class="order-body">
          <div class="work-info">
            <img :src="order.cover" :alt="order.workTitle" class="work-cover" />
            <div class="work-detail">
              <h3 class="work-title">{{ order.workTitle }}</h3>
              <p class="work-creator">创作者：{{ order.creator }}</p>
              <div class="work-tags">
                <el-tag size="small" effect="plain">{{ order.licenseType }}</el-tag>
                <el-tag size="small" type="info" effect="plain">{{ order.genre }}</el-tag>
              </div>
            </div>
          </div>
          <div class="order-amount">
            <div class="amount-label">订单金额</div>
            <div class="amount-value">¥{{ order.amount }}</div>
          </div>
          <div class="order-actions">
            <el-button 
              v-if="order.status === 'pending'" 
              type="primary" 
              size="small"
              @click="handlePay(order)"
            >
              去付款
            </el-button>
            <el-button 
              v-if="order.status === 'completed'" 
              size="small"
              @click="viewCertificate(order)"
            >
              授权凭证
            </el-button>
            <el-button 
              v-if="order.status === 'completed'" 
              size="small"
              @click="downloadOrder(order)"
            >
              下载文件
            </el-button>
            <el-button text type="primary" size="small">订单详情</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('all')
const searchKeyword = ref('')
const dateRange = ref('')
const total = ref(28)

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const orderList = ref([
  {
    id: 1,
    orderNo: 'ORD202401150001',
    createTime: '2024-01-15 14:30:25',
    status: 'completed',
    workTitle: '夏日微风',
    cover: 'https://picsum.photos/200/200?random=1',
    creator: '李音乐',
    licenseType: '商业授权',
    genre: '流行',
    amount: '899.00'
  },
  {
    id: 2,
    orderNo: 'ORD202401140002',
    createTime: '2024-01-14 10:15:32',
    status: 'pending',
    workTitle: '星空下的约定',
    cover: 'https://picsum.photos/200/200?random=2',
    creator: '王创作',
    licenseType: '独家授权',
    genre: '民谣',
    amount: '5,999.00'
  },
  {
    id: 3,
    orderNo: 'ORD202401130003',
    createTime: '2024-01-13 16:45:08',
    status: 'completed',
    workTitle: '江南烟雨',
    cover: 'https://picsum.photos/200/200?random=4',
    creator: '古风韵',
    licenseType: '商业授权',
    genre: '古风',
    amount: '2,999.00'
  },
  {
    id: 4,
    orderNo: 'ORD202401120004',
    createTime: '2024-01-12 09:20:15',
    status: 'cancelled',
    workTitle: '电子狂欢',
    cover: 'https://picsum.photos/200/200?random=3',
    creator: 'DJ小飞',
    licenseType: '个人授权',
    genre: '电子',
    amount: '299.00'
  },
  {
    id: 5,
    orderNo: 'ORD202401110005',
    createTime: '2024-01-11 18:55:42',
    status: 'refunding',
    workTitle: '城市夜晚',
    cover: 'https://picsum.photos/200/200?random=5',
    creator: '都市音乐人',
    licenseType: '商业授权',
    genre: 'R&B',
    amount: '1,599.00'
  }
])

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'info',
    refunding: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待付款',
    completed: '已完成',
    cancelled: '已取消',
    refunding: '退款中'
  }
  return map[status] || status
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handlePay = (order) => {
  ElMessage.success(`正在跳转到支付页面：${order.orderNo}`)
}

const viewCertificate = (order) => {
  ElMessage.info(`查看授权凭证：${order.orderNo}`)
}

const downloadOrder = (order) => {
  ElMessage.success(`开始下载：${order.workTitle}`)
}
</script>

<style scoped lang="scss">
.orders-page {
  padding: 24px;
}

.filter-bar {
  margin-bottom: 20px;
}

.status-tabs {
  margin-bottom: 16px;

  :deep(.el-tabs__item) {
    font-size: 14px;
  }
}

.search-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  border: 1px solid $border-color;
  border-radius: 10px;
  overflow: hidden;
  transition: $transition-base;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #f8fafc;
  border-bottom: 1px solid $border-light;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;

  .order-label {
    color: $text-secondary;
  }

  .order-no {
    font-weight: 500;
    color: $text-primary;
  }

  .order-time {
    color: $text-muted;
  }
}

.order-body {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 24px;
}

.work-info {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
}

.work-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.work-detail {
  flex: 1;
  min-width: 0;

  .work-title {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 6px;
  }

  .work-creator {
    font-size: 13px;
    color: $text-secondary;
    margin-bottom: 8px;
  }

  .work-tags {
    display: flex;
    gap: 6px;
  }
}

.order-amount {
  text-align: center;
  min-width: 120px;

  .amount-label {
    font-size: 12px;
    color: $text-muted;
    margin-bottom: 4px;
  }

  .amount-value {
    font-size: 20px;
    font-weight: 700;
    color: $danger-color;
  }
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 100px;
}
</style>
