<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">创作者审核</h2>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索创作者名称"
          style="width: 280px"
          clearable
          @keyup.enter="fetchList"
        />
        <el-select v-model="searchForm.creatorType" placeholder="主体类型" clearable style="width: 160px">
          <el-option label="独立音乐人" :value="1" />
          <el-option label="唱片公司" :value="2" />
          <el-option label="音乐工作室" :value="3" />
          <el-option label="MCN机构" :value="4" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="审核状态" clearable style="width: 140px">
          <el-option label="待审核" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
          <el-option label="已禁用" :value="3" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="creator_name" label="主体名称" width="180" />
        <el-table-column label="主体类型" width="120">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ creatorTypeMap[row.creator_type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联用户" width="140">
          <template #default="{ row }">
            {{ row.user?.username || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="contact_name" label="联系人" width="120" />
        <el-table-column prop="contact_phone" label="联系电话" width="140" />
        <el-table-column prop="total_works" label="作品数" width="100" />
        <el-table-column label="累计销售额" width="120">
          <template #default="{ row }">
            ¥{{ (row.total_sales / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType[row.status]" size="small">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">查看</el-button>
            <el-button
              v-if="row.status === 0"
              size="small"
              type="success"
              link
              @click="handleAudit(row, true)"
            >通过</el-button>
            <el-button
              v-if="row.status === 0"
              size="small"
              type="danger"
              link
              @click="handleAudit(row, false)"
            >驳回</el-button>
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

    <el-dialog v-model="detailVisible" title="创作者详情" width="600px">
      <el-descriptions v-if="currentRow" :column="2" border size="small">
        <el-descriptions-item label="主体名称">{{ currentRow.creator_name }}</el-descriptions-item>
        <el-descriptions-item label="主体类型">{{ creatorTypeMap[currentRow.creator_type] }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ currentRow.contact_name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentRow.contact_phone }}</el-descriptions-item>
        <el-descriptions-item label="联系邮箱">{{ currentRow.contact_email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType[currentRow.status]" size="small">
            {{ statusMap[currentRow.status] }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">
          {{ currentRow.description || '-' }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentRow.reject_reason" label="驳回原因" :span="2" type="danger">
          {{ currentRow.reject_reason }}
        </el-descriptions-item>
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

const searchForm = reactive({
  keyword: '',
  creatorType: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const creatorTypeMap = { 1: '独立音乐人', 2: '唱片公司', 3: '音乐工作室', 4: 'MCN机构' }
const statusMap = { 0: '待审核', 1: '已通过', 2: '已拒绝', 3: '已禁用' }
const statusType = { 0: 'warning', 1: 'success', 2: 'danger', 3: 'info' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/creators', {
      params: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchForm.keyword || undefined,
        creatorType: searchForm.creatorType || undefined,
        status: searchForm.status
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
  searchForm.creatorType = ''
  searchForm.status = ''
  pagination.page = 1
  fetchList()
}

const handleView = (row) => {
  currentRow.value = row
  detailVisible.value = true
}

const handleAudit = async (row, pass) => {
  try {
    let reason = ''
    if (!pass) {
      const { value } = await ElMessageBox.prompt('请输入驳回原因', '审核驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValidator: (val) => !!val || '请输入驳回原因'
      })
      reason = value
    } else {
      await ElMessageBox.confirm('确定要通过该创作者的入驻申请吗？', '提示', { type: 'success' })
    }
    await request.put(`/creators/${row.id}/audit`, { pass, reason })
    ElMessage.success(pass ? '审核通过' : '已驳回')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(() => {
  if (route.query.status !== undefined) {
    searchForm.status = route.query.status
  }
  fetchList()
})
</script>
