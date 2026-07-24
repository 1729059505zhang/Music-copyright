<template>
  <div class="dashboard-page">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon work">
            <el-icon><DocumentMusic /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.workCount || 0 }}</div>
            <div class="stat-label">已上架作品</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon user">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.userCount || 0 }}</div>
            <div class="stat-label">注册用户</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon creator">
            <el-icon><Avatar /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.creatorCount || 0 }}</div>
            <div class="stat-label">入驻创作者</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon amount">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">¥{{ formatMoney(stats.totalAmount) }}</div>
            <div class="stat-label">累计交易额</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card warning">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingWorkCount || 0 }}</div>
            <div class="stat-label">待审核作品</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card warning">
          <div class="stat-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingCreatorCount || 0 }}</div>
            <div class="stat-label">待审核创作者</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card warning">
          <div class="stat-icon">
            <el-icon><Medal /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingCopyrightCount || 0 }}</div>
            <div class="stat-label">待版权登记审核</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card success">
          <div class="stat-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayOrderCount || 0 }}</div>
            <div class="stat-label">今日订单 / ¥{{ formatMoney(stats.todayAmount) }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <h3>近7日订单趋势</h3>
          </div>
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <h3>快捷操作</h3>
          </div>
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/work/list?auditStatus=0')">
              <el-icon size="28" color="#f59e0b"><Warning /></el-icon>
              <span>作品审核</span>
            </div>
            <div class="action-item" @click="$router.push('/user/creator?status=0')">
              <el-icon size="28" color="#6366f1"><UserCheck /></el-icon>
              <span>创作者审核</span>
            </div>
            <div class="action-item" @click="$router.push('/copyright/apply?status=1')">
              <el-icon size="28" color="#10b981"><Medal /></el-icon>
              <span>版权登记审核</span>
            </div>
            <div class="action-item" @click="$router.push('/finance/withdrawal?status=0')">
              <el-icon size="28" color="#ef4444"><Wallet /></el-icon>
              <span>提现审核</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import request from '@/api/request'

const stats = ref({})
const chartRef = ref(null)
let chartInstance = null

const formatMoney = (value) => {
  if (!value) return '0.00'
  return (value / 100).toFixed(2)
}

const fetchStats = async () => {
  try {
    const [statsRes, trendRes] = await Promise.all([
      request.get('/dashboard/stats'),
      request.get('/dashboard/order-trend')
    ])
    stats.value = statsRes
    renderChart(trendRes || [])
  } catch (error) {
    console.error('获取数据失败', error)
  }
}

const renderChart = (data) => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' }
    },
    legend: {
      data: ['订单数', '交易额(元)'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' }
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#64748b' },
        splitLine: { lineStyle: { color: '#f1f5f9' } }
      },
      {
        type: 'value',
        name: '交易额(元)',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#64748b' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '订单数',
        type: 'bar',
        data: data.map(d => d.count),
        barWidth: 20,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#60a5fa' },
            { offset: 1, color: '#3b82f6' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '交易额(元)',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(d => (d.amount / 100).toFixed(2)),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#10b981', width: 3 },
        itemStyle: { color: '#10b981' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
          ])
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  fetchStats()
  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;

    &.work {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
    }
    &.user {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6);
    }
    &.creator {
      background: linear-gradient(135deg, #34d399, #10b981);
    }
    &.amount {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
    }
  }

  &.warning .stat-icon {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
  }
  &.success .stat-icon {
    background: linear-gradient(135deg, #34d399, #10b981);
  }

  .stat-info {
    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 13px;
      color: #64748b;
    }
  }
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .chart-header {
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
    }
  }

  .chart-container {
    width: 100%;
    height: 320px;
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 10px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 12px;
    background: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #f1f5f9;
      transform: scale(1.02);
    }

    span {
      margin-top: 8px;
      font-size: 13px;
      color: #475569;
    }
  }
}
</style>
