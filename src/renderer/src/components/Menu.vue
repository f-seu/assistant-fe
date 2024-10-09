<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->

<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="menuWidth">
      <!-- 侧边栏菜单区域 -->
      <el-menu id="menu" default-active="chat">
        <router-link to="/home">
          <el-menu-item index="home">
            <el-icon>
              <RecommendIcon />
            </el-icon>
            <template #title>主页</template>
          </el-menu-item>
        </router-link>
        <router-link to="/chat">
          <el-menu-item index="chat">
            <el-icon>
              <ChatIcon />
            </el-icon>
            <template #title>聊天</template>
          </el-menu-item>
        </router-link>

        <router-link to="/calendar">
          <el-menu-item index="calendar">
            <el-icon>
              <CalendarIcon />
            </el-icon>
            <template #title>日程</template>
          </el-menu-item>
        </router-link>

        <router-link to="/recommend">
          <el-menu-item index="recommend">
            <el-icon>
              <RecommendIcon />
            </el-icon>
            <template #title>推荐</template>
          </el-menu-item>
        </router-link>
        
      </el-menu>
    </el-aside>
  </el-container>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import ChatIcon from '@assets/icons/chat.svg'
import CalendarIcon from '@assets/icons/calendar.svg'
import RecommendIcon from '@assets/icons/recommend.svg'

const menuWidth = ref('64')
</script>

<style scoped>
#menu {
  min-height: 100vh;
  padding-top: 20vh;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
