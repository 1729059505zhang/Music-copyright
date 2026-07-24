<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">操作日志</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="username" placeholder="操作人" style="width: 180px" clearable />
        <el-input v-model="module" placeholder="模块" style="width: 140px" clearable />
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe size="small">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="action" label="操作" min-width="200" show-overflow-tooltip />
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="ip" label="IP" width="140" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="耗时" width="100">
          <template #default="{ row }">{{ row.duration }}ms</template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="180" />
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" :page-sizes="[20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/api/request'

const loading = ref(false)
const tableData = ref([])
const username = ref('')
const module = ref('')
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/system/logs', {
      params: { page: pagination.page, pageSize: pagination.pageSize, username: username.value || undefined, module: module.value || undefined }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

onMounted(() => fetchList())
</script>
