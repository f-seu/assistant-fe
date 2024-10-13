<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->

<template>
  <el-config-provider :locale="zhCn">
  <el-container class="app-container">
    <el-affix>
      <Menu></Menu>
    </el-affix>
    <el-container class="main-container">
      <el-main class="main-content" height="100vh">
        
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
      </el-main>
    </el-container>
  </el-container>
</el-config-provider>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

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
  width: 100%;
  /* 使宽度可以根据视口大小变化 */
  margin: 0 auto;
  padding: 0;
  /* 水平居中 */
}
</style>