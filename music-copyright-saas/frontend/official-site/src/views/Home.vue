<template>
  <div class="home-page">
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">
            专业音乐版权<br/>
            <span class="highlight">交易SaaS平台</span>
          </h1>
          <p class="hero-desc">
            面向音乐全产业链，提供词曲版权交易、音乐作品发行、版权登记存证一站式服务。
            安全、透明、高效的音乐版权管理解决方案。
          </p>
          <div class="hero-actions">
            <a :href="buyerUrl" class="btn btn-primary btn-lg">采购词曲作品</a>
            <a :href="creatorUrl" class="btn btn-outline btn-lg">音乐人入驻</a>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-num">10,000+</div>
              <div class="stat-label">优质词曲作品</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">2,000+</div>
              <div class="stat-label">合作音乐人</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">500+</div>
              <div class="stat-label">企业客户</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">99.9%</div>
              <div class="stat-label">版权合规率</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card card-1">
            <el-icon :size="32"><Headset /></el-icon>
            <div>
              <div class="card-title">词曲交易集市</div>
              <div class="card-desc">海量优质词曲任您选</div>
            </div>
          </div>
          <div class="visual-card card-2">
            <el-icon :size="32"><Medal /></el-icon>
            <div>
              <div class="card-title">版权登记存证</div>
              <div class="card-desc">权威证书 法律保障</div>
            </div>
          </div>
          <div class="visual-card card-3">
            <el-icon :size="32"><Promotion /></el-icon>
            <div>
              <div class="card-title">全平台发行</div>
              <div class="card-desc">覆盖主流音乐平台</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-bg"></div>
    </section>

    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">三大核心服务</h2>
          <p class="section-desc">覆盖音乐版权全生命周期，为音乐人及企业客户提供专业服务</p>
        </div>
        <div class="services-grid">
          <div class="service-card" @click="$router.push('/service/copyright-trade')">
            <div class="service-icon icon-trade">
              <el-icon :size="28"><ShoppingCart /></el-icon>
            </div>
            <h3>词曲版权交易</h3>
            <p>连接创作者与采购方，提供多维度筛选、在线试听、即时交易的词曲交易服务。多种授权模式，满足不同使用场景需求。</p>
            <div class="service-link">了解详情 <el-icon><ArrowRight /></el-icon></div>
          </div>
          <div class="service-card" @click="$router.push('/service/release')">
            <div class="service-icon icon-release">
              <el-icon :size="28"><Promotion /></el-icon>
            </div>
            <h3>音乐作品发行</h3>
            <p>一键发行至全球主流音乐平台，覆盖Spotify、Apple Music、QQ音乐、网易云音乐等200+渠道，专业发行团队全程护航。</p>
            <div class="service-link">了解详情 <el-icon><ArrowRight /></el-icon></div>
          </div>
          <div class="service-card" @click="$router.push('/service/registration')">
            <div class="service-icon icon-copyright">
              <el-icon :size="28"><Medal /></el-icon>
            </div>
            <h3>版权登记存证</h3>
            <p>提供专业版权登记服务，电子版权证书快速生成，区块链存证技术保障版权权属清晰，为您的音乐创作保驾护航。</p>
            <div class="service-link">了解详情 <el-icon><ArrowRight /></el-icon></div>
          </div>
        </div>
      </div>
    </section>

    <section class="partners-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">合作客户</h2>
          <p class="section-desc">服务于唱片公司、MCN机构、品牌方、影视公司等全产业链客户</p>
        </div>
        <div class="partners-grid">
          <div v-for="i in 8" :key="i" class="partner-logo">
            <span>合作客户 {{ i }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-inner">
        <div class="cta-content">
          <h2>开启您的音乐版权之旅</h2>
          <p>无论是采购优质词曲，还是售卖您的音乐创作，我们都能满足您的需求</p>
        </div>
        <div class="cta-actions">
          <a :href="buyerUrl" class="btn btn-white">企业采购通道</a>
          <a :href="creatorUrl" class="btn btn-outline-white">音乐人入驻</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const buyerUrl = 'http://localhost:5175'
const creatorUrl = 'http://localhost:5176'
</script>

<style lang="scss" scoped>
.home-page {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .section-header {
    text-align: center;
    margin-bottom: 48px;

    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .section-desc {
      font-size: 16px;
      color: #64748b;
    }
  }
}

.hero {
  position: relative;
  padding: 80px 0 100px;
  overflow: hidden;

  .hero-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%);
    z-index: -1;
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }

  .hero-title {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.2;
    color: #0f172a;
    margin-bottom: 24px;

    .highlight {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .hero-desc {
    font-size: 17px;
    color: #64748b;
    line-height: 1.8;
    margin-bottom: 36px;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    margin-bottom: 48px;

    .btn {
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      display: inline-block;
      font-weight: 500;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      &:hover { opacity: 0.9; transform: translateY(-1px); }
    }

    .btn-outline {
      border: 2px solid #1e40af;
      color: #1e40af;
      &:hover { background: #eff6ff; }
    }
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    .stat-item {
      .stat-num {
        font-size: 28px;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 4px;
      }
      .stat-label {
        font-size: 13px;
        color: #64748b;
      }
    }
  }

  .hero-visual {
    position: relative;
    height: 420px;

    .visual-card {
      position: absolute;
      background: #fff;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 16px;

      .card-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 2px;
      }
      .card-desc {
        font-size: 12px;
        color: #94a3b8;
      }

      &.card-1 {
        top: 20px;
        left: 0;
        color: #3b82f6;
        animation: float 6s ease-in-out infinite;
      }
      &.card-2 {
        top: 150px;
        right: 20px;
        color: #10b981;
        animation: float 6s ease-in-out infinite 1s;
      }
      &.card-3 {
        bottom: 40px;
        left: 40px;
        color: #f59e0b;
        animation: float 6s ease-in-out infinite 2s;
      }
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.services-section {
  padding: 80px 0;
  background: #fff;

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  }

  .service-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 40px 32px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(30, 64, 175, 0.1);
      border-color: #e0e7ff;
      background: #fff;
    }

    .service-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-bottom: 24px;

      &.icon-trade { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-release { background: linear-gradient(135deg, #34d399, #10b981); }
      &.icon-copyright { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.8;
      margin-bottom: 20px;
    }

    .service-link {
      font-size: 14px;
      color: #1e40af;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.partners-section {
  padding: 80px 0;
  background: #f8fafc;

  .partners-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .partner-logo {
      background: #fff;
      height: 80px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 14px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s;

      &:hover {
        border-color: #cbd5e1;
        color: #64748b;
      }
    }
  }
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);

  .cta-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: 32px;
      color: #fff;
      margin-bottom: 8px;
    }

    p {
      color: #bfdbfe;
      font-size: 16px;
    }
  }

  .cta-actions {
    display: flex;
    gap: 16px;

    .btn {
      padding: 14px 28px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-block;
      font-weight: 500;
    }

    .btn-white {
      background: #fff;
      color: #1e40af;
      &:hover { background: #f1f5f9; }
    }

    .btn-outline-white {
      border: 2px solid rgba(255,255,255,0.5);
      color: #fff;
      &:hover {
        border-color: #fff;
        background: rgba(255,255,255,0.1);
      }
    }
  }
}
</style>
