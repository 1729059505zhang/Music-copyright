<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">交易订单</h2>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="searchForm.keyword" placeholder="订单号" style="width: 260px" clearable />
        <el-select v-model="searchForm.status" placeholder="订单状态" clearable style="width: 160px">
          <el-option label="待支付" :value="0" />
          <el-option label="已支付待结算" :value="1" />
          <el-option label="交易完成" :value="2" />
          <el-option label="已取消" :value="3" />
          <el-option label="已退款" :value="4" />
        </el-select>
        <el-select v-model="searchForm.orderType" placeholder="订单类型" clearable style="width: 140px">
          <el-option label="词曲授权" :value="1" />
          <el-option label="版权登记" :value="2" />
          <el-option label="发行服务" :value="3" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 280px"
        />
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="order_no" label="订单号" width="200" />
        <el-table-column label="买家" width="140">
          <template #default="{ row }">
            {{ row.buyer?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="row.order_type === 1 ? 'primary' : row.order_type === 2 ? 'success' : 'warning'">
              {{ orderTypeMap[row.order_type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120">
          <template #default="{ row }">
            <span style="color: #ef4444; font-weight: 500">¥{{ (row.pay_amount / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="100">
          <template #default="{ row }">
            <el-tag :type="payStatusType[row.pay_status]" size="small">
              {{ payStatusMap[row.pay_status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType[row.order_status]" size="small">
              {{ statusMap[row.order_status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="结算状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.settlement_status === 2 ? 'success' : 'warning'" size="small">
              {{ settlementMap[row.settlement_status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">详情</el-button>
            <el-button
              v-if="row.order_status === 1 || row.order_status === 2"
              size="small"
              type="danger"
              link
              @click="handleRefund(row)"
            >退款</el-button>
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

    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <el-descriptions v-if="currentOrder" :column="2" border size="small">
        <el-descriptions-item label="订单号">{{ currentOrder.order_no }}</el-descriptions-item>
        <el-descriptions-item label="订单类型">{{ orderTypeMap[currentOrder.order_type] }}</el-descriptions-item>
        <el-descriptions-item label="买家">{{ currentOrder.buyer?.username }} / {{ currentOrder.buyer?.phone }}</el-descriptions-item>
        <el-descriptions-item label="订单金额">¥{{ (currentOrder.pay_amount / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="支付状态">{{ payStatusMap[currentOrder.pay_status] }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">{{ statusMap[currentOrder.order_status] }}</el-descriptions-item>
        <el-descriptions-item label="支付时间">{{ currentOrder.pay_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="冻结至">{{ currentOrder.frozen_until || '-' }}</el-descriptions-item>
        <el-descriptions-item label="商品明细" :span="2">
          <el-table :data="currentOrder.items || []" size="small" border>
            <el-table-column prop="item_name" label="商品名称" />
            <el-table-column label="授权类型" width="100">
              <template #default="{ row }">
                {{ licenseTypeMap[row.license_type] || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="单价" width="100">
              <template #default="{ row }">¥{{ (row.price / 100).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="60" />
            <el-table-column label="小计" width="100">
              <template #default="{ row }">¥{{ (row.total_price / 100).toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const tableData = ref([])
const detailVisible = ref(false)
const currentOrder = ref(null)
const dateRange = ref([])

const searchForm = reactive({
  keyword: '',
  status: '',
  orderType: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const orderTypeMap = { 1: '词曲授权', 2: '版权登记', 3: '发行服务' }
const statusMap = { 0: '待支付', 1: '已支付待结算', 2: '交易完成', 3: '已取消', 4: '已退款' }
const statusType = { 0: 'warning', 1: 'primary', 2: 'success', 3: 'info', 4: 'danger' }
const payStatusMap = { 0: '待支付', 1: '已支付', 2: '已退款', 3: '支付失败' }
const payStatusType = { 0: 'warning', 1: 'success', 2: 'danger', 3: 'info' }
const settlementMap = { 0: '未结算', 1: '结算中', 2: '已结算' }
const licenseTypeMap = { 1: '非商用', 2: '商用', 3: '独家', 4: '全版权' }

const fetchList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword || undefined,
      status: searchForm.status,
      orderType: searchForm.orderType || undefined
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    const res = await request.get('/orders', { params })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.orderType = ''
  dateRange.value = []
  pagination.page = 1
  fetchList()
}

const handleView = async (row) => {
  try {
    const res = await request.get(`/orders/${row.id}`)
    currentOrder.value = res
    detailVisible.value = true
  } catch (e) {
    console.error(e)
  }
}

const handleRefund = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入退款原因', '订单退款', {
      confirmButtonText: '确认退款',
      cancelButtonText: '取消',
      type: 'warning',
      inputType: 'textarea',
      inputValidator: (val) => !!val || '请输入退款原因'
    })
    await ElMessageBox.confirm('确认要对该订单进行退款吗？', '二次确认', { type: 'error' })
    await request.post(`/orders/${row.id}/refund`, { reason: value })
    ElMessage.success('退款成功')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(() => {
  fetchList()
})
</script>
