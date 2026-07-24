<template>
  <div class="content-page">
    <div class="page-hero">
      <div class="container">
        <h1>授权方案</h1>
        <p>清晰透明的授权体系，满足不同场景的使用需求</p>
      </div>
    </div>
    <div class="container content-inner">
      <div class="license-cards">
        <div class="license-card">
          <div class="license-header">
            <h3>非商用授权</h3>
            <div class="license-price">¥ <span>99</span> 起/首</div>
          </div>
          <div class="license-desc">适合个人学习、非商业项目使用</div>
          <ul class="license-features">
            <li>个人非商业用途</li>
            <li>完整歌词及曲谱</li>
            <li>完整Demo音频下载</li>
            <li>使用期限：永久</li>
            <li>可用于个人展示、学习研究</li>
            <li class="disabled">不可用于商业用途</li>
            <li class="disabled">不可转让授权</li>
          </ul>
          <a :href="buyerUrl" class="btn btn-block">立即选购</a>
        </div>
        <div class="license-card featured">
          <div class="badge">推荐</div>
          <div class="license-header">
            <h3>商用授权</h3>
            <div class="license-price">¥ <span>999</span> 起/首</div>
          </div>
          <div class="license-desc">适合企业商业宣传、短视频、广告配乐</div>
          <ul class="license-features">
            <li>商业用途授权</li>
            <li>完整歌词及曲谱</li>
            <li>完整Demo音频下载</li>
            <li>可用于品牌广告</li>
            <li>可用于短视频平台</li>
            <li>可用于企业宣传</li>
            <li>授权期限：1年/永久可选</li>
          </ul>
          <a :href="buyerUrl" class="btn btn-primary btn-block">立即选购</a>
        </div>
        <div class="license-card">
          <div class="license-header">
            <h3>独家授权</h3>
            <div class="license-price">¥ <span>9,999</span> 起/首</div>
          </div>
          <div class="license-desc">独家使用授权，下架保护，专享权益</div>
          <ul class="license-features">
            <li>独家使用授权</li>
            <li>作品下架保护</li>
            <li>完整歌词及曲谱</li>
            <li>完整分轨文件</li>
            <li>可商用、可改编</li>
            <li>授权期限：永久</li>
            <li>专属客服支持</li>
          </ul>
          <a :href="buyerUrl" class="btn btn-block">联系询价</a>
        </div>
        <div class="license-card">
          <div class="license-header">
            <h3>全版权买断</h3>
            <div class="license-price">¥ <span>面议</span></div>
          </div>
          <div class="license-desc">转让全部版权，归属买家所有</div>
          <ul class="license-features">
            <li>全部版权转让</li>
            <li>著作权变更登记</li>
            <li>完整源文件交付</li>
            <li>可署名、可改编</li>
            <li>可用于任何商业用途</li>
            <li>永久拥有</li>
            <li>法律文件完备</li>
          </ul>
          <a :href="buyerUrl" class="btn btn-block">商务洽谈</a>
        </div>
      </div>

      <div class="license-terms">
        <h2>授权权责说明</h2>
        <div class="terms-grid">
          <div class="term-item">
            <h4>买家权利</h4>
            <ul>
              <li>按授权类型使用作品</li>
              <li>下载授权范围内的作品文件</li>
              <li>获得电子授权凭证</li>
              <li>在授权范围内改编、演绎</li>
            </ul>
          </div>
          <div class="term-item">
            <h4>买家义务</h4>
            <ul>
              <li>按约定支付授权费用</li>
              <li>不得超出授权范围使用</li>
              <li>不得转售、转授权</li>
              <li>保护作品版权，不得侵权</li>
            </ul>
          </div>
          <div class="term-item">
            <h4>创作者权利</h4>
            <ul>
              <li>获得授权费用</li>
              <li>保有作品署名权</li>
              <li>非独家授权可继续售卖</li>
              <li>独家授权期间下架保护</li>
            </ul>
          </div>
          <div class="term-item">
            <h4>平台服务</h4>
            <ul>
              <li>电子授权凭证生成</li>
              <li>交易资金担保</li>
              <li>版权纠纷协助处理</li>
              <li>7天无理由退款保障</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const buyerUrl = 'http://localhost:5175'
</script>

<style lang="scss" scoped>
.content-page {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }
}

.page-hero {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  padding: 60px 0;
  text-align: center;
  color: #fff;

  h1 {
    font-size: 36px;
    margin-bottom: 12px;
  }
  p {
    font-size: 16px;
    opacity: 0.9;
  }
}

.content-inner {
  padding: 60px 24px;
}

.license-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.license-card {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px 24px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }

  &.featured {
    border-color: #3b82f6;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);

    .badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 12px;
    }
  }

  .license-header {
    text-align: center;
    margin-bottom: 16px;

    h3 {
      font-size: 20px;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .license-price {
      font-size: 14px;
      color: #64748b;

      span {
        font-size: 36px;
        font-weight: 700;
        color: #1e40af;
        margin: 0 4px;
      }
    }
  }

  .license-desc {
    text-align: center;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .license-features {
    margin-bottom: 24px;

    li {
      font-size: 14px;
      color: #475569;
      padding: 8px 0;
      padding-left: 20px;
      position: relative;

      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #10b981;
        font-weight: bold;
      }

      &.disabled {
        color: #cbd5e1;
        &::before { content: '✕'; color: #cbd5e1; }
      }
    }
  }

  .btn {
    display: block;
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    color: #475569;
    font-weight: 500;
    transition: all 0.3s;

    &.btn-primary {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: #fff;
      border: none;
    }

    &:hover { opacity: 0.9; }

    &.btn-block { width: 100%; }
  }
}

.license-terms {
  h2 {
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
    color: #1e293b;
  }
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  .term-item {
    background: #f8fafc;
    padding: 28px;
    border-radius: 12px;

    h4 {
      font-size: 16px;
      color: #1e293b;
      margin-bottom: 16px;
    }

    ul li {
      font-size: 13px;
      color: #64748b;
      padding: 6px 0;
      padding-left: 16px;
      position: relative;

      &::before {
        content: '·';
        position: absolute;
        left: 4px;
        color: #94a3b8;
      }
    }
  }
}
</style>
