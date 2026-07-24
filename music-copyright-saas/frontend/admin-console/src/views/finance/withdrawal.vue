<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">提现审核</h2></div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-select v-model="status" placeholder="审核状态" clearable style="width: 140px">
          <el-option label="待审核" :value="0" />
          <el-option label="审核通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
          <el-option label="已完成" :value="4" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="withdrawal_no" label="提现单号" width="200" />
        <el-table-column label="申请人" width="160">
          <template #default="{ row }">{{ row.creator?.creator_name || '-' }}</template>
        </el-table-column>
        <el-table-column label="提现金额" width="120">
          <template #default="{ row }"><span style="color:#ef4444">¥{{ (row.amount / 100).toFixed(2) }}</span></template>
        </el-table-column>
        <el-table-column label="手续费" width="100">
          <template #default="{ row }">¥{{ (row.fee / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="实到金额" width="120">
          <template #default="{ row }">¥{{ (row.actual_amount / 100).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="提现方式" width="100">
          <template #default="{ row }">{{ typeMap[row.withdrawal_type] }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.apply_status]" size="small">{{ statusMap[row.apply_status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.apply_status === 0" size="small" type="success" link @click="handleAudit(row, true)">通过</el-button>
            <el-button v-if="row.apply_status === 0" size="small" type="danger" link @click="handleAudit(row, false)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
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
const status = ref('')
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const typeMap = { 1: '银行卡', 2: '支付宝', 3: '微信' }
const statusMap = { 0: '待审核', 1: '审核通过', 2: '已拒绝', 3: '打款中', 4: '已完成', 5: '打款失败' }
const statusType = { 0: 'warning', 1: 'primary', 2: 'danger', 3: 'info', 4: 'success', 5: 'danger' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/finance/withdrawals', {
      params: { page: pagination.page, pageSize: pagination.pageSize, status: status.value }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

const handleAudit = async (row, pass) => {
  try {
    let reason = ''
    if (!pass) {
      const { value } = await ElMessageBox.prompt('请输入驳回原因', '审核驳回', { confirmButtonText: '确定', cancelButtonText: '取消', inputType: 'textarea', inputValidator: val => !!val || '请输入驳回原因' })
      reason = value
    } else {
      await ElMessageBox.confirm(`确定要通过该提现申请吗？\n提现金额：¥${(row.amount/100).toFixed(2)}`, '提示', { type: 'warning' })
    }
    await request.put(`/finance/withdrawals/${row.id}/audit`, { pass, reason })
    ElMessage.success(pass ? '审核通过' : '已驳回')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => {
  if (route.query.status !== undefined) status.value = route.query.status
  fetchList()
})
</script>
