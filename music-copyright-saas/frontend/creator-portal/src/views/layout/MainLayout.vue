<template>
  <div class="main-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <el-icon :size="24"><Music /></el-icon>
        </div>
        <span class="logo-text" v-show="!isCollapsed">创作者工作台</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        background-color="transparent"
        text-color="rgba(255,255,255,0.7)"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>工作台概览</template>
        </el-menu-item>

        <el-sub-menu index="work">
          <template #title>
            <el-icon><Files /></el-icon>
            <span>作品管理</span>
          </template>
          <el-menu-item index="/work/lyric">词曲作品</el-menu-item>
          <el-menu-item index="/work/release">发行作品</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <template #title>交易台账</template>
        </el-menu-item>

        <el-sub-menu index="earnings">
          <template #title>
            <el-icon><Wallet /></el-icon>
            <span>收益中心</span>
          </template>
          <el-menu-item index="/earnings/index">收益概览</el-menu-item>
          <el-menu-item index="/earnings/flow">销售流水</el-menu-item>
          <el-menu-item index="/earnings/settlement">分账明细</el-menu-item>
          <el-menu-item index="/earnings/withdraw">提现申请</el-menu-item>
          <el-menu-item index="/earnings/account">收款账户</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="copyright">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>版权业务</span>
          </template>
          <el-menu-item index="/copyright/apply">版权登记申请</el-menu-item>
          <el-menu-item index="/copyright/list">版权登记记录</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>账号设置</span>
          </template>
          <el-menu-item index="/settings/profile">基本资料</el-menu-item>
          <el-menu-item index="/settings/sub-account">子账号管理</el-menu-item>
          <el-menu-item index="/settings/password">修改密码</el-menu-item>
        </el-sub-menu>
      </el-menu>

      <div class="sidebar-footer">
        <div class="collapse-btn" @click="toggleCollapse">
          <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
        </div>
      </div>
    </aside>

    <div class="main-wrapper" :class="{ collapsed: isCollapsed }">
      <header class="header">
        <div class="header-left">
          <div class="collapse-toggle" @click="toggleCollapse">
            <el-icon :size="20"><Menu /></el-icon>
          </div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPageTitle">{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <div class="tenant-info">
            <el-tag type="success" effect="light">创作者版</el-tag>
          </div>

          <el-badge :value="5" :max="99" class="message-badge">
            <el-button text class="icon-btn">
              <el-icon :size="20"><Bell /></el-icon>
            </el-button>
          </el-badge>

          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="36" class="user-avatar">
                {{ userStore.userInfo?.name?.charAt(0) || '创' }}
              </el-avatar>
              <div class="user-detail">
                <div class="user-name">{{ userStore.userInfo?.name || '创作者' }}</div>
                <div class="user-role">
                  <el-tag size="small" type="info" effect="light">独立音乐人</el-tag>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  基本资料
                </el-dropdown-item>
                <el-dropdown-item command="earnings">
                  <el-icon><Wallet /></el-icon>
                  收益中心
                </el-dropdown-item>
                <el-dropdown-item command="password" divided>
                  <el-icon><Lock /></el-icon>
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapsed = ref(false)

const activeMenu = computed(() => {
  return route.path
})

const currentPageTitle = computed(() => {
  return route.meta?.title || ''
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/settings/profile')
      break
    case 'earnings':
      router.push('/earnings/index')
      break
    case 'password':
      router.push('/settings/password')
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: $sidebar-width;
  background: linear-gradient(180deg, $primary-darker 0%, $primary-color 100%);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;

  &.collapsed {
    width: $sidebar-collapsed-width;
  }
}

.sidebar-logo {
  height: $header-height;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  padding: 12px 0;

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    height: 48px;
    line-height: 48px;
    margin: 4px 8px;
    border-radius: 6px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  :deep(.el-menu-item.is-active) {
    background: $primary-light !important;
    color: #fff !important;
  }

  :deep(.el-sub-menu .el-menu-item) {
    min-width: auto;
    padding-left: 48px !important;
  }
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 6px;
  transition: $transition-base;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left 0.3s ease;
}

.header {
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
  cursor: pointer;
  border-radius: 6px;
  transition: $transition-base;

  &:hover {
    background: $bg-body;
    color: $primary-color;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tenant-info {
  margin-right: 8px;
}

.icon-btn {
  color: $text-secondary;

  &:hover {
    color: $primary-color;
  }
}

.message-badge {
  :deep(.el-badge__content) {
    font-size: 11px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  transition: $transition-base;

  &:hover {
    background: $bg-body;
  }
}

.user-avatar {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  font-weight: 600;
}

.user-detail {
  line-height: 1.3;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.user-role {
  margin-top: 2px;
}

.arrow-icon {
  color: $text-muted;
  font-size: 12px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: $bg-body;
}
</style>
