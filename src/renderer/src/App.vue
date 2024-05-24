<template>
  <el-container>
    <el-affix>
      <Menu></Menu>
    </el-affix>
    <el-container width="200px" class="main-container">
      <el-main class="main-content" width="100vh">
        <el-scrollbar>
          <router-view></router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue'
</script>

<style scoped>
.main-container {
  /* 修改此处以允许footer附着在底部 */
  align-items: center;
  height: 100vh;
  text-align: center;
}

.main-content {
  max-width: 1200px;
  /* 最大宽度为 1200px */
  width: 100%;
  /* 使宽度可以根据视口大小变化 */
  margin: 0 auto;
  /* 水平居中 */
}
</style>