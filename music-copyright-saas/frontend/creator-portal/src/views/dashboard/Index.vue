<template>
  <div class="dashboard-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">工作台概览</h2>
          <p class="page-subtitle">欢迎回来，{{ greeting }}！查看您的作品和收益数据</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="goToUpload">
            <el-icon><Upload /></el-icon>
            上传作品
          </el-button>
        </div>
      </div>

      <el-row :gutter="16" class="stats-cards mb-20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon work">
              <el-icon :size="28"><Files /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalWorks }}</div>
              <div class="stat-label">作品总数</div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              12%
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon on-sale">
              <el-icon :size="28"><ShoppingCart /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.onSaleWorks }}</div>
              <div class="stat-label">在售数量</div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              8%
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon order">
              <el-icon :size="28"><List /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.todayOrders }}</div>
              <div class="stat-label">今日订单</div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              25%
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-icon earnings">
              <el-icon :size="28"><Wallet /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalEarnings.toLocaleString() }}</div>
              <div class="stat-label">累计收益</div>
            </div>
            <div class="stat-trend up">
              <el-icon><Top /></el-icon>
              18%
            </div>
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
          <div class="card-wrapper todo-card">
            <div class="card-header">
              <span class="card-title">待办事项</span>
              <el-badge :value="todoList.length" class="todo-badge" />
            </div>
            <div class="todo-list">
              <div class="todo-item" v-for="item in todoList" :key="item.id">
                <div class="todo-icon" :class="item.type">
                  <el-icon><component :is="item.icon" /></el-icon>
                </div>
                <div class="todo-content">
                  <div class="todo-title">{{ item.title }}</div>
                  <div class="todo-desc">{{ item.desc }}</div>
                </div>
                <el-button type="primary" link size="small" @click="handleTodo(item)">
                  去处理
                </el-button>
              </div>
              <div class="empty-todo" v-if="todoList.length === 0">
                <el-empty description="暂无待办事项" :image-size="80" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16">
        <el-col :span="16">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">最近订单</span>
              <el-button type="primary" link @click="goToOrders">
                查看全部
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
            <el-table :data="recentOrders" style="width: 100%">
              <el-table-column prop="orderNo" label="订单号" width="160">
                <template #default="{ row }">
                  <span class="order-no">{{ row.orderNo }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="workTitle" label="作品名称">
                <template #default="{ row }">
                  <div class="work-cell">
                    <div class="work-cover">
                      <el-icon><Picture /></el-icon>
                    </div>
                    <span>{{ row.workTitle }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="buyer" label="买家" width="120" />
              <el-table-column prop="licenseType" label="授权类型" width="100">
                <template #default="{ row }">
                  <el-tag size="small" :type="row.licenseType === '商用' ? 'warning' : 'info'">
                    {{ row.licenseType }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额" width="100" align="right">
                <template #default="{ row }">
                  <span class="amount">¥{{ row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="90">
                <template #default="{ row }">
                  <el-tag size="small" :type="getStatusType(row.status)">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" width="160" />
            </el-table>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="card-wrapper">
            <div class="card-header">
              <span class="card-title">作品分布</span>
            </div>
            <div class="genre-chart">
              <v-chart class="chart" :option="genreChartOption" autoresize />
            </div>
            <div class="genre-list">
              <div class="genre-item" v-for="item in genreStats" :key="item.name">
                <span class="genre-name">{{ item.name }}</span>
                <div class="genre-bar">
                  <div class="genre-bar-inner" :style="{ width: item.percent + '%' }"></div>
                </div>
                <span class="genre-count">{{ item.count }}首</span>
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
import { BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

const router = useRouter()
const chartPeriod = ref('week')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const stats = ref({
  totalWorks: 128,
  onSaleWorks: 96,
  todayOrders: 23,
  totalEarnings: 128650
})

const todoList = ref([
  { id: 1, type: 'audit', icon: 'Clock', title: '2个作品待审核', desc: '提交的词曲作品正在审核中' },
  { id: 2, type: 'order', icon: 'List', title: '3笔订单待确认', desc: '请及时处理授权订单' },
  { id: 3, type: 'withdraw', icon: 'Wallet', title: '1笔提现已到账', desc: '¥5,000.00 已到账' }
])

const recentOrders = ref([
  { orderNo: 'ORD202412010001', workTitle: '夏日微风', buyer: '星辰传媒', licenseType: '商用', amount: 2999, status: '已完成', time: '2024-12-01 14:30' },
  { orderNo: 'ORD202412010002', workTitle: '城市夜曲', buyer: '光影影视', licenseType: '非商用', amount: 599, status: '已完成', time: '2024-12-01 11:20' },
  { orderNo: 'ORD202412010003', workTitle: '追梦人', buyer: '音乐工作室A', licenseType: '商用', amount: 1999, status: '进行中', time: '2024-12-01 10:15' },
  { orderNo: 'ORD202411300012', workTitle: '海边的风', buyer: '综艺制作组', licenseType: '商用', amount: 3999, status: '已完成', time: '2024-11-30 16:45' },
  { orderNo: 'ORD202411300008', workTitle: '星辰大海', buyer: '短视频达人', licenseType: '非商用', amount: 299, status: '已完成', time: '2024-11-30 09:30' }
])

const genreStats = ref([
  { name: '流行', count: 42, percent: 33 },
  { name: '民谣', count: 28, percent: 22 },
  { name: '电子', count: 22, percent: 17 },
  { name: '摇滚', count: 18, percent: 14 },
  { name: '古风', count: 12, percent: 9 },
  { name: '其他', count: 6, percent: 5 }
])

const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['11/25', '11/26', '11/27', '11/28', '11/29', '11/30', '12/01'],
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisLabel: { color: '#64748b' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f1f5f9' } },
    axisLabel: { color: '#64748b' }
  },
  series: [{
    name: '收益',
    type: 'bar',
    barWidth: '40%',
    data: [8200, 9320, 7800, 12500, 10800, 15200, 13600],
    itemStyle: {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: '#2563eb' },
          { offset: 1, color: '#1e3a8a' }
        ]
      },
      borderRadius: [4, 4, 0, 0]
    }
  }]
}))

const genreChartOption = computed(() => ({
  tooltip: { trigger: 'item' },
  series: [{
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    emphasis: { label: { show: false } },
    labelLine: { show: false },
    data: [
      { value: 42, name: '流行', itemStyle: { color: '#2563eb' } },
      { value: 28, name: '民谣', itemStyle: { color: '#10b981' } },
      { value: 22, name: '电子', itemStyle: { color: '#f59e0b' } },
      { value: 18, name: '摇滚', itemStyle: { color: '#ef4444' } },
      { value: 12, name: '古风', itemStyle: { color: '#6366f1' } },
      { value: 6, name: '其他', itemStyle: { color: '#94a3b8' } }
    ]
  }]
}))

const getStatusType = (status) => {
  const map = {
    '已完成': 'success',
    '进行中': 'primary',
    '待确认': 'warning',
    '已取消': 'info'
  }
  return map[status] || 'info'
}

const goToUpload = () => {
  router.push('/work/lyric/create')
}

const goToOrders = () => {
  router.push('/orders')
}

const handleTodo = (item) => {
  switch (item.type) {
    case 'audit':
      router.push('/work/lyric')
      break
    case 'order':
      router.push('/orders')
      break
    case 'withdraw':
      router.push('/earnings/withdraw')
      break
  }
}
</script>

<style scoped lang="scss">
.dashboard-page {
  min-height: 100%;
}

.stats-cards {
  .stat-card {
    background: #fff;
    border-radius: $border-radius;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: $shadow-sm;
    transition: $transition-base;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.work {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: $primary-color;
  }
  &.on-sale {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: $success-color;
  }
  &.order {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: $warning-color;
  }
  &.earnings {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    color: $info-color;
  }
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: $text-muted;
}

.stat-trend {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;

  &.up {
    color: $success-color;
  }
  &.down {
    color: $danger-color;
  }
}

.chart-container {
  height: 320px;
}

.genre-chart {
  height: 200px;
}

.todo-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.todo-list {
  flex: 1;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid $border-light;

  &:last-child {
    border-bottom: none;
  }
}

.todo-icon {
  width: 40px;
  height: 40px;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.audit {
    background: #fef3c7;
    color: $warning-color;
  }
  &.order {
    background: #dbeafe;
    color: $primary-color;
  }
  &.withdraw {
    background: #dcfce7;
    color: $success-color;
  }
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.todo-title {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  margin-bottom: 2px;
}

.todo-desc {
  font-size: 12px;
  color: $text-muted;
}

.empty-todo {
  padding: 20px 0;
}

.work-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.work-cover {
  width: 40px;
  height: 40px;
  border-radius: $border-radius-sm;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.order-no {
  font-family: monospace;
  font-size: 13px;
  color: $text-secondary;
}

.amount {
  font-weight: 600;
  color: $primary-color;
}

.genre-list {
  margin-top: 16px;
}

.genre-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
}

.genre-name {
  width: 50px;
  font-size: 13px;
  color: $text-secondary;
}

.genre-bar {
  flex: 1;
  height: 6px;
  background: $bg-body;
  border-radius: 3px;
  overflow: hidden;
}

.genre-bar-inner {
  height: 100%;
  background: linear-gradient(90deg, $primary-color, $primary-light);
  border-radius: 3px;
}

.genre-count {
  width: 50px;
  text-align: right;
  font-size: 13px;
  color: $text-muted;
}
</style>
