<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">角色权限</h2>
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
    </div>
    <div class="card-wrapper">
      <el-table :data="roleList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="role_name" label="角色名称" width="200" />
        <el-table-column prop="role_code" label="角色编码" width="200" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">{{ row.status === 1 ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleAssign(row)">分配权限</el-button>
            <el-button size="small" type="warning" link>编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="permDialogVisible" title="分配权限" width="500px">
      <el-tree
        ref="treeRef"
        :data="permissionTree"
        :props="{ label: 'permission_name', children: 'children' }"
        show-checkbox
        node-key="id"
        default-expand-all
      />
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePerm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="新增角色" width="450px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="角色名称" required><el-input v-model="form.roleName" /></el-form-item>
        <el-form-item label="角色编码" required><el-input v-model="form.roleCode" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" :rows="2" /></el-form-item>
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
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const loading = ref(false)
const roleList = ref([])
const permissionTree = ref([])
const treeRef = ref(null)
const dialogVisible = ref(false)
const permDialogVisible = ref(false)
const currentRoleId = ref(null)

const form = reactive({ roleName: '', roleCode: '', description: '' })

const fetchRoles = async () => {
  loading.value = true
  try {
    const res = await request.get('/system/roles')
    roleList.value = res
  } finally { loading.value = false }
}

const fetchPermissions = async () => {
  const res = await request.get('/system/permissions')
  permissionTree.value = res
}

const handleAdd = () => {
  form.roleName = ''; form.roleCode = ''; form.description = ''
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await request.post('/system/roles', form)
  ElMessage.success('创建成功')
  dialogVisible.value = false
  fetchRoles()
}

const handleAssign = async (row) => {
  currentRoleId.value = row.id
  permDialogVisible.value = true
  try {
    const res = await request.get(`/system/roles/${row.id}/permissions`)
    await nextTick()
    treeRef.value?.setCheckedKeys(res || [])
  } catch (e) { console.error(e) }
}

const handleSavePerm = async () => {
  const keys = treeRef.value?.getCheckedKeys() || []
  await request.put(`/system/roles/${currentRoleId.value}/permissions`, { permissionIds: keys })
  ElMessage.success('权限分配成功')
  permDialogVisible.value = false
}

import { nextTick } from 'vue'
onMounted(() => { fetchRoles(); fetchPermissions() })
</script>
