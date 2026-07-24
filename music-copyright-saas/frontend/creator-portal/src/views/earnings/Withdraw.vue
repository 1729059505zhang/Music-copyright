<template>
  <div class="withdraw-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">提现申请</h2>
          <p class="page-subtitle">申请提现到您的收款账户</p>
        </div>
      </div>

      <el-row :gutter="20">
        <el-col :span="16">
          <div class="card-wrapper">
            <div class="withdraw-form">
              <div class="balance-info">
                <div class="balance-item">
                  <div class="label">可提现余额</div>
                  <div class="value">¥{{ balance.withdrawable.toLocaleString() }}</div>
                </div>
                <div class="balance-item">
                  <div class="label">待结算金额</div>
                  <div class="value pending">¥{{ balance.pending.toLocaleString() }}</div>
                </div>
                <div class="balance-item">
                  <div class="label">累计提现</div>
                  <div class="value total">¥{{ balance.totalWithdraw.toLocaleString() }}</div>
                </div>
              </div>

              <el-divider />

              <el-form :model="withdrawForm" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="提现金额" prop="amount">
                  <el-input-number 
                    v-model="withdrawForm.amount" 
                    :min="1" 
                    :max="balance.withdrawable"
                    :step="100"
                    :precision="2"
                    style="width: 280px"
                  />
                  <span class="unit">元</span>
                  <el-button link type="primary" @click="withdrawAll">全部提现</el-button>
                </el-form-item>

                <el-form-item label="收款账户" prop="accountId">
                  <el-radio-group v-model="withdrawForm.accountId">
                    <el-radio v-for="account in accountList" :key="account.id" :value="account.id" border>
                      <div class="account-option">
                        <div class="account-bank">
                          <el-icon><CreditCard /></el-icon>
                          {{ account.bankName }}
                        </div>
                        <div class="account-no">尾号 {{ account.accountNo.slice(-4) }}</div>
                        <div class="account-name">{{ account.accountName }}</div>
                      </div>
                    </el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="提现密码" prop="password" v-if="needPassword">
                  <el-input v-model="withdrawForm.password" type="password" show-password style="width: 280px" />
                </el-form-item>

                <el-alert
                  title="提现说明"
                  type="info"
                  :closable="false"
                  show-icon
                  class="withdraw-tip"
                >
                  <div class="tip-content">
                    <p>1. 提现申请提交后，预计1-3个工作日内到账</p>
                    <p>2. 单笔提现最低1元，最高50000元</p>
                    <p>3. 每月免费提现3次，超出部分收取0.5%手续费</p>
                    <p>4. 本月剩余免费提现次数：<b>{{ freeTimes }}</b> 次</p>
                  </div>
                </el-alert>

                <div class="form-actions">
                  <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
                    确认提现
                  </el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">提现记录</span>
              <el-button type="primary" link @click="goToAccount">
                管理账户
              </el-button>
            </div>

            <div class="withdraw-list">
              <div class="withdraw-item" v-for="item in withdrawList" :key="item.id">
                <div class="item-top">
                  <span class="amount">-¥{{ item.amount.toLocaleString() }}</span>
                  <el-tag size="small" :type="getStatusType(item.status)" effect="light">
                    {{ item.status }}
                  </el-tag>
                </div>
                <div class="item-bottom">
                  <span class="bank">{{ item.bankName }} 尾号{{ item.accountNo.slice(-4) }}</span>
                  <span class="time">{{ item.applyTime }}</span>
                </div>
              </div>
              <div class="list-empty" v-if="withdrawList.length === 0">
                <el-empty description="暂无提现记录" :image-size="60" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const formRef = ref(null)
const submitting = ref(false)
const needPassword = ref(true)
const freeTimes = ref(2)

const balance = ref({
  withdrawable: 25680.5,
  pending: 8950,
  totalWithdraw: 103000
})

const accountList = ref([
  { id: 1, bankName: '中国工商银行', accountNo: '622202****8888', accountName: '张三' },
  { id: 2, bankName: '中国建设银行', accountNo: '621700****6666', accountName: '张三' }
])

const withdrawForm = reactive({
  amount: null,
  accountId: 1,
  password: ''
})

const rules = {
  amount: [
    { required: true, message: '请输入提现金额', trigger: 'blur' }
  ],
  accountId: [
    { required: true, message: '请选择收款账户', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入提现密码', trigger: 'blur' }
  ]
}

const withdrawList = ref([
  { id: 1, amount: 5000, bankName: '工商银行', accountNo: '8888', status: '已到账', applyTime: '2024-11-30 16:00' },
  { id: 2, amount: 3000, bankName: '工商银行', accountNo: '8888', status: '已到账', applyTime: '2024-11-20 14:30' },
  { id: 3, amount: 8000, bankName: '工商银行', accountNo: '8888', status: '处理中', applyTime: '2024-12-01 10:00' },
  { id: 4, amount: 2000, bankName: '建设银行', accountNo: '6666', status: '已到账', applyTime: '2024-11-15 11:20' },
  { id: 5, amount: 1000, bankName: '工商银行', accountNo: '8888', status: '失败', applyTime: '2024-11-10 09:00' }
])

const getStatusType = (status) => {
  const map = {
    '已到账': 'success',
    '处理中': 'warning',
    '失败': 'danger'
  }
  return map[status] || 'info'
}

const withdrawAll = () => {
  withdrawForm.amount = balance.value.withdrawable
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      ElMessageBox.confirm(
        `确认提现 ¥${withdrawForm.amount.toLocaleString()} 到 ${accountList.value.find(a => a.id === withdrawForm.accountId)?.bankName}？`,
        '提现确认',
        {
          confirmButtonText: '确认提现',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        submitting.value = true
        setTimeout(() => {
          submitting.value = false
          ElMessage.success('提现申请已提交，等待处理')
          withdrawForm.amount = null
          withdrawForm.password = ''
        }, 1500)
      }).catch(() => {})
    }
  })
}

const goToAccount = () => {
  router.push('/earnings/account')
}
</script>

<style scoped lang="scss">
.withdraw-page {
  .balance-info {
    display: flex;
    gap: 40px;
    padding: 20px 0;
  }

  .balance-item {
    .label {
      font-size: 13px;
      color: $text-muted;
      margin-bottom: 8px;
    }

    .value {
      font-size: 28px;
      font-weight: 700;
      color: $success-color;

      &.pending {
        color: $warning-color;
      }

      &.total {
        color: $text-primary;
        font-size: 22px;
      }
    }
  }

  .unit {
    margin-left: 8px;
    color: $text-secondary;
  }

  .account-option {
    line-height: 1.6;

    .account-bank {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
      color: $text-primary;
    }

    .account-no {
      font-size: 13px;
      color: $text-secondary;
    }

    .account-name {
      font-size: 12px;
      color: $text-muted;
    }
  }

  .withdraw-tip {
    margin-top: 20px;

    .tip-content {
      p {
        margin: 4px 0;
        font-size: 13px;
        color: $text-secondary;
      }

      b {
        color: $primary-color;
      }
    }
  }

  .form-actions {
    margin-top: 24px;
    text-align: center;
  }

  .withdraw-list {
    .withdraw-item {
      padding: 14px 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }
    }

    .item-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .amount {
        font-size: 16px;
        font-weight: 600;
        color: $text-primary;
      }
    }

    .item-bottom {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: $text-muted;
    }

    .list-empty {
      padding: 20px 0;
    }
  }
}
</style>
