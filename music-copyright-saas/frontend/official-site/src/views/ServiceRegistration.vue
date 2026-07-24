<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-badge">版权登记服务</div>
        <h1>权威版权登记，守护音乐创作</h1>
        <p>专业版权登记服务，区块链存证技术，快速生成电子版权证书，为您的音乐创作保驾护航</p>
        <div class="hero-actions">
          <a :href="creatorUrl" class="btn btn-white btn-lg">立即登记</a>
          <a :href="creatorUrl" class="btn btn-outline-white btn-lg">了解详情</a>
        </div>
      </div>
    </section>

    <section class="section intro-section">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-visual">
            <div class="certificate-preview">
              <div class="cert-inner">
                <div class="cert-badge">
                  <el-icon :size="24"><Medal /></el-icon>
                </div>
                <div class="cert-title">音乐作品著作权登记证书</div>
                <div class="cert-no">登记号：渝作登字-2024-XXXXXXXX</div>
                <div class="cert-divider"></div>
                <div class="cert-info">
                  <div class="info-row">
                    <span class="info-label">作品名称</span>
                    <span class="info-value">XXXXXX</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">作者</span>
                    <span class="info-value">XXXXXX</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">著作权人</span>
                    <span class="info-value">XXXXXX</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">创作完成日期</span>
                    <span class="info-value">2024-XX-XX</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">登记日期</span>
                    <span class="info-value">2024-XX-XX</span>
                  </div>
                </div>
                <div class="cert-seal">
                  <div class="seal-inner">版权登记专用章</div>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-content">
            <div class="section-badge">服务介绍</div>
            <h2 class="section-title">权威版权登记<br/>法律有效保障</h2>
            <p class="section-desc">
              我们与权威版权登记机构合作，为音乐创作者提供专业、便捷的版权登记服务。
              通过区块链存证技术，确保版权权属清晰、不可篡改。电子版权证书与纸质证书具有同等法律效力，
              是您维权诉讼的重要证据。
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <el-icon color="#f59e0b"><Select /></el-icon>
                <span>权威机构合作，证书全国有效</span>
              </div>
              <div class="feature-item">
                <el-icon color="#f59e0b"><Select /></el-icon>
                <span>区块链存证，不可篡改可追溯</span>
              </div>
              <div class="feature-item">
                <el-icon color="#f59e0b"><Select /></el-icon>
                <span>电子证书即时生成，纸质证书邮寄</span>
              </div>
              <div class="feature-item">
                <el-icon color="#f59e0b"><Select /></el-icon>
                <span>专业法务团队，维权协助支持</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">登记流程</h2>
          <p class="section-desc">三步完成版权登记，简单高效</p>
        </div>
        <div class="process-steps">
          <div class="step-card">
            <div class="step-number">01</div>
            <div class="step-icon">
              <el-icon :size="32"><Upload /></el-icon>
            </div>
            <h3>提交材料</h3>
            <p>上传作品音频、身份证明、创作说明等材料，填写作品基本信息。</p>
            <ul class="step-list">
              <li>作品音频文件</li>
              <li>身份证明文件</li>
              <li>作品创作说明</li>
              <li>权利归属证明</li>
            </ul>
          </div>
          <div class="step-arrow">
            <el-icon :size="32"><ArrowRight /></el-icon>
          </div>
          <div class="step-card">
            <div class="step-number">02</div>
            <div class="step-icon">
              <el-icon :size="32"><DocumentChecked /></el-icon>
            </div>
            <h3>审核登记</h3>
            <p>专业审核团队审核材料，提交版权登记机构，区块链同步存证。</p>
            <ul class="step-list">
              <li>材料初审（1-2个工作日）</li>
              <li>机构复审（3-5个工作日）</li>
              <li>区块链存证</li>
              <li>生成登记号</li>
            </ul>
          </div>
          <div class="step-arrow">
            <el-icon :size="32"><ArrowRight /></el-icon>
          </div>
          <div class="step-card">
            <div class="step-number">03</div>
            <div class="step-icon">
              <el-icon :size="32"><Medal /></el-icon>
            </div>
            <h3>生成证书</h3>
            <p>审核通过后生成电子版权证书，如需纸质证书将安排邮寄。</p>
            <ul class="step-list">
              <li>电子证书即时下载</li>
              <li>区块链可验证</li>
              <li>纸质证书7-15天邮寄</li>
              <li>证书永久有效</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section validity-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">证书效力说明</h2>
          <p class="section-desc">权威认证，法律保障，维权有力证据</p>
        </div>
        <div class="validity-grid">
          <div class="validity-card">
            <div class="validity-icon">
              <el-icon :size="28"><ScaleToBalance /></el-icon>
            </div>
            <h3>法律效力</h3>
            <p>电子版权证书与纸质证书具有同等法律效力，可作为著作权归属的初步证明。</p>
          </div>
          <div class="validity-card">
            <div class="validity-icon">
              <el-icon :size="28"><Link /></el-icon>
            </div>
            <h3>区块链存证</h3>
            <p>采用区块链技术存证，时间戳不可篡改，确保版权权属清晰可追溯。</p>
          </div>
          <div class="validity-card">
            <div class="validity-icon">
              <el-icon :size="28"><ShieldCheck /></el-icon>
            </div>
            <h3>维权依据</h3>
            <p>在版权纠纷、侵权诉讼中，版权登记证书是重要的权利证据，可有效维护合法权益。</p>
          </div>
          <div class="validity-card">
            <div class="validity-icon">
              <el-icon :size="28"><Trophy /></el-icon>
            </div>
            <h3>资质证明</h3>
            <p>可用于项目申报、资质认定、入驻平台等场景，证明作品原创性与合法性。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section faq-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">常见问题</h2>
          <p class="section-desc">关于版权登记，您可能想了解的问题</p>
        </div>
        <el-collapse class="faq-collapse">
          <el-collapse-item title="版权登记需要多长时间？" name="1">
            <p>电子版权登记一般需要3-7个工作日完成审核并生成电子证书。如需纸质证书，在审核通过后7-15个工作日内寄出。具体时间可能因登记机构工作量略有变动。</p>
          </el-collapse-item>
          <el-collapse-item title="哪些作品可以申请版权登记？" name="2">
            <p>音乐作品（歌曲、纯音乐、配乐等）、歌词作品、曲谱作品等均可申请版权登记。作品必须是原创的，且不得侵犯他人著作权。我们支持单曲、专辑、歌词、曲谱等多种类型的版权登记。</p>
          </el-collapse-item>
          <el-collapse-item title="电子证书和纸质证书有什么区别？" name="3">
            <p>电子版权证书与纸质证书具有同等法律效力，均可作为著作权归属的证明。电子证书即时生成，可随时下载验证；纸质证书为实体证件，适合存档或展示使用。您可根据需要选择。</p>
          </el-collapse-item>
          <el-collapse-item title="版权登记的有效期是多久？" name="4">
            <p>根据著作权法规定，公民的作品，其发表权、复制权等权利的保护期为作者终生及其死亡后五十年；法人或者其他组织的作品，保护期为五十年。版权登记证书一经颁发，永久有效，无需年审。</p>
          </el-collapse-item>
          <el-collapse-item title="合作创作的作品如何登记？" name="5">
            <p>合作创作的作品，需所有合作作者共同申请登记。申请时需提供所有作者的身份证明文件，并明确著作权归属方式（共同共有或按份共有）。具体可咨询我们的客服人员。</p>
          </el-collapse-item>
          <el-collapse-item title="如果发现他人侵权，登记证书有用吗？" name="6">
            <p>版权登记证书是证明著作权归属的重要证据。在发生版权纠纷时，登记证书可以作为初步证据使用，减轻权利人的举证负担。同时我们提供专业的法务咨询服务，协助您维护合法权益。</p>
          </el-collapse-item>
        </el-collapse>
      </div>
    </section>

    <section class="cta-section">
      <div class="container cta-inner">
        <div class="cta-content">
          <h2>为您的音乐创作穿上法律铠甲</h2>
          <p>立即登记，守护每一个音乐创意</p>
        </div>
        <div class="cta-actions">
          <a :href="creatorUrl" class="btn btn-white">立即登记</a>
          <a :href="creatorUrl" class="btn btn-outline-white">咨询客服</a>
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
  background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);
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
      color: #b45309;
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
    background: #fef3c7;
    color: #b45309;
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
    margin-bottom: 28px;
  }

  .feature-list {
    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      font-size: 15px;
      color: #475569;
    }
  }

  .certificate-preview {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 20px;
    padding: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cert-inner {
    background: #fff;
    border-radius: 12px;
    padding: 36px 32px;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 40px rgba(180, 83, 9, 0.15);
    position: relative;

    .cert-badge {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #f59e0b, #b45309);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .cert-title {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #b45309;
      margin-bottom: 4px;
    }

    .cert-no {
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 20px;
    }

    .cert-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #fbbf24, transparent);
      margin-bottom: 20px;
    }

    .cert-info {
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 13px;

        .info-label {
          color: #94a3b8;
        }
        .info-value {
          color: #475569;
          font-weight: 500;
        }
      }
    }

    .cert-seal {
      position: absolute;
      bottom: 24px;
      right: 24px;
      width: 70px;
      height: 70px;
      border: 2px solid #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transform: rotate(-15deg);

      .seal-inner {
        font-size: 11px;
        color: #ef4444;
        font-weight: 600;
        text-align: center;
      }
    }
  }
}

.process-section {
  background: #f8fafc;

  .process-steps {
    display: flex;
    align-items: stretch;
    justify-content: center;
    gap: 0;
  }

  .step-card {
    flex: 1;
    background: #fff;
    border-radius: 16px;
    padding: 36px 28px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    text-align: center;
    max-width: 320px;

    .step-number {
      font-size: 14px;
      font-weight: 600;
      color: #b45309;
      background: #fef3c7;
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .step-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #f59e0b, #b45309);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
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
      line-height: 1.7;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .step-list {
      text-align: left;

      li {
        font-size: 13px;
        color: #64748b;
        padding: 6px 0;
        padding-left: 18px;
        position: relative;

        &::before {
          content: '·';
          position: absolute;
          left: 6px;
          color: #94a3b8;
          font-size: 18px;
        }
      }
    }
  }

  .step-arrow {
    color: #fbbf24;
    display: flex;
    align-items: center;
    padding: 0 8px;
    flex-shrink: 0;
    align-self: center;
  }
}

.validity-section {
  background: #fff;

  .validity-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .validity-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(245, 158, 11, 0.1);
      border-color: #fde68a;
      background: #fff;
    }

    .validity-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      background: linear-gradient(135deg, #f59e0b, #b45309);
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
      font-size: 14px;
      color: #64748b;
      line-height: 1.7;
    }
  }
}

.faq-section {
  background: #f8fafc;

  .faq-collapse {
    max-width: 800px;
    margin: 0 auto;

    :deep(.el-collapse-item) {
      margin-bottom: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #fff;
      overflow: hidden;

      &.is-active {
        border-color: #fbbf24;
      }
    }

    :deep(.el-collapse-item__header) {
      padding: 20px 24px;
      font-size: 15px;
      font-weight: 500;
      color: #1e293b;
      border-bottom: none;
      background: transparent;
    }

    :deep(.el-collapse-item__wrap) {
      border-bottom: none;
    }

    :deep(.el-collapse-item__content) {
      padding: 0 24px 20px;
      font-size: 14px;
      color: #64748b;
      line-height: 1.8;
    }
  }
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #b45309 0%, #f59e0b 100%);

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
      color: #fef3c7;
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
      color: #b45309;
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
