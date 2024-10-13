<!-- 
  Copyright (c) 2024, Li Yaning,Zu Yuankun/Southeast University
  Licensed under the GPL3 License (see LICENSE file for details) 
-->
<template>
  <div class="menu">
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/home' }" @click="navigateTo('/home')"  >
      <div class="icon">
          <ChatIcon />
      </div>
      <div>
        主页
      </div>
    </div>
    <div class="menu-item" :class="{ 'is-active': currentRoute === '/chat' }" @click="navigateTo('/chat')">
      <div class="icon">
          <ChatIcon />
      </div>
      <div>
        聊天
      </div>
    </div>
  </div>


</template>


<script lang="ts" setup>
import { useRouter } from 'vue-router'
import ChatIcon from '@assets/icons/chat.svg'
import { ref } from 'vue';

const currentRoute = ref("/home")

const router = useRouter();

function navigateTo(route) {
  router.push(route);
  currentRoute.value = route;
}
</script>

<style scoped>
.menu {
  min-height: 100vh;
  /* padding-top: 20vh; */
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  background-color: #e4e9efa9;
  border-radius: 50px;
}

.icon{
  width: 40px;
  height: 40px;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

.menu-item {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 30%;
  width: 95%;
}
.is-active {
  background-color: #409eff;
  color: white;
  border-radius: 10px;
}

</style>
