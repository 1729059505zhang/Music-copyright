<template>
  <div class="sub-account-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">子账号管理</h2>
          <p class="page-subtitle">管理机构下的子账号和权限</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加子账号
          </el-button>
        </div>
      </div>

      <el-alert
        title="子账号功能仅对机构用户开放，当前您的身份为独立音乐人，如需使用请升级为机构账号。"
        type="info"
        :closable="false"
        show-icon
        class="feature-tip mb-20"
      />

      <div class="card-wrapper">
        <div class="search-bar">
          <el-input v-model="searchForm.keyword" placeholder="搜索账号/姓名" style="width: 240px">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="searchForm.role" placeholder="角色" clearable style="width: 140px">
            <el-option label="全部角色" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="运营" value="operation" />
            <el-option label="财务" value="finance" />
            <el-option label="内容编辑" value="editor" />
          </el-select>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </div>

        <el-table :data="tableData" v-loading="loading" border style="width: 100%">
          <el-table-column prop="account" label="账号" width="160" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="role" label="角色" width="120">
            <template #default="{ row }">
              <el-tag size="small" :type="getRoleType(row.role)" effect="light">
                {{ getRoleLabel(row.role) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="permissions" label="权限范围" min-width="200">
            <template #default="{ row }">
              <div class="permission-tags">
                <el-tag 
                  v-for="perm in row.permissions" 
                  :key="perm"
                  size="small"
                  type="info"
                  effect="plain"
                >
                  {{ perm }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" width="140" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-switch v-model="row.status" active-text="启用" inactive-text="禁用" />
            </template>
          </el-table-column>
          <el-table-column prop="lastLogin" label="最后登录" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button type="warning" link size="small" @click="handleResetPwd(row)">重置密码</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑子账号' : '添加子账号'" width="560px">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="登录账号" prop="account">
            <el-input v-model="form.account" placeholder="请输入登录账号" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
              <el-option label="管理员" value="admin" />
              <el-option label="运营" value="operation" />
              <el-option label="财务" value="finance" />
              <el-option label="内容编辑" value="editor" />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="权限设置">
            <el-checkbox-group v-model="form.permissions">
              <el-checkbox label="作品管理">作品管理</el-checkbox>
              <el-checkbox label="订单管理">订单管理</el-checkbox>
              <el-checkbox label="收益查看">收益查看</el-checkbox>
              <el-checkbox label="提现操作">提现操作</el-checkbox>
              <el-checkbox label="版权登记">版权登记</el-checkbox>
              <el-checkbox label="数据统计">数据统计</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-if="!isEdit" label="初始密码" prop="password">
            <el-input v-model="form.password" type="password" show-password placeholder="请设置初始密码" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">确认</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const total = ref(0)
const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const submitting = ref(false)

const searchForm = reactive({
  keyword: '',
  role: ''
})

const pagination = reactive({
  page: 1,
  size: 10
})

const tableData = ref([
  { id: 1, account: 'admin001', name: '李四', role: 'admin', permissions: ['全部权限'], phone: '139****1111', status: true, lastLogin: '2024-12-01 10:30' },
  { id: 2, account: 'editor001', name: '王五', role: 'editor', permissions: ['作品管理', '版权登记'], phone: '139****2222', status: true, lastLogin: '2024-11-30 14:20' },
  { id: 3, account: 'finance001', name: '赵六', role: 'finance', permissions: ['收益查看', '提现操作'], phone: '139****3333', status: true, lastLogin: '2024-11-28 09:15' },
  { id: 4, account: 'operation001', name: '孙七', role: 'operation', permissions: ['作品管理', '订单管理', '数据统计'], phone: '139****4444', status: false, lastLogin: '2024-11-20 16:45' }
])

total.value = 4

const form = reactive({
  id: null,
  account: '',
  name: '',
  role: '',
  phone: '',
  email: '',
  permissions: [],
  password: ''
})

const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请设置初始密码', trigger: 'blur' }]
}

const getRoleType = (role) => {
  const map = {
    admin: 'danger',
    operation: 'primary',
    finance: 'warning',
    editor: 'success'
  }
  return map[role] || 'info'
}

const getRoleLabel = (role) => {
  const map = {
    admin: '管理员',
    operation: '运营',
    finance: '财务',
    editor: '内容编辑'
  }
  return map[role] || role
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    account: '',
    name: '',
    role: '',
    phone: '',
    email: '',
    permissions: [],
    password: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleResetPwd = (row) => {
  ElMessageBox.prompt('请输入新密码', '重置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
    inputValidator: (value) => {
      if (!value || value.length < 6) {
        return '密码长度不能少于6位'
      }
      return true
    }
  }).then(() => {
    ElMessage.success('密码重置成功')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除子账号「${row.account}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      setTimeout(() => {
        submitting.value = false
        if (isEdit.value) {
          const index = tableData.value.findIndex(item => item.id === form.id)
          if (index > -1) {
            Object.assign(tableData.value[index], form)
          }
          ElMessage.success('修改成功')
        } else {
          tableData.value.unshift({
            ...form,
            id: Date.now(),
            status: true,
            lastLogin: '-'
          })
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
      }, 1000)
    }
  })
}
</script>

<style scoped lang="scss">
.sub-account-page {
  .feature-tip {
    :deep(.el-alert__title) {
      font-weight: 500;
    }
  }

  .permission-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
