<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-badge">词曲授权交易</div>
        <h1>海量优质词曲，一键授权使用</h1>
        <p>连接音乐创作者与商业需求方，提供透明、安全、高效的词曲版权交易服务</p>
        <div class="hero-actions">
          <a :href="buyerUrl" class="btn btn-white btn-lg">立即选曲</a>
          <a :href="creatorUrl" class="btn btn-outline-white btn-lg">出售作品</a>
        </div>
      </div>
    </section>

    <section class="section advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">服务优势</h2>
          <p class="section-desc">专业平台保障，让词曲交易更安心</p>
        </div>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon icon-library">
              <el-icon :size="28"><Collection /></el-icon>
            </div>
            <h3>海量曲库</h3>
            <p>10,000+优质原创词曲作品，覆盖流行、摇滚、民谣、电子、古风等多种风格，满足不同场景需求。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-transparent">
              <el-icon :size="28"><View /></el-icon>
            </div>
            <h3>透明交易</h3>
            <p>明码标价，授权范围清晰明确，无隐藏费用。交易全程可追溯，保障买卖双方权益。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-shield">
              <el-icon :size="28"><Shield /></el-icon>
            </div>
            <h3>授权保障</h3>
            <p>电子授权凭证即时生成，区块链存证技术确保版权权属清晰，提供法律维权支持。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-audit">
              <el-icon :size="28"><DocumentChecked /></el-icon>
            </div>
            <h3>专业审核</h3>
            <p>每首作品均经过专业音乐审核团队严格筛选，确保作品质量与版权真实性。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">交易流程</h2>
          <p class="section-desc">四步完成词曲授权，简单高效</p>
        </div>
        <div class="process-steps">
          <div class="step-item">
            <div class="step-number">01</div>
            <div class="step-icon">
              <el-icon :size="32"><Search /></el-icon>
            </div>
            <h3>选曲</h3>
            <p>按风格、情绪、速度、乐器等多维度筛选，快速找到心仪作品。</p>
          </div>
          <div class="step-arrow">
            <el-icon :size="24"><ArrowRight /></el-icon>
          </div>
          <div class="step-item">
            <div class="step-number">02</div>
            <div class="step-icon">
              <el-icon :size="32"><VideoPlay /></el-icon>
            </div>
            <h3>试听</h3>
            <p>在线完整试听Demo，查看歌词、曲谱及作品详情，确认是否符合需求。</p>
          </div>
          <div class="step-arrow">
            <el-icon :size="24"><ArrowRight /></el-icon>
          </div>
          <div class="step-item">
            <div class="step-number">03</div>
            <div class="step-icon">
              <el-icon :size="32"><CreditCard /></el-icon>
            </div>
            <h3>购买</h3>
            <p>选择授权类型，在线支付完成购买，平台担保交易资金安全。</p>
          </div>
          <div class="step-arrow">
            <el-icon :size="24"><ArrowRight /></el-icon>
          </div>
          <div class="step-item">
            <div class="step-number">04</div>
            <div class="step-icon">
              <el-icon :size="32"><Medal /></el-icon>
            </div>
            <h3>获取授权</h3>
            <p>即时下载作品文件，生成电子授权凭证，即刻投入使用。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section scenarios-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">适用场景</h2>
          <p class="section-desc">广泛应用于各行业商业场景</p>
        </div>
        <div class="scenarios-grid">
          <div class="scenario-card">
            <div class="scenario-icon icon-video">
              <el-icon :size="26"><VideoCamera /></el-icon>
            </div>
            <h3>短视频</h3>
            <p>抖音、快手、B站等短视频平台背景音乐，快速获取授权避免侵权风险。</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-icon icon-ad">
              <el-icon :size="26"><Promotion /></el-icon>
            </div>
            <h3>广告营销</h3>
            <p>品牌广告、宣传片、产品演示视频配乐，提升品牌形象与传播效果。</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-icon icon-film">
              <el-icon :size="26"><Film /></el-icon>
            </div>
            <h3>影视动漫</h3>
            <p>电影、电视剧、网络大电影、动漫作品的配乐及主题曲授权。</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-icon icon-game">
              <el-icon :size="26"><Trophy /></el-icon>
            </div>
            <h3>游戏配乐</h3>
            <p>手游、端游、小游戏的背景音乐、主题曲及音效授权服务。</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-icon icon-brand">
              <el-icon :size="26"><OfficeBuilding /></el-icon>
            </div>
            <h3>品牌商用</h3>
            <p>企业主题曲、品牌声音LOGO、线下门店背景音乐等商业使用。</p>
          </div>
          <div class="scenario-card">
            <div class="scenario-icon icon-more">
              <el-icon :size="26"><MoreFilled /></el-icon>
            </div>
            <h3>更多场景</h3>
            <p>播客、有声书、线上课程、舞台剧等，满足各类音乐使用需求。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-inner">
        <div class="cta-content">
          <h2>开启您的词曲采购之旅</h2>
          <p>海量优质词曲，一键授权，即刻使用</p>
        </div>
        <div class="cta-actions">
          <a :href="buyerUrl" class="btn btn-white">立即选曲</a>
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
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
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

.advantages-section {
  background: #fff;

  .advantages-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .advantage-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 36px 28px;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(30, 64, 175, 0.1);
      border-color: #e0e7ff;
      background: #fff;
    }

    .advantage-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-bottom: 20px;

      &.icon-library { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-transparent { background: linear-gradient(135deg, #34d399, #10b981); }
      &.icon-shield { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
      &.icon-audit { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
    }

    h3 {
      font-size: 18px;
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

.process-section {
  background: #f8fafc;

  .process-steps {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
  }

  .step-item {
    flex: 1;
    text-align: center;
    max-width: 220px;

    .step-number {
      font-size: 48px;
      font-weight: 800;
      color: #e0e7ff;
      margin-bottom: 8px;
      line-height: 1;
    }

    .step-icon {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.7;
    }
  }

  .step-arrow {
    color: #cbd5e1;
    padding-top: 80px;
    flex-shrink: 0;
    margin: 0 8px;
  }
}

.scenarios-section {
  background: #fff;

  .scenarios-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .scenario-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    gap: 20px;
    transition: all 0.3s;

    &:hover {
      border-color: #3b82f6;
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
      transform: translateY(-2px);
    }

    .scenario-icon {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      &.icon-video { background: linear-gradient(135deg, #f472b6, #ec4899); }
      &.icon-ad { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-film { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
      &.icon-game { background: linear-gradient(135deg, #34d399, #10b981); }
      &.icon-brand { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
      &.icon-more { background: linear-gradient(135deg, #94a3b8, #64748b); }
    }

    .scenario-content {
      flex: 1;
    }

    h3 {
      font-size: 17px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.7;
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
