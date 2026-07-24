<template>
  <div class="account-page">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">收款账户</h2>
          <p class="page-subtitle">管理您的提现收款账户</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加账户
          </el-button>
        </div>
      </div>

      <div class="card-wrapper">
        <div class="account-list">
          <div 
            v-for="account in accountList" 
            :key="account.id" 
            class="account-card"
            :class="{ default: account.isDefault }"
          >
            <div class="card-left">
              <div class="bank-icon">
                <el-icon :size="32"><CreditCard /></el-icon>
              </div>
              <div class="account-info">
                <div class="bank-name">
                  {{ account.bankName }}
                  <el-tag v-if="account.isDefault" size="small" type="danger" effect="light">默认账户</el-tag>
                </div>
                <div class="account-no">{{ account.accountNo }}</div>
                <div class="account-name">开户名：{{ account.accountName }}</div>
              </div>
            </div>
            <div class="card-right">
              <el-button link type="primary" size="small" @click="handleSetDefault(account)" v-if="!account.isDefault">
                设为默认
              </el-button>
              <el-button link type="primary" size="small" @click="handleEdit(account)">
                编辑
              </el-button>
              <el-button link type="danger" size="small" @click="handleDelete(account)">
                删除
              </el-button>
            </div>
          </div>

          <div v-if="accountList.length === 0" class="empty-account">
            <el-empty description="暂无收款账户，请添加">
              <el-button type="primary" @click="handleAdd">添加账户</el-button>
            </el-empty>
          </div>
        </div>
      </div>

      <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑账户' : '添加账户'" width="500px">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="开户银行" prop="bankName">
            <el-select v-model="form.bankName" placeholder="请选择银行" style="width: 100%" filterable>
              <el-option label="中国工商银行" value="中国工商银行" />
              <el-option label="中国建设银行" value="中国建设银行" />
              <el-option label="中国农业银行" value="中国农业银行" />
              <el-option label="中国银行" value="中国银行" />
              <el-option label="招商银行" value="招商银行" />
              <el-option label="交通银行" value="交通银行" />
              <el-option label="中国邮政储蓄银行" value="中国邮政储蓄银行" />
            </el-select>
          </el-form-item>
          <el-form-item label="开户支行" prop="branch">
            <el-input v-model="form.branch" placeholder="请输入开户支行" />
          </el-form-item>
          <el-form-item label="银行卡号" prop="accountNo">
            <el-input v-model="form.accountNo" placeholder="请输入银行卡号" />
          </el-form-item>
          <el-form-item label="开户名" prop="accountName">
            <el-input v-model="form.accountName" placeholder="请输入开户人姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入银行预留手机号" />
          </el-form-item>
          <el-form-item label="设为默认" prop="isDefault">
            <el-switch v-model="form.isDefault" />
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

const dialogVisible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const submitting = ref(false)

const accountList = ref([
  { 
    id: 1, 
    bankName: '中国工商银行', 
    branch: '北京中关村支行',
    accountNo: '6222 0200 **** 8888', 
    accountName: '张三', 
    phone: '138****8888',
    isDefault: true 
  },
  { 
    id: 2, 
    bankName: '中国建设银行', 
    branch: '上海浦东支行',
    accountNo: '6217 0000 **** 6666', 
    accountName: '张三', 
    phone: '138****8888',
    isDefault: false 
  }
])

const form = reactive({
  id: null,
  bankName: '',
  branch: '',
  accountNo: '',
  accountName: '',
  phone: '',
  isDefault: false
})

const rules = {
  bankName: [{ required: true, message: '请选择开户银行', trigger: 'change' }],
  branch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
  accountNo: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
  accountName: [{ required: true, message: '请输入开户名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, {
    id: null,
    bankName: '',
    branch: '',
    accountNo: '',
    accountName: '',
    phone: '',
    isDefault: false
  })
  dialogVisible.value = true
}

const handleEdit = (account) => {
  isEdit.value = true
  Object.assign(form, account)
  dialogVisible.value = true
}

const handleSetDefault = (account) => {
  accountList.value.forEach(item => {
    item.isDefault = item.id === account.id
  })
  ElMessage.success('已设为默认账户')
}

const handleDelete = (account) => {
  ElMessageBox.confirm(`确定要删除 ${account.bankName} 尾号${account.accountNo.slice(-4)} 的账户吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = accountList.value.findIndex(item => item.id === account.id)
    if (index > -1) {
      accountList.value.splice(index, 1)
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
          const index = accountList.value.findIndex(item => item.id === form.id)
          if (index > -1) {
            Object.assign(accountList.value[index], form)
          }
          ElMessage.success('修改成功')
        } else {
          const newAccount = {
            ...form,
            id: Date.now(),
            accountNo: form.accountNo.replace(/(\d{4})\d+(\d{4})/, '$1 **** $2')
          }
          if (newAccount.isDefault) {
            accountList.value.forEach(item => item.isDefault = false)
          }
          accountList.value.unshift(newAccount)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
      }, 1000)
    }
  })
}
</script>

<style scoped lang="scss">
.account-page {
  .account-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .account-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border: 2px solid $border-color;
    border-radius: $border-radius;
    transition: $transition-base;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);

    &:hover {
      border-color: $primary-light;
      box-shadow: $shadow-md;
    }

    &.default {
      border-color: $primary-color;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
    }
  }

  .card-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .bank-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, $primary-color, $primary-light);
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .account-info {
    .bank-name {
      font-size: 16px;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .account-no {
      font-size: 18px;
      font-family: monospace;
      color: $text-primary;
      margin-bottom: 4px;
      letter-spacing: 2px;
    }

    .account-name {
      font-size: 13px;
      color: $text-muted;
    }
  }

  .card-right {
    display: flex;
    gap: 12px;
  }

  .empty-account {
    padding: 40px 0;
  }
}
</style>
