<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-badge">机构入驻</div>
        <h1>携手共赢，共创音乐新未来</h1>
        <p>面向唱片公司、MCN机构、音乐工作室，提供定制化合作方案，助力业务增长</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" @click="scrollToForm">立即申请入驻</el-button>
          <el-button size="large" plain @click="scrollToForm">了解合作方案</el-button>
        </div>
      </div>
    </section>

    <section class="section advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">入驻优势</h2>
          <p class="section-desc">专属于机构的强大功能与优质服务</p>
        </div>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon icon-brand">
              <el-icon :size="28"><Flag /></el-icon>
            </div>
            <h3>独立品牌展示</h3>
            <p>专属机构主页，独立品牌形象展示，自定义店铺风格，打造专属音乐品牌。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-income">
              <el-icon :size="28"><Wallet /></el-icon>
            </div>
            <h3>定制分成方案</h3>
            <p>根据机构规模与作品数量，提供个性化分成方案，最大化机构收益。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-account">
              <el-icon :size="28"><UserFilled /></el-icon>
            </div>
            <h3>多账号管理</h3>
            <p>支持主账号+子账号体系，灵活分配权限，方便团队协作管理。</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon icon-data">
              <el-icon :size="28"><DataAnalysis /></el-icon>
            </div>
            <h3>专业数据后台</h3>
            <p>详细的数据统计分析，实时掌握作品表现、收益情况、用户画像等。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section targets-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">入驻对象</h2>
          <p class="section-desc">欢迎各类音乐相关机构入驻合作</p>
        </div>
        <div class="targets-grid">
          <el-card class="target-card" shadow="hover">
            <div class="target-icon icon-record">
              <el-icon :size="36"><Disc /></el-icon>
            </div>
            <h3>唱片公司</h3>
            <p>拥有签约艺人、大量音乐作品的唱片公司，可批量上架作品，拓展版权收入渠道。</p>
            <ul class="target-benefits">
              <li>批量作品管理</li>
              <li>多渠道分发</li>
              <li>收益透明结算</li>
            </ul>
          </el-card>
          <el-card class="target-card" shadow="hover">
            <div class="target-icon icon-mcn">
              <el-icon :size="36"><User /></el-icon>
            </div>
            <h3>MCN机构</h3>
            <p>拥有音乐达人、短视频音乐创作者的MCN机构，帮助达人变现，提升商业价值。</p>
            <ul class="target-benefits">
              <li>达人统一管理</li>
              <li>商业对接资源</li>
              <li>数据化运营</li>
            </ul>
          </el-card>
          <el-card class="target-card" shadow="hover">
            <div class="target-icon icon-studio">
              <el-icon :size="36"><MagicStick /></el-icon>
            </div>
            <h3>音乐工作室</h3>
            <p>独立音乐工作室、制作人团队，展示作品，承接定制，拓展商业合作机会。</p>
            <ul class="target-benefits">
              <li>作品展示推广</li>
              <li>定制需求对接</li>
              <li>版权登记服务</li>
            </ul>
          </el-card>
        </div>
      </div>
    </section>

    <section class="section process-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">入驻流程</h2>
          <p class="section-desc">四步快速入驻，开启合作之旅</p>
        </div>
        <div class="process-steps">
          <div class="step-item">
            <div class="step-circle">
              <span>01</span>
            </div>
            <h3>提交申请</h3>
            <p>填写入驻申请表，提交机构基本信息与合作意向。</p>
          </div>
          <div class="step-line"></div>
          <div class="step-item">
            <div class="step-circle">
              <span>02</span>
            </div>
            <h3>资质审核</h3>
            <p>平台对机构资质进行审核，1-3个工作日内反馈结果。</p>
          </div>
          <div class="step-line"></div>
          <div class="step-item">
            <div class="step-circle">
              <span>03</span>
            </div>
            <h3>开通账号</h3>
            <p>审核通过后，签署合作协议，开通机构专属管理账号。</p>
          </div>
          <div class="step-line"></div>
          <div class="step-item">
            <div class="step-circle">
              <span>04</span>
            </div>
            <h3>上架作品</h3>
            <p>登录机构后台，上传作品，开始运营，获取收益。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section form-section" id="apply-form">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">入驻申请</h2>
          <p class="section-desc">填写以下信息，我们将尽快与您联系</p>
        </div>
        <div class="form-wrapper">
          <el-form :model="form" label-position="top" class="apply-form">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="机构名称">
                  <el-input v-model="form.companyName" placeholder="请输入机构/公司名称" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="机构类型">
                  <el-select v-model="form.companyType" placeholder="请选择机构类型" size="large" style="width: 100%">
                    <el-option label="唱片公司" value="record" />
                    <el-option label="MCN机构" value="mcn" />
                    <el-option label="音乐工作室" value="studio" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="联系人姓名">
                  <el-input v-model="form.contactName" placeholder="请输入联系人姓名" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话">
                  <el-input v-model="form.contactPhone" placeholder="请输入联系电话" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="联系邮箱">
                  <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作品数量">
                  <el-select v-model="form.workCount" placeholder="请选择预估作品数量" size="large" style="width: 100%">
                    <el-option label="50首以下" value="lt50" />
                    <el-option label="50-200首" value="50-200" />
                    <el-option label="200-500首" value="200-500" />
                    <el-option label="500首以上" value="gt500" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="机构简介">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请简要介绍贵机构的业务范围、艺人/音乐人资源、合作需求等"
                size="large"
              />
            </el-form-item>
            <el-form-item label="合作意向">
              <el-checkbox-group v-model="form.cooperationTypes">
                <el-checkbox value="trade">词曲版权交易</el-checkbox>
                <el-checkbox value="release">音乐发行服务</el-checkbox>
                <el-checkbox value="registration">版权登记服务</el-checkbox>
                <el-checkbox value="custom">音乐定制合作</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="form-actions">
              <el-button type="primary" size="large">提交申请</el-button>
              <el-button size="large">重置</el-button>
            </div>
            <p class="form-tip">提交后我们将在1-3个工作日内与您联系，请保持电话畅通</p>
          </el-form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  companyName: '',
  companyType: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  workCount: '',
  description: '',
  cooperationTypes: []
})

const scrollToForm = () => {
  const el = document.getElementById('apply-form')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
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
  background: linear-gradient(135deg, #5b21b6 0%, #8b5cf6 100%);
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

    :deep(.el-button--large) {
      padding: 14px 32px;
      font-size: 16px;
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
      box-shadow: 0 20px 40px rgba(91, 33, 182, 0.1);
      border-color: #ddd6fe;
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

      &.icon-brand { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
      &.icon-income { background: linear-gradient(135deg, #34d399, #10b981); }
      &.icon-account { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-data { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
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

.targets-section {
  background: #f8fafc;

  .targets-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .target-card {
    border-radius: 16px;
    border: none;
    text-align: center;

    :deep(.el-card__body) {
      padding: 40px 32px;
    }

    .target-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin: 0 auto 24px;

      &.icon-record { background: linear-gradient(135deg, #f472b6, #ec4899); }
      &.icon-mcn { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
      &.icon-studio { background: linear-gradient(135deg, #34d399, #10b981); }
    }

    h3 {
      font-size: 22px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    > p {
      font-size: 14px;
      color: #64748b;
      line-height: 1.8;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #f1f5f9;
    }

    .target-benefits {
      text-align: left;

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
          color: #8b5cf6;
          font-weight: bold;
        }
      }
    }
  }
}

.process-section {
  background: #fff;

  .process-steps {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
  }

  .step-item {
    flex: 1;
    text-align: center;
    position: relative;
    z-index: 2;

    .step-circle {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #5b21b6);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
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
      max-width: 180px;
      margin: 0 auto;
    }
  }

  .step-line {
    flex: 0 0 60px;
    height: 2px;
    background: #e9d5ff;
    margin-top: 32px;
    flex-shrink: 0;
  }
}

.form-section {
  background: #f8fafc;

  .form-wrapper {
    max-width: 900px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 48px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .apply-form {
    :deep(.el-form-item__label) {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 6px;
    }
  }

  .form-actions {
    text-align: center;
    margin-top: 32px;
    margin-bottom: 16px;

    :deep(.el-button--large) {
      padding: 14px 40px;
      font-size: 16px;
    }

    :deep(.el-button + .el-button) {
      margin-left: 16px;
    }
  }

  .form-tip {
    text-align: center;
    font-size: 13px;
    color: #94a3b8;
  }
}
</style>
