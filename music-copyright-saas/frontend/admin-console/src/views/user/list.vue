<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">用户列表</h2>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索用户名/昵称/手机号"
          style="width: 280px"
          clearable
          @keyup.enter="fetchList"
        />
        <el-select v-model="searchForm.userType" placeholder="用户类型" clearable style="width: 140px">
          <el-option label="采购方" :value="1" />
          <el-option label="创作者" :value="2" />
          <el-option label="机构成员" :value="3" />
        </el-select>
        <el-select v-model="searchForm.authStatus" placeholder="认证状态" clearable style="width: 140px">
          <el-option label="未认证" :value="0" />
          <el-option label="审核中" :value="1" />
          <el-option label="已通过" :value="2" />
          <el-option label="已拒绝" :value="3" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="账号状态" clearable style="width: 120px">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="nickname" label="昵称" width="140" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="用户类型" width="120">
          <template #default="{ row }">
            <el-tag :type="row.user_type === 2 ? 'success' : row.user_type === 3 ? 'warning' : 'info'" size="small">
              {{ userTypeMap[row.user_type] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" width="110">
          <template #default="{ row }">
            <el-tag :type="authStatusType[row.auth_status]" size="small">
              {{ authStatusMap[row.auth_status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="余额" width="120">
          <template #default="{ row }">
            ¥{{ (row.balance / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="注册时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleView(row)">详情</el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'warning' : 'success'"
              link
              @click="handleToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="info" link @click="handleResetPwd(row)">重置密码</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const tableData = ref([])

const searchForm = reactive({
  keyword: '',
  userType: '',
  authStatus: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const userTypeMap = { 1: '采购方', 2: '创作者', 3: '机构成员' }
const authStatusMap = { 0: '未认证', 1: '审核中', 2: '已通过', 3: '已拒绝' }
const authStatusType = { 0: 'info', 1: 'warning', 2: 'success', 3: 'danger' }

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/users', {
      params: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        keyword: searchForm.keyword || undefined,
        userType: searchForm.userType || undefined,
        authStatus: searchForm.authStatus,
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
  searchForm.userType = ''
  searchForm.authStatus = ''
  searchForm.status = ''
  pagination.page = 1
  fetchList()
}

const handleView = (row) => {
  ElMessageBox.alert(`用户ID: ${row.id}\n用户名: ${row.username}\n手机号: ${row.phone || '-'}\n邮箱: ${row.email || '-'}`, '用户详情', {
    confirmButtonText: '确定'
  })
}

const handleToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}该用户吗？`,
      '提示',
      { type: 'warning' }
    )
    await request.put(`/users/${row.id}/status`, { status: row.status === 1 ? 0 : 1 })
    ElMessage.success('操作成功')
    fetchList()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

const handleResetPwd = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新密码', '重置密码', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputValidator: (value) => {
        if (!value || value.length < 6) return '密码长度不能少于6位'
        return true
      }
    })
    await request.put(`/users/${row.id}/reset-password`, { newPassword: value })
    ElMessage.success('密码重置成功')
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  }
}

onMounted(() => {
  fetchList()
})
</script>
