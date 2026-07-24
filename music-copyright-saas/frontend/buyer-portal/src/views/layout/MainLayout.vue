<template>
  <div class="main-layout">
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <router-link to="/market" class="logo">
            <div class="logo-icon">
              <el-icon :size="24"><Music /></el-icon>
            </div>
            <span class="logo-text">音乐版权采购平台</span>
          </router-link>
          <nav class="nav-menu">
            <router-link to="/market" class="nav-item">
              <el-icon><Shop /></el-icon>
              <span>词曲集市</span>
            </router-link>
          </nav>
        </div>

        <div class="header-center">
          <div class="search-box">
            <el-input 
              v-model="searchKeyword" 
              placeholder="搜索词曲作品、创作者、曲风..." 
              size="large"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>

        <div class="header-right">
          <el-badge :value="3" :max="99" class="notification-badge">
            <el-button text class="icon-btn">
              <el-icon :size="20"><Bell /></el-icon>
            </el-button>
          </el-badge>

          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="36" class="user-avatar">
                {{ userStore.userInfo?.name?.charAt(0) || '用' }}
              </el-avatar>
              <div class="user-detail">
                <div class="user-name">{{ userStore.userInfo?.name || '未登录' }}</div>
                <div class="user-role">
                  <el-tag v-if="userStore.userInfo" size="small" type="success">企业采购</el-tag>
                  <span v-else>游客</span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  企业信息
                </el-dropdown-item>
                <el-dropdown-item command="orders">
                  <el-icon><ShoppingCart /></el-icon>
                  我的订单
                </el-dropdown-item>
                <el-dropdown-item command="purchased">
                  <el-icon><FolderChecked /></el-icon>
                  已采购词曲
                </el-dropdown-item>
                <el-dropdown-item command="favorites">
                  <el-icon><Star /></el-icon>
                  我的收藏
                </el-dropdown-item>
                <el-dropdown-item command="balance">
                  <el-icon><Wallet /></el-icon>
                  账户余额
                </el-dropdown-item>
                <el-dropdown-item divided command="password">
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
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-links">
          <a href="javascript:;">关于我们</a>
          <a href="javascript:;">服务条款</a>
          <a href="javascript:;">隐私政策</a>
          <a href="javascript:;">帮助中心</a>
          <a href="javascript:;">联系客服</a>
        </div>
        <div class="footer-copyright">
          © 2024 音乐版权采购平台 版权所有
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const searchKeyword = ref('')

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/market', query: { keyword: searchKeyword.value } })
  }
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'orders':
      router.push('/user/orders')
      break
    case 'purchased':
      router.push('/user/purchased')
      break
    case 'favorites':
      router.push('/user/favorites')
      break
    case 'balance':
      router.push('/user/balance')
      break
    case 'password':
      router.push('/user/password')
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: $shadow-sm;
}

.header-inner {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  &:hover {
    .logo-text {
      color: $primary-color;
    }
  }
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  transition: $transition-base;
}

.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  color: $text-secondary;
  font-size: 14px;
  font-weight: 500;
  transition: $transition-base;

  &:hover,
  &.router-link-active {
    color: $primary-color;
    background: rgba(30, 64, 175, 0.08);
  }
}

.header-center {
  flex: 1;
  max-width: 560px;
}

.search-box {
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px $border-color inset;
    border-radius: 8px;

    &:hover,
    &.is-focus {
      box-shadow: 0 0 0 1px $primary-light inset;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-btn {
  color: $text-secondary;

  &:hover {
    color: $primary-color;
  }
}

.notification-badge {
  :deep(.el-badge__content) {
    font-size: 11px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 8px;
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
  font-size: 12px;
  color: $text-muted;
}

.arrow-icon {
  color: $text-muted;
  font-size: 12px;
}

.main-content {
  flex: 1;
}

.footer {
  background: #fff;
  border-top: 1px solid $border-color;
  padding: 24px 0;
  margin-top: 40px;
}

.footer-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 32px;
  text-align: center;
}

.footer-links {
  margin-bottom: 16px;

  a {
    color: $text-secondary;
    font-size: 13px;
    margin: 0 16px;
    transition: $transition-base;

    &:hover {
      color: $primary-color;
    }
  }
}

.footer-copyright {
  font-size: 12px;
  color: $text-muted;
}
</style>
