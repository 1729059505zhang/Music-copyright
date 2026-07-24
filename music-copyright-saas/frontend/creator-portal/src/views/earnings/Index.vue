<template>
  <div class="earnings-index-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">收益概览</h2>
          <p class="page-subtitle">查看您的收益数据和趋势</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="goToWithdraw">
            <el-icon><Money /></el-icon>
            申请提现
          </el-button>
        </div>
      </div>

      <el-row :gutter="16" class="balance-cards mb-20">
        <el-col :span="6">
          <div class="balance-card primary">
            <div class="card-label">可提现余额</div>
            <div class="card-amount">¥{{ balance.withdrawable.toLocaleString() }}</div>
            <div class="card-action">
              <el-button type="primary" plain size="small" @click="goToWithdraw">立即提现</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="balance-card warning">
            <div class="card-label">待结算金额</div>
            <div class="card-amount">¥{{ balance.pending.toLocaleString() }}</div>
            <div class="card-desc">预计 {{ balance.settleDate }} 结算</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="balance-card success">
            <div class="card-label">累计收益</div>
            <div class="card-amount">¥{{ balance.total.toLocaleString() }}</div>
            <div class="card-desc">历史累计总收入</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="balance-card info">
            <div class="card-label">累计订单</div>
            <div class="card-amount">{{ balance.orders }} 笔</div>
            <div class="card-desc">历史累计订单数</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16" class="mb-20">
        <el-col :span="16">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">收益趋势</span>
              <el-radio-group v-model="chartPeriod" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
                <el-radio-button label="quarter">近90天</el-radio-button>
              </el-radio-group>
            </div>
            <div class="chart-container">
              <v-chart class="chart" :option="chartOption" autoresize />
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">收益构成</span>
            </div>
            <div class="pie-chart">
              <v-chart class="chart" :option="pieOption" autoresize />
            </div>
            <div class="income-list">
              <div class="income-item" v-for="item in incomeTypes" :key="item.name">
                <span class="dot" :style="{ background: item.color }"></span>
                <span class="name">{{ item.name }}</span>
                <span class="value">¥{{ item.value.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="12">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">最近收益</span>
              <el-button type="primary" link @click="goToFlow">查看全部</el-button>
            </div>
            <div class="recent-list">
              <div class="recent-item" v-for="item in recentEarnings" :key="item.id">
                <div class="item-left">
                  <div class="item-icon" :class="item.type">
                    <el-icon><component :is="item.icon" /></el-icon>
                  </div>
                  <div class="item-info">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-desc">{{ item.desc }}</div>
                  </div>
                </div>
                <div class="item-right">
                  <div class="item-amount" :class="item.amountType">
                    {{ item.amountType === 'income' ? '+' : '-' }}¥{{ item.amount }}
                  </div>
                  <div class="item-time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">提现记录</span>
              <el-button type="primary" link @click="goToWithdraw">查看全部</el-button>
            </div>
            <div class="withdraw-list">
              <div class="withdraw-item" v-for="item in recentWithdraws" :key="item.id">
                <div class="item-left">
                  <div class="item-icon withdraw">
                    <el-icon><Wallet /></el-icon>
                  </div>
                  <div class="item-info">
                    <div class="item-title">提现到{{ item.bank }}</div>
                    <div class="item-desc">{{ item.account }}</div>
                  </div>
                </div>
                <div class="item-right">
                  <div class="item-amount withdraw">-¥{{ item.amount }}</div>
                  <div class="item-status">
                    <el-tag size="small" :type="getStatusType(item.status)" effect="light">
                      {{ item.status }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

const router = useRouter()
const chartPeriod = ref('month')

const balance = ref({
  withdrawable: 25680.5,
  pending: 8950.0,
  total: 128650.0,
  orders: 156,
  settleDate: '每周一'
})

const incomeTypes = ref([
  { name: '商用授权', value: 68500, color: '#2563eb' },
  { name: '非商用授权', value: 32800, color: '#10b981' },
  { name: '独家授权', value: 24000, color: '#f59e0b' },
  { name: '其他收入', value: 3350, color: '#6366f1' }
])

const recentEarnings = ref([
  { id: 1, type: 'income', icon: 'ShoppingCart', title: '商用授权收入', desc: '作品「夏日微风」- 星辰传媒', amount: 2399.2, amountType: 'income', time: '12-01 14:30' },
  { id: 2, type: 'income', icon: 'ShoppingCart', title: '非商用授权收入', desc: '作品「城市夜曲」- 光影影视', amount: 479.2, amountType: 'income', time: '12-01 11:20' },
  { id: 3, type: 'withdraw', icon: 'Wallet', title: '提现', desc: '中国工商银行尾号8888', amount: 5000, amountType: 'expense', time: '11-30 16:00' },
  { id: 4, type: 'income', icon: 'ShoppingCart', title: '商用授权收入', desc: '作品「海边的风」- 快乐综艺', amount: 3199.2, amountType: 'income', time: '11-30 16:45' },
  { id: 5, type: 'income', icon: 'ShoppingCart', title: '非商用授权收入', desc: '作品「星辰大海」- 短视频达人', amount: 239.2, amountType: 'income', time: '11-30 09:30' }
])

const recentWithdraws = ref([
  { id: 1, amount: 5000, bank: '工商银行', account: '尾号 8888', status: '已到账', time: '2024-11-30' },
  { id: 2, amount: 3000, bank: '工商银行', account: '尾号 8888', status: '已到账', time: '2024-11-20' },
  { id: 3, amount: 8000, bank: '工商银行', account: '尾号 8888', status: '处理中', time: '2024-12-01' }
])

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['收益', '订单数'],
    top: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['11/02', '11/06', '11/10', '11/14', '11/18', '11/22', '11/26', '11/30'],
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: { color: '#64748b' }
  },
  yAxis: [
    {
      type: 'value',
      name: '收益(元)',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' }
    },
    {
      type: 'value',
      name: '订单数',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { color: '#64748b' }
    }
  ],
  series: [
    {
      name: '收益',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: [4200, 6800, 5500, 8200, 7600, 9800, 12500, 15600],
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#1e3a8a' },
            { offset: 1, color: '#2563eb' }
          ]
        }
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(37, 99, 235, 0.2)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#2563eb' }
    },
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      yAxisIndex: 1,
      data: [8, 12, 10, 15, 14, 18, 22, 25],
      lineStyle: { width: 2, color: '#10b981' },
      itemStyle: { color: '#10b981' }
    }
  ]
}))

const pieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['50%', '75%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: false } },
    labelLine: { show: false },
    data: incomeTypes.value.map(item => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: item.color }
    }))
  }]
}))

const getStatusType = (status) => {
  const map = {
    '已到账': 'success',
    '处理中': 'warning',
    '失败': 'danger'
  }
  return map[status] || 'info'
}

const goToWithdraw = () => {
  router.push('/earnings/withdraw')
}

const goToFlow = () => {
  router.push('/earnings/flow')
}
</script>

<style scoped lang="scss">
.earnings-index-page {
  .balance-card {
    background: #fff;
    border-radius: $border-radius;
    padding: 24px;
    position: relative;
    overflow: hidden;
    box-shadow: $shadow-sm;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
    }

    &.primary::before { background: linear-gradient(90deg, $primary-color, $primary-light); }
    &.warning::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    &.success::before { background: linear-gradient(90deg, #10b981, #34d399); }
    &.info::before { background: linear-gradient(90deg, #6366f1, #818cf8); }
  }

  .card-label {
    font-size: 14px;
    color: $text-muted;
    margin-bottom: 12px;
  }

  .card-amount {
    font-size: 28px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 12px;
  }

  .card-desc {
    font-size: 12px;
    color: $text-muted;
  }

  .card-action {
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .chart-container {
    height: 320px;
  }

  .pie-chart {
    height: 200px;
  }

  .income-list {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid $border-light;
  }

  .income-item {
    display: flex;
    align-items: center;
    padding: 6px 0;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .name {
      flex: 1;
      font-size: 13px;
      color: $text-secondary;
    }

    .value {
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
    }
  }

  .recent-list,
  .withdraw-list {
    .recent-item,
    .withdraw-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: $border-radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;

      &.income {
        background: #dcfce7;
        color: $success-color;
      }
      &.withdraw {
        background: #fef3c7;
        color: $warning-color;
      }
    }

    .item-info {
      .item-title {
        font-size: 14px;
        font-weight: 500;
        color: $text-primary;
        margin-bottom: 2px;
      }
      .item-desc {
        font-size: 12px;
        color: $text-muted;
      }
    }

    .item-right {
      text-align: right;
    }

    .item-amount {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;

      &.income {
        color: $success-color;
      }
      &.expense,
      &.withdraw {
        color: $text-primary;
      }
    }

    .item-time {
      font-size: 12px;
      color: $text-muted;
    }

    .item-status {
      margin-top: 4px;
    }
  }
}
</style>
