<template>
  <div class="messages-page">
    <div class="message-sidebar">
      <div class="sidebar-header">
        <h3>消息通知</h3>
        <el-button text type="primary" size="small" @click="markAllRead">全部已读</el-button>
      </div>
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category.key"
          class="category-item"
          :class="{ active: activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          <div class="category-left">
            <el-icon :size="18">{{ category.icon }}</el-icon>
            <span>{{ category.name }}</span>
          </div>
          <el-badge v-if="category.unread > 0" :value="category.unread" class="unread-badge" />
        </div>
      </div>
    </div>

    <div class="message-content">
      <div class="content-header">
        <h3>{{ currentCategoryName }}</h3>
        <div class="header-actions">
          <el-button text size="small" @click="refreshMessages">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <div v-if="messageList.length > 0" class="message-list">
        <div 
          v-for="msg in messageList" 
          :key="msg.id"
          class="message-item"
          :class="{ unread: !msg.read }"
          @click="viewMessage(msg)"
        >
          <div class="msg-icon" :class="msg.type">
            <el-icon :size="20">{{ getMessageIcon(msg.type) }}</el-icon>
          </div>
          <div class="msg-content">
            <div class="msg-title-row">
              <span class="msg-title">{{ msg.title }}</span>
              <span class="msg-time">{{ msg.time }}</span>
            </div>
            <p class="msg-desc text-ellipsis">{{ msg.content }}</p>
          </div>
          <div v-if="!msg.read" class="unread-dot"></div>
        </div>
      </div>

      <div v-else class="empty-state">
        <el-empty description="暂无消息" />
      </div>

      <div v-if="messageList.length > 0" class="pagination-wrapper">
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

    <el-dialog v-model="detailDialogVisible" title="消息详情" width="560px">
      <div v-if="currentMessage" class="message-detail">
        <div class="detail-header">
          <div class="msg-icon large" :class="currentMessage.type">
            <el-icon :size="24">{{ getMessageIcon(currentMessage.type) }}</el-icon>
          </div>
          <div>
            <h3>{{ currentMessage.title }}</h3>
            <p class="msg-meta">{{ currentMessage.time }}</p>
          </div>
        </div>
        <div class="detail-body">
          <p>{{ currentMessage.content }}</p>
          <div v-if="currentMessage.detail" class="detail-extra">
            <p v-for="(line, idx) in currentMessage.detailLines" :key="idx">{{ line }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeCategory = ref('all')
const detailDialogVisible = ref(false)
const currentMessage = ref(null)
const total = ref(36)

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const categories = ref([
  { key: 'all', name: '全部消息', icon: 'Bell', unread: 5 },
  { key: 'order', name: '订单通知', icon: 'ShoppingCart', unread: 2 },
  { key: 'system', name: '系统通知', icon: 'Warning', unread: 1 },
  { key: 'activity', name: '活动通知', icon: 'Present', unread: 2 },
  { key: 'finance', name: '财务通知', icon: 'Wallet', unread: 0 }
])

const currentCategoryName = computed(() => {
  const cat = categories.value.find(c => c.key === activeCategory.value)
  return cat?.name || '全部消息'
})

const messageList = ref([
  {
    id: 1,
    type: 'order',
    title: '订单支付成功',
    content: '您的订单「夏日微风 - 商业授权」已支付成功，金额 ¥899.00。可在已采购词曲中查看和下载。',
    time: '2024-01-15 14:35',
    read: false,
    detailLines: [
      '订单号：ORD202401150001',
      '作品名称：夏日微风',
      '授权类型：商业授权',
      '支付金额：¥899.00',
      '支付方式：账户余额',
      '授权凭证：已生成'
    ]
  },
  {
    id: 2,
    type: 'system',
    title: '企业资质认证通过',
    content: '恭喜您，企业资质认证已通过审核！您现在可以正常使用平台所有采购功能了。',
    time: '2024-01-15 10:20',
    read: false,
    detailLines: [
      '企业名称：北京示例科技有限公司',
      '认证类型：企业资质认证',
      '审核结果：通过',
      '生效时间：2024-01-15 10:20:00',
      '认证有效期：长期有效'
    ]
  },
  {
    id: 3,
    type: 'activity',
    title: '新春特惠活动开启',
    content: '新春特惠！全场商业授权8折优惠，独家授权满5000减1000，活动截止到2月15日。',
    time: '2024-01-14 09:00',
    read: false,
    detailLines: [
      '活动时间：2024年1月14日 - 2024年2月15日',
      '优惠内容1：商业授权全场8折',
      '优惠内容2：独家授权满5000减1000',
      '优惠内容3：充值满10000送1000',
      '活动规则：不与其他优惠叠加'
    ]
  },
  {
    id: 4,
    type: 'order',
    title: '询价已回复',
    content: '您对「星空下的约定」的询价已收到回复，请及时查看详情。',
    time: '2024-01-13 15:40',
    read: false,
    detailLines: [
      '询价作品：星空下的约定',
      '询价类型：独家授权',
      '报价金额：¥5,999.00',
      '回复时间：2024-01-13 15:40:00',
      '有效期：7天'
    ]
  },
  {
    id: 5,
    type: 'activity',
    title: '新用户专属福利',
    content: '欢迎加入音乐版权采购平台！新用户首单立减200元，更有专属客服一对一服务。',
    time: '2024-01-12 16:00',
    read: false,
    detailLines: [
      '福利内容1：首单立减200元',
      '福利内容2：免费体验3首作品',
      '福利内容3：专属客服对接',
      '有效期：注册后30天内',
      '使用方式：下单时自动抵扣'
    ]
  },
  {
    id: 6,
    type: 'finance',
    title: '充值成功',
    content: '您的账户已成功充值 ¥5,000.00，当前余额 ¥12,580.00。',
    time: '2024-01-10 11:30',
    read: true,
    detailLines: [
      '充值金额：¥5,000.00',
      '支付方式：支付宝',
      '到账时间：2024-01-10 11:30:00',
      '当前余额：¥12,580.00',
      '订单号：RC202401100001'
    ]
  },
  {
    id: 7,
    type: 'system',
    title: '密码修改成功',
    content: '您的账户密码已于 2024-01-08 14:30 修改成功，如非本人操作请及时联系客服。',
    time: '2024-01-08 14:30',
    read: true,
    detailLines: [
      '操作类型：修改密码',
      '操作时间：2024-01-08 14:30:00',
      '操作IP：192.168.1.100',
      '设备信息：Windows 10 / Chrome',
      '如非本人操作，请立即联系客服：400-888-8888'
    ]
  }
])

const getMessageIcon = (type) => {
  const map = {
    order: 'ShoppingCart',
    system: 'Warning',
    activity: 'Present',
    finance: 'Wallet'
  }
  return map[type] || 'Bell'
}

const viewMessage = (msg) => {
  currentMessage.value = msg
  detailDialogVisible.value = true
  if (!msg.read) {
    msg.read = true
    const cat = categories.value.find(c => c.key === msg.type)
    if (cat && cat.unread > 0) cat.unread--
    const allCat = categories.value.find(c => c.key === 'all')
    if (allCat && allCat.unread > 0) allCat.unread--
  }
}

const markAllRead = () => {
  messageList.value.forEach(msg => {
    msg.read = true
  })
  categories.value.forEach(cat => {
    cat.unread = 0
  })
  ElMessage.success('已全部标记为已读')
}

const refreshMessages = () => {
  ElMessage.success('消息已刷新')
}
</script>

<style scoped lang="scss">
.messages-page {
  display: flex;
  height: 600px;
}

.message-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid $border-light;
  background: #fafafa;
  border-radius: 12px 0 0 12px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid $border-light;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.category-list {
  padding: 8px 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: $transition-base;

  &:hover {
    background: $bg-body;
  }

  &.active {
    background: rgba(30, 64, 175, 0.08);
    color: $primary-color;
    font-weight: 500;
  }
}

.category-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.unread-badge {
  :deep(.el-badge__content) {
    font-size: 11px;
  }
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid $border-light;

  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    margin: 0;
  }
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid $border-light;
  cursor: pointer;
  transition: $transition-base;
  position: relative;

  &:hover {
    background: $bg-body;
  }

  &.unread {
    background: rgba(30, 64, 175, 0.02);
  }
}

.msg-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;

  &.order {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  }

  &.system {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  &.activity {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.finance {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  }

  &.large {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.msg-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.msg-time {
  font-size: 12px;
  color: $text-muted;
  flex-shrink: 0;
}

.msg-desc {
  font-size: 13px;
  color: $text-secondary;
  margin: 0;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: $danger-color;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-detail {
  .detail-header {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-light;

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $text-primary;
      margin: 0 0 4px;
    }

    .msg-meta {
      font-size: 13px;
      color: $text-muted;
      margin: 0;
    }
  }

  .detail-body {
    p {
      font-size: 14px;
      color: $text-secondary;
      line-height: 1.8;
      margin-bottom: 12px;
    }

    .detail-extra {
      margin-top: 16px;
      padding: 16px;
      background: $bg-body;
      border-radius: 8px;

      p {
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
