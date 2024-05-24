<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside :width="menuWidth">
      <!-- 侧边栏菜单区域 -->
      <el-menu id="menu" default-active="home">
        <router-link to="/home">
          <el-menu-item index="home">
              <ChatIcon />
            <template #title>聊天</template>
          </el-menu-item>
        </router-link>

        <router-link to="/home">
          <el-menu-item index="home">
            <el-icon>
              <House />
            </el-icon>
            <template #title>日程</template>
          </el-menu-item>
        </router-link>

        <router-link to="/home">
          <el-menu-item index="home">
            <el-icon>
              <House />
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
import { House } from '@element-plus/icons-vue'
import ChatIcon from '@assets/icons/chat.svg'

const menuWidth = ref('64')
</script>

<style scoped>
#menu {
  min-height: 100vh;
  padding-top: 20vh; /* 调整这个值以增加距离 */
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
