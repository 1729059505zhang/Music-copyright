<template>
  <div class="dashboard-page">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card lyric">
          <div class="stat-icon">
            <el-icon><DocumentMusic /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingLyricCount || 28 }}</div>
            <div class="stat-label">待审核词曲</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>12%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card release">
          <div class="stat-icon">
            <el-icon><VideoPlay /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingReleaseCount || 15 }}</div>
            <div class="stat-label">待审核发行</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>8%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card copyright">
          <div class="stat-icon">
            <el-icon><Medal /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingCopyrightCount || 22 }}</div>
            <div class="stat-label">待登记版权</div>
          </div>
          <div class="stat-trend down">
            <el-icon><Bottom /></el-icon>
            <span>5%</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card today">
          <div class="stat-icon">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayAuditCount || 47 }}</div>
            <div class="stat-label">今日已审核</div>
          </div>
          <div class="stat-trend up">
            <el-icon><Top /></el-icon>
            <span>23%</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <div class="chart-card">
          <div class="chart-header">
            <h3>近7日审核量趋势</h3>
            <el-radio-group v-model="chartType" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="lyric">词曲</el-radio-button>
              <el-radio-button label="release">发行</el-radio-button>
              <el-radio-button label="copyright">版权</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="chartRef" class="chart-container"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-header">
            <h3>审核效率统计</h3>
          </div>
          <div class="efficiency-stats">
            <div class="efficiency-item">
              <div class="eff-label">平均审核时长</div>
              <div class="eff-value">2.5<span>小时</span></div>
              <div class="eff-bar">
                <div class="eff-bar-inner" style="width: 75%"></div>
              </div>
            </div>
            <div class="efficiency-item">
              <div class="eff-label">一次性通过率</div>
              <div class="eff-value">86<span>%</span></div>
              <div class="eff-bar">
                <div class="eff-bar-inner" style="width: 86%"></div>
              </div>
            </div>
            <div class="efficiency-item">
              <div class="eff-label">今日完成率</div>
              <div class="eff-value">68<span>%</span></div>
              <div class="eff-bar">
                <div class="eff-bar-inner" style="width: 68%"></div>
              </div>
            </div>
            <div class="efficiency-item">
              <div class="eff-label">本周工作量</div>
              <div class="eff-value">156<span>件</span></div>
              <div class="eff-bar">
                <div class="eff-bar-inner" style="width: 78%"></div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="14">
        <div class="chart-card">
          <div class="chart-header">
            <h3>待办事项</h3>
            <el-button type="primary" link @click="$router.push('/work/lyric')">查看全部</el-button>
          </div>
          <el-table :data="todoList" style="width: 100%">
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="getTagType(row.type)" size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="内容" />
            <el-table-column prop="submitter" label="提交人" width="100" />
            <el-table-column prop="time" label="提交时间" width="160" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="handleTodo(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="chart-card">
          <div class="chart-header">
            <h3>快捷入口</h3>
          </div>
          <div class="quick-actions">
            <div class="action-item" @click="$router.push('/work/lyric')">
              <div class="action-icon lyric">
                <el-icon><DocumentMusic /></el-icon>
              </div>
              <span>词曲审核</span>
            </div>
            <div class="action-item" @click="$router.push('/work/release')">
              <div class="action-icon release">
                <el-icon><VideoPlay /></el-icon>
              </div>
              <span>发行审核</span>
            </div>
            <div class="action-item" @click="$router.push('/copyright/apply')">
              <div class="action-icon copyright">
                <el-icon><Medal /></el-icon>
              </div>
              <span>登记审核</span>
            </div>
            <div class="action-item" @click="$router.push('/risk')">
              <div class="action-icon risk">
                <el-icon><Warning /></el-icon>
              </div>
              <span>风险筛查</span>
            </div>
            <div class="action-item" @click="$router.push('/certificate')">
              <div class="action-icon cert">
                <el-icon><Postcard /></el-icon>
              </div>
              <span>证书管理</span>
            </div>
            <div class="action-item" @click="$router.push('/archive')">
              <div class="action-icon archive">
                <el-icon><Files /></el-icon>
              </div>
              <span>档案检索</span>
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

const stats = ref({})
const chartRef = ref(null)
const chartType = ref('all')
let chartInstance = null

const todoList = ref([
  { type: '词曲审核', title: '《夜的第七章》歌词审核', submitter: '张三', time: '2024-01-15 10:30' },
  { type: '发行审核', title: 'EP《四季》发行审核', submitter: '李四', time: '2024-01-15 09:45' },
  { type: '版权登记', title: '《稻香》版权登记申请', submitter: '王五', time: '2024-01-15 08:20' },
  { type: '风险处理', title: '涉嫌侵权作品核查', submitter: '系统', time: '2024-01-14 16:30' },
  { type: '词曲审核', title: '《晴天》曲谱审核', submitter: '赵六', time: '2024-01-14 14:15' },
  { type: '版权登记', title: '《青花瓷》补正材料审核', submitter: '钱七', time: '2024-01-14 11:00' }
])

const getTagType = (type) => {
  const map = {
    '词曲审核': 'warning',
    '发行审核': 'primary',
    '版权登记': 'success',
    '风险处理': 'danger'
  }
  return map[type] || 'info'
}

const handleTodo = (row) => {
  if (row.type === '词曲审核') {
    window.location.href = '/work/lyric'
  } else if (row.type === '发行审核') {
    window.location.href = '/work/release'
  } else if (row.type === '版权登记') {
    window.location.href = '/copyright/apply'
  } else if (row.type === '风险处理') {
    window.location.href = '/risk'
  }
}

const trendData = {
  all: [42, 38, 55, 48, 62, 51, 47],
  lyric: [18, 15, 22, 20, 25, 19, 21],
  release: [10, 12, 15, 13, 18, 14, 12],
  copyright: [14, 11, 18, 15, 19, 18, 14]
}

const renderChart = () => {
  if (!chartRef.value) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const dates = ['01-09', '01-10', '01-11', '01-12', '01-13', '01-14', '01-15']
  const data = trendData[chartType.value] || trendData.all

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#bbf7d0',
      textStyle: { color: '#14532d' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#bbf7d0' } },
      axisLabel: { color: '#52525b' }
    },
    yAxis: {
      type: 'value',
      name: '审核数量',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#52525b' },
      splitLine: { lineStyle: { color: '#dcfce7' } }
    },
    series: [
      {
        name: '审核量',
        type: 'line',
        data: data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#166534', width: 3 },
        itemStyle: { color: '#166534' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(22, 101, 52, 0.3)' },
            { offset: 1, color: 'rgba(22, 101, 52, 0.02)' }
          ])
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    renderChart()
  })
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
  gap: 16px;
  box-shadow: 0 1px 3px rgba(22, 101, 52, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(22, 101, 52, 0.15);
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
    flex-shrink: 0;
  }

  &.lyric .stat-icon {
    background: linear-gradient(135deg, #166534, #059669);
  }
  &.release .stat-icon {
    background: linear-gradient(135deg, #0891b2, #06b6d4);
  }
  &.copyright .stat-icon {
    background: linear-gradient(135deg, #b45309, #d97706);
  }
  &.today .stat-icon {
    background: linear-gradient(135deg, #059669, #10b981);
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #14532d;
      margin-bottom: 4px;
      line-height: 1.2;
    }
    .stat-label {
      font-size: 13px;
      color: #71717a;
    }
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
      color: #16a34a;
    }
    &.down {
      color: #dc2626;
    }
  }
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(22, 101, 52, 0.05);

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #14532d;
      margin: 0;
    }
  }

  .chart-container {
    width: 100%;
    height: 320px;
  }
}

.efficiency-stats {
  padding: 10px 0;

  .efficiency-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .eff-label {
      font-size: 13px;
      color: #71717a;
      margin-bottom: 8px;
    }

    .eff-value {
      font-size: 24px;
      font-weight: 700;
      color: #166534;
      margin-bottom: 8px;

      span {
        font-size: 13px;
        font-weight: 400;
        color: #71717a;
        margin-left: 4px;
      }
    }

    .eff-bar {
      height: 6px;
      background: #dcfce7;
      border-radius: 3px;
      overflow: hidden;

      .eff-bar-inner {
        height: 100%;
        background: linear-gradient(90deg, #166534, #059669);
        border-radius: 3px;
        transition: width 0.5s ease;
      }
    }
  }
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 10px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 12px;
    background: #f0fdf4;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: #dcfce7;
      transform: scale(1.03);
    }

    .action-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      color: #fff;
      margin-bottom: 8px;

      &.lyric {
        background: linear-gradient(135deg, #166534, #059669);
      }
      &.release {
        background: linear-gradient(135deg, #0891b2, #06b6d4);
      }
      &.copyright {
        background: linear-gradient(135deg, #b45309, #d97706);
      }
      &.risk {
        background: linear-gradient(135deg, #dc2626, #ef4444);
      }
      &.cert {
        background: linear-gradient(135deg, #7c3aed, #8b5cf6);
      }
      &.archive {
        background: linear-gradient(135deg, #475569, #64748b);
      }
    }

    span {
      font-size: 12px;
      color: #14532d;
      font-weight: 500;
    }
  }
}
</style>
