<template>
  <div class="work-layout">
    <div class="page-container">
      <div class="page-header">
        <div>
          <h2 class="page-title">作品管理</h2>
          <p class="page-subtitle">管理您的词曲作品和发行作品</p>
        </div>
      </div>

      <div class="work-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="词曲作品" name="lyric">
            <router-view />
          </el-tab-pane>
          <el-tab-pane label="发行作品" name="release">
            <router-view />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeTab = ref('lyric')

watch(() => route.path, (path) => {
  if (path.includes('/work/lyric')) {
    activeTab.value = 'lyric'
  } else if (path.includes('/work/release')) {
    activeTab.value = 'release'
  }
}, { immediate: true })

const handleTabChange = (tab) => {
  if (tab === 'lyric') {
    router.push('/work/lyric')
  } else if (tab === 'release') {
    router.push('/work/release')
  }
}
</script>

<style scoped lang="scss">
.work-layout {
  min-height: 100%;
}

.work-tabs {
  background: #fff;
  border-radius: $border-radius;
  padding: 0 20px;
  box-shadow: $shadow-sm;

  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
    font-weight: 500;
  }
}
</style>
