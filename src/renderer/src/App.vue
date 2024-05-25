<template>
  <el-container class="app-container">
    <el-affix>
      <Menu></Menu>
    </el-affix>
    <el-container class="main-container">
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
.app-container {
  height: 100vh;
  width: 100%;
  text-align: center;
  padding: 0;
}
.main-container {
  /* 修改此处以允许footer附着在底部 */
  align-items: center;
  height: 100vh;
  width: 100%;
  text-align: center;
  padding: 0;
}

.main-content {
  max-width: 1200px;
  /* 最大宽度为 1200px */
  width: 100%;
  /* 使宽度可以根据视口大小变化 */
  margin: 0 auto;
  padding:0;
  /* 水平居中 */
}
</style>