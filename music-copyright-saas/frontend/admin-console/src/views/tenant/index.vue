<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">SaaS租户管理</h2>
      <el-button type="primary" @click="handleAdd">新建租户</el-button>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-input v-model="keyword" placeholder="搜索租户名称/编码" style="width: 280px" clearable @keyup.enter="fetchList" />
        <el-select v-model="status" placeholder="状态" clearable style="width: 120px">
          <el-option label="正常" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tenant_code" label="租户编码" width="160" />
        <el-table-column prop="tenant_name" label="租户名称" min-width="180" />
        <el-table-column prop="domain" label="独立域名" width="180" />
        <el-table-column label="分成比例" width="120">
          <template #default="{ row }">{{ row.revenue_share_ratio ? row.revenue_share_ratio + '%' : '默认' }}</template>
        </el-table-column>
        <el-table-column prop="contact_name" label="联系人" width="120" />
        <el-table-column prop="contact_phone" label="联系电话" width="140" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" link @click="handleToggle(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑租户' : '新建租户'" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="租户编码" required>
          <el-input v-model="form.tenantCode" :disabled="editMode" />
        </el-form-item>
        <el-form-item label="租户名称" required>
          <el-input v-model="form.tenantName" />
        </el-form-item>
        <el-form-item label="品牌LOGO">
          <el-input v-model="form.logoUrl" placeholder="LOGO URL" />
        </el-form-item>
        <el-form-item label="独立域名">
          <el-input v-model="form.domain" placeholder="如: music.example.com" />
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.contactName" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.contactPhone" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="form.contactEmail" />
        </el-form-item>
        <el-form-item label="租户分成比例">
          <el-input-number v-model="form.revenueShareRatio" :min="0" :max="100" :precision="2" />
          <span style="margin-left:8px;color:#94a3b8">%（留空使用全局默认）</span>
        </el-form-item>
        <el-form-item label="到期时间">
          <el-date-picker v-model="form.expireTime" type="datetime" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
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
const dialogVisible = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({
  id: null, tenantCode: '', tenantName: '', logoUrl: '', domain: '',
  contactName: '', contactPhone: '', contactEmail: '',
  revenueShareRatio: null, expireTime: null, status: 1, remark: ''
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/tenants', {
      params: { page: pagination.page, pageSize: pagination.pageSize, keyword: keyword.value || undefined, status: status.value }
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

const handleAdd = () => {
  editMode.value = false
  Object.keys(form).forEach(k => form[k] = k === 'status' ? 1 : null)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.tenantCode = row.tenant_code
  form.tenantName = row.tenant_name
  form.logoUrl = row.logo_url
  form.domain = row.domain
  form.contactName = row.contact_name
  form.contactPhone = row.contact_phone
  form.contactEmail = row.contact_email
  form.revenueShareRatio = row.revenue_share_ratio
  form.expireTime = row.expire_time
  form.status = row.status
  form.remark = row.remark
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await request.put(`/tenants/${form.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await request.post('/tenants', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally { submitting.value = false }
}

const handleToggle = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要${row.status === 1 ? '禁用' : '启用'}该租户吗？`, '提示', { type: 'warning' })
    const data = { ...row, status: row.status === 1 ? 0 : 1 }
    await request.put(`/tenants/${row.id}`, data)
    ElMessage.success('操作成功')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => fetchList())
</script>
