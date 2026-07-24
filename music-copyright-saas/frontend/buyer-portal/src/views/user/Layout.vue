<template>
  <div class="user-center">
    <div class="user-header">
      <div class="header-inner">
        <div class="user-info-card">
          <div class="avatar-section">
            <el-avatar :size="72" class="user-avatar">
              {{ userStore.userInfo?.name?.charAt(0) || '用' }}
            </el-avatar>
            <div class="user-detail">
              <h2 class="user-name">{{ userStore.userInfo?.name || '用户' }}</h2>
              <div class="company-name">
                <el-icon><OfficeBuilding /></el-icon>
                {{ userStore.companyInfo?.name || '未设置企业信息' }}
              </div>
              <div class="user-tags">
                <el-tag type="success" size="small">企业认证</el-tag>
                <el-tag type="warning" size="small">VIP会员</el-tag>
              </div>
            </div>
          </div>
          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-value">{{ stats.orders }}</div>
              <div class="stat-label">订单数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.purchased }}</div>
              <div class="stat-label">已采购</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.favorites }}</div>
              <div class="stat-label">收藏数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value balance">¥{{ stats.balance }}</div>
              <div class="stat-label">账户余额</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="user-content">
      <div class="content-inner">
        <aside class="sidebar">
          <div class="sidebar-card">
            <div class="menu-group">
              <div class="menu-group-title">交易管理</div>
              <ul class="menu-list">
                <li 
                  v-for="item in orderMenus" 
                  :key="item.path"
                  class="menu-item"
                  :class="{ active: isActive(item.path) }"
                  @click="goTo(item.path)"
                >
                  <el-icon>{{ item.icon }}</el-icon>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>

            <div class="menu-group">
              <div class="menu-group-title">资产管理</div>
              <ul class="menu-list">
                <li 
                  v-for="item in assetMenus" 
                  :key="item.path"
                  class="menu-item"
                  :class="{ active: isActive(item.path) }"
                  @click="goTo(item.path)"
                >
                  <el-icon>{{ item.icon }}</el-icon>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>

            <div class="menu-group">
              <div class="menu-group-title">账户设置</div>
              <ul class="menu-list">
                <li 
                  v-for="item in accountMenus" 
                  :key="item.path"
                  class="menu-item"
                  :class="{ active: isActive(item.path) }"
                  @click="goTo(item.path)"
                >
                  <el-icon>{{ item.icon }}</el-icon>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main class="main-area">
          <div class="page-card">
            <div class="page-header">
              <h2 class="page-title">{{ currentPageTitle }}</h2>
            </div>
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const stats = reactive({
  orders: 28,
  purchased: 56,
  favorites: 128,
  balance: '12,580.00'
})

const orderMenus = [
  { path: '/user/orders', name: '我的订单', icon: 'ShoppingCart' },
  { path: '/user/purchased', name: '已采购词曲', icon: 'FolderChecked' },
  { path: '/user/certificates', name: '授权凭证', icon: 'Document' },
  { path: '/user/inquiries', name: '询价记录', icon: 'ChatDotRound' }
]

const assetMenus = [
  { path: '/user/favorites', name: '我的收藏', icon: 'Star' },
  { path: '/user/balance', name: '账户余额', icon: 'Wallet' },
  { path: '/user/invoices', name: '发票申请', icon: 'Tickets' }
]

const accountMenus = [
  { path: '/user/messages', name: '消息通知', icon: 'Bell' },
  { path: '/user/profile', name: '企业信息', icon: 'OfficeBuilding' },
  { path: '/user/password', name: '修改密码', icon: 'Lock' }
]

const allMenus = [...orderMenus, ...assetMenus, ...accountMenus]

const currentPageTitle = computed(() => {
  const menu = allMenus.find(m => isActive(m.path))
  return menu?.name || '用户中心'
})

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped lang="scss">
.user-center {
  min-height: calc(100vh - #{$header-height});
  background: $bg-body;
}

.user-header {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: 32px 0;
  margin-bottom: -60px;
  position: relative;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
}

.user-info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 72px;
  height: 72px;
  font-size: 28px;
  font-weight: 600;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  .user-name {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .company-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 8px;
  }

  .user-tags {
    display: flex;
    gap: 8px;
  }
}

.stats-section {
  display: flex;
  gap: 48px;
}

.stat-item {
  text-align: center;

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;

    &.balance {
      font-size: 24px;
    }
  }

  .stat-label {
    font-size: 13px;
    opacity: 0.85;
  }
}

.user-content {
  padding: 0 0 40px;
}

.content-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  gap: 24px;
}

.sidebar {
  width: $user-sidebar-width;
  flex-shrink: 0;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: $shadow-sm;
}

.menu-group {
  padding: 12px 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.menu-group-title {
  font-size: 12px;
  font-weight: 600;
  color: $text-muted;
  padding: 0 12px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: $text-secondary;
    transition: $transition-base;

    .el-icon {
      font-size: 18px;
    }

    &:hover {
      background: $bg-body;
      color: $text-primary;
    }

    &.active {
      background: rgba(30, 64, 175, 0.08);
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.main-area {
  flex: 1;
  min-width: 0;
}

.page-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: $shadow-sm;
  min-height: 600px;
}

.page-header {
  padding: 20px 24px;
  border-bottom: 1px solid $border-light;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  margin: 0;
}
</style>
