<template>
  <div class="site-layout">
    <header class="site-header">
      <div class="container header-inner">
        <div class="logo" @click="$router.push('/')">
          <el-icon :size="28" color="#1e40af"><MusicNote /></el-icon>
          <span class="logo-text">MusicCopyright</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/" class="nav-item">首页</router-link>
          <el-dropdown trigger="click">
            <span class="nav-item">
              业务服务 <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/service/copyright-trade')">词曲授权交易</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/service/release')">音乐发行服务</el-dropdown-item>
                <el-dropdown-item @click="$router.push('/service/registration')">版权登记服务</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <router-link to="/license" class="nav-item">授权方案</router-link>
          <router-link to="/agency" class="nav-item">机构入驻</router-link>
          <router-link to="/help" class="nav-item">帮助中心</router-link>
        </nav>
        <div class="header-actions">
          <a :href="buyerPortalUrl" class="btn btn-outline">采购商入口</a>
          <a :href="creatorPortalUrl" class="btn btn-primary">创作者入驻</a>
        </div>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-col">
          <div class="footer-logo">
            <el-icon :size="24" color="#3b82f6"><MusicNote /></el-icon>
            <span>MusicCopyright</span>
          </div>
          <p class="footer-desc">专业的音乐版权交易SaaS平台，为音乐全产业链提供版权交易、发行、登记一站式服务。</p>
        </div>
        <div class="footer-col">
          <h4>业务服务</h4>
          <ul>
            <li><router-link to="/service/copyright-trade">词曲版权交易</router-link></li>
            <li><router-link to="/service/release">音乐发行服务</router-link></li>
            <li><router-link to="/service/registration">版权登记存证</router-link></li>
            <li><router-link to="/license">授权方案说明</router-link></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>关于我们</h4>
          <ul>
            <li><router-link to="/about">平台介绍</router-link></li>
            <li><router-link to="/agency">机构入驻</router-link></li>
            <li><router-link to="/help">帮助中心</router-link></li>
            <li><router-link to="/about">联系我们</router-link></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>联系我们</h4>
          <ul class="contact-list">
            <li><el-icon><Phone /></el-icon> 400-888-8888</li>
            <li><el-icon><Message /></el-icon> service@musiccopyright.com</li>
            <li><el-icon><Location /></el-icon> 北京市朝阳区音乐大厦</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <div class="footer-links">
            <router-link to="/agreement">用户协议</router-link>
            <span>|</span>
            <router-link to="/privacy">隐私政策</router-link>
            <span>|</span>
            <router-link to="/about">版权声明</router-link>
          </div>
          <p>© 2024 MusicCopyright SaaS Platform. All Rights Reserved. 京ICP备12345678号</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const buyerPortalUrl = 'http://localhost:5175'
const creatorPortalUrl = 'http://localhost:5176'
</script>

<style lang="scss" scoped>
.site-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: #1e40af;
    letter-spacing: 0.5px;
  }
}

.nav-menu {
  display: flex;
  gap: 32px;

  .nav-item {
    font-size: 15px;
    color: #475569;
    cursor: pointer;
    padding: 8px 0;
    position: relative;
    transition: color 0.3s;

    &:hover, &.router-link-active {
      color: #1e40af;
    }

    &.router-link-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #1e40af;
      border-radius: 1px;
    }
  }
}

.header-actions {
  display: flex;
  gap: 12px;

  .btn {
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-block;
  }

  .btn-outline {
    border: 1px solid #1e40af;
    color: #1e40af;
    &:hover { background: #eff6ff; }
  }

  .btn-primary {
    background: linear-gradient(135deg, #3b82f6, #1e40af);
    color: #fff;
    &:hover { opacity: 0.9; }
  }
}

.site-main {
  flex: 1;
}

.site-footer {
  background: #0f172a;
  color: #94a3b8;
  padding-top: 60px;

  .footer-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    padding-bottom: 40px;
  }

  .footer-col {
    h4 {
      color: #e2e8f0;
      font-size: 15px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    ul li {
      margin-bottom: 12px;
      font-size: 14px;

      a {
        transition: color 0.3s;
        &:hover { color: #60a5fa; }
      }
    }
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;

    span {
      font-size: 18px;
      font-weight: 700;
      color: #f1f5f9;
    }
  }

  .footer-desc {
    font-size: 13px;
    line-height: 1.8;
  }

  .contact-list li {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .footer-bottom {
    border-top: 1px solid #1e293b;
    padding: 20px 0;
    font-size: 13px;

    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .footer-links {
    display: flex;
    gap: 16px;
    align-items: center;

    a {
      transition: color 0.3s;
      &:hover { color: #60a5fa; }
    }
  }
}
</style>
