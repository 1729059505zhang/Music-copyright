<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-badge">音乐发行服务</div>
        <h1>一键发行，触达全球听众</h1>
        <p>覆盖200+主流音乐平台，专业发行团队全程护航，让你的音乐被世界听见</p>
        <div class="hero-actions">
          <a :href="creatorUrl" class="btn btn-white btn-lg">立即发行</a>
          <a :href="creatorUrl" class="btn btn-outline-white btn-lg">了解更多</a>
        </div>
      </div>
    </section>

    <section class="section intro-section">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-content">
            <div class="section-badge">服务介绍</div>
            <h2 class="section-title">全球200+平台<br/>一键发行全覆盖</h2>
            <p class="section-desc">
              我们与全球主流音乐平台深度合作，提供一站式音乐发行服务。
              只需上传一次作品，即可同步发行至QQ音乐、网易云音乐、Spotify、Apple Music等
              200+平台，让你的音乐触达全球数十亿听众。
            </p>
            <div class="intro-stats">
              <div class="intro-stat">
                <div class="stat-num">200+</div>
                <div class="stat-label">发行平台</div>
              </div>
              <div class="intro-stat">
                <div class="stat-num">98%</div>
                <div class="stat-label">上架成功率</div>
              </div>
              <div class="intro-stat">
                <div class="stat-num">7-15天</div>
                <div class="stat-label">最快上架</div>
              </div>
              <div class="intro-stat">
                <div class="stat-num">100%</div>
                <div class="stat-label">版权归你</div>
              </div>
            </div>
          </div>
          <div class="intro-visual">
            <div class="platform-ring">
              <div class="ring-center">
                <el-icon :size="48" color="#3b82f6"><Promotion /></el-icon>
                <div class="ring-text">全球发行</div>
              </div>
              <div class="platform-icon p1"><span>QQ</span></div>
              <div class="platform-icon p2"><span>网易</span></div>
              <div class="platform-icon p3"><span>Spotify</span></div>
              <div class="platform-icon p4"><span>Apple</span></div>
              <div class="platform-icon p5"><span>酷狗</span></div>
              <div class="platform-icon p6"><span>酷我</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section channels-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">发行渠道</h2>
          <p class="section-desc">覆盖全球主流音乐平台，全面触达目标听众</p>
        </div>
        <div class="channels-grid">
          <div class="channel-card">
            <div class="channel-icon icon-qq">
              <el-icon :size="24"><Headset /></el-icon>
            </div>
            <h4>QQ音乐</h4>
            <p>国内最大音乐平台</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-163">
              <el-icon :size="24"><MusicNote /></el-icon>
            </div>
            <h4>网易云音乐</h4>
            <p>音乐社区领导者</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-spotify">
              <el-icon :size="24"><TrendCharts /></el-icon>
            </div>
            <h4>Spotify</h4>
            <p>全球最大流媒体</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-apple">
              <el-icon :size="24"><Iphone /></el-icon>
            </div>
            <h4>Apple Music</h4>
            <p>苹果生态音乐服务</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-kugou">
              <el-icon :size="24"><Microphone /></el-icon>
            </div>
            <h4>酷狗音乐</h4>
            <p>国民级音乐应用</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-kuwo">
              <el-icon :size="24"><MagicStick /></el-icon>
            </div>
            <h4>酷我音乐</h4>
            <p>高品质音乐平台</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-bilibili">
              <el-icon :size="24"><VideoCamera /></el-icon>
            </div>
            <h4>哔哩哔哩</h4>
            <p>Z世代音乐社区</p>
          </div>
          <div class="channel-card">
            <div class="channel-icon icon-more">
              <el-icon :size="24"><MoreFilled /></el-icon>
            </div>
            <h4>更多平台</h4>
            <p>200+平台全覆盖</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">发行流程</h2>
          <p class="section-desc">五步完成音乐发行，简单高效</p>
        </div>
        <div class="process-steps">
          <div class="step-item">
            <div class="step-number">01</div>
            <div class="step-icon">
              <el-icon :size="28"><Upload /></el-icon>
            </div>
            <h3>上传作品</h3>
            <p>上传音频文件、封面图，填写作品信息与歌词。</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">02</div>
            <div class="step-icon">
              <el-icon :size="28"><DocumentChecked /></el-icon>
            </div>
            <h3>专业审核</h3>
            <p>专业团队审核作品质量与版权合规性。</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">03</div>
            <div class="step-icon">
              <el-icon :size="28"><Promotion /></el-icon>
            </div>
            <h3>全网发行</h3>
            <p>同步推送至200+音乐平台，全球上线。</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">04</div>
            <div class="step-icon">
              <el-icon :size="28"><DataAnalysis /></el-icon>
            </div>
            <h3>数据统计</h3>
            <p>实时查看播放量、收藏量、粉丝增长等数据。</p>
          </div>
          <div class="step-connector"></div>
          <div class="step-item">
            <div class="step-number">05</div>
            <div class="step-icon">
              <el-icon :size="28"><Wallet /></el-icon>
            </div>
            <h3>收益结算</h3>
            <p>透明结算体系，按月结算播放收益。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section valueadded-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">增值服务</h2>
          <p class="section-desc">专业服务助力音乐梦想起飞</p>
        </div>
        <div class="valueadded-grid">
          <el-card class="value-card" shadow="hover">
            <div class="value-icon icon-cover">
              <el-icon :size="32"><Picture /></el-icon>
            </div>
            <h3>封面设计</h3>
            <p>专业设计师一对一服务，打造独特的专辑封面视觉。提供多套设计方案，满足不同风格需求。</p>
            <ul class="value-features">
              <li>3套设计方案可选</li>
              <li>3次免费修改</li>
              <li>源文件交付</li>
            </ul>
          </el-card>
          <el-card class="value-card" shadow="hover">
            <div class="value-icon icon-promo">
              <el-icon :size="32"><TrendCharts /></el-icon>
            </div>
            <h3>推广宣传</h3>
            <p>平台推荐位、歌单推荐、社交媒体推广等多渠道宣发，提升作品曝光度与影响力。</p>
            <ul class="value-features">
              <li>首页Banner推荐</li>
              <li>精选歌单收录</li>
              <li>社交媒体传播</li>
            </ul>
          </el-card>
          <el-card class="value-card" shadow="hover">
            <div class="value-icon icon-mix">
              <el-icon :size="32"><MagicStick /></el-icon>
            </div>
            <h3>混音母带</h3>
            <p>专业混音师、母带工程师为你的作品提供高品质后期处理，打造专业级音质。</p>
            <ul class="value-features">
              <li>专业混音处理</li>
              <li>母带后期制作</li>
              <li>多版本交付</li>
            </ul>
          </el-card>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-inner">
        <div class="cta-content">
          <h2>让世界听见你的音乐</h2>
          <p>立即加入，开启全球音乐发行之旅</p>
        </div>
        <div class="cta-actions">
          <a :href="creatorUrl" class="btn btn-white">立即发行</a>
          <a :href="creatorUrl" class="btn btn-outline-white">联系我们</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const creatorUrl = 'http://localhost:5176'
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
  background: linear-gradient(135deg, #0e7490 0%, #06b6d4 100%);
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
    margin-bottom: 36px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    display: flex;
    gap: 16px;
    justify-content: center;

    .btn {
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      display: inline-block;
      font-weight: 500;
    }

    .btn-white {
      background: #fff;
      color: #0e7490;
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

.intro-section {
  background: #fff;

  .intro-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  .section-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #ecfeff;
    color: #0e7490;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 20px;
    line-height: 1.3;
  }

  .section-desc {
    font-size: 15px;
    color: #64748b;
    line-height: 1.9;
    margin-bottom: 32px;
  }

  .intro-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    .intro-stat {
      text-align: center;
      padding: 20px 12px;
      background: #f8fafc;
      border-radius: 12px;

      .stat-num {
        font-size: 24px;
        font-weight: 700;
        color: #0e7490;
        margin-bottom: 4px;
      }
      .stat-label {
        font-size: 13px;
        color: #64748b;
      }
    }
  }

  .intro-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .platform-ring {
    position: relative;
    width: 380px;
    height: 380px;

    .ring-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 140px;
      height: 140px;
      background: linear-gradient(135deg, #ecfeff, #cffafe);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;

      .ring-text {
        font-size: 16px;
        font-weight: 600;
        color: #0e7490;
      }
    }

    .platform-icon {
      position: absolute;
      width: 60px;
      height: 60px;
      background: #fff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #0e7490;
      box-shadow: 0 8px 24px rgba(14, 116, 144, 0.15);

      &.p1 { top: 30px; left: 50%; transform: translateX(-50%); }
      &.p2 { top: 80px; right: 20px; }
      &.p3 { bottom: 80px; right: 20px; }
      &.p4 { bottom: 30px; left: 50%; transform: translateX(-50%); }
      &.p5 { bottom: 80px; left: 20px; }
      &.p6 { top: 80px; left: 20px; }
    }
  }
}

.channels-section {
  background: #f8fafc;

  .channels-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .channel-card {
    background: #fff;
    border-radius: 12px;
    padding: 28px 24px;
    text-align: center;
    transition: all 0.3s;
    border: 1px solid #e2e8f0;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
      border-color: #06b6d4;
    }

    .channel-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin: 0 auto 16px;

      &.icon-qq { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-163 { background: linear-gradient(135deg, #f87171, #ef4444); }
      &.icon-spotify { background: linear-gradient(135deg, #4ade80, #22c55e); }
      &.icon-apple { background: linear-gradient(135deg, #94a3b8, #64748b); }
      &.icon-kugou { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
      &.icon-kuwo { background: linear-gradient(135deg, #c084fc, #a855f7); }
      &.icon-bilibili { background: linear-gradient(135deg, #f472b6, #ec4899); }
      &.icon-more { background: linear-gradient(135deg, #22d3ee, #06b6d4); }
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 6px;
    }

    p {
      font-size: 13px;
      color: #94a3b8;
    }
  }
}

.process-section {
  background: #fff;

  .process-steps {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .step-item {
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 2;

    .step-number {
      font-size: 14px;
      font-weight: 600;
      color: #06b6d4;
      background: #ecfeff;
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .step-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #06b6d4, #0e7490);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.7;
      max-width: 160px;
      margin: 0 auto;
    }
  }

  .step-connector {
    flex: 0 0 40px;
    height: 2px;
    background: linear-gradient(90deg, #06b6d4, #a5f3fc);
    margin-top: 48px;
    border-radius: 1px;
  }
}

.valueadded-section {
  background: #f8fafc;

  .valueadded-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .value-card {
    border-radius: 16px;
    border: none;

    :deep(.el-card__body) {
      padding: 36px 32px;
    }

    .value-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-bottom: 20px;

      &.icon-cover { background: linear-gradient(135deg, #c084fc, #a855f7); }
      &.icon-promo { background: linear-gradient(135deg, #f472b6, #ec4899); }
      &.icon-mix { background: linear-gradient(135deg, #22d3ee, #06b6d4); }
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

    .value-features {
      li {
        font-size: 14px;
        color: #475569;
        padding: 6px 0;
        padding-left: 20px;
        position: relative;

        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
      }
    }
  }
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #0e7490 0%, #06b6d4 100%);

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
      color: #a5f3fc;
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
      color: #0e7490;
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
