<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">资金流水</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-select v-model="flowType" placeholder="流水类型" clearable style="width: 160px">
          <el-option label="订单收入" :value="1" />
          <el-option label="订单退款" :value="2" />
          <el-option label="充值" :value="3" />
          <el-option label="提现" :value="4" />
          <el-option label="分账结算" :value="5" />
          <el-option label="平台抽佣" :value="6" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="flow_no" label="流水号" width="220" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.flow_direction === 1 ? 'success' : 'danger'">
              {{ typeMap[row.flow_type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            <span :style="{ color: row.flow_direction === 1 ? '#10b981' : '#ef4444' }">
              {{ row.flow_direction === 1 ? '+' : '-' }}¥{{ (row.amount / 100).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="变动前余额" width="120">
          <template #default="{ row }">¥{{ (row.balance_before / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="变动后余额" width="120">
          <template #default="{ row }">¥{{ (row.balance_after / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="created_at" label="时间" width="180" />
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
const flowType = ref('')
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const typeMap = { 1: '订单收入', 2: '订单退款', 3: '充值', 4: '提现', 5: '分账结算', 6: '平台抽佣' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/finance/flows', {
      params: { page: pagination.page, pageSize: pagination.pageSize, flowType: flowType.value || undefined }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

onMounted(() => fetchList())
</script>
