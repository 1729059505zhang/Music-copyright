<template>
  <div class="not-found">
    <div class="code">404</div>
    <div class="message">页面不存在</div>
    <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: #f1f5f9;

  .code {
    font-size: 80px;
    font-weight: 700;
    color: #3b82f6;
    line-height: 1;
  }

  .message {
    font-size: 18px;
    color: #64748b;
  }
}
</style>
