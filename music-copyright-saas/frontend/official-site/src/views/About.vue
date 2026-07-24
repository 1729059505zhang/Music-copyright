<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-badge">关于我们</div>
        <h1>让音乐版权价值最大化</h1>
        <p>专业的音乐版权交易SaaS平台，连接创作者与市场，为音乐全产业链赋能</p>
      </div>
    </section>

    <section class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-content">
            <div class="section-badge">平台介绍</div>
            <h2 class="section-title">专注音乐版权<br/>服务全产业链</h2>
            <p class="about-desc">
              MusicCopyright 是国内领先的音乐版权交易SaaS平台，致力于为音乐创作者、唱片公司、MCN机构、品牌方等提供一站式版权服务。
            </p>
            <p class="about-desc">
              平台涵盖词曲版权交易、音乐作品发行、版权登记存证三大核心业务，通过技术创新与专业服务，构建高效、透明、安全的音乐版权交易生态，让每一首好音乐都能实现其商业价值。
            </p>
            <p class="about-desc">
              自成立以来，我们已服务超过2,000位音乐人和500家企业客户，平台累计交易词曲作品超10,000首，版权合规率达99.9%，获得业界广泛认可。
            </p>
          </div>
          <div class="about-stats">
            <div class="stat-card">
              <div class="stat-num">10,000+</div>
              <div class="stat-label">优质词曲作品</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">2,000+</div>
              <div class="stat-label">合作音乐人</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">500+</div>
              <div class="stat-label">企业客户</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">99.9%</div>
              <div class="stat-label">版权合规率</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section mission-section">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-card">
            <div class="mission-icon">
              <el-icon :size="32"><Lightbulb /></el-icon>
            </div>
            <h3>我们的愿景</h3>
            <p>成为全球领先的音乐版权服务平台，让每一个音乐创意都能被发现、被尊重、被价值化。</p>
          </div>
          <div class="mission-card">
            <div class="mission-icon">
              <el-icon :size="32"><Aim /></el-icon>
            </div>
            <h3>我们的使命</h3>
            <p>用技术和服务连接音乐创作者与商业市场，推动音乐版权交易透明化、高效化，助力音乐产业健康发展。</p>
          </div>
          <div class="mission-card">
            <div class="mission-icon">
              <el-icon :size="32"><Star /></el-icon>
            </div>
            <h3>我们的价值观</h3>
            <p>尊重创作、诚信经营、技术驱动、用户至上，用专业和真诚服务每一位客户。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">联系我们</h2>
          <p class="section-desc">商务合作、客户服务，欢迎随时与我们联系</p>
        </div>
        <div class="contact-grid">
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon :size="28"><Briefcase /></el-icon>
            </div>
            <h3>商务合作</h3>
            <p>品牌合作、机构入驻、渠道合作</p>
            <div class="contact-info-item">
              <el-icon><Phone /></el-icon>
              <span>400-888-8888 转 1</span>
            </div>
            <div class="contact-info-item">
              <el-icon><Message /></el-icon>
              <span>business@musiccopyright.com</span>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon :size="28"><Headset /></el-icon>
            </div>
            <h3>客户服务</h3>
            <p>使用咨询、问题反馈、售后支持</p>
            <div class="contact-info-item">
              <el-icon><Phone /></el-icon>
              <span>400-888-8888 转 2</span>
            </div>
            <div class="contact-info-item">
              <el-icon><Message /></el-icon>
              <span>service@musiccopyright.com</span>
            </div>
          </div>
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon :size="28"><Location /></el-icon>
            </div>
            <h3>公司地址</h3>
            <p>欢迎到访，洽谈合作</p>
            <div class="contact-info-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>北京市朝阳区音乐大厦A座18层</span>
            </div>
            <div class="contact-info-item">
              <el-icon><Clock /></el-icon>
              <span>工作日 9:00 - 18:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section map-section">
      <div class="container">
        <div class="map-placeholder">
          <el-icon :size="48" color="#94a3b8"><Location /></el-icon>
          <p>北京市朝阳区音乐大厦A座18层</p>
          <span>地图位置示意图</span>
        </div>
      </div>
    </section>

    <section class="section cooperation-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">商务合作</h2>
          <p class="section-desc">多种合作模式，携手共赢未来</p>
        </div>
        <div class="cooperation-grid">
          <el-card class="coop-card" shadow="hover">
            <div class="coop-icon">
              <el-icon :size="28"><TrendCharts /></el-icon>
            </div>
            <h3>品牌合作</h3>
            <p>品牌音乐定制、联名推广、广告配乐等品牌音乐营销合作。</p>
          </el-card>
          <el-card class="coop-card" shadow="hover">
            <div class="coop-icon">
              <el-icon :size="28"><OfficeBuilding /></el-icon>
            </div>
            <h3>机构合作</h3>
            <p>唱片公司、MCN机构、音乐工作室入驻，批量作品运营合作。</p>
          </el-card>
          <el-card class="coop-card" shadow="hover">
            <div class="coop-icon">
              <el-icon :size="28"><Link /></el-icon>
            </div>
            <h3>渠道合作</h3>
            <p>流量渠道、平台联运、API接入等多元化渠道合作模式。</p>
          </el-card>
          <el-card class="coop-card" shadow="hover">
            <div class="coop-icon">
              <el-icon :size="28"><Medal /></el-icon>
            </div>
            <h3>版权合作</h3>
            <p>版权采购、版权分销、独家代理等版权内容合作。</p>
          </el-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.content-page {
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

  .section {
    padding: 80px 0;
  }
}

.page-hero {
  position: relative;
  padding: 80px 0 100px;
  text-align: center;
  color: #fff;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  overflow: hidden;

  .hero-badge {
    display: inline-block;
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    font-size: 13px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
  }

  h1 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.3;
  }

  p {
    font-size: 17px;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.about-section {
  background: #fff;

  .about-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .section-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 24px;
    line-height: 1.3;
  }

  .about-desc {
    font-size: 15px;
    color: #64748b;
    line-height: 1.9;
    margin-bottom: 16px;
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    .stat-card {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 16px;
      padding: 32px 24px;
      text-align: center;

      &:nth-child(2) {
        margin-top: 24px;
        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      }
      &:nth-child(3) {
        background: linear-gradient(135deg, #fffbeb, #fef3c7);
      }
      &:nth-child(4) {
        margin-top: 24px;
        background: linear-gradient(135deg, #fdf4ff, #fae8ff);
      }

      .stat-num {
        font-size: 32px;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #64748b;
      }
    }
  }
}

.mission-section {
  background: #f8fafc;

  .mission-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .mission-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px 32px;
    text-align: center;
    transition: all 0.3s;
    border: 1px solid #e2e8f0;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(30, 64, 175, 0.1);
      border-color: #bfdbfe;
    }

    .mission-icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
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
    }
  }
}

.contact-section {
  background: #fff;

  .contact-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .contact-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 36px 28px;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(30, 64, 175, 0.08);
      border-color: #e0e7ff;
      background: #fff;
    }

    .contact-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    > p {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .contact-info-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #475569;
      padding: 6px 0;

      .el-icon {
        color: #3b82f6;
        font-size: 16px;
      }
    }
  }
}

.map-section {
  padding: 0 0 80px;
  background: #fff;

  .map-placeholder {
    height: 320px;
    background: #f1f5f9;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;

    p {
      font-size: 16px;
      color: #475569;
      font-weight: 500;
    }

    span {
      font-size: 13px;
      color: #94a3b8;
    }
  }
}

.cooperation-section {
  background: #f8fafc;

  .cooperation-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .coop-card {
    border-radius: 16px;
    border: none;
    text-align: center;

    :deep(.el-card__body) {
      padding: 36px 24px;
    }

    .coop-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    h3 {
      font-size: 17px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }

    p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.7;
    }
  }
}
</style>
