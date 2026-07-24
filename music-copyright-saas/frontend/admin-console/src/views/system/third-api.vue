<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">第三方API配置</h2>
      <el-button type="primary" @click="handleAdd">新增配置</el-button>
    </div>
    <div class="card-wrapper">
      <div class="search-bar">
        <el-select v-model="apiType" placeholder="API类型" clearable style="width: 180px">
          <el-option label="支付网关" value="payment" />
          <el-option label="云存储OSS" value="oss" />
          <el-option label="版权存证" value="copyright" />
          <el-option label="短信服务" value="sms" />
          <el-option label="邮件服务" value="email" />
        </el-select>
        <el-button type="primary" @click="fetchList">搜索</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="api_type" label="类型" width="120" />
        <el-table-column prop="api_name" label="名称" width="180" />
        <el-table-column prop="api_provider" label="服务商" width="120" />
        <el-table-column prop="base_url" label="接口地址" min-width="200" show-overflow-tooltip />
        <el-table-column prop="app_key" label="AppKey" width="160" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑API配置' : '新增API配置'" width="600px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="API类型" required>
          <el-select v-model="form.api_type" style="width: 100%">
            <el-option label="支付网关" value="payment" />
            <el-option label="云存储OSS" value="oss" />
            <el-option label="版权存证" value="copyright" />
            <el-option label="短信服务" value="sms" />
            <el-option label="邮件服务" value="email" />
          </el-select>
        </el-form-item>
        <el-form-item label="API名称" required><el-input v-model="form.api_name" /></el-form-item>
        <el-form-item label="服务商"><el-input v-model="form.api_provider" /></el-form-item>
        <el-form-item label="接口地址"><el-input v-model="form.base_url" /></el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="form.request_method" style="width: 100%">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="AppKey"><el-input v-model="form.app_key" /></el-form-item>
        <el-form-item label="AppSecret">
          <el-input v-model="form.app_secret" type="password" show-password />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">禁用</el-radio>
            <el-radio :value="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
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
const apiType = ref('')
const dialogVisible = ref(false)
const editMode = ref(false)

const form = reactive({
  id: null, api_type: 'payment', api_name: '', api_provider: '',
  base_url: '', request_method: 'POST', app_key: '', app_secret: '',
  status: 0, remark: ''
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/system/third-apis', { params: { apiType: apiType.value || undefined } })
    tableData.value = res
  } finally { loading.value = false }
}

const handleAdd = () => {
  editMode.value = false
  Object.keys(form).forEach(k => form[k] = k === 'request_method' ? 'POST' : k === 'api_type' ? 'payment' : k === 'status' ? 0 : '')
  form.id = null
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.api_type = row.api_type
  form.api_name = row.api_name
  form.api_provider = row.api_provider
  form.base_url = row.base_url
  form.request_method = row.request_method
  form.app_key = row.app_key
  form.app_secret = row.app_secret
  form.status = row.status
  form.remark = row.remark
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (editMode.value) {
    await request.put(`/system/third-apis/${form.id}`, form)
    ElMessage.success('更新成功')
  } else {
    await request.post('/system/third-apis', form)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  fetchList()
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', { type: 'warning' })
    await request.delete(`/system/third-apis/${row.id}`)
    ElMessage.success('删除成功')
    fetchList()
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => fetchList())
</script>
