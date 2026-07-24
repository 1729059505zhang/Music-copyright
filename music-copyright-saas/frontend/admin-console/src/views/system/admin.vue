<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">管理员管理</h2>
      <el-button type="primary" @click="handleAdd">新增管理员</el-button>
    </div>
    <div class="card-wrapper">
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="140" />
        <el-table-column prop="real_name" label="真实姓名" width="140" />
        <el-table-column prop="phone" label="手机号" width="140" />
        <el-table-column label="角色" width="140">
          <template #default="{ row }">{{ row.role?.role_name || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录" width="180" />
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="warning" link @click="handleResetPwd(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper" @size-change="fetchList" @current-change="fetchList" />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="editMode ? '编辑管理员' : '新增管理员'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="用户名" required>
          <el-input v-model="form.username" :disabled="editMode" />
        </el-form-item>
        <el-form-item v-if="!editMode" label="密码" required>
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="form.realName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleId" style="width: 100%">
            <el-option v-for="r in roleList" :key="r.id" :label="r.role_name" :value="r.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
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
const roleList = ref([])
const dialogVisible = ref(false)
const editMode = ref(false)
const submitting = ref(false)
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const form = reactive({
  id: null, username: '', password: '', realName: '', phone: '', email: '', roleId: null, status: 1
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await request.get('/system/admins', { params: { page: pagination.page, pageSize: pagination.pageSize } })
    tableData.value = res.list
    pagination.total = res.total
  } finally { loading.value = false }
}

const fetchRoles = async () => {
  const res = await request.get('/system/roles')
  roleList.value = res
}

const handleAdd = () => {
  editMode.value = false
  Object.keys(form).forEach(k => form[k] = k === 'status' ? 1 : null)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editMode.value = true
  form.id = row.id
  form.username = row.username
  form.realName = row.real_name
  form.phone = row.phone
  form.email = row.email
  form.roleId = row.role_id
  form.status = row.status
  dialogVisible.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editMode.value) {
      await request.put(`/system/admins/${form.id}`, form)
      ElMessage.success('更新成功')
    } else {
      await request.post('/system/admins', form)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally { submitting.value = false }
}

const handleResetPwd = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新密码', '重置密码', { confirmButtonText: '确定', cancelButtonText: '取消', inputType: 'password', inputValidator: val => val && val.length >= 6 || '密码长度不能少于6位' })
    await request.put(`/system/admins/${row.id}/reset-password`, { newPassword: value })
    ElMessage.success('密码重置成功')
  } catch (e) { if (e !== 'cancel') console.error(e) }
}

onMounted(() => { fetchList(); fetchRoles() })
</script>
