<template>
  <div class="content-page">
    <section class="page-hero">
      <div class="container">
        <h1>帮助中心</h1>
        <p>常见问题解答，助您快速了解平台服务</p>
        <div class="search-box">
          <el-input v-model="searchKeyword" placeholder="搜索您想了解的问题..." size="large">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </section>

    <section class="section help-section">
      <div class="container">
        <div class="help-layout">
          <div class="help-sidebar">
            <div class="sidebar-title">问题分类</div>
            <el-tabs v-model="activeTab" tab-position="left" class="help-tabs">
              <el-tab-pane label="账号相关" name="account">
                <el-icon><User /></el-icon>
                <span>账号相关</span>
              </el-tab-pane>
              <el-tab-pane label="交易相关" name="trade">
                <el-icon><ShoppingCart /></el-icon>
                <span>交易相关</span>
              </el-tab-pane>
              <el-tab-pane label="版权相关" name="copyright">
                <el-icon><Medal /></el-icon>
                <span>版权相关</span>
              </el-tab-pane>
              <el-tab-pane label="结算相关" name="settlement">
                <el-icon><Wallet /></el-icon>
                <span>结算相关</span>
              </el-tab-pane>
            </el-tabs>
          </div>

          <div class="help-content">
            <div v-if="activeTab === 'account'">
              <h2 class="content-title">账号相关</h2>
              <el-collapse class="faq-collapse">
                <el-collapse-item title="如何注册平台账号？" name="a1">
                  <p>点击页面右上角的"注册"按钮，选择用户类型（采购商/音乐人），填写手机号、验证码和密码即可完成注册。注册成功后可以完善个人资料，开始使用平台服务。</p>
                </el-collapse-item>
                <el-collapse-item title="忘记密码怎么办？" name="a2">
                  <p>在登录页面点击"忘记密码"，输入注册时使用的手机号，接收验证码后即可重置密码。如果手机号已不再使用，请联系客服进行人工处理。</p>
                </el-collapse-item>
                <el-collapse-item title="如何修改个人信息？" name="a3">
                  <p>登录后，点击右上角头像进入"个人中心"，在"账号设置"中可以修改昵称、头像、简介等个人信息。实名认证信息需要联系客服进行修改。</p>
                </el-collapse-item>
                <el-collapse-item title="如何进行实名认证？" name="a4">
                  <p>进入"个人中心-账号设置-实名认证"，按照提示上传身份证正反面照片，填写真实姓名和身份证号，提交后1-2个工作日内完成审核。音乐人还需提交音乐人认证材料。</p>
                </el-collapse-item>
                <el-collapse-item title="一个人可以注册多个账号吗？" name="a5">
                  <p>不建议一个人注册多个账号。同一身份信息只能实名认证一个账号。如有特殊需求，请联系客服说明情况。</p>
                </el-collapse-item>
                <el-collapse-item title="如何注销账号？" name="a6">
                  <p>进入"个人中心-账号设置-账号注销"，按照提示操作即可申请注销。账号注销后所有数据将被清除且不可恢复，请谨慎操作。注销前请确保已结清所有款项。</p>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div v-if="activeTab === 'trade'">
              <h2 class="content-title">交易相关</h2>
              <el-collapse class="faq-collapse">
                <el-collapse-item title="如何购买词曲授权？" name="t1">
                  <p>浏览或搜索心仪的作品，点击进入作品详情页，选择授权类型后点击"立即购买"，确认订单信息并完成支付，即可获取作品授权。支付成功后可在"我的订单"中下载作品文件和授权凭证。</p>
                </el-collapse-item>
                <el-collapse-item title="授权类型有什么区别？" name="t2">
                  <p>非商用授权适用于个人学习、非商业项目；商用授权适用于商业宣传、短视频、广告等；独家授权享有独家使用权，作品将下架保护；全版权买断则转让全部版权。具体权益请查看授权方案页面。</p>
                </el-collapse-item>
                <el-collapse-item title="购买后可以退款吗？" name="t3">
                  <p>平台提供7天无理由退款保障。购买后7天内，如未下载作品文件且未用于商业用途，可申请全额退款。已下载作品文件或已使用的，不支持退款。如有特殊情况请联系客服。</p>
                </el-collapse-item>
                <el-collapse-item title="如何出售自己的作品？" name="t4">
                  <p>注册成为音乐人并完成实名认证后，进入"音乐人后台-作品管理-上传作品"，填写作品信息、上传音频文件和曲谱，设置价格和授权类型，提交审核。审核通过后作品即可上架售卖。</p>
                </el-collapse-item>
                <el-collapse-item title="作品审核需要多长时间？" name="t5">
                  <p>作品审核一般在1-3个工作日内完成。审核内容包括作品质量、版权归属、信息完整性等。如审核不通过，会通过站内信告知原因，修改后可重新提交。</p>
                </el-collapse-item>
                <el-collapse-item title="可以修改作品价格吗？" name="t6">
                  <p>可以。进入"音乐人后台-作品管理"，找到对应作品点击"编辑"，即可修改价格和授权类型。修改后需要重新审核，审核期间作品保持原价展示。</p>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div v-if="activeTab === 'copyright'">
              <h2 class="content-title">版权相关</h2>
              <el-collapse class="faq-collapse">
                <el-collapse-item title="平台如何保障版权安全？" name="c1">
                  <p>平台采取多重措施保障版权安全：1）所有上传作品均经过专业审核；2）采用区块链存证技术，确保版权权属清晰可追溯；3）交易资金由平台担保，确认无误后结算；4）提供电子授权凭证，具备法律效力；5）专业法务团队提供维权支持。</p>
                </el-collapse-item>
                <el-collapse-item title="如何申请版权登记？" name="c2">
                  <p>进入"版权登记"页面，选择登记类型（音乐作品/歌词/曲谱），上传作品文件和相关材料，填写作品信息，提交申请并支付费用。审核通过后生成电子版权证书，如需纸质证书将安排邮寄。</p>
                </el-collapse-item>
                <el-collapse-item title="版权登记需要哪些材料？" name="c3">
                  <p>需要的材料包括：1）作品音频文件或歌词/曲谱文档；2）申请人身份证明（个人提供身份证，企业提供营业执照）；3）作品创作说明；4）权利归属证明（如合作协议、委托协议等）。具体要求以登记页面提示为准。</p>
                </el-collapse-item>
                <el-collapse-item title="发现侵权怎么办？" name="c4">
                  <p>如发现他人侵犯您的版权，请收集侵权证据（侵权链接、截图等），通过以下方式维权：1）在平台内提交侵权投诉；2）联系客服获取维权协助；3）凭借版权登记证书通过法律途径维权。我们的法务团队会提供专业支持。</p>
                </el-collapse-item>
                <el-collapse-item title="电子版权证书有效吗？" name="c5">
                  <p>电子版权证书与纸质证书具有同等法律效力，可作为著作权归属的初步证明。证书采用区块链存证技术，可随时在线验证真伪。在版权纠纷中，登记证书是重要的权利证据。</p>
                </el-collapse-item>
                <el-collapse-item title="合作作品如何登记版权？" name="c6">
                  <p>合作作品需要所有合作作者共同申请登记。申请时需提供所有作者的身份证明文件，并明确著作权归属方式（共同共有或按份共有）。建议各方提前签订书面协议明确权利归属。</p>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div v-if="activeTab === 'settlement'">
              <h2 class="content-title">结算相关</h2>
              <el-collapse class="faq-collapse">
                <el-collapse-item title="收益多久结算一次？" name="s1">
                  <p>音乐人收益按月结算，每月10日前结算上月收益，结算完成后款项将转入您的账户余额，可随时申请提现。如遇节假日，结算时间可能顺延。具体以结算规则为准。</p>
                </el-collapse-item>
                <el-collapse-item title="如何提现？" name="s2">
                  <p>进入"个人中心-我的钱包-提现"，输入提现金额，选择提现方式（银行卡/支付宝），提交申请后1-3个工作日内到账。首次提现需要先绑定收款账户并完成实名认证。</p>
                </el-collapse-item>
                <el-collapse-item title="提现手续费是多少？" name="s3">
                  <p>每月前3次提现免手续费，超过3次后按提现金额的1%收取手续费，最低1元，最高50元。单笔提现最低金额为100元。具体费率可能根据政策调整，请以提现页面提示为准。</p>
                </el-collapse-item>
                <el-collapse-item title="分成比例是多少？" name="s4">
                  <p>基础分成比例为音乐人70%、平台30%。根据音乐人等级、作品数量、销量等因素，可享受更高的分成比例，最高可达90%。机构合作采用定制化分成方案，具体可联系商务洽谈。</p>
                </el-collapse-item>
                <el-collapse-item title="如何查看收益明细？" name="s5">
                  <p>进入"音乐人后台-数据中心-收益明细"，可以查看每笔订单的详细收益情况，包括作品名称、授权类型、订单金额、分成金额、结算状态等。支持按时间范围筛选和导出数据。</p>
                </el-collapse-item>
                <el-collapse-item title="提现失败怎么办？" name="s6">
                  <p>提现失败可能是以下原因：1）银行卡信息错误；2）账户未实名认证；3）收款账户与实名信息不一致。请检查收款账户信息是否正确，如仍有问题请联系客服处理。失败的款项会退回账户余额。</p>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div class="contact-card">
              <div class="contact-info">
                <el-icon :size="28" color="#3b82f6"><Headset /></el-icon>
                <div>
                  <h4>还有其他问题？</h4>
                  <p>联系客服，我们将为您提供专业解答</p>
                </div>
              </div>
              <div class="contact-ways">
                <div class="contact-way">
                  <el-icon><Phone /></el-icon>
                  <span>400-888-8888</span>
                </div>
                <div class="contact-way">
                  <el-icon><Message /></el-icon>
                  <span>service@musiccopyright.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('account')
const searchKeyword = ref('')
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
  padding: 60px 0 80px;
  text-align: center;
  color: #fff;

  h1 {
    font-size: 36px;
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
    opacity: 0.9;
    margin-bottom: 32px;
  }

  .search-box {
    max-width: 500px;
    margin: 0 auto;

    :deep(.el-input__wrapper) {
      border-radius: 24px;
      padding: 8px 20px;
      box-shadow: none;
    }

    :deep(.el-input--large .el-input__wrapper) {
      padding: 10px 20px;
    }
  }
}

.help-section {
  padding: 60px 0 80px;
  background: #f8fafc;

  .help-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 40px;
    align-items: flex-start;
  }

  .help-sidebar {
    background: #fff;
    border-radius: 12px;
    padding: 24px 16px;
    position: sticky;
    top: 80px;

    .sidebar-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
      padding-left: 8px;
    }
  }

  .help-tabs {
    :deep(.el-tabs__item) {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      color: #64748b;
      padding: 0 12px;
      display: flex;
      align-items: center;
      gap: 10px;

      .el-icon {
        font-size: 18px;
      }

      &.is-active {
        color: #1e40af;
        background: #eff6ff;
        border-radius: 8px;
        font-weight: 500;
      }
    }

    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    :deep(.el-tabs__active-bar) {
      display: none;
    }
  }

  .help-content {
    .content-title {
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 24px;
    }

    .faq-collapse {
      margin-bottom: 40px;

      :deep(.el-collapse-item) {
        margin-bottom: 12px;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        background: #fff;
        overflow: hidden;

        &.is-active {
          border-color: #3b82f6;
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
        line-height: 1.9;
      }
    }

    .contact-card {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .contact-info {
        display: flex;
        align-items: center;
        gap: 16px;

        h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        p {
          font-size: 14px;
          color: #64748b;
        }
      }

      .contact-ways {
        display: flex;
        gap: 32px;

        .contact-way {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #1e40af;
          font-weight: 500;

          .el-icon {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
