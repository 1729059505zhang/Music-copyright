<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">分账记录</h2></div>
    <div class="card-wrapper">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="settlement_no" label="结算单号" width="220" />
        <el-table-column label="订单号" width="200">
          <template #default="{ row }">{{ row.order?.order_no || '-' }}</template>
        </el-table-column>
        <el-table-column label="创作者" width="160">
          <template #default="{ row }">{{ row.creator?.creator_name || '-' }}</template>
        </el-table-column>
        <el-table-column label="订单金额" width="120">
          <template #default="{ row }">¥{{ (row.total_amount / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="平台分成" width="120">
          <template #default="{ row }">¥{{ (row.platform_amount / 100).toFixed(2) }} ({{ row.platform_rate }}%)</template>
        </el-table-column>
        <el-table-column label="租户分成" width="120">
          <template #default="{ row }">¥{{ (row.tenant_amount / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="创作者分成" width="140">
          <template #default="{ row }">
            <span style="color:#10b981">¥{{ (row.creator_amount / 100).toFixed(2) }} ({{ row.creator_rate }}%)</span>
          </template>
        </el-table-column>
        <el-table-column prop="settled_at" label="结算时间" width="180" />
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import request from '@/api/request'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/finance/settlements', { params: { page: pagination.page, pageSize: pagination.pageSize } })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

onMounted(() => fetchList())
</script>
