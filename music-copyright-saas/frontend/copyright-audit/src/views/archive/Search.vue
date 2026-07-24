<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">全平台版权档案检索</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出Excel
        </el-button>
      </div>
    </div>

    <div class="card-wrapper">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="search-form-inner">
          <el-form-item label="作品名称">
            <el-input v-model="searchForm.workTitle" placeholder="请输入作品名称" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="权利人">
            <el-input v-model="searchForm.owner" placeholder="请输入权利人姓名" clearable style="width: 160px" />
          </el-form-item>
          <el-form-item label="证书编号">
            <el-input v-model="searchForm.certNo" placeholder="请输入证书编号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="登记号">
            <el-input v-model="searchForm.regNo" placeholder="请输入登记号" clearable style="width: 180px" />
          </el-form-item>
          <el-form-item label="作品类型">
            <el-select v-model="searchForm.workType" placeholder="全部类型" clearable style="width: 130px">
              <el-option label="音乐作品" value="music" />
              <el-option label="文字作品" value="text" />
              <el-option label="美术作品" value="art" />
              <el-option label="摄影作品" value="photo" />
            </el-select>
          </el-form-item>
          <el-form-item label="登记日期">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              检索
            </el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="regNo" label="登记号" width="160" />
        <el-table-column prop="certNo" label="证书编号" width="180" />
        <el-table-column prop="workTitle" label="作品名称" min-width="160" />
        <el-table-column prop="workType" label="作品类型" width="100" />
        <el-table-column prop="owner" label="权利人" width="120" />
        <el-table-column prop="createDate" label="创作完成日" width="120" />
        <el-table-column prop="publishDate" label="首次发表日" width="120" />
        <el-table-column prop="regDate" label="登记日期" width="120" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleView(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <el-dialog v-model="detailVisible" title="版权档案详情" width="750px" class="detail-dialog">
      <div v-if="currentArchive" class="archive-detail">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="版权登记号">{{ currentArchive.regNo }}</el-descriptions-item>
              <el-descriptions-item label="证书编号">{{ currentArchive.certNo }}</el-descriptions-item>
              <el-descriptions-item label="作品名称">{{ currentArchive.workTitle }}</el-descriptions-item>
              <el-descriptions-item label="作品类型">{{ currentArchive.workType }}</el-descriptions-item>
              <el-descriptions-item label="权利人">{{ currentArchive.owner }}</el-descriptions-item>
              <el-descriptions-item label="证件类型">{{ currentArchive.idType }}</el-descriptions-item>
              <el-descriptions-item label="证件号码">{{ currentArchive.idNo }}</el-descriptions-item>
              <el-descriptions-item label="联系电话">{{ currentArchive.phone }}</el-descriptions-item>
              <el-descriptions-item label="创作完成日期">{{ currentArchive.createDate }}</el-descriptions-item>
              <el-descriptions-item label="首次发表日期">{{ currentArchive.publishDate }}</el-descriptions-item>
              <el-descriptions-item label="登记日期">{{ currentArchive.regDate }}</el-descriptions-item>
              <el-descriptions-item label="发证日期">{{ currentArchive.certDate }}</el-descriptions-item>
              <el-descriptions-item label="登记机构">音乐版权SaaS平台</el-descriptions-item>
              <el-descriptions-item label="版权状态">
                <el-tag :type="getStatusTag(currentArchive.status)">{{ getStatusName(currentArchive.status) }}</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="作品样本" name="sample">
            <div class="sample-section">
              <div class="sample-item">
                <div class="sample-label">作品封面</div>
                <div class="sample-cover">
                  <el-icon size="48"><Picture /></el-icon>
                </div>
              </div>
              <div class="sample-item">
                <div class="sample-label">音频样本</div>
                <div class="audio-player">
                  <el-button circle size="small">
                    <el-icon><VideoPlay /></el-icon>
                  </el-button>
                  <div class="progress-bar">
                    <div class="progress-inner" style="width: 0%"></div>
                  </div>
                  <span class="time">00:00 / {{ currentArchive.duration }}</span>
                </div>
              </div>
              <div class="sample-item">
                <div class="sample-label">歌词文本</div>
                <div class="lyrics-box">
                  <pre>{{ currentArchive.lyrics || '暂无歌词文本' }}</pre>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="区块链存证" name="blockchain">
            <div class="blockchain-section">
              <div class="bc-status">
                <el-icon size="48" color="#16a34a"><Link /></el-icon>
                <div>
                  <h4>区块链存证已完成</h4>
                  <p>版权信息已上链存证，数据不可篡改，永久有效</p>
                </div>
              </div>
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="存证交易哈希">
                  <span class="mono-text">{{ currentArchive.blockchainTx }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="区块高度">
                  <span class="mono-text">{{ currentArchive.blockHeight }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="存证时间">{{ currentArchive.blockchainTime }}</el-descriptions-item>
                <el-descriptions-item label="存证链">版权存证联盟链</el-descriptions-item>
                <el-descriptions-item label="区块确认数">
                  <el-tag type="success">{{ currentArchive.confirmations }} 个确认</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>

          <el-tab-pane label="操作记录" name="logs">
            <el-timeline>
              <el-timeline-item
                v-for="(log, index) in currentArchive.logs"
                :key="index"
                :timestamp="log.time"
                :type="log.type"
              >
                <el-card size="small">
                  <div class="log-title">{{ log.action }}</div>
                  <div class="log-desc">{{ log.desc }}</div>
                  <div class="log-operator">操作人：{{ log.operator }}</div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentArchive)">下载证书</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const detailVisible = ref(false)
const currentArchive = ref(null)
const activeTab = ref('basic')

const searchForm = reactive({
  workTitle: '',
  owner: '',
  certNo: '',
  regNo: '',
  workType: '',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 256
})

const tableData = ref([
  { regNo: 'CR2024010001', certNo: 'CZ202401150001', workTitle: '夜的第七章', workType: '音乐作品', owner: '张三', createDate: '2023-12-20', publishDate: '2024-01-01', regDate: '2024-01-15', certDate: '2024-01-15', status: 'valid', duration: '04:25', idType: '身份证', idNo: '110***********1234', phone: '138****5678', blockchainTx: '0x7f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e', blockHeight: '12,856,342', blockchainTime: '2024-01-15 15:30:00', confirmations: '3,256', lyrics: '1983年小巷 十二月晴朗\n夜的第七章 打字机继续推向接近事实的那下一行\n石楠烟斗的雾 飘向枯萎的树\n沉默的对我哭诉', logs: [
    { action: '区块链存证完成', time: '2024-01-15 15:30:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-15 14:20:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员张明' },
    { action: '材料核验通过', time: '2024-01-15 10:30:00', type: 'success', desc: '申请材料核验通过', operator: '审核员李华' },
    { action: '申请提交', time: '2024-01-14 16:30:00', type: 'info', desc: '用户提交版权登记申请', operator: '张三' }
  ] },
  { regNo: 'CR2024010002', certNo: 'CZ202401150002', workTitle: '晴天', workType: '音乐作品', owner: '李四', createDate: '2023-11-15', publishDate: '2023-12-25', regDate: '2024-01-15', certDate: '2024-01-15', status: 'valid', duration: '04:29', idType: '身份证', idNo: '110***********5678', phone: '139****9876', blockchainTx: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', blockHeight: '12,856,128', blockchainTime: '2024-01-15 14:50:00', confirmations: '3,470', lyrics: '故事的小黄花 从出生那年就飘着\n童年的荡秋千 随记忆一直晃到现在', logs: [
    { action: '区块链存证完成', time: '2024-01-15 14:50:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-15 13:40:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员张明' },
    { action: '材料核验通过', time: '2024-01-15 09:20:00', type: 'success', desc: '申请材料核验通过', operator: '审核员李华' },
    { action: '申请提交', time: '2024-01-14 15:20:00', type: 'info', desc: '用户提交版权登记申请', operator: '李四' }
  ] },
  { regNo: 'CR2024010003', certNo: 'CZ202401140003', workTitle: '稻香', workType: '音乐作品', owner: '王五', createDate: '2023-10-10', publishDate: '2023-11-20', regDate: '2024-01-14', certDate: '2024-01-14', status: 'valid', duration: '03:43', idType: '身份证', idNo: '110***********9012', phone: '137****3456', blockchainTx: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', blockHeight: '12,845,678', blockchainTime: '2024-01-14 18:00:00', confirmations: '13,920', lyrics: '对这个世界如果你有太多的抱怨\n跌倒了就不敢继续往前走', logs: [
    { action: '区块链存证完成', time: '2024-01-14 18:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-14 16:30:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '材料核验通过', time: '2024-01-14 16:45:00', type: 'success', desc: '申请材料核验通过', operator: '审核员张明' },
    { action: '申请提交', time: '2024-01-13 14:10:00', type: 'info', desc: '用户提交版权登记申请', operator: '王五' }
  ] },
  { regNo: 'CR2024010006', certNo: 'CZ202401130006', workTitle: '东风破', workType: '音乐作品', owner: '孙八', createDate: '2023-07-22', publishDate: '2023-08-15', regDate: '2024-01-13', certDate: '2024-01-13', status: 'valid', duration: '05:15', idType: '护照', idNo: 'E12345678', phone: '134****6789', blockchainTx: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', blockHeight: '12,834,567', blockchainTime: '2024-01-13 20:00:00', confirmations: '25,031', lyrics: '一盏离愁 孤单伫立在窗口\n我在门后 假装你人还没走', logs: [
    { action: '区块链存证完成', time: '2024-01-13 20:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-13 17:30:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '材料核验通过', time: '2024-01-13 15:50:00', type: 'success', desc: '申请材料核验通过', operator: '审核员张明' },
    { action: '申请提交', time: '2024-01-12 10:30:00', type: 'info', desc: '用户提交版权登记申请', operator: '孙八' }
  ] },
  { regNo: 'CR2024010009', certNo: 'CZ202401120009', workTitle: '霍元甲', workType: '音乐作品', owner: '郑十一', createDate: '2023-04-10', publishDate: '2023-05-18', regDate: '2024-01-12', certDate: '2024-01-12', status: 'valid', duration: '03:08', idType: '身份证', idNo: '110***********8901', phone: '131****8901', blockchainTx: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', blockHeight: '12,823,456', blockchainTime: '2024-01-12 14:30:00', confirmations: '36,142', lyrics: '吓 命有几回合 擂台等着\n生死状 赢了什么 冷笑着', logs: [
    { action: '区块链存证完成', time: '2024-01-12 14:30:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-12 12:00:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员张明' },
    { action: '材料核验通过', time: '2024-01-12 09:45:00', type: 'success', desc: '申请材料核验通过', operator: '审核员李华' },
    { action: '申请提交', time: '2024-01-11 15:00:00', type: 'info', desc: '用户提交版权登记申请', operator: '郑十一' }
  ] },
  { regNo: 'CR2024010012', certNo: 'CZ202401100012', workTitle: '七里香', workType: '音乐作品', owner: '钱七', createDate: '2023-08-18', publishDate: '2023-09-28', regDate: '2024-01-10', certDate: '2024-01-10', status: 'valid', duration: '04:59', idType: '身份证', idNo: '110***********7890', phone: '135****2345', blockchainTx: '0x9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', blockHeight: '12,790,123', blockchainTime: '2024-01-10 16:00:00', confirmations: '69,475', lyrics: '窗外的麻雀 在电线杆上多嘴\n你说这一句 很有夏天的感觉', logs: [
    { action: '区块链存证完成', time: '2024-01-10 16:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-10 14:00:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '材料核验通过', time: '2024-01-10 10:15:00', type: 'success', desc: '申请材料核验通过', operator: '审核员张明' },
    { action: '申请提交', time: '2024-01-09 11:30:00', type: 'info', desc: '用户提交版权登记申请', operator: '钱七' }
  ] },
  { regNo: 'CR2024010015', certNo: 'CZ202401080015', workTitle: '发如雪', workType: '音乐作品', owner: '吴十', createDate: '2023-05-15', publishDate: '2023-06-25', regDate: '2024-01-08', certDate: '2024-01-08', status: 'void', duration: '04:55', idType: '身份证', idNo: '110***********4567', phone: '132****4567', blockchainTx: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d', blockHeight: '12,765,432', blockchainTime: '2024-01-08 15:00:00', confirmations: '94,166', lyrics: '狼牙月 伊人憔悴\n我举杯 饮尽了风雪', logs: [
    { action: '证书作废', time: '2024-01-12 10:00:00', type: 'danger', desc: '因版权转移，证书已作废', operator: '审核员张明' },
    { action: '区块链存证完成', time: '2024-01-08 15:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-08 13:00:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '申请提交', time: '2024-01-07 09:00:00', type: 'info', desc: '用户提交版权登记申请', operator: '吴十' }
  ] },
  { regNo: 'CR2024010018', certNo: 'CZ202401050018', workTitle: '青花瓷', workType: '音乐作品', owner: '赵六', createDate: '2023-09-25', publishDate: '2023-10-30', regDate: '2024-01-05', certDate: '2024-01-05', status: 'valid', duration: '03:59', idType: '身份证', idNo: '110***********3456', phone: '136****7890', blockchainTx: '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f', blockHeight: '12,720,987', blockchainTime: '2024-01-05 17:00:00', confirmations: '138,611', lyrics: '素胚勾勒出青花笔锋浓转淡\n瓶身描绘的牡丹一如你初妆', logs: [
    { action: '区块链存证完成', time: '2024-01-05 17:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-05 14:30:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员张明' },
    { action: '申请提交', time: '2024-01-04 10:00:00', type: 'info', desc: '用户提交版权登记申请', operator: '赵六' }
  ] },
  { regNo: 'CR2024010020', certNo: 'CZ202401020020', workTitle: '以父之名', workType: '音乐作品', owner: '王十二', createDate: '2023-03-25', publishDate: '2023-04-30', regDate: '2024-01-02', certDate: '2024-01-02', status: 'valid', duration: '05:44', idType: '身份证', idNo: '110***********2345', phone: '130****2345', blockchainTx: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b', blockHeight: '12,680,000', blockchainTime: '2024-01-02 16:00:00', confirmations: '179,598', lyrics: '微凉的晨露 沾湿黑礼服\n石板路有雾 父在低诉', logs: [
    { action: '区块链存证完成', time: '2024-01-02 16:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2024-01-02 13:30:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '申请提交', time: '2024-01-01 09:00:00', type: 'info', desc: '用户提交版权登记申请', operator: '王十二' }
  ] },
  { regNo: 'CR2023120030', certNo: 'CZ202312280030', workTitle: '双截棍', workType: '音乐作品', owner: '周九', createDate: '2023-06-30', publishDate: '2023-07-20', regDate: '2023-12-28', certDate: '2023-12-28', status: 'reissued', duration: '03:22', idType: '身份证', idNo: '110***********0123', phone: '133****0123', blockchainTx: '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', blockHeight: '12,600,000', blockchainTime: '2023-12-28 15:00:00', confirmations: '259,598', lyrics: '岩烧店的烟味弥漫 隔壁是国术馆\n店里面的妈妈桑 茶道有三段', logs: [
    { action: '证书补发', time: '2024-01-13 10:00:00', type: 'warning', desc: '因原证书遗失，补发新证书', operator: '审核员张明' },
    { action: '区块链存证完成', time: '2023-12-28 15:00:00', type: 'success', desc: '版权信息已成功上链存证', operator: '系统' },
    { action: '证书颁发', time: '2023-12-28 12:00:00', type: 'primary', desc: '电子版权证书已生成并颁发', operator: '审核员李华' },
    { action: '申请提交', time: '2023-12-27 10:00:00', type: 'info', desc: '用户提交版权登记申请', operator: '周九' }
  ] }
])

const getStatusTag = (status) => {
  const map = { valid: 'success', reissued: 'warning', void: 'info' }
  return map[status] || ''
}

const getStatusName = (status) => {
  const map = { valid: '有效', reissued: '已补发', void: '已作废' }
  return map[status] || status
}

const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleReset = () => {
  searchForm.workTitle = ''
  searchForm.owner = ''
  searchForm.certNo = ''
  searchForm.regNo = ''
  searchForm.workType = ''
  searchForm.dateRange = []
  handleSearch()
}

const handlePageChange = (page) => {
  pagination.page = page
}

const handleSizeChange = (size) => {
  pagination.size = size
}

const handleView = (row) => {
  currentArchive.value = row
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleExport = () => {
  ElMessage.success('导出任务已创建，完成后将通知您')
}

const handleDownload = (row) => {
  ElMessage.success('证书下载中...')
}
</script>

<style lang="scss" scoped>
.search-form {
  margin-bottom: 20px;

  .search-form-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.archive-detail {
  .sample-section {
    padding: 10px 0;

    .sample-item {
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      .sample-label {
        font-size: 14px;
        font-weight: 600;
        color: #14532d;
        margin-bottom: 12px;
        padding-left: 8px;
        border-left: 3px solid #166534;
      }

      .sample-cover {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, #dcfce7, #bbf7d0);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #166534;
      }
    }
  }

  .audio-player {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: #f0fdf4;
    border-radius: 8px;

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #bbf7d0;
      border-radius: 3px;

      .progress-inner {
        height: 100%;
        background: #166534;
        border-radius: 3px;
      }
    }

    .time {
      font-size: 12px;
      color: #71717a;
      min-width: 80px;
      text-align: center;
    }
  }

  .lyrics-box {
    background: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    max-height: 200px;
    overflow-y: auto;

    pre {
      font-family: inherit;
      font-size: 14px;
      line-height: 1.8;
      color: #52525b;
      white-space: pre-wrap;
      word-wrap: break-word;
      margin: 0;
    }
  }

  .blockchain-section {
    .bc-status {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f0fdf4;
      border-radius: 8px;
      margin-bottom: 20px;

      h4 {
        font-size: 16px;
        font-weight: 600;
        color: #14532d;
        margin-bottom: 4px;
      }

      p {
        font-size: 13px;
        color: #52525b;
        margin: 0;
      }
    }

    .mono-text {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 12px;
      word-break: break-all;
    }
  }

  .log-title {
    font-size: 14px;
    font-weight: 600;
    color: #14532d;
    margin-bottom: 4px;
  }

  .log-desc {
    font-size: 13px;
    color: #52525b;
    margin-bottom: 4px;
  }

  .log-operator {
    font-size: 12px;
    color: #71717a;
  }
}
</style>
