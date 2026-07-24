<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">词曲作品</h2>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索作品标题"
          style="width: 280px"
          clearable
          @keyup.enter="fetchList"
        />
        <el-select v-model="searchForm.status" placeholder="上架状态" clearable style="width: 140px">
          <el-option label="已下架" :value="0" />
          <el-option label="已上架" :value="1" />
        </el-select>
        <el-select v-model="searchForm.auditStatus" placeholder="审核状态" clearable style="width: 140px">
          <el-option label="待审核" :value="0" />
          <el-option label="审核通过" :value="1" />
          <el-option label="审核拒绝" :value="2" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="作品" min-width="220">
          <template #default="{ row }">
            <div class="work-item">
              <div class="work-cover">
                <el-icon v-if="!row.cover_url" size="32"><Picture /></el-icon>
                <img v-else :src="row.cover_url" />
              </div>
              <div class="work-info">
                <div class="work-title text-ellipsis">{{ row.title }}</div>
                <div class="work-creator text-ellipsis">{{ row.creator?.creator_name || '-' }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="曲风" width="120">
          <template #default="{ row }">
            {{ row.category?.name || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="销售模式" width="110">
          <template #default="{ row }">
            <el-tag :type="row.sale_mode === 1 ? 'success' : 'warning'" size="small">
              {{ row.sale_mode === 1 ? '明码标价' : '仅询价' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sale_count" label="成交数" width="90" />
        <el-table-column prop="view_count" label="浏览量" width="90" />
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="auditStatusType[row.audit_status]" size="small">
              {{ auditStatusMap[row.audit_status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上架状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
              {{ row.status === 1 ? '已上架' : '已下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">详情</el-button>
            <el-button
              v-if="row.audit_status === 0"
              size="small"
              type="success"
              link
              @click="handleAudit(row, true)"
            >审核通过</el-button>
            <el-button
              v-if="row.audit_status === 0"
              size="small"
              type="danger"
              link
              @click="handleAudit(row, false)"
            >审核拒绝</el-button>
            <el-button size="small" type="warning" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const route = useRoute()
const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  status: '',
  auditStatus: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const auditStatusMap = { 0: '待审核', 1: '审核通过', 2: '审核拒绝' }
const auditStatusType = { 0: 'warning', 1: 'success', 2: 'danger' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/works', {
      params: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchForm.keyword || undefined,
        status: searchForm.status,
        auditStatus: searchForm.auditStatus
      }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.auditStatus = ''
  pagination.page = 1
  fetchList()
}

const handleView = (row) => {
  ElMessageBox.alert(
    `作品ID: ${row.id}\n标题: ${row.title}\n创作者: ${row.creator?.creator_name || '-'}\n曲风: ${row.category?.name || '-'}\nBPM: ${row.tempo || '-'}\n调性: ${row.tonality || '-'}\n语言: ${row.language || '-'}`,
    '作品详情',
    { confirmButtonText: '确定', customStyle: { width: '500px' } }
  )
}

const handleAudit = async (row, pass) => {
  try {
    let reason = ''
    if (!pass) {
      const { value } = await ElMessageBox.prompt('请输入拒绝原因', '审核拒绝', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValidator: (val) => !!val || '请输入拒绝原因'
      })
      reason = value
    } else {
      await ElMessageBox.confirm('确定要通过该作品的审核吗？', '提示', { type: 'success' })
    }
    await request.put(`/works/${row.id}/audit`, { pass, reason })
    ElMessage.success(pass ? '审核通过' : '已拒绝')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该作品吗？删除后不可恢复！', '警告', { type: 'warning' })
    await request.delete(`/works/${row.id}`)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(() => {
  if (route.query.auditStatus !== undefined) {
    searchForm.auditStatus = route.query.auditStatus
  }
  fetchList()
})
</script>

<style lang="scss" scoped>
.work-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.work-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  color: #94a3b8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.work-info {
  flex: 1;
  min-width: 0;

  .work-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }

  .work-creator {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
}
</style>
