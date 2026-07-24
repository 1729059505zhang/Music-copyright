<template>
  <div class="inquiries-page">
    <div class="filter-bar">
      <div class="filter-left">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索询价作品" 
          style="width: 280px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="状态筛选" style="width: 140px" clearable>
          <el-option label="待回复" value="pending" />
          <el-option label="已回复" value="replied" />
          <el-option label="已关闭" value="closed" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <el-table :data="inquiryList" stripe style="width: 100%">
      <el-table-column label="作品信息" min-width="280">
        <template #default="{ row }">
          <div class="work-info-cell">
            <img :src="row.cover" :alt="row.workTitle" class="work-cover" />
            <div class="work-detail">
              <div class="work-title">{{ row.workTitle }}</div>
              <div class="work-creator">{{ row.creator }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="inquiryType" label="询价类型" width="120" />
      <el-table-column prop="budget" label="预算范围" width="140">
        <template #default="{ row }">
          <span class="budget-text">¥{{ row.budget }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="询价时间" width="180" />
      <el-table-column prop="replyTime" label="回复时间" width="180">
        <template #default="{ row }">
          <span v-if="row.replyTime">{{ row.replyTime }}</span>
          <span v-else class="text-muted">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewDetail(row)">查看详情</el-button>
          <el-button 
            v-if="row.status === 'replied'" 
            size="small"
            @click="handleBuy(row)"
          >
            立即购买
          </el-button>
        </template>
      </el-table-column>
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

    <el-dialog v-model="detailDialogVisible" title="询价详情" width="600px">
      <div v-if="currentInquiry" class="inquiry-detail">
        <div class="detail-section">
          <h4>作品信息</h4>
          <div class="detail-work">
            <img :src="currentInquiry.cover" :alt="currentInquiry.workTitle" />
            <div>
              <div class="work-title">{{ currentInquiry.workTitle }}</div>
              <div class="work-creator">创作者：{{ currentInquiry.creator }}</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>询价内容</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">询价类型</span>
              <span class="value">{{ currentInquiry.inquiryType }}</span>
            </div>
            <div class="detail-item">
              <span class="label">预算范围</span>
              <span class="value price">¥{{ currentInquiry.budget }}</span>
            </div>
            <div class="detail-item full">
              <span class="label">使用场景</span>
              <span class="value">{{ currentInquiry.scene }}</span>
            </div>
            <div class="detail-item full">
              <span class="label">补充说明</span>
              <span class="value">{{ currentInquiry.remark }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentInquiry.reply" class="detail-section">
          <h4>平台回复</h4>
          <div class="reply-box">
            <p>{{ currentInquiry.reply }}</p>
            <div class="reply-time">回复时间：{{ currentInquiry.replyTime }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button 
          v-if="currentInquiry?.status === 'replied'" 
          type="primary"
          @click="handleBuy(currentInquiry)"
        >
          立即购买
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const searchKeyword = ref('')
const statusFilter = ref('')
const total = ref(15)
const detailDialogVisible = ref(false)
const currentInquiry = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const inquiryList = ref([
  {
    id: 1,
    workTitle: '夏日微风',
    cover: 'https://picsum.photos/100/100?random=1',
    creator: '李音乐',
    inquiryType: '独家授权',
    budget: '5000-8000',
    createTime: '2024-01-15 10:30:00',
    replyTime: '2024-01-15 14:20:00',
    status: 'replied',
    scene: '品牌年度广告片，预计投放周期1年，覆盖全国主要城市地铁、户外大屏及线上视频平台',
    remark: '希望能获得独家授权，用于我们品牌的年度宣传活动，预算可以再谈。',
    reply: '您好，感谢您的询价。关于《夏日微风》的独家授权，我们可以为您提供6800元的优惠价格，包含全渠道商业使用授权及永久版权。如需进一步沟通，请联系我们的商务专员。'
  },
  {
    id: 2,
    workTitle: '星空下的约定',
    cover: 'https://picsum.photos/100/100?random=2',
    creator: '王创作',
    inquiryType: '商业授权',
    budget: '1000-2000',
    createTime: '2024-01-14 15:45:00',
    replyTime: '',
    status: 'pending',
    scene: '企业内部年会视频背景',
    remark: '用于公司年会的开场视频，约500人规模，不对外传播。'
  },
  {
    id: 3,
    workTitle: '江南烟雨',
    cover: 'https://picsum.photos/100/100?random=4',
    creator: '古风韵',
    inquiryType: '商业授权',
    budget: '2000-3000',
    createTime: '2024-01-13 09:20:00',
    replyTime: '2024-01-13 11:30:00',
    status: 'replied',
    scene: '古风类短视频账号背景音乐，单条视频使用',
    remark: '我们是一个古风文化账号，粉丝约50万，想使用这首曲子作为视频BGM。',
    reply: '您好，可以使用。商业授权价格为2800元，可用于您的短视频账号所有视频。'
  },
  {
    id: 4,
    workTitle: '电子狂欢',
    cover: 'https://picsum.photos/100/100?random=3',
    creator: 'DJ小飞',
    inquiryType: '个人授权',
    budget: '300-500',
    createTime: '2024-01-12 16:10:00',
    replyTime: '2024-01-12 17:00:00',
    status: 'closed',
    scene: '个人Vlog背景音乐',
    remark: '个人旅行Vlog使用，非商业用途。',
    reply: '您好，个人授权价格为299元，可用于非商业用途。'
  }
])

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    replied: 'success',
    closed: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待回复',
    replied: '已回复',
    closed: '已关闭'
  }
  return map[status] || status
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const viewDetail = (row) => {
  currentInquiry.value = row
  detailDialogVisible.value = true
}

const handleBuy = (row) => {
  detailDialogVisible.value = false
  router.push(`/market/${row.id}`)
}
</script>

<style scoped lang="scss">
.inquiries-page {
  padding: 24px;
}

.filter-bar {
  margin-bottom: 20px;
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.work-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.work-cover {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  object-fit: cover;
}

.work-detail {
  .work-title {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 4px;
  }

  .work-creator {
    font-size: 12px;
    color: $text-secondary;
  }
}

.budget-text {
  color: $danger-color;
  font-weight: 600;
}

.text-muted {
  color: $text-muted;
}

.inquiry-detail {
  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: 15px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid $border-light;
    }
  }

  .detail-work {
    display: flex;
    align-items: center;
    gap: 16px;

    img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }

    .work-title {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 6px;
    }

    .work-creator {
      font-size: 13px;
      color: $text-secondary;
    }
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .detail-item {
    &.full {
      grid-column: 1 / -1;
    }

    .label {
      display: block;
      font-size: 13px;
      color: $text-muted;
      margin-bottom: 4px;
    }

    .value {
      font-size: 14px;
      color: $text-primary;

      &.price {
        color: $danger-color;
        font-weight: 600;
      }
    }
  }

  .reply-box {
    background: #f0fdf4;
    border-radius: 8px;
    padding: 16px;

    p {
      font-size: 14px;
      color: $text-primary;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .reply-time {
      font-size: 12px;
      color: $text-muted;
      text-align: right;
    }
  }
}
</style>
