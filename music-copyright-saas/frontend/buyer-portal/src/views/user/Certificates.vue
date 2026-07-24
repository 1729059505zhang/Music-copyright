<template>
  <div class="certificates-page">
    <div class="filter-bar">
      <div class="filter-left">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索凭证编号、作品名称" 
          style="width: 280px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-date-picker 
          v-model="dateRange" 
          type="daterange" 
          range-separator="至" 
          start-placeholder="开始日期" 
          end-placeholder="结束日期"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>

    <div class="certificate-list">
      <div v-for="cert in certificateList" :key="cert.id" class="cert-card">
        <div class="cert-preview">
          <div class="cert-paper">
            <div class="cert-header">
              <div class="cert-logo">
                <el-icon :size="28" color="#1e40af"><Music /></el-icon>
              </div>
              <h3 class="cert-title">音乐版权授权证书</h3>
              <div class="cert-no">证书编号：{{ cert.certNo }}</div>
            </div>
            <div class="cert-body">
              <p class="cert-text">兹证明</p>
              <p class="cert-company">{{ cert.companyName }}</p>
              <p class="cert-text">已获得以下音乐作品的授权使用权：</p>
              <p class="cert-work">{{ cert.workTitle }}</p>
              <div class="cert-info-row">
                <div class="cert-info-item">
                  <span class="label">授权类型</span>
                  <span class="value">{{ cert.licenseType }}</span>
                </div>
                <div class="cert-info-item">
                  <span class="label">授权期限</span>
                  <span class="value">{{ cert.licensePeriod }}</span>
                </div>
              </div>
            </div>
            <div class="cert-footer">
              <div class="cert-seal">
                <div class="seal-text">版权专用章</div>
              </div>
              <div class="cert-date">签发日期：{{ cert.issueDate }}</div>
            </div>
          </div>
        </div>
        <div class="cert-info">
          <h4 class="work-title">{{ cert.workTitle }}</h4>
          <p class="work-creator">创作者：{{ cert.creator }}</p>
          <div class="cert-detail">
            <div class="detail-item">
              <span class="label">凭证编号</span>
              <span class="value">{{ cert.certNo }}</span>
            </div>
            <div class="detail-item">
              <span class="label">授权类型</span>
              <el-tag size="small" type="primary">{{ cert.licenseType }}</el-tag>
            </div>
            <div class="detail-item">
              <span class="label">签发日期</span>
              <span class="value">{{ cert.issueDate }}</span>
            </div>
            <div class="detail-item">
              <span class="label">有效期至</span>
              <span class="value">{{ cert.expireDate }}</span>
            </div>
          </div>
          <div class="cert-actions">
            <el-button type="primary" @click="downloadPDF(cert)">
              <el-icon><Download /></el-icon>
              下载PDF
            </el-button>
            <el-button @click="viewDetail(cert)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button text type="primary" @click="verifyCert(cert)">
              验真
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[6, 12, 24]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const dateRange = ref('')
const total = ref(56)

const pagination = reactive({
  page: 1,
  pageSize: 6
})

const certificateList = ref([
  {
    id: 1,
    certNo: 'MCRT-2024-00001',
    workTitle: '夏日微风',
    creator: '李音乐',
    companyName: '北京示例科技有限公司',
    licenseType: '商业授权',
    licensePeriod: '永久',
    issueDate: '2024-01-15',
    expireDate: '永久有效'
  },
  {
    id: 2,
    certNo: 'MCRT-2024-00002',
    workTitle: '星空下的约定',
    creator: '王创作',
    companyName: '北京示例科技有限公司',
    licenseType: '独家授权',
    licensePeriod: '永久',
    issueDate: '2024-01-12',
    expireDate: '永久有效'
  },
  {
    id: 3,
    certNo: 'MCRT-2024-00003',
    workTitle: '江南烟雨',
    creator: '古风韵',
    companyName: '北京示例科技有限公司',
    licenseType: '商业授权',
    licensePeriod: '永久',
    issueDate: '2024-01-10',
    expireDate: '永久有效'
  },
  {
    id: 4,
    certNo: 'MCRT-2024-00004',
    workTitle: '城市夜晚',
    creator: '都市音乐人',
    companyName: '北京示例科技有限公司',
    licenseType: '商业授权',
    licensePeriod: '永久',
    issueDate: '2024-01-08',
    expireDate: '永久有效'
  }
])

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const downloadPDF = (cert) => {
  ElMessage.success(`正在下载凭证：${cert.certNo}`)
}

const viewDetail = (cert) => {
  ElMessage.info(`查看详情：${cert.certNo}`)
}

const verifyCert = (cert) => {
  ElMessage.success(`凭证验证通过：${cert.certNo}`)
}
</script>

<style scoped lang="scss">
.certificates-page {
  padding: 24px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.certificate-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.cert-card {
  border: 1px solid $border-color;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  transition: $transition-base;

  &:hover {
    box-shadow: $shadow-md;
  }
}

.cert-preview {
  width: 320px;
  flex-shrink: 0;
  background: #f8fafc;
  padding: 20px;
  border-right: 1px solid $border-light;
}

.cert-paper {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: $shadow-sm;
  position: relative;
  transform: scale(0.85);
  transform-origin: top left;
  width: 118%;
}

.cert-header {
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid $primary-color;
  margin-bottom: 12px;
}

.cert-logo {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
}

.cert-title {
  font-size: 16px;
  font-weight: 700;
  color: $primary-color;
  margin-bottom: 6px;
}

.cert-no {
  font-size: 10px;
  color: $text-muted;
}

.cert-body {
  text-align: center;
  padding: 8px 0;
}

.cert-text {
  font-size: 11px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.cert-company {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin: 6px 0;
}

.cert-work {
  font-size: 15px;
  font-weight: 700;
  color: $primary-color;
  margin: 8px 0;
}

.cert-info-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 12px;
}

.cert-info-item {
  text-align: center;

  .label {
    display: block;
    font-size: 10px;
    color: $text-muted;
    margin-bottom: 2px;
  }

  .value {
    font-size: 11px;
    color: $text-primary;
    font-weight: 500;
  }
}

.cert-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed $border-color;
}

.cert-seal {
  width: 60px;
  height: 60px;
  border: 2px solid #dc2626;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transform: rotate(-15deg);

  .seal-text {
    font-size: 10px;
    color: #dc2626;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
  }
}

.cert-date {
  font-size: 10px;
  color: $text-muted;
}

.cert-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 16px;
}

.cert-detail {
  flex: 1;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid $border-light;
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: $text-muted;
  }

  .value {
    color: $text-primary;
    font-weight: 500;
  }
}

.cert-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;

  .el-button {
    flex: 1;
  }
}
</style>
