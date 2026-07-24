<template>
  <div class="page-container">
    <div class="page-header"><h2 class="page-title">系统配置</h2></div>
    <div class="card-wrapper">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础配置" name="basic">
          <el-form :model="configForm" label-width="180px" style="max-width: 600px">
            <el-form-item label="平台名称">
              <el-input v-model="configForm.platform_name" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="configForm.contact_phone" />
            </el-form-item>
            <el-form-item label="客服邮箱">
              <el-input v-model="configForm.contact_email" />
            </el-form-item>
            <el-form-item label="ICP备案号">
              <el-input v-model="configForm.site_icp" />
            </el-form-item>
            <el-form-item label="版权信息">
              <el-input v-model="configForm.site_copyright" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="财务配置" name="finance">
          <el-form :model="configForm" label-width="200px" style="max-width: 600px">
            <el-form-item label="平台抽佣比例(%)">
              <el-input-number v-model="configForm.default_platform_share_ratio" :min="0" :max="100" :precision="2" />
            </el-form-item>
            <el-form-item label="租户分成比例(%)">
              <el-input-number v-model="configForm.default_tenant_share_ratio" :min="0" :max="100" :precision="2" />
            </el-form-item>
            <el-form-item label="结算冻结天数">
              <el-input-number v-model="configForm.settlement_freeze_days" :min="0" :max="30" />
              <span style="margin-left:8px;color:#94a3b8">天</span>
            </el-form-item>
            <el-form-item label="最低提现金额(元)">
              <el-input-number v-model="withdrawalMinYuan" :min="0" :precision="2" />
            </el-form-item>
            <el-form-item label="提现手续费比例(%)">
              <el-input-number v-model="configForm.withdrawal_fee_rate" :min="0" :max="20" :precision="2" />
            </el-form-item>
            <el-form-item label="版权登记服务费(元)">
              <el-input-number v-model="copyrightFeeYuan" :min="0" :precision="2" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="功能模块" name="module">
          <el-form :model="configForm" label-width="200px" style="max-width: 600px">
            <el-form-item label="音乐发行模块">
              <el-switch v-model="configForm.enable_release_module" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="版权登记模块">
              <el-switch v-model="configForm.enable_copyright_module" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="自动审核开关">
              <el-switch v-model="configForm.audit_auto_pass" active-value="1" inactive-value="0" />
              <span style="margin-left:8px;color:#94a3b8">（测试用：作品上传后自动通过）</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="margin-top: 20px">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

const activeTab = ref('basic')
const configForm = ref({})

const withdrawalMinYuan = computed({
  get: () => (configForm.value.min_withdrawal_amount / 100).toFixed(2),
  set: (val) => { configForm.value.min_withdrawal_amount = Math.round(val * 100) }
})

const copyrightFeeYuan = computed({
  get: () => (configForm.value.copyright_register_fee / 100).toFixed(2),
  set: (val) => { configForm.value.copyright_register_fee = Math.round(val * 100) }
})

const fetchConfig = async () => {
  const res = await request.get('/system/config')
  configForm.value = res || {}
}

const handleSave = async () => {
  await request.put('/system/config', configForm.value)
  ElMessage.success('配置已保存')
  fetchConfig()
}

onMounted(() => fetchConfig())
</script>
