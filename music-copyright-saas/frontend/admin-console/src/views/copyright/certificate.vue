<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">版权证书管理</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="证书编号/作品名称" style="width: 280px" clearable @keyup.enter="fetchList" />
        <el-select v-model="status" placeholder="状态" clearable style="width: 120px">
          <el-option label="有效" :value="1" />
          <el-option label="已作废" :value="0" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="certificate_no" label="证书编号" width="200" />
        <el-table-column prop="work_title" label="作品名称" min-width="180" />
        <el-table-column prop="author_name" label="作者" width="140" />
        <el-table-column prop="copyright_owner" label="版权所有人" width="140" />
        <el-table-column prop="register_date" label="登记日期" width="120" />
        <el-table-column prop="hash_value" label="作品哈希" width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '有效' : '已作废' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reissue_count" label="补发次数" width="100" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleReissue(row)">补发</el-button>
            <el-button size="small" type="info" link>下载</el-button>
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
const status = ref('')
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/copyright/certificates', {
      params: { page: pagination.page, pageSize: pagination.pageSize, keyword: keyword.value || undefined, status: status.value }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

const handleReissue = async (row) => {
  try {
    await ElMessageBox.confirm('确定要补发该证书吗？', '提示', { type: 'warning' })
    await request.post(`/copyright/certificates/${row.id}/reissue`)
    ElMessage.success('补发成功')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => fetchList())
</script>
