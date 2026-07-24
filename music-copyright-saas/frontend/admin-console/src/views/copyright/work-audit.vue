<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">作品内容审核</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索作品名称" style="width: 280px" clearable @keyup.enter="fetchList" />
        <el-select v-model="auditStatus" placeholder="审核状态" clearable style="width: 140px">
          <el-option label="待审核" :value="0" />
          <el-option label="审核通过" :value="1" />
          <el-option label="审核拒绝" :value="2" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="作品名称" min-width="200" />
        <el-table-column label="申请人" width="160">
          <template #default="{ row }">{{ row.creator?.creator_name || '-' }}</template>
        </el-table-column>
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image v-if="row.cover_url" :src="row.cover_url" style="width: 50px; height: 50px; border-radius: 4px" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.audit_status]" size="small">{{ statusMap[row.audit_status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="提交时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">查看</el-button>
            <el-button v-if="row.audit_status === 0" size="small" type="success" link @click="handleAudit(row, true)">通过</el-button>
            <el-button v-if="row.audit_status === 0" size="small" type="danger" link @click="handleAudit(row, false)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const tableData = ref([])
const keyword = ref('')
const auditStatus = ref('')
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const statusMap = { 0: '待审核', 1: '审核通过', 2: '审核拒绝' }
const statusType = { 0: 'warning', 1: 'success', 2: 'danger' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/works', {
      params: { page: pagination.page, pageSize: pagination.pageSize, keyword: keyword.value || undefined, auditStatus: auditStatus.value }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

const handleView = (row) => {
  ElMessageBox.alert(`作品名称: ${row.title}\n创作者: ${row.creator?.creator_name || '-'}\n提交时间: ${row.created_at}`, '作品详情')
}

const handleAudit = async (row, pass) => {
  try {
    let reason = ''
    if (!pass) {
      const { value } = await ElMessageBox.prompt('请输入驳回原因', '审核驳回', { confirmButtonText: '确定', cancelButtonText: '取消', inputType: 'textarea', inputValidator: val => !!val || '请输入驳回原因' })
      reason = value
    } else {
      await ElMessageBox.confirm('确定要通过该作品的审核吗？', '提示', { type: 'success' })
    }
    await request.put(`/works/${row.id}/audit`, { pass, reason })
    ElMessage.success(pass ? '审核通过' : '已驳回')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => fetchList())
</script>
