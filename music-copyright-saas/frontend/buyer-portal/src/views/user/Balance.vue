<template>
  <div class="balance-page">
    <div class="balance-card">
      <div class="balance-info">
        <div class="balance-label">账户余额</div>
        <div class="balance-amount">
          <span class="currency">¥</span>
          <span class="amount">12,580.00</span>
        </div>
        <div class="balance-actions">
          <el-button type="primary" size="large" @click="showRechargeDialog = true">
            <el-icon><Plus /></el-icon>
            充值
          </el-button>
          <el-button size="large" @click="showWithdrawDialog = true">
            <el-icon><Minus /></el-icon>
            提现
          </el-button>
        </div>
      </div>
      <div class="balance-stats">
        <div class="stat-item">
          <div class="stat-icon income">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">累计充值</div>
            <div class="stat-value">¥28,500.00</div>
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-icon expense">
            <el-icon><Sell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">累计消费</div>
            <div class="stat-value">¥15,920.00</div>
          </div>
        </div>
      </div>
    </div>

    <div class="record-section">
      <el-tabs v-model="activeTab" class="record-tabs">
        <el-tab-pane label="充值记录" name="recharge" />
        <el-tab-pane label="消费记录" name="consume" />
      </el-tabs>

      <div class="filter-bar">
        <el-date-picker 
          v-model="dateRange" 
          type="daterange" 
          range-separator="至" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期"
        />
        <el-button type="primary" @click="handleSearch">筛选</el-button>
      </div>

      <el-table :data="recordList" stripe style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'recharge' ? 'success' : 'warning'" size="small">
              {{ row.type === 'recharge' ? '充值' : '消费' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            <span :class="row.type === 'recharge' ? 'income-text' : 'expense-text'">
              {{ row.type === 'recharge' ? '+' : '-' }}¥{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">
            <span>¥{{ row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payMethod" label="支付方式" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'success' ? 'success' : 'warning'" size="small">
              {{ row.status === 'success' ? '成功' : '处理中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="180" />
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <el-dialog v-model="showRechargeDialog" title="账户充值" width="480px">
      <div class="recharge-content">
        <div class="recharge-amount">
          <div class="amount-label">充值金额</div>
          <div class="amount-options">
            <div 
              v-for="amount in rechargeOptions" 
              :key="amount"
              class="amount-option"
              :class="{ active: rechargeAmount === amount }"
              @click="rechargeAmount = amount"
            >
              ¥{{ amount }}
            </div>
          </div>
          <div class="custom-amount">
            <el-input-number 
              v-model="customAmount" 
              :min="100" 
              :max="100000" 
              :step="100"
              placeholder="自定义金额"
              style="width: 100%"
              size="large"
            >
              <template #prepend>¥</template>
            </el-input-number>
          </div>
        </div>

        <div class="pay-method">
          <div class="method-label">支付方式</div>
          <el-radio-group v-model="payMethod">
            <el-radio label="alipay">
              <span class="pay-icon alipay">支</span>
              支付宝
            </el-radio>
            <el-radio label="wechat">
              <span class="pay-icon wechat">微</span>
              微信支付
            </el-radio>
            <el-radio label="bank">
              <span class="pay-icon bank">银</span>
              银行卡
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="showRechargeDialog = false">取消</el-button>
        <el-button type="primary" @click="handleRecharge">确认充值</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showWithdrawDialog" title="余额提现" width="480px">
      <div class="withdraw-content">
        <el-alert 
          title="提现说明" 
          type="info" 
          :closable="false"
          style="margin-bottom: 20px"
        >
          <p>1. 提现金额将在1-3个工作日内到账</p>
          <p>2. 每笔提现收取1%手续费（最低2元）</p>
          <p>3. 单笔最低提现金额100元</p>
        </el-alert>

        <div class="withdraw-form">
          <el-form label-width="100px">
            <el-form-item label="提现金额">
              <el-input-number 
                v-model="withdrawAmount" 
                :min="100" 
                :max="12580" 
                :step="100"
                style="width: 100%"
                size="large"
              >
                <template #prepend>¥</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="到账银行卡">
              <el-select v-model="bankCard" placeholder="选择银行卡" size="large" style="width: 100%">
                <el-option label="工商银行 **** 8888" value="icbc" />
                <el-option label="建设银行 **** 6666" value="ccb" />
              </el-select>
            </el-form-item>
            <el-form-item label="预计到账">
              <span class="arrival-text">¥{{ (withdrawAmount * 0.99).toFixed(2) }}（扣除手续费¥{{ (withdrawAmount * 0.01).toFixed(2) }}）</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="showWithdrawDialog = false">取消</el-button>
        <el-button type="primary" @click="handleWithdraw">确认提现</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('recharge')
const dateRange = ref('')
const total = ref(36)
const showRechargeDialog = ref(false)
const showWithdrawDialog = ref(false)
const rechargeAmount = ref(500)
const customAmount = ref(100)
const payMethod = ref('alipay')
const withdrawAmount = ref(1000)
const bankCard = ref('')

const rechargeOptions = [100, 500, 1000, 2000, 5000, 10000]

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const recordList = ref([
  {
    id: 1,
    orderNo: 'RC202401150001',
    type: 'recharge',
    description: '账户充值',
    amount: '5,000.00',
    balance: '12,580.00',
    payMethod: '支付宝',
    status: 'success',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    orderNo: 'ORD202401140002',
    type: 'consume',
    description: '购买「星空下的约定」- 独家授权',
    amount: '5,999.00',
    balance: '7,580.00',
    payMethod: '余额',
    status: 'success',
    createTime: '2024-01-14 14:20:00'
  },
  {
    id: 3,
    orderNo: 'ORD202401130003',
    type: 'consume',
    description: '购买「夏日微风」- 商业授权',
    amount: '899.00',
    balance: '13,579.00',
    payMethod: '余额',
    status: 'success',
    createTime: '2024-01-13 16:45:00'
  },
  {
    id: 4,
    orderNo: 'RC202401100002',
    type: 'recharge',
    description: '账户充值',
    amount: '10,000.00',
    balance: '14,478.00',
    payMethod: '微信支付',
    status: 'success',
    createTime: '2024-01-10 09:15:00'
  },
  {
    id: 5,
    orderNo: 'ORD202401080004',
    type: 'consume',
    description: '购买「江南烟雨」- 商业授权',
    amount: '2,999.00',
    balance: '4,478.00',
    payMethod: '余额',
    status: 'success',
    createTime: '2024-01-08 11:30:00'
  }
])

const handleSearch = () => {
  ElMessage.info('筛选功能')
}

const handleRecharge = () => {
  ElMessage.success('充值成功')
  showRechargeDialog.value = false
}

const handleWithdraw = () => {
  ElMessage.success('提现申请已提交，预计1-3个工作日到账')
  showWithdrawDialog.value = false
}
</script>

<style scoped lang="scss">
.balance-page {
  padding: 24px;
}

.balance-card {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: 16px;
  padding: 32px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
}

.balance-info {
  position: relative;
  z-index: 1;
}

.balance-label {
  font-size: 14px;
  opacity: 0.85;
  margin-bottom: 8px;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;

  .currency {
    font-size: 20px;
    font-weight: 500;
    margin-right: 4px;
  }

  .amount {
    font-size: 48px;
    font-weight: 700;
    line-height: 1;
  }
}

.balance-actions {
  display: flex;
  gap: 12px;
}

.balance-stats {
  display: flex;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;

  &.income {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
  }

  &.expense {
    background: rgba(245, 158, 11, 0.2);
    color: #fcd34d;
  }
}

.stat-info {
  .stat-label {
    font-size: 13px;
    opacity: 0.8;
    margin-bottom: 4px;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 600;
  }
}

.record-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.record-tabs {
  margin-bottom: 16px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.income-text {
  color: $success-color;
  font-weight: 600;
}

.expense-text {
  color: $danger-color;
  font-weight: 600;
}

.recharge-content {
  .recharge-amount {
    margin-bottom: 24px;
  }

  .amount-label,
  .method-label {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 12px;
  }

  .amount-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .amount-option {
    padding: 16px;
    text-align: center;
    border: 2px solid $border-color;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    transition: $transition-base;

    &:hover {
      border-color: $primary-light;
    }

    &.active {
      border-color: $primary-color;
      background: rgba(30, 64, 175, 0.05);
      color: $primary-color;
    }
  }

  .pay-method {
    :deep(.el-radio-group) {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    :deep(.el-radio) {
      margin-right: 0;
      padding: 12px 16px;
      border: 1px solid $border-color;
      border-radius: 8px;
    }
  }

  .pay-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    margin-right: 8px;

    &.alipay {
      background: #1677ff;
    }

    &.wechat {
      background: #07c160;
    }

    &.bank {
      background: #f59e0b;
    }
  }
}

.withdraw-content {
  .arrival-text {
    color: $danger-color;
    font-weight: 600;
  }
}
</style>
