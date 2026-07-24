<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">版权登记申请审核</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="searchForm.keyword" placeholder="作品名称" style="width: 260px" clearable />
        <el-select v-model="searchForm.status" placeholder="审核状态" clearable style="width: 140px">
          <el-option label="待提交" :value="0" />
          <el-option label="审核中" :value="1" />
          <el-option label="已通过" :value="2" />
          <el-option label="已拒绝" :value="3" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="work_title" label="作品名称" min-width="200" />
        <el-table-column prop="author_name" label="作者" width="140" />
        <el-table-column label="申请人" width="160">
          <template #default="{ row }">{{ row.creator?.creator_name || '-' }}</template>
        </el-table-column>
        <el-table-column label="申请费用" width="120">
          <template #default="{ row }">¥{{ (row.apply_fee / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.apply_status]" size="small">{{ statusMap[row.apply_status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">详情</el-button>
            <el-button v-if="row.apply_status === 1" size="small" type="success" link @click="handleAudit(row, true)">通过</el-button>
            <el-button v-if="row.apply_status === 1" size="small" type="danger" link @click="handleAudit(row, false)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>
    <el-dialog v-model="detailVisible" title="版权登记详情" width="600px">
      <el-descriptions v-if="currentRow" :column="2" border size="small">
        <el-descriptions-item label="作品名称" :span="2">{{ currentRow.work_title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ currentRow.author_name }}</el-descriptions-item>
        <el-descriptions-item label="版权所有人">{{ currentRow.copyright_owner }}</el-descriptions-item>
        <el-descriptions-item label="创作日期">{{ currentRow.creation_date || '-' }}</el-descriptions-item>
        <el-descriptions-item label="首次发表">{{ currentRow.first_publish_date || '-' }}</el-descriptions-item>
        <el-descriptions-item label="申请费用">¥{{ (currentRow.apply_fee / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType[currentRow.apply_status]" size="small">{{ statusMap[currentRow.apply_status] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentRow.reject_reason" label="驳回原因" :span="2" type="danger">{{ currentRow.reject_reason }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
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
const detailVisible = ref(false)
const currentRow = ref(null)

const searchForm = reactive({ keyword: '', status: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const statusMap = { 0: '待提交', 1: '审核中', 2: '已通过', 3: '已拒绝' }
const statusType = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/copyright/applications', {
      params: { page: pagination.page, pageSize: pagination.pageSize, keyword: searchForm.keyword || undefined, status: searchForm.status }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}
const resetSearch = () => { searchForm.keyword = ''; searchForm.status = ''; pagination.page = 1; fetchList() }

const handleView = (row) => { currentRow.value = row; detailVisible.value = true }

const handleAudit = async (row, pass) => {
  try {
    let reason = ''
    if (!pass) {
      const { value } = await ElMessageBox.prompt('请输入驳回原因', '审核驳回', { confirmButtonText: '确定', cancelButtonText: '取消', inputType: 'textarea', inputValidator: val => !!val || '请输入驳回原因' })
      reason = value
    } else {
      await ElMessageBox.confirm('确定要通过该版权登记申请吗？', '提示', { type: 'success' })
    }
    await request.put(`/copyright/applications/${row.id}/audit`, { pass, reason })
    ElMessage.success(pass ? '审核通过' : '已驳回')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => {
  if (route.query.status !== undefined) searchForm.status = route.query.status
  fetchList()
})
</script>
