<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo"  @select="handleSelect">
    <router-link to="/home"><el-menu-item index="1">聊天</el-menu-item></router-link>
    <router-link to="/home"> <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <span>Navigator Two</span>
      </el-menu-item></router-link>
    <router-link to="/home"><el-menu-item index="3"> <el-menu-item index="2">
          <el-icon><icon-menu /></el-icon>
          <span>Navigator Two</span>
        </el-menu-item></el-menu-item></router-link>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>
